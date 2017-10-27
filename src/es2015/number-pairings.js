// this modules implements some binary pairings
// - these are objects like {z:...,xy:...,bounds:...},
// - where
//   z: ( x, y ) -> z
//     maps the z ( x, y ) uniquely to z
//   xy: ( z ) -> ( x, y ) is the inverse of z
//   and bounds are the bounds of the two inputs (bound[0], bound[1])
//     and the output (bound[2])
// - a bound of 0 means unbounded, otherwise the bound is the maximum value plus one
// - all numbers are assumed to be positive integers including zero
// - there are also half-pairings for commutative relations

//import { fl, sq, tn, tr, ext, min, max, pow, range } from './helpers'

const fl = Math.floor
const sq = ( x ) => fl( Math.sqrt( x ) )
const tn = ( x ) => x * ( x + 1 ) / 2 //  sum of all n <= x (Gauss) - triangle numaers
const tr = ( x ) => fl( ( sq( 1 + x * 8 ) - 1 ) / 2 ) //  triangle root (inverse of tn())
const ext = ( x ) => x - tn( tr( x ) ) //  excess over last triangle numaer
const min = Math.min
const max = Math.max
const pow = Math.pow
const range = (start, end) => { return [...Array(1+end-start).keys()].map(v => start+v) }

// Cantor pairing
export const Cantor = {
  z: ( x, y ) => tn( x + y ) + y,
  xy: ( z ) => {
    t = tr( z )
    return [
      ( t * ( t + 3 ) / 2 ) - z,
      z - ( ( t * ( t + 1 ) ) / 2 )
    ]
  },
  b: [ 0, 0, 0 ]
}

// elegant pairing
export const elegant = {
  z: ( x, y ) => {
    if ( y >= x )
      return y * ( y + 1 ) + x;
    else
      return x * x + y;
  },
  xy: ( z ) => {
    sq_z = sq( z )
    if ( sq_z * sq_z > z ) sq_z--
    t = z - sq_z * sq_z
    if (t < sq_z) return [ sq_z, t ]
    else return [ t - sq_z, sq_z ]
  },
  b: [ 0, 0, 0 ]
}

// power of two pairing
export const poto = {
  z: ( x, y ) => pow( 2, x ) * ( 2 * y + 1 ) - 1,
  xy: ( z ) => {
    _z = z + 1
    for( let x in range(0, _z-1) ) {
      p = fl( pow( 2, x ) )
      q = _z / p
      if( q % 2 === 1 )
        return [ x, fl( q / 2 ) ]
    }
  },
  b: [ 0, 0, 0 ]
}

// half pairing (only x<=y pairs)
export const half = {
  z: ( x, y ) => {
    _x = max( x, y )
    _y = min( x, y )
    return tn( _x ) + _y
  },
  xy: ( z ) => {
    x = tr( z )
    y = ext( z )
    return [ x, y ]
  },
  b: [ 0, 0, 0 ]
}

// finite/finite pairing
export const field = ( sx, sy ) => {
  return {
    z: ( x, y ) => {
      if( x < sx && y < sy ) return sx * y + x % sx
    },
    xy: ( z ) => {
      if( z < sx * sy ) return [ z % sx, fl( z/sx ) ]
    },
    b: [  sx, sy, sx * sy ]
  }
}

// x is finite y is infinite
export const stack_y = ( sx ) => {
  return {
    z: ( x, y ) => {
      if( x < sx )
        return sx * y + x % sx
    },
    xy: ( z ) => [ z % sx, fl( z/sx ) ],
    b: [ sx, 0, 0 ]
  }
}

// x is infinite and y is finite
export const stack_x = ( sy ) => {
  return {
    z: ( x, y ) => {
      if( y < sy )
        return y % sy + sy * x
    },
    xy: ( z ) => [ fl( z/sy ), z % sy ],
    b: [ 0, sy, 0 ]
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

/*
// composition
composition = ( l, iip = def_iip ) => {
  arity = l.length
  pairings = [ select( l[arity-2], l[arity-1] ) ]
  for( i=arity-3; i>=0; i-- ) {
    new_pairing = select( l[i], pairings[0].b[2], iip )
    pairings = pushFront( new_pairing, pairings )
  }
  return {
    b: l.concat( [ pairings[0].b[2] ] ),
    join: ( l ) => {
      k = l.length
      //if k isnt arity then return
      //n = pairings[k-2].z( l[k-2], l[k-1] )
      //for i in [k-3 to 0 by -1]
      //  n = pairings[i].z( l[i], n )
      //n
    },
    split: ( n ) => {
      //[ x, y ] = pairings[0].xy( n )
      //l = [ x ]
      //if pairings.length > 1
      //  for k from 1 til pairings.length
      //    [ x, y ] = pairings[k].xy( y )
      //    l.push x
      //l.push y
      //l
    }
  }
}
*/
