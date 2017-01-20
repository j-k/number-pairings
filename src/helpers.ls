# helpers I/O
export say = console.log
# helpers math
export fl = Math.floor
export sq = ( x ) -> fl Math.sqrt( x )
#  sum of all n <= x (Gauss) - triangle numbers
export tn = ( x ) -> x * ( x + 1 ) / 2
#  triangle root (inverse of tn())
export tr = ( x ) -> fl( ( sq( 1 + x * 8 ) - 1 ) / 2 )
#  excess over last triangle number
export ext = ( x ) -> x - tn tr( x )
# min
export min = Math.min
# max
export max = Math.max
#  minimum bound (0 means infinity)
export minBound = ( a, b ) ->
  if a is 0 then b
  else if b is 0 then a
  else min a, b
#  maximum bound (0 means infinity)
export maxBound = ( a, b ) ->
  if a is 0 then a
  else if b is 0 then b
  else max a, b
# array helpers
export last = ( it ) ->
  it[it.length-1]
export initial = ( it ) ->
  it[0 til it.length - 1]
export minBoundOf = ( B ) ->
  [pos, min] = [0, B[0]]
  for i from 1 til B.length
    _min = minBound min, B[i]
    if _min < min or min is 0 then [pos, min] = [i, _min]
  [pos, min]
export maxBoundOf = ( B ) ->
  [pos, max] = [0, B[0]]
  for i from 1 til B.length
    _max = minBound max, B[i]
    if _max > max then [pos, max] = [i, _max]
  [pos, max]
export deleteAt = ( A, pos ) ->
  A[0 til pos].concat A[pos+1 til A.length]

# list pairings zings
export list = ( p, sz=10 ) ->
  out = ''
  _sz = minBound( sz, p.b[2] )
  for z from 0 til _sz
    [ l, r ] = p.xy z
    _z = p.z( l, r )
    out += ( z + ' -> <' + l + ',' + r + '> -> ' + _z + '\n' )
    if _z isnt z then out += 'error\n'
  out

# plot pairings
export plot = (p, x=5, y=5) ->
  vals = []
  max = 0
  sx = minBound( x, p.b[0] )
  sy = minBound( y, p.b[1] )
  say sx, sy
  for j from 0 til sy
    for i from 0 til sx
      val = p.z( i, j )
      vals.push val
      valSize = val.toString!.length
      if valSize > max then max = valSize
  out = ''
  max += 1
  for j from 0 til sy
    for i from 0 til sx
      str = p.z( i, j ) + ''
      if str.length < max
        for k from 0 til ( max - str.length )
          str = ' ' + str
      out += str
      if i < ( sx - 1)
        out += ' '
    out += '\n'
  out
