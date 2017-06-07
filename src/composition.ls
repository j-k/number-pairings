# compose an n-ary pairing out of binary pairings
# - input is a list of element numbers per dimension
# - zero elements means infinitely many

{ last, pushFront, say } = require './helpers'
{ field, stack-x, stack-y, Cantor } = require './pairings'

# default infinite-infinite pairing
def-iip = Cantor

# selection
select = ( x, y, iip=def-iip ) ->
  if x is 0 and y is 0 then iip
  else if x is 0 then stack-x y
  else if y is 0 then stack-y x
  else field x, y

# composition
composition = ( l, iip=def-iip ) ->
  arity = l.length
  pairings = [ select( l[arity-2], l[arity-1] ) ]
  for i in [arity-3 to 0 by -1]
    new-pairing = select( l[i], pairings[0].b[2] )
    pairings = pushFront new-pairing, pairings
  b: l.concat [ pairings[0].b[2] ]
  join: ( l ) ->
    k = l.length
    if k isnt arity then return
    n = pairings[k-2].z( l[k-2], l[k-1] )
    for i in [k-3 to 0 by -1]
      n = pairings[i].z( l[i], n )
    n
  split: ( n ) ->
    [ x, y ] = pairings[0].xy( n )
    l = [ x ]
    if pairings.length > 1
      for k from 1 til pairings.length
        [ x, y ] = pairings[k].xy( y )
        l.push x
    l.push y
    l

if require.main is module
  c = composition [1,2,3]
  say c.join [0,1,2]
  say c.split 5
else module.exports = { composition }
