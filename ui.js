import { vec, radialToCartesian, sqr, mag, 
        inv, dist, perp, sub,
        add, mul, div, norm, dir,
        line_intersect, dot, cross, angle,
        floor, ceil } from "/math.js";


export class UI {
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
  onCollideFunc = (me, actor, caused) => {};
  name = "";

  // called when new Sprite( ..... ) is invoked, to setup the new sprite
  constructor( name, filename, x, y, 
              updateFunc = (s) => {},
              onInitFunc = (me) => {} ) {
    this.img = new Image();    // a new empty image
    this.img.addEventListener( "load", () => {
      this.width = this.img.width;
      this.height = this.img.height;
      console.log( `Sprite ${filename} loaded with ${this.width} x ${this.height}`)
    });
    this.img.src = filename;  // loads the image
    this.x = x;               // sprite x position
    this.y = y;               // sprite y position
    this.width = this.img.width; // width of the sprite in pixels
    this.height = this.img.height; // height of the sprite in pixels
    this.showbbox = false;     // debug: display the bounding box
    this.updateFunc = updateFunc;
    this.name = name;
    onInitFunc(this)
  }

  // draw the sprite using the given canvas ctx
  draw( ctx ) {

    // draws the image into the canvas\
    ctx.drawImage( this.img,
      0,0,
      this.img.width, this.img.height, // original image pixels
      this.x, this.y,
      this.width, this.height  // new pos/size you want to draw
    );

    console.log( this.width, this.height )


    this.updateFunc( this );
  }

}
