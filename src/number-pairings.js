// Copyright (C) 2017 Jens Kubacki - All Rights Reserved
// see license file

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
const pushFront = (e, a) => { return [e].concat(a); };

// Cantor pairing
export function Cantor() {
  return {
    join: ( x, y ) => { return tn( x + y ) + y },
    split: ( z ) => {
      let t = tr( z )
      return [
        ( t * ( t + 3 ) / 2 ) - z,
        z - ( ( t * ( t + 1 ) ) / 2 )
      ]
    },
    bounds: () => { return [ 0, 0, 0 ] }
  }
}

// elegant pairing
export function elegant() {
  return {
    join: ( x, y ) => {
      if ( y >= x )
        return y * ( y + 1 ) + x;
      else
        return x * x + y;
    },
    split: ( z ) => {
      let sq_z = sq( z )
      if ( sq_z * sq_z > z ) sq_z--
      let t = z - sq_z * sq_z
      if (t < sq_z) return [ sq_z, t ]
      else return [ t - sq_z, sq_z ]
    },
    bounds: () => { return [ 0, 0, 0 ] }
  }
}

// power of two pairing
export function poto() {
  return {
    join: ( x, y ) => { return pow( 2, x ) * ( 2 * y + 1 ) - 1 },
    split: ( z ) => {
      var _z, i$, x, p, q;
      _z = z + 1;
      for (i$ = 0; i$ < _z; ++i$) {
        x = i$;
        p = fl(pow(2, x));
        q = _z / p;
        if (q % 2 === 1) { return [x, fl(q / 2)]; }
      }
    },
    bounds: () => { return [ 0, 0, 0 ] }
  }
}

// half pairing (only x <= y pairs)
export function half() {
  return {
    join: ( x, y ) => { return tn( max( x, y ) ) + min( x, y ) },
    split: ( z ) => { return [ ext( z ), tr( z ) ] },
    bounds: () => { return [ 0, 0, 0 ] }
  }
}

// finite field (matrix) of two dimensions
export function field( sx, sy ) {
  const sz = sx * sy
  return {
    join: ( x, y ) => { if( x < sx && y < sy ) return sx * y + x % sx },
    split: ( z ) => { if( z < sz ) return [ z % sx, fl( z / sx ) ] },
    bounds: () => { return [ sx, sy, sz ] }
  }
}

// x is infinite and y is finite
// sy: size in y
export function stack_x( sy ) {
  return {
    join: ( x, y ) => { if( y < sy ) return y % sy + sy * x },
    split: ( z ) => { return [ fl( z / sy ), z % sy ] },
    bounds: () => { return [ 0, sy, 0 ] }
  }
}

// x is finite y is infinite
// sx: size in x
export function stack_y( sx ) {
  return {
    join: ( x, y ) => { if( x < sx ) return x % sx + sx * y },
    split: ( z ) => { return [ z % sx, fl( z / sx ) ] },
    bounds: () => { return [ sx, 0, 0 ] }
  }
}

// default infinite-infinite pairing
const def_iip = Cantor

// selection
const select = ( x, y, iip = def_iip ) => {
  if( x === 0 && y === 0 ) return iip
  else if( x === 0 ) return stack_x( y )
  else if( y === 0 ) return stack_y( x )
  else return field( x, y )
}

// composition operator
export function composition( l, iip = def_iip ) {
  const _arity = l.length
  const _iip = new def_iip
  let _pairings = [ select( l[_arity-2], l[_arity-1] ) ]
  for( let i = _arity-3; i >= 0; i-- ) {
    let new_pairing = select( l[i], _pairings[0].bounds()[2], iip )
    _pairings = pushFront( new_pairing, _pairings )
  }
  const _bounds = l.concat( [ _pairings[0].bounds()[2] ] )
  return {
    join: ( l ) => {
      for( let i = 0; i<_arity; i++)
        if( l[i] >= _bounds[i] && _bounds[i] > 0 ) return
      let k = l.length
      if( k !== _arity) return
      let n = _pairings[k-2].join( l[k-2], l[k-1] )
      for( let i=k-3; i>=0; i-- )
        n = _pairings[i].join( l[i], n )
      return n
    },
    split: ( n ) => {
      if( n >= _bounds[_arity] && _bounds[_arity] > 0 ) return
      let [ x, y ] = _pairings[0].split( n )
      let l = [ x ]
      if( _pairings.length > 1 )
        for( let k = 1; k<_pairings.length; k++ ) {
          [ x, y ] = _pairings[k].split( y )
          l.push( x )
        }
      l.push( y )
      return l
    }
  }
}
