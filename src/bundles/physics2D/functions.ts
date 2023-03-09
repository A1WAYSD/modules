/**
 * Physics2D
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module physics2D
 * @author Author Name
 * @author Author Name
 */

import { b2CircleShape, b2PolygonShape } from '@box2d/core';
import { Force, PhysicsObject, PhysicsWorld, Vector2 } from './types';

// Global Variables

let world;


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
 * @returns new force
 * 
 * @category Dynamics
 */
export function make_force(dir: Vector2, mag: number): Force {
  let force: Force = {
    direction: dir,
    magnitude: mag,
    duration: 0,
    start_time: 0,
  };
  return force;
}

/**
 * Apply force to an object.
 * 
 * @param force existing force
 * @param start start time of force
 * @param dur duration of force
 * @param obj existing object the force applies on
 * 
 * @category Dynamics
 */
export function apply_force(force: Force, start: number, dur: number, obj: PhysicsObject) {
  force.start_time = start;
  force.duration = dur;
  obj.addForce(force);
}

/**
 * Create a new physics world and set gravity of world.
 * 
 * @param v gravity vector
 * @example
 * ```
 * set_gravity(0, -9.8); //gravity vector for real world
 * ```
 * 
 * @category Main
 */
export function set_gravity(v: Vector2) {
  world = new PhysicsWorld();
  world.setGravity(v);
}

// /**
//  * Make the ground body of the world.
//  * 
//  * @param x height of ground
//  * 
//  * @category Main
//  */
// export function make_ground(x: number) {
//   world.makeGround(x);
// }
export function make_ground() {
  world.makeGround(-5);
}

/**
 * Make a box object with given initial position, rotation, velocity and size.
 * 
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param size size
 * @returns new box object
 * 
 * @category Main
 */
export function make_box_object(pos: Vector2,
  rot: number, velc: Vector2, size: Vector2): PhysicsObject {
  const newObj: PhysicsObject = new PhysicsObject(pos, rot, new b2PolygonShape()
    .SetAsBox(size.x, size.y), world);
  newObj.setLinearVelocity(velc);

  return newObj;
}

/**
 * Make a circle object with given initial position, rotation, velocity and radius.
 * 
 * @param pos initial position vector of center
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @param radius radius
 * @returns new circle object
 * 
 * @category Main
 */
export function make_circle_object(pos: Vector2,
  rot: number, velc: Vector2, radius: number): PhysicsObject {
  const newObj: PhysicsObject = new PhysicsObject(pos, rot, new b2CircleShape()
    .Set(new Vector2(), radius), world);
  newObj.setLinearVelocity(velc);

  return newObj;
}

/**
 * Add the object to the world.
 * 
 * @param obj existing object
 * 
 * @category Main
 */
export function add_to_world(obj: PhysicsObject) {
  world.addObject(obj);
}

/**
 * Update the world with a fixed time step.
 * 
 * @param dt value of fixed time step
 * 
 * @category Main
 */
export function update_world(dt: number) {
  world.update(dt);
}

/**
 * Get position of the object at current world time.
 * 
 * @param obj existing object
 * @returns position of center
 * 
 * @category Main
 */
export function get_position(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getPosition().x, obj.getPosition().y);
}

/**
 * Get current velocity of the object.
 * 
 * @param obj exisiting object
 * @returns velocity vector
 * 
 * @category Main
 */
export function get_velocity(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getVelocity().x, obj.getVelocity().y);
}


