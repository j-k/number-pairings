# this modules implements some binary pairings
# these are objects like {z:...,xy:...,bounds:...},
# where
#   z: ( x, y ) -> z
#     maps the z ( x, y ) uniquely to z
#   xy: ( z ) -> ( x, y ) is the inverse of z
#   and bounds are the bounds of the two inputs (bound[0], bound[1])
#     and the output (bound[2])
# a bound of 0 means unbounded, otherwise the bound is the maximum value plus one
# all numbers are assumed to be positive integers including zero
# there are also half-pairings for commutative relations

{say, fl, sq, tn, tr, ext, min, max, pow, log, minBound, list, plot} = require './helpers'

# Cantor pairing
Cantor =
  z: ( x, y ) -> tn( x + y ) + y
  xy: ( z ) ->
    t = tr z
    [
      ( t * ( t + 3 ) / 2 ) - z
      z - ( ( t * ( t + 1 ) ) / 2 )
    ]
  b: [ 0 0 0 ]

# elegant pairing
elegant =
  z: ( x, y ) ->
    if ( y >= x )
      y * ( y + 1 ) + x;
    else
      x * x + y;
  xy: ( z ) ->
    sq_z = sq z
    if ( sq_z * sq_z > z ) then sq_z--
    t = z - sq_z * sq_z
    if (t < sq_z)
      [ sq_z, t ]
    else
      [ t - sq_z, sq_z ]
  b: [ 0 0 0 ]

# power of two pairing
poto =
  z: ( x, y ) ->
    pow( 2, x ) * ( 2 * y + 1 ) - 1
  xy: ( z ) ->
    _z = z + 1
    for x from 0 til _z
      p = fl( pow( 2, x ) )
      q = _z / p
      if  q % 2 is 1 then
        return [ x, fl( q / 2 ) ]
  b: [ 0 0 0 ]

# half pairing (only x<=y pairs)
half =
  z: ( x, y ) ->
    _x = max x, y
    _y = min x, y
    tn( _x ) + _y
  xy: ( z ) ->
    x = tr z
    y = ext z
    [ x, y ]
  b: [ 0 0 0 ]

# finite/finite pairing
field = ( sx, sy ) ->
  z: ( x, y ) ->
    if( x < sx and y < sy )
      sx * y + x % sx
  xy: ( z ) ->
    if( z < sx * sy )
      [ z % sx, fl z/sx]
  b: [  sx, sy, sx * sy ]

# x is finite y is infinite
stack-y = ( sx ) ->
  z: ( x, y ) ->
    if( x < sx )
      sx * y + x % sx
  xy: ( z ) ->
    [ z % sx, fl z/sx ]
  b: [ sx, 0, 0 ]

# x is infinite and y is finite
stack-x = ( sy ) ->
  z: ( x, y ) ->
    if( y < sy )
      y % sy + sy * x
  xy: ( z ) ->
    [ fl( z/sy ), z % sy ]
  b: [ 0, sy, 0 ]

test-examples = !->
  say = console.log
  say \Cantor\n
  say list Cantor
  say plot Cantor
  say \elegant\n
  say list elegant
  say plot elegant
  say \poto\n
  say list poto
  say plot poto
  say \half\n
  say list half
  say plot half
  say \field\n
  f = field 3, 4
  say f.b
  say list f
  say plot f
  say \stack-y\n
  sy = stack-y 3
  say list sy
  say plot sy
  say \stack-x\n
  sx = stack-x 3
  say list sx
  say plot sx

if require.main is module
  test-examples!
else
  module.exports = { Cantor, elegant, poto, half, field, stack-y, stack-x }
