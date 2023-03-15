import { b2Body, b2Shape, b2Fixture, b2BodyDef, b2BodyType, b2PolygonShape, b2StepConfig, b2Vec2, b2World, b2ContactListener, b2Contact, b2ContactEdge } from '@box2d/core';
import { ReplResult } from '../../typings/type_helpers';

export class Vector2 extends b2Vec2 implements ReplResult{
  public toReplString = () => `[${this.x}, ${this.y}]`;
};

export type Force = {
  direction: b2Vec2;
  magnitude: number;
  duration: number;
  start_time: number;
};

type ForceWithPos = {
  force: Force,
  pos: b2Vec2,
}

type TouchingObjects = {
  fix1: b2Fixture,
  fix2: b2Fixture,
  start_time: number;
}

export class Timer {
  private time: number;

  constructor() {
    this.time = 0;
  }

  public step(dt: number) {
    this.time += dt;
    return this.time;
  }

  public getTime() {
    return this.time;
  }
}

export class PhysicsObject implements ReplResult {
  private body: b2Body;
  private shape: b2Shape;
  private fixture: b2Fixture;
  private forcesCentered: Force[] = [];
  private forcesAtAPoint: ForceWithPos[] = [];

  constructor(
    position: b2Vec2,
    rotation: number,
    shape: b2Shape,
    world: PhysicsWorld,
  ) {
    this.body = world.createBody({
      type: b2BodyType.b2_dynamicBody,
      position,
      angle: rotation,
    });
    this.shape = shape;

    this.fixture = this.body.CreateFixture({
      shape: this.shape,
      density: 1,
      friction: 0.3,
    });
  }

  public changeDensity(density: number) {
    this.fixture.SetDensity(density);
    this.body.ResetMassData();
  }

  public addForceCentered(force: Force) {
    this.forcesCentered.push(force);
  }

  public addForceAtAPoint(force: Force, pos: b2Vec2) {
    this.forcesAtAPoint.push({force: force, pos: pos});
  }

  public applyForcesToCenter(world_time: number) {
    this.forcesCentered = this.forcesCentered
    .filter(
      (force: Force) => force.start_time + force.duration > world_time,
    );

    const resForce = this.forcesCentered.filter(
      (force: Force) => force.start_time < world_time,
    )
      .reduce(
        (resForce: b2Vec2, force: Force) => resForce.Add(force.direction.Scale(force.magnitude)),
        new b2Vec2(),
      );

    this.body.ApplyForceToCenter(resForce);
  }

  public applyForcesAtAPoint(world_time: number) {
    this.forcesAtAPoint = this.forcesAtAPoint
    .filter(
      (forceWithPos: ForceWithPos) => forceWithPos.force.start_time + forceWithPos.force.duration > world_time,
    );

    this.forcesAtAPoint.forEach(forceWithPos => {
      const force = forceWithPos.force;
      this.body.ApplyForce(force.direction.Scale(force.magnitude), forceWithPos.pos);
    });
  }

  public applyForces(world_time: number) {
    this.applyForcesToCenter(world_time);
    this.applyForcesAtAPoint(world_time);
  }

  public setRotation(rot: number) {
    this.body.SetAngle(rot);
  }

  public setLinearVelocity(velc: b2Vec2) {
    this.body.SetLinearVelocity(velc);
  }

  public getPosition() {
    return this.body.GetPosition();
  }

  public getVelocity() {
    return this.body.GetLinearVelocity();
  }

  public getRotation() {
    return this.body.GetAngle();
  }

  public getLinearVelocity() {
    return this.body.GetLinearVelocity();
  }

  public getAngularVelocity() {
    return this.body.GetAngularVelocity();
  }

  public getMass() {
    return this.body.GetMass();
  }

  public isTouching(obj2: PhysicsObject) {
    let ce = this.body.GetContactList();
    while (ce != null) {
      if (ce.other == obj2.body && ce.contact.IsTouching()) {
        return true;
      }
      ce = ce.next;
    }
  }

  public toReplString = () => `
Mass: ${this.getMass()}

Position: [${this.getPosition().x},${this.getPosition().y}]
Velocity: [${this.getVelocity().x},${this.getVelocity().y}] 

Rotation: ${this.getRotation()}
AngularVelocity: [${this.getAngularVelocity()}]`;
}

export class PhysicsWorld {
  private b2World: b2World;
  private b2Objects: PhysicsObject[];
  private timer: Timer;
  
  // private touchingObjects: TouchingObjects[];


  private iterationsConfig: b2StepConfig = {
    velocityIterations: 8,
    positionIterations: 3,
  };

  constructor() {
    this.b2World = b2World.Create(new b2Vec2());
    this.b2Objects = [];
    this.timer = new Timer();

    // this.touchingObjects = [];

    // const contactListener: b2ContactListener = new b2ContactListener();
    // contactListener.BeginContact = (contact: b2Contact) => {
    //   const touchingObj: TouchingObjects = {
    //     fix1: contact.GetFixtureA(),
    //     fix2: contact.GetFixtureB(),
    //     start_time: this.timer.getTime()
    //   }
    //   this.touchingObjects.push(touchingObj);
    // }
    // contactListener.EndContact = (contact: b2Contact) => {
    //   const touchingObj: TouchingObjects = {
    //     fix1: contact.GetFixtureA(),
    //     fix2: contact.GetFixtureB(),
    //     start_time: this.timer.getTime()
    //   }
    //   // do sth
    // }

    // this.b2World.SetContactListener(contactListener);
  }

  public setGravity(gravity: b2Vec2) {
    this.b2World.SetGravity(gravity);
  }

  public addObject(obj: PhysicsObject) {
    this.b2Objects.push(obj);
  }

  public createBody(bodyDef: b2BodyDef) {
    return this.b2World.CreateBody(bodyDef);
  }

  public makeGround(height: number) {
    const groundBody: b2Body = this.createBody({
      type: b2BodyType.b2_staticBody,
      position: new b2Vec2(0, height - 10),
    });
    const groundShape: b2PolygonShape = new b2PolygonShape()
      .SetAsBox(10000, 10);

    groundBody.CreateFixture({
      shape: groundShape,
      density: 1,
      friction: 0.3,
    });
  }

  public update(dt: number) {
    for (let obj of this.b2Objects) {
      obj.applyForces(this.timer.getTime());
    }
    this.b2World.Step(dt, this.iterationsConfig);
    this.timer.step(dt);
  }
}
