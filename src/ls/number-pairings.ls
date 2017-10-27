# this file gathers all stuff for the number pairings
{ Cantor, elegant, poto, half, field, stack-y, stack-x } = require './pairings'
{ composition } = require './composition'

if require.main is module
    console.log "This is the number-pairings module, use like: np = require './number-pairings'"
else
  module.exports = { Cantor, elegant, poto, half, field, stack-y, stack-x, composition }
