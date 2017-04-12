# this file implements some interleavings
{ Cantor } = require './pairings'
{ last } = require './helpers'

# default infinite-infinite pairing
def-iip = Cantor

# indexify
indexify = ( l ) ->

  for i, k in l
    [ k, i ]

test = [0,1,0,2,0,3]
itest = indexify test

console.log itest

zero = ( l ) ->
  for i in l
    [ i[0], 0 ]

zeros = zero itest
console.log zeros

upcount = ( limits, state ) ->
  _state = []
  for i, k in state
    if i[1] < limits[k][1] || limits[k][1] is 0
      _state.push [ i[0], i[1]+1 ]
  _state

one = upcount( itest, zeros )
two = upcount( itest, one )

console.log two

all-done = ( limits, state ) ->
  for l in limits
    is-done = l[1] is 0 or state[1] is l[1] - 1
    if not is-done return false
  true


interleave = ( l, iip=def-iip  ) ->
  a = []
  limits = indexify l
  count = zero limits
  console.log count
  count = upcount( limits, count )
  console.log count
  #do
  #  a = a.concat count
  #  count = upcount( limits, count )
  #  console.log count
  #while not all-zero count
  a

console.log interleave test
