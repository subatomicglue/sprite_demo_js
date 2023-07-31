import { Map } from "/map.js";
import { Sprite } from "/sprite.js";

////////////////////////////////////////////////////////////////////////////////
// game data

export let fps = 30;  // frame rate  (film is 24hz, TV at 60hz)
export let actors = [
  // actors[0] is the map
  new Map( "walls.jpg", 8, 16, 32, [
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
  ], [2, 7, 12, 17] ),

  // actors[1] is the player character
  new Sprite( "sprites.png", 400,40, 9,4, {
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
  { x: 22, y: 15, w: 20, h: 48 }, // bounding box
  actor => {
    // if (!actors[0].collide( actor.x + actor.dx * 1/fps, actor.y + actor.dy * 1/fps )) {
    //   actor.x += actor.dx * 1/fps; // move by dx every second
    //   actor.y += actor.dy * 1/fps; // move by dy every second
    // }

    if (!actors[0].collideBox( actor.x + actor.bbox.x + actor.dx * 1/fps,
                              actor.y + actor.bbox.y + actor.dy * 1/fps,
                              actor.bbox.w,
                              actor.bbox.h )) {
      actor.x += actor.dx * 1/fps; // move by dx every second
      actor.y += actor.dy * 1/fps; // move by dy every second
    }
  }),
]; // end of actor array...
