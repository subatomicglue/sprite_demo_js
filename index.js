
// a tile map
// map is defined with an image containing JxK sprite tiles, and an NxM grid of indexes into those sprite tiles. 
//   filename = the image containing a grid of sprite tiles
//   width = width of the image in pixels  (one sprite will be width/tilesx)
//   height = height of the image in pixels (one sprite will be height/tilesy)
//   tilesx/y = how many sprite tiles are in the image
//   map      = grid of indexes into those sprite tiles (what sprite to show for each tile)
//   mapx     = how wide is the map grid
//   collidable = the indexes that result in a collision, when calling Map.collide() 
//
// example usage:
//   let map = new Map( "walls.jpg", 8, 16, 32, [2,2,2,2, 2,3,4,2, 2,5,6,2, 2,2,2,2], [2, 6] )
//   map.draw( canvas.getContext("2d") );
function Map( filename, tilesx = 8, tilesy = 16, mapx = 4, map = [2,2,2,2, 2,3,4,2, 2,5,6,2, 2,2,2,2], collidable = [2, 7, 12, 17] ) {
  this.img = new Image();    // a new empty image
  this.img.addEventListener( "load", () => {
    this.width = this.img.width / this.tilesx;
    this.height = this.img.height / this.tilesy;
    console.log( `Map ${filename} loaded ${this.img.width} x ${this.img.height} total, ${this.width} x ${this.height} per tile, ${tilesx} x ${tilesy} tiles`)
  });
  this.img.src = filename;// loads the image
  this.tilesx = tilesx;   // number of x sprites in the image
  this.tilesy = tilesy;   // number of y sprites in the image
  this.mapx = mapx;       // number of x sprites in the map
  this.map = map;         // the sprite layout to draw.  e.g. [ 2,2,2,2 ], where each ID is an index into the image counting from left to right, starting at top left.
  this.collidable = collidable; // which sprite indexes are collidable
  this.x = 0;             // offset to draw the map into the canvas
  this.y = 0;             // offset to draw the map into the canvas

  this.draw = function( ctx ) {
    // todo: detect parent viewport extents, dont bother drawing out of bounds

    for (let i = 0; i < map.length; ++i) {
      let x = i % mapx;
      let y = Math.floor( i / mapx );
      let tx = map[i] % tilesx;
      let ty = Math.floor( map[i] / tilesx );

      // draws the image into the canvas
      ctx.drawImage( this.img,
        tx * this.width, ty * this.height,
        this.width, this.height, // original image pixels
        this.x + x * this.width, this.y + y * this.height,
        this.width, this.height  // new pos/size you want to draw
      );
    }
  }

  function mapXYtoIndex( x, y ) {
    return x + y * this.mapx;
  }

  // does x,y intersect a collidable tile?
  this.collide = function ( x, y ) {
    let mapx = Math.floor( x / this.width - this.x + 1);
    let mapy = Math.floor( y / this.height - this.y + 1 );
    let mapindex = mapx + mapy * this.mapx; // get the map grid location of x,y
    let id = this.map[mapindex];            // get the tile ID at the grid location 
    return this.collidable.find( r => r == id ); // is the tile ID collidable?
  }

  // does the box intersect a collidable tile?
  this.collideBox = function ( x, y, width, height ) {
    let topleft = vec( x, y );
    let botright = vec( x+width, y+height );
    // what map tiles does the given box pass through?
    let min_map = floor( sub( div( topleft, vec( this.width, this.height ) ), vec( this.x, this.y ) ) );
    let max_map = floor( sub( div( botright, vec( this.width, this.height ) ), vec( this.x, this.y ) ) );
    // if any of those tiles are collidable, signal a collision
    for (let j = min_map.y; j <= max_map.y; ++j) {
      for (let i = min_map.x; i <= max_map.x; ++i) {
        let index = i + j * this.mapx;
        let id = this.map[index];
        if (this.collidable.find( r => r == id )) {
          return true;
        }
      }
    }
    return false; // no collision
  }
}

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
function Sprite( filename, x, y, tilesx = 9, tilesy = 4, sequences = {default: {interval: 0.4, frames: [[0,0], [1,0]]} }, bbox = { x: 22, y: 15, w: 20, h: 48 }, updateFunc = (s) => {} ) {
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

  // draw the sprite using the given canvas ctx
  this.draw = function( ctx ) {   
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

    updateFunc( this );
  };

  // change animation
  this.changeSequence = ( name ) => {
    this.animation = this.sequences[name] ? this.sequences[name] : this.sequences.default;
    this.anim = 0;
  }
}

// clear the canvas using the given canvas ctx
function clear( ctx ) {
  ctx.fillStyle = "#000000";                    // use black
  ctx.fillRect(0,0,canvas.width,canvas.height); // clear the canvas
}

////////////////////////////////////////////////////////////////////////////////
// game data

let fps = 30;  // frame rate  (film is 24hz, TV at 60hz)
let actors = [
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

////////////////////////////////////////////////////////////////////////////////
// game loop methods
function init() {
}

function draw() {
  let ctx = canvas.getContext("2d");
  clear( ctx );
  for (let x=0; x < actors.length; ++x) {
    actors[x].draw( ctx );
  }
}

function resize() {
  // Check if the canvas's image buffer is not the same size as the browser's area.
  if (canvas.width  != canvas.clientWidth ||
      canvas.height != canvas.clientHeight) {
    // Make the canvas the same size
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    console.log( `resizing canvas to: ${canvas.width} x ${canvas.height}` )
  }
}

////////////////////////////////////////////////////////////////////////////////
// start the game loop
init();
setInterval( () => {
  resize();
  draw();
}, 1000 / fps );

////////////////////////////////////////////////////////////////////////////////
// respond to Input
document.onkeydown = (event) => {
  if (event.repeat) return;
  let speed = 3;
  switch (event.key) {
    case "ArrowLeft":
      actors[1].changeSequence("left");
      actors[1].dx = -32*speed;
      actors[1].dy = 0;
      break;
    case "ArrowRight":
      actors[1].changeSequence("right");
      actors[1].dx = 32*speed;
      actors[1].dy = 0;
      break;
    case "ArrowUp":
      actors[1].changeSequence("up");
      actors[1].dx = 0;
      actors[1].dy = -32*speed;
      break;
    case "ArrowDown":
      actors[1].changeSequence("down");
      actors[1].dx = 0;
      actors[1].dy = 32*speed;
      break;
  }
  console.log('keydown event\n\n' + 'key: ' + event.key, " repeat: ", event.repeat);
};

document.onkeyup = (event) => {
  if (event.repeat) return;
  // cancel velocity
  actors[1].dx = 0;
  actors[1].dy = 0;
  switch (event.key) {
    case "ArrowLeft":
      actors[1].changeSequence("left_idle");
      break;
    case "ArrowRight":
      actors[1].changeSequence("right_idle");
      break;
    case "ArrowUp":
      actors[1].changeSequence("up_idle");
      break;
    case "ArrowDown":
      actors[1].changeSequence("down_idle");
      break;
  }
  console.log('keyup event\n\n' + 'key: ' + event.key, " repeat: ", event.repeat);
};

