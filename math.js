//////////////////////////////////////
// math and 2D vector math  {x: 0, y: 0}
//////////////////////////////////////

// create a vector from a scalar (number)
// usage:
// let v = vec( 0, 0 );
export function vec( n, n2=n ) { return {x: n, y: n2}; }

// given an [x,y] starting position, and a distance with angle (rad)
// return the resulting [x,y] position
// usage:
// let p = radialToCartesian( 0, 0, 10, 45 * TO_RAD )
export function radialToCartesian( x, y, radius, angle_rad ) {
  return {
     x: x + radius * Math.cos( angle_rad ),
     y: y + radius * Math.sin( angle_rad )
  };
}
// square the number
export function sqr( n ) { return n*n; }

// return the magnitude of the vector
export function mag( v ) {
  return Math.sqrt( sqr( v.x ) + sqr( v.y ) );
}

// reverse (invert) the direction of the vector
export function inv( v ) {
  return {x: -v.x, y: -v.y};
}

// return the distance from p0 to p1
export function dist( p0, p1 ) {
  return mag( sub( p0, p1 ) );
}

// perpendicular vector (rotated 90 deg)
export function perp( v ) {
  let theta = -90 * Math.PI / 180;
  let cs = Math.cos(theta);
  let sn = Math.sin(theta);
  return {
     x: v.x * cs - v.y * sn,
     y: v.x * sn + v.y * cs,
  }
}

// return the unnormalized vector from p1 to p0
export function sub( p0, p1 ) {
  return {x: p0.x - p1.x, y: p0.y - p1.y};
}
// add p1 to p0
export function add( p0, p1 ) {
  return {x: p0.x + p1.x, y: p0.y + p1.y};
}
// multiply p1 & p0
export function mul( p0, p1 ) {
  return {x: p0.x * p1.x, y: p0.y * p1.y};
}
// divide p0 / p1
export function div( p0, p1 ) {
  return {x: p0.x / p1.x, y: p0.y / p1.y};
}
// normalize the vector
export function norm( v ) {
  let d = mag( v );
  return {x: v.x/d, y: v.y/d};
}

// return the normalized direction vector for the two points.
export function dir( p0, p1 ) {
  return norm( sub( p0, p1 ) );
}

// http://paulbourke.net/geometry/pointlineplane/
export function line_intersect(v1, v2, v3, v4) {
  let denom = (v4.y - v3.y)*(v2.x - v1.x) - (v4.x - v3.x)*(v2.y - v1.y);
  if (denom == 0) {
     return null; // parallel lines;
  }
  let ua = ((v4.x - v3.x)*(v1.y - v3.y) - (v4.y - v3.y)*(v1.x - v3.x))/denom;
  let ub = ((v2.x - v1.x)*(v1.y - v3.y) - (v2.y - v1.y)*(v1.x - v3.x))/denom;
  return {
     x: v1.x + ua * (v2.x - v1.x),
     y: v1.y + ua * (v2.y - v1.y),
     seg1: ua >= 0 && ua <= 1, // if both are true, then line SEGMENTS intersect,
     seg2: ub >= 0 && ub <= 1  // if either are false, then lines intersect
  };
}
export function dot( v1, v2 ) {
 return v1.x * v2.x + v1.y * v2.y;
}

// 2D cross product doesn't makes sense, or does it?
// do the 3D cross product of 2D vectors, result.x and .y will be 0, so
// simply return the z component only.  You can test for >0 or <0
export function cross( v1, v2 ) {
 return (v1.x * v2.y) - (v1.y * v2.x);
}

// returns angle in radians
export function angle( v1, v2 ) {
 let z = cross( v1, v2 );
 let a = Math.acos( dot( norm( v1 ), norm( v2 ) ) );
 return z > 0 ? a : -a;
}

// floor each dimension of the vec
export function floor( v ) {
  return {x: Math.floor( v.x ), y: Math.floor( v.y )};
}

// ceil each dimension of the vec
export function ceil( v ) {
  return {x: Math.ceil( v.x ), y: Math.ceil( v.y )};
}
