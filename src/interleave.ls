# helpers
max = Number.MAX_SAFE_INTEGER

#  minimum bound (0 means infinity and is ignored)
min-finite-bound = ( l ) ->
  min = max
  for i in l
    if i > 0 and i < min
      min = i
  min

# first index of value
index = ( l, val ) ->
  for i, k in l
    if i is val then return k

# remove ith item
remove = ( l, i ) ->
  for item, k in l
    if i isnt k then item else -1

# eat item
eat-item = ( l ) ->
  min = min-finite-bound l
  if min isnt max
    mindex = index( l, min )
    return [ [ [ mindex ], min ], remove( l , mindex ) ]

# minimum finite bounds
min-finite-bounds = ( l ) ->
  min = min-finite-bound l
  for i, k in l
    if i is min then [i, k]

# get all indexes of value >=n or 0
get-all-n-zero = ( l, n ) ->
  for i, k in l
    if i >= 0 or i is n
      k

# product of numbers > 0
get-product = ( l ) ->
  p = 1
  for i in l
    if i > 0 then p *= i
  p

# remove all items of value n
# removing here means setting to -1
# others are down counted
remove-down-count = ( l, n ) ->
  for i in l
    if i isnt 0
      m = i - n
      if m is 0 then -1
      else m
    else 0

# eat field
eat-field = ( l ) ->
  min = min-finite-bound l
  if min isnt max
    items = get-all-n-zero l, min
    product = get-product items
    return [ [ items, min ], remove-down-count( l , min ) ]

# all used up
all-used = ( l ) ->
  for i in l
    if i > 0 then return false
  true

example = [ 0, 3, 3, 4, 0, 7, 0 ]

# get things done
# [ [ [ 0, 1, 2, 3, 4, 5, 6 ], 3 ], [ 0, -1, -1, 1, 0, 4, 0 ] ]
# [ [ [ 0, 3, 4, 5, 6 ], 1 ], [ 0, -2, -2, -1, 0, 3, 0 ] ]
get-things-done = ( l, eat = eat-item ) ->
  ate = [ eat l ]
  do
    rest = ate[ate.length-1][1]
    is-used = all-used rest
    if not is-used
      ate.push eat rest
  while not all-used rest
  for a in ate
    a[0]

# build the functions
interleave = ( l, eat = eat-item ) ->
  finites = []
  
console.log get-things-done( example )
#x = eat-field example
#y = eat-field x[1]
#console.log x, y
#console.log eat-item example, 3
