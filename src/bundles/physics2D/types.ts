import { b2Body, b2Shape, b2BodyDef, b2BodyType, b2PolygonShape, b2StepConfig, b2Vec2, b2World } from '@box2d/core';
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
  private forces: Force[] = [];

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

    this.body.CreateFixture({
      shape: this.shape,
      density: 1,
      friction: 0.3,
    });
  }

  public addForce(force: Force) {
    this.forces.push(force);
  }

  public applyForces(word_time: number) {
    this.forces = this.forces
      .filter(
        (force: Force) => force.start_time + force.duration > word_time,
      );

    const resForce = this.forces.filter(
      (force: Force) => force.start_time < word_time,
    )
      .reduce(
        (resForce: b2Vec2, force: Force) => resForce.Add(force.direction.Scale(force.magnitude)),
        new b2Vec2(),
      );

    this.body.ApplyForceToCenter(resForce);
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

  public toReplString = () => `Position: [${this.getPosition().x},${this.getPosition().x}], Rotation: ${this.getRotation()}`;
}

export class PhysicsWorld {
  private b2Objects: PhysicsObject[];
  private timer: Timer;
  private b2World: b2World;
  private iterationsConfig: b2StepConfig = {
    velocityIterations: 8,
    positionIterations: 3,
  };

  constructor() {
    this.b2Objects = [];
    this.timer = new Timer();
    this.b2World = b2World.Create(new b2Vec2());
  }

  public setGravity(gravity: b2Vec2) {
    this.b2World.SetGravity(gravity);
  }

  public addObject(obj: PhysicsObject) {
    this.b2Objects.push(obj);
    // this.world.
  }

  public createBody(bodyDef: b2BodyDef) {
    return this.b2World.CreateBody(bodyDef);
  }

  public makeGround(height: number) {
    const vector: b2Vec2 = new b2Vec2();
    vector.Set(0, height);
    const groundBody: b2Body = this.createBody({
      type: b2BodyType.b2_staticBody,
      position: vector,
    });
    const groundShape: b2PolygonShape = new b2PolygonShape()
      .SetAsBox(1000, 10);
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
