# number-pairings

**JavaScript number pairings functions**

This is a fun project about the coding of two (or more) natural numbers into one and vice versa. Now implemented are:

- [Cantor pairing](https://en.wikipedia.org/wiki/Pairing_function), it's inversion and a *half* variant for unique pairs
- [Elegant pairing](szudzik.com/ElegantPairing.pdf) and it's inversion
- Pairing for finite fields
- Pairings for one finite and one infinite dimension

This JavaSript nodejs module is written in [LiveScript](http://livescript.net/).

Install with: `npm install number-pairings`

Use like:

```javascript
p = require( "number-pairings" );
pair = p.Cantor;
console.log( p.xy( 100 ) );
```

Build from LiveScript: `lsc -co lib src`
