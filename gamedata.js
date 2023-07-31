import { Map } from "/map.js";
import { Sprite } from "/sprite.js";

////////////////////////////////////////////////////////////////////////////////
// game data

export let fps = 30;  // frame rate  (film is 24hz, TV at 60hz)

let actor_update_func = (actor) => {
  // if (!actors[0].collide( actor.x + actor.dx * 1/fps, actor.y + actor.dy * 1/fps )) {
  //   actor.x += actor.dx * 1/fps; // move by dx every second
  //   actor.y += actor.dy * 1/fps; // move by dy every second
  // }

  let collided_actors = actors.filter( a => {
    if (a == actor) return false
    return a.collideBox( actor.x + actor.bbox.x + actor.dx * 1/fps,
                        actor.y + actor.bbox.y + actor.dy * 1/fps,
                        actor.bbox.w,
                        actor.bbox.h );
  });

  // log who we hit
  if (collided_actors.length > 0)
    console.log( "collided with:", collided_actors.map( a => a.name ).join( ", " ))

  // move the actor by its velocity, as long as it isnt colliding
  if (collided_actors.length == 0) {
    actor.x += actor.dx * 1/fps; // move by dx every second
    actor.y += actor.dy * 1/fps; // move by dy every second
  }
};

// list of game actors
// each game actor must have a draw( ctx ) on it.
// and by convention:
// - our map is always at actor[0]
// - our PC (player character) is always at actor[1]
export let actors = [
  // actors[0] is the map
  new Map( "walls.jpg", 8, 16, 32, [
    // define the map, using tile ID (see image)
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,12,12,12,12,12,12, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,12,12,12,12,12,12, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,12,12,12,12,12,12, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,12,12,12,12,12,12, 8, 8, 8, 8, 2,
    2, 8, 8,17,17,17,17,17,17, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,12,12,12,12,12,12, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,12,12,12,12,12,12, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  ],
  // these tile IDs will be collidable
  [2, 7, 12, 17] ),

  // actors[1] is the player character
  new Sprite( "Player Character", "sprites.png", 400,40, 9,4,
    // sprite animation sequences (see image for the frames used below)
    {
      default: {interval: 0.05, frames: [[0,3], ] },
      up: {interval: 0.5, frames: [[1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], ] },
      left: {interval: 0.25, frames: [[1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], ] },
      down: {interval: 0.5, frames: [[1,2], [2,2], [3,2], [4,2], [5,2], [6,2], [7,2], [8,2], ] },
      right: {interval: 0.25, frames: [[1,3], [2,3], [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], ] },
      up_idle:  {interval: 0.05, frames: [[0,0], ] },
      left_idle:  {interval: 0.05, frames: [[0,1], ] },
      down_idle:  {interval: 0.05, frames: [[0,2], ] },
      right_idle:  {interval: 0.05, frames: [[0,3], ] },
    },

    // bounding box
    { x: 22, y: 15, w: 20, h: 48 },

    // update function
    actor_update_func
  ),

  // enemy
  new Sprite( "Enemy", "sprites.png", 400,160, 9,4,
    // sprite animation sequences (see image for the frames used below)
    {
      default: {interval: 0.05, frames: [[0,3], ] },
      up: {interval: 0.5, frames: [[1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], ] },
      left: {interval: 0.25, frames: [[1,1], [2,1], [3,1], [4,1], [5,1], [6,1], [7,1], [8,1], ] },
      down: {interval: 0.5, frames: [[1,2], [2,2], [3,2], [4,2], [5,2], [6,2], [7,2], [8,2], ] },
      right: {interval: 0.25, frames: [[1,3], [2,3], [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], ] },
      up_idle:  {interval: 0.05, frames: [[0,0], ] },
      left_idle:  {interval: 0.05, frames: [[0,1], ] },
      down_idle:  {interval: 0.05, frames: [[0,2], ] },
      right_idle:  {interval: 0.05, frames: [[0,3], ] },
    },

    // bounding box
    { x: 22, y: 15, w: 20, h: 48 },

    // update function
    actor_update_func
  ),
]; // end of actor array...
