import { vec, radialToCartesian, sqr, mag, 
        inv, dist, perp, sub,
        add, mul, div, norm, dir,
        line_intersect, dot, cross, angle,
        floor, ceil } from "/math.js";

import { Map } from "/map.js";
import { Sprite } from "/sprite.js";
import { fps, actors } from "/gamedata.js";


// clear the canvas using the given canvas ctx
function clear( ctx ) {
  ctx.fillStyle = "#000000";                    // use black
  ctx.fillRect(0,0,canvas.width,canvas.height); // clear the canvas
}

////////////////////////////////////////////////////////////////////////////////
// game loop methods

// initialize
function init() {
}

// draw the scene
function draw() {
  let ctx = canvas.getContext("2d");
  clear( ctx );

  // draw every actor (map, sprites, etc)
  for (let x=0; x < actors.length; ++x) {
    actors[x].draw( ctx );
  }
}

// called on viewport resize
function resize() {
  // Check if the viewport size changed
  // - Check if the canvas's image buffer is not the same size as the browser's area.
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

