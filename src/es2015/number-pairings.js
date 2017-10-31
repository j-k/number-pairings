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
const tn = ( x ) => x * ( x + 1 ) / 2 // triangle numaers
const tr = ( x ) => fl( ( sq( 1 + x * 8 ) - 1 ) / 2 ) //  triangle root
const ext = ( x ) => x - tn( tr( x ) ) //  excess over last triangle numaer
const pushFront = function(e, a){ return [e].concat(a); };

// Cantor pairing
export class Cantor {
  static join( x, y ) { return tn( x + y ) + y }
  static split( z ) {
    let t = tr( z )
    return [
      ( t * ( t + 3 ) / 2 ) - z,
      z - ( ( t * ( t + 1 ) ) / 2 )
    ]
  }
  static bound() { return 0 }
}

// elegant pairing
export class elegant {
  static join ( x, y ) {
    if ( y >= x )
      return y * ( y + 1 ) + x;
    else
      return x * x + y;
  }
  static split ( z ) {
    let sq_z = sq( z )
    if ( sq_z * sq_z > z ) sq_z--
    let t = z - sq_z * sq_z
    if (t < sq_z) return [ sq_z, t ]
    else return [ t - sq_z, sq_z ]
  }
  static bound() { return 0 }
}

// power of two pairing
export class poto {
  static join ( x, y ) {
    return pow( 2, x ) * ( 2 * y + 1 ) - 1
  }
  static split ( z ) {
    let _z = z + 1
    for( let x=0; x<_z; x++ ) {
      let p = fl( pow( 2, x ) )
      let q = _z / p
      if( q % 2 === 1 )
        return [ x, fl( q / 2 ) ]
    }
  }
  static bound() { return 0 }
}

// half pairing (only x<=y pairs)
export class half {
  static join ( x, y ) {
    let _x = max( x, y )
    let _y = min( x, y )
    return tn( _x ) + _y
  }
  static split ( z ) {
    let x = ext( z )
    let y = tr( z )
    return [ x, y ]
  }
  static bound() { return 0 }
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
      return [ z % this.sx, fl( z / this.sx ) ]
  }
  static bound() { return this._sz }
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
    return [ fl( z / this._sy ), z % this._sy ]
  }
  static bound() { return 0 }
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
  static bound() { return 0 }
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

// composition
export class composition  {
  constructor( l, iip = def_iip ) {
    this._arity = l.length
    this._iip = def_iip
    for( let i = 0; i < arity; i++ ) {
      if( l[i] === 0 ) return
    }
    this.pairings = [ select( l[this._arity-2], l[this._arity-1] ) ]
    for( let i=this._arity-3; i>=0; i-- ) {
      let new_pairing = select( l[i], this.pairings[0].bound(), iip )
      this.pairings = pushFront( new_pairing, this.pairings )
    }
    this.bounds = l.concat( [ this.pairings[0].bound() ] )
  }
  join( l ) {
    for( let i = 0; i<arity; i++)
      if( l[i] >= this.bounds[i] && this.bounds[i] > 0 ) return
    if( k !== arity) return
    let k = l.length
    let n = this.pairings[k-2].join( l[k-2], l[k-1] )
    for( let i=k-3; i>=0; i--)
      n = this.pairings[i].join( l[i], n )
    return n
  }
  split( n ) {
    if( n >= b[arity] && b[arity] > 0 ) return
    let [ x, y ] = this.pairings[0].split( n )
    let l = [ x ]
    if( this.pairings.length > 1 )
      for( let k = 1; k<this.pairings.length; k++ ) {
        [ x, y ] = this.pairings[k].split( y )
        l.push( x )
      }
    l.push( y )
    return l
  }
}
