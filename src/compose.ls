# compose an n-ary pairing
# out of binary pairings
# input is a list of element numbers per dimension

{last} = require './helpers'
{field, stack-x, stack-y, Cantor} = require './pairings'

# default infinite-infinite pairing
def-iip = Cantor

# selection
select = ( x, y, iip=def-iip ) ->
  if x is 0 and y is 0 then iip
  else if x is 0 then stack-x y
  else if y is 0 then stack-y x
  else field x, y

# composition
compose = ( l, iip=def-iip ) ->
  pairings = [ select( l[0], l[1] ) ]
  for n from 2 til l.length
    new-pairing = select( last( pairings ).b[2], l[n] )
    pairings.push new-pairing
  b: l.concat [ last( pairings ).b[2] ]
  
# todo: test and complete this

if require.main is module
  console.log compose [1,2,3,4,5]
