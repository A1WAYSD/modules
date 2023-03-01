/**
 * Physics2D
 *
 * Sentences describing the module. More sentences about the module.
 *
 * @module physics2D
 * @author Author Name
 * @author Author Name
 */

import { b2PolygonShape } from '@box2d/core';
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
 * @param dur duration of force apply
 * @param start start time of force
 * @returns new force
 * 
 * @category Dynamics
 */
export function make_force(dir: Vector2, mag: number, dur: number, start: number): Force {
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
 * set_gravity(0, -9.8); //gravity vector for real world
 * ```
 * 
 * @category Main
 */
export function set_gravity(v: Vector2) {
  world = new PhysicsWorld();
  world.setGravity(v);
}

/**
 * Make the ground body of the world.
 * 
 * @param x height of ground
 * 
 * @category Main
 */
export function make_ground(x: number) {
  world.makeGround(x);
}

/**
 * Make a box object with given initial position, rotation and velocity.
 * 
 * @param pos initial position vector
 * @param rot initial rotation
 * @param velc initial velocity vector
 * @returns new box object
 * 
 * @category Main
 */
export function make_box_object(pos: Vector2,
  rot: number, velc: Vector2): PhysicsObject {
  const newObj: PhysicsObject = new PhysicsObject(pos, rot, new b2PolygonShape()
    .SetAsBox(5, 5), world);
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

export function update_world(dt: number) {
  world.update(dt);
}

export function get_position(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getPosition().x, obj.getPosition().y);
}

export function get_velocity(obj: PhysicsObject): Vector2 {
  return new Vector2(obj.getVelocity().x, obj.getVelocity().y);
}

export function apply_force(force: Force, obj: PhysicsObject) {
  obj.addForce(force);
}