# this file implements some interleavings
{ Cantor } = require './pairings'
{ last } = require './helpers'

# default infinite-infinite pairing
def-iip = Cantor

# zero base
zero-base = ( length ) ->
  for i from 0 til length
    [ i, 0 ]

# increment
increment = ( state, limits ) ->
  _state = []
  for i, k in state
    if i[1] < limits[k] || limits[k] is 0
      _state.push [ i[0], i[1]+1 ]
  _state

limits = [1,0,2,0,3,0]
zero = zero-base limits.length
#console.log zero
one = increment zero, limits
#console.log one

# check if all processed
all-done = ( state, limits ) ->
  for i, k in state
    if limits[i[1]] isnt 0
      #console.log i[1], limits[i[0]]-1
      #console.log i[1] < limits[i[0]]-1
      if i[1] < limits[i[0]]-1 then return false
  true

state = zero
console.log all-done( state, limits )
#while not all-done( state, limits )
#  state = increment( state, limits )
#  console.log state

/*
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
*/
