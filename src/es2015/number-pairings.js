// this modules implements some binary pairings
// - these are objects like {join:...,split:...,bounds:...},
// - where
//   join: ( x, y ) -> z
//     maps the z ( x, y ) uniquely to z
//   split: ( z ) -> ( x, y ) is the inverse of z
//   and bounds are the bounds of the two inputs (bound[0], bound[1])
//     and the output (bound[2])
// - a bound of 0 means unbounded, otherwise the bound is the maximum value plus one
// - all numbers are assumed to be positive integers including zero
// - there are also half-pairings for commutative relations

// todo: check bounds

const fl = Math.floor
const min = Math.min
const max = Math.max
const pow = Math.pow
const sq = ( x ) => fl( Math.sqrt( x ) )
const tn = ( x ) => x * ( x + 1 ) / 2 // triangle numbers
const tr = ( x ) => fl( ( sq( 1 + x * 8 ) - 1 ) / 2 ) //  triangle root
const ext = ( x ) => x - tn( tr( x ) ) //  excess over last triangle numaer
const pushFront = function(e, a){ return [e].concat(a); };

// Cantor pairing
export class Cantor {
  join( x, y ) { return tn( x + y ) + y }
  split( z ) {
    let t = tr( z )
    return [
      ( t * ( t + 3 ) / 2 ) - z,
      z - ( ( t * ( t + 1 ) ) / 2 )
    ]
  }
  bounds() { return [0, 0, 0] }
}

// elegant pairing
export class elegant {
  join ( x, y ) {
    if ( y >= x )
      return y * ( y + 1 ) + x;
    else
      return x * x + y;
  }
  split ( z ) {
    let sq_z = sq( z )
    if ( sq_z * sq_z > z ) sq_z--
    let t = z - sq_z * sq_z
    if (t < sq_z) return [ sq_z, t ]
    else return [ t - sq_z, sq_z ]
  }
  bounds() { return [0, 0, 0] }
}

// power of two pairing
export class poto {
  join ( x, y ) {
    return pow( 2, x ) * ( 2 * y + 1 ) - 1
  }
  split ( z ) {
    // this is the transpiled code from LiveScript
    // another "own" try didn't work
    // -> find out why
    var _z, i$, x, p, q;
    _z = z + 1;
    for (i$ = 0; i$ < _z; ++i$) {
      x = i$;
      p = fl(pow(2, x));
      q = _z / p;
      if (q % 2 === 1) {
        return [x, fl(q / 2)];
      }
    }
  }
  bounds() { return [0, 0, 0] }
}

// half pairing (only x<=y pairs)
export class half {
  join ( x, y ) {
    let _x = max( x, y )
    let _y = min( x, y )
    return tn( _x ) + _y
  }
  split ( z ) {
    let x = ext( z )
    let y = tr( z )
    return [ x, y ]
  }
  bounds() { return [0, 0, 0] }
}

// finite/finite pairing
// sx: size in x
// sy: size in y
export class field {
  constructor( sx, sy ) {
    this._sx = sx
    this._sy = sy
    this._sz = sx * sy
  }
  join ( x, y ) {
    if( x < this._sx && y < this._sy )
      return this._sx * y + x % this._sx
  }
  split ( z ) {
    if( z < this._sz )
      return [ z % this._sx, fl( z / this._sx ) ]
  }
  bounds() { return [this._sx, this._sy, this._sz] }
}

// x is infinite and y is finite
export class stack_x {
  constructor( sy ) {
    this._sy = sy
  }
  join ( x, y ) {
    if( y < this._sy )
    return y % this._sy + this._sy * x
  }
  split ( z ) {
    let x = fl( z / this._sy )
    let y = z % this._sy
    return [ x, y ]
  }
  bounds() { return [0, this._sy, 0] }
}

// x is finite y is infinite
export class stack_y {
  constructor( sx ) {
    this._sx = sx
  }
  join ( x, y ) {
    if( x < this._sx )
      return this._sx * y + x % this._sx
  }
  split ( z ) {
    return [ z % this._sx, fl( z / this._sx ) ]
  }
  bounds() { return [ this._sx, 0, 0 ] }
}

// default infinite-infinite pairing
const def_iip = Cantor

// selection
const select = ( x, y, iip = def_iip ) => {
  if( x === 0 && y === 0 ) return new iip
  else if( x === 0 ) return new stack_x( y )
  else if( y === 0 ) return new stack_y( x )
  else return new field( x, y )
}

// composition operator
export class composition  {
  constructor( l, iip = def_iip ) {
    this._arity = l.length
    this._iip = new def_iip
    let first = select( l[this._arity-2], l[this._arity-1] )
    this._pairings = [ first ]
    for( let i = this._arity-3; i >= 0; i-- ) {
      let new_pairing = select( l[i], this._pairings[0].bounds()[2], iip )
      this._pairings = pushFront( new_pairing, this._pairings )
    }
    this._bounds = l.concat( [ this._pairings[0].bounds()[2] ] )
  }
  join( l ) {
    for( let i = 0; i<this._arity; i++)
      if( l[i] >= this._bounds[i] && this._bounds[i] > 0 ) return
    let k = l.length
    if( k !== this._arity) return
    let n = this._pairings[k-2].join( l[k-2], l[k-1] )
    for( let i=k-3; i>=0; i-- )
      n = this._pairings[i].join( l[i], n )
    return n
  }
  split( n ) {
    if( n >= this._bounds[this._arity] && this._bounds[this._arity] > 0 ) return
    let [ x, y ] = this._pairings[0].split( n )
    let l = [ x ]
    if( this._pairings.length > 1 )
      for( let k = 1; k<this._pairings.length; k++ ) {
        [ x, y ] = this._pairings[k].split( y )
        l.push( x )
      }
    l.push( y )
    return l
  }
}
