# compose an n-ary pairing
# out of binary pairings
# input is a list of element numbers per dimension

{ last, pushFront, say } = require './helpers.ls'
{ field, stack-x, stack-y, Cantor } = require './pairings.ls'

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
  arity = l.length
  pairings = [ select( l[arity-2], l[arity-1] ) ]
  for i in [arity-3 to 0 by -1]
    new-pairing = select( l[i], pairings[0].b[2] )
    #say new-pairing
    pairings = pushFront new-pairing, pairings
  say pairings
  b: l.concat [ pairings[0].b[2] ]
  join: ( l ) ->
    k = l.length
    if k isnt arity then return
    n = pairings[k-2].z( l[k-2], l[k-1] )
    for i in [k-3 to 0 by -1]
      n = pairings[i].z( l[i], n )
    n
  split: ( n ) ->
    l = []
    [ x, y ] = pairings[0].xy( n )
    for k from 1 to pairings.length
      l.push x
      [ x, y ] = pairings[k].xy( y )
    l

if require.main is module
  c = compose [2,3]
  say c.join [1,2]
else module.exports = { compose }
