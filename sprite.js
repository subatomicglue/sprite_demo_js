import { vec, radialToCartesian, sqr, mag, 
        inv, dist, perp, sub,
        add, mul, div, norm, dir,
        line_intersect, dot, cross, angle,
        floor, ceil } from "/math.js";

// a sprite
// sprite is defined with an image containing JxK sprite tiles, and animation sequences of those. 
//   filename   = the image containing a grid of sprite tiles
//   x/y        = the position of the sprite    (use this for initial position)
//   dx/dy      = the velocity of the sprite    (use this to move)
//   width      = width of the sprite in pixels (image width == width * tilesx)
//   height     = height of the sprite in pixels (image height == height * tilesy)
//   tilesx/y   = how many sprite tiles are in the image
//   sequences  = several named animations, each one containing a sequence of tiles and the speed to play
//   updateFunc = called for each draw()
//
// example usage:
//   let actor = new Sprite( "sprites.png", 40,40, 9,4, { default: {interval: 0.05, frames: [[0,3], ] } }, { x: 22, y: 15, w: 20, h: 48 }, actor => {} )
//   actor.draw( canvas.getContext("2d") );
export class Sprite {
  img = undefined;
  x = 0;
  y = 0;
  tilesx = 0;
  tilesy = 0;
  width = 0;
  height = 0;
  anim = 0;
  sequences = {default: {interval: 0.4, frames: [[0,0], [1,0]]} };
  bbox = { x: 22, y: 15, w: 20, h: 48 };
  updateFunc = (s) => {};

  // called when new Sprite( ..... ) is invoked, to setup the new sprite
  constructor( filename, x, y, tilesx = 9, tilesy = 4,
              sequences = {default: {interval: 0.4, frames: [[0,0], [1,0]]} },
              bbox = { x: 22, y: 15, w: 20, h: 48 },
              updateFunc = (s) => {} ) {
    this.img = new Image();    // a new empty image
    this.img.addEventListener( "load", () => {
      this.width = this.img.width / this.tilesx;
      this.height = this.img.height / this.tilesy;
      console.log( `Sprite ${filename} loaded with ${this.width} x ${this.height}`)
    });
    this.img.src = filename;  // loads the image
    this.x = x;               // sprite x position
    this.y = y;               // sprite y position
    this.tilesx = tilesx;     // number of x sprites in the image
    this.tilesy = tilesy;     // number of y sprites in the image
    this.width = this.img.width / this.tilesx; // width of the sprite in pixels
    this.height = this.img.height / this.tilesy; // height of the sprite in pixels
    this.anim = 0;            // animation clock, controls which frame to display, loops
    this.sequences = sequences; // collection of named animation sequences, e.g. { default: {interval: 0.4, frames: [[0,0], [1,0]]}, ... }
    this.animation = this.sequences.default; // current sequence, e.g. {interval: 0.4, frames: [[0,0], [1,0]]}
    this.dx = 0;              // velocity in x
    this.dy = 0;              // velocity in y
    this.bbox = { x: 22, y: 15, w: 20, h: 48 }; // collision bounding box relative to x/y
    this.showbbox = false;     // debug: display the bounding box
    this.updateFunc = updateFunc;
  }

  // draw the sprite using the given canvas ctx
  draw( ctx ) {
    let frame = this.animation.frames[Math.floor( this.anim )]

    // draws the image into the canvas
    if (this.showbbox)
      ctx.fillRect( this.x + this.bbox.x,
                    this.y + this.bbox.y,
                    this.bbox.w,
                    this.bbox.h );
    ctx.drawImage( this.img,
      frame[0] * this.width, frame[1] * this.height,
      this.width, this.height, // original image pixels
      this.x, this.y,
      this.width, this.height  // new pos/size you want to draw
    );

    this.anim = (this.anim + this.animation.interval) % this.animation.frames.length;
    //console.log( `${Math.floor( this.anim ) * this.width} ${Math.floor( this.bank ) * this.height}`)

    this.updateFunc( this );
  };

  // change animation to another sequence
  //   (of the named sequences initially given to new Sprite( ... ))
  changeSequence( name ) {
    this.animation = this.sequences[name] ? this.sequences[name] : this.sequences.default;
    this.anim = 0;
  }
}
