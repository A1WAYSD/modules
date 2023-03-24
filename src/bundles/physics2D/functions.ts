/* eslint-disable new-cap */
/**
 * Physics2D
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module physics2D
 * @author Author Name
 * @author Author Name
 */

import { context } from 'js-slang/moduleHelpers';

import { b2CircleShape, b2PolygonShape } from '@box2d/core';

import { type Force, Vector2 } from './types';
import { PhysicsObject } from './PhysicsObject';
import { PhysicsWorld } from './PhysicsWorld';

// Global Variables

let world : PhysicsWorld | null = null;

// Module's Private Functions

// Module's Exposed Functions

/**
 * Make a 2d vector with the given x and y components.
 *
 * @param x x-component of new vector
 * @param y y-component of new vector
 * @returns with x, y as components
 *
 * @category Main
 */
export function make_vector(x: number, y: number): Vector2 {
  return new Vector2(x, y);
}

/**
 * Make a force with direction vector, magnitude, force duration and start time.
 *
 * @param dir direction of force
 * @param mag magnitude of force
 * @param dur duration of force
 * @param start start time of force
 * @returns new force
 *
 * @category Dynamics
 */
export function make_force(
  dir: Vector2,
  mag: number,
  dur: number,
  start: number,
): Force {
  let force: Force = {
    direction: dir,
    magnitude: mag,
    duration: dur,
    start_time: start,
  };
  return force;
}

/**
 * Create a new physics world and set gravity of world.
 *
 * @param v gravity vector
 * @example
 * ```
 * set_gravity(0, -9.8); // gravity vector for real world
 * ```
 *
 * @category Main
 */
export function set_gravity(v: Vector2) {
  world = new PhysicsWorld();
  context.moduleContexts.physics2D.state = {
    world,
  };
  world.setGravity(v);
}

/**
 * Make the ground body of the world.
 *
 * @param height height of ground
 * @param friction friction of ground
 *
 * @category Main
 */
export function make_ground(height: number, friction: number) {
  if (!world) {
    throw new Error('Please call set_gravity first!');
  }

  world.makeGround(height, friction);
}

/**
 * Make a box object with given initial position, rotation, velocity, size and add it to the world.
 *
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param size size
 * @returns new box object
 *
 * @category Body
 */
export function add_box_object(
  pos: Vector2,
  rot: number,
  velc: Vector2,
  size: Vector2,
): PhysicsObject {
  if (!world) {
    throw new Error('Please call set_gravity first!');
  }
  const newObj: PhysicsObject = new PhysicsObject(
    pos,
    rot,
    new b2PolygonShape()
      .SetAsBox(size.x / 2, size.y / 2),
    world,
  );
  newObj.setVelocity(velc);
  world.addObject(newObj);
  return newObj;
}

/**
 * Make a circle object with given initial position, rotation, velocity, radius and add it to the world.
 *
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param radius radius
 * @returns new circle object
 *
 * @category Body
 */
export function add_circle_object(
  pos: Vector2,
  rot: number,
  velc: Vector2,
  radius: number,
): PhysicsObject {
  if (!world) {
    throw new Error('Please call set_gravity first!');
  }
  const newObj: PhysicsObject = new PhysicsObject(
    pos,
    rot,
    new b2CircleShape()
      .Set(new Vector2(), radius),
    world,
  );
  newObj.setVelocity(velc);
  world.addObject(newObj);
  return newObj;
}

/**
 * Update the world with a fixed time step.
 *
 * @param dt value of fixed time step
 *
 * @category Main
 */
export function update_world(dt: number) {
  if (!world) {
    throw new Error('Please call set_gravity first!');
  }

  world.update(dt);
}

/**
 * Simulate the world.
 *
 * @param total_time total time to simulate
 *
 * @category Main
 */
export function simulate_world(total_time: number) {
  if (!world) {
    throw new Error('Please call set_gravity first!');
  }

  world.simulate(total_time);
}

/**
 * Get position of the object at current world time.
 *
 * @param obj existing object
 * @returns position of center
 *
 * @category Body
 */
export function get_position(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getPosition().x, obj.getPosition().y);
}

/**
 * Get rotation of the object at current world time.
 *
 * @param obj existing object
 * @returns rotation of object
 *
 * @category Body
 */
export function get_rotation(obj: PhysicsObject): number {
  return obj.getRotation();
}

/**
 * Get current velocity of the object.
 *
 * @param obj exisiting object
 * @returns velocity vector
 *
 * @category Body
 */
export function get_velocity(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getVelocity().x, obj.getVelocity().y);
}

/**
 * Get current angular velocity of the object.
 *
 * @param obj exisiting object
 * @returns angular velocity vector
 *
 * @category Body
 */
export function get_angular_velocity(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getAngularVelocity());
}

/**
 * Sets the position of the object.
 *
 * @param obj existing object
 * @param pos new position
 *
 * @category Body
 */
export function set_position(obj: PhysicsObject, pos: Vector2): void {
  obj.setPosition(pos);
}

/**
 * Sets the rotation of the object.
 *
 * @param obj existing object
 * @param rot new rotation
 *
 * @category Body
 */
export function set_rotation(obj: PhysicsObject, rot: number): void {
  obj.setRotation(rot);
}

/**
 * Sets current velocity of the object.
 *
 * @param obj exisiting object
 * @param velc new velocity
 *
 * @category Body
 */
export function set_velocity(obj: PhysicsObject, velc: Vector2): void {
  obj.setVelocity(velc);
}

/**
 * Get current angular velocity of the object.
 *
 * @param obj exisiting object
 * @param velc angular velocity number
 *
 * @category Body
 */
export function set_angular_velocity(obj: PhysicsObject, velc: number): void {
  return obj.setAngularVelocity(velc);
}

/**
 * Set density of the object.
 *
 * @param obj existing object
 * @param density density
 *
 * @category Body
 */
export function set_density(obj: PhysicsObject, density: number) {
  obj.setDensity(density);
}

/**
 * Set friction of the object.
 *
 * @param obj
 * @param friction
 *
 * @category Body
 */
export function set_friction(obj: PhysicsObject, friction: number) {
  obj.setFriction(friction);
}

/**
 * Check if two objects is touching.
 *
 * @param obj1
 * @param obj2
 * @returns touching state
 *
 * @category Dynamics
 */
export function is_touching(obj1: PhysicsObject, obj2: PhysicsObject) {
  return obj1.isTouching(obj2);
}

/**
 * Impact start time of two currently touching objects.
 *
 * @param obj1
 * @param obj2
 * @returns impact start time
 *
 * @category Dynamics
 */
export function impact_start_time(obj1: PhysicsObject, obj2: PhysicsObject) {
  if (!world) {
    throw new Error('Please call set_gravity first!');
  }

  return world.findImpact(obj1, obj2);
}

/**
 * Apply force to an object.
 *
 * @param force existing force
 * @param obj existing object the force applies on
 *
 * @category Dynamics
 */
export function apply_force_to_center(force: Force, obj: PhysicsObject) {
  obj.addForceCentered(force);
}

/**
 * Apply force to an object at a given world point.
 *
 * @param force existing force
 * @param pos world point the force is applied on
 * @param obj existing object the force applies on
 *
 * @category Dynamics
 */
export function apply_force(force: Force, pos: Vector2, obj: PhysicsObject) {
  obj.addForceAtAPoint(force, pos);
}