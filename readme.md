# number-pairings

**JavaScript number pairing functions**

This is a fun project about [pairing functions](https://en.wikipedia.org/wiki/Pairing_function), the coding of two natural numbers into one and vice versa. Now implemented are:

- Pairing for finite fields (both dimensions are limited) (`field`).
- Pairings for one finite and one infinite dimension (`stack_y`, `stack_x`).
- [Cantor pairing](https://en.wikipedia.org/wiki/Pairing_function) (`Cantor`), and a *half* variant for unordered pairs (`half`).
- [elegant pairing](https://www.google.ch/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjUtpeoj_bRAhXDVxoKHYJBCGwQFggoMAA&url=http%3A%2F%2Fszudzik.com%2FElegantPairing.pdf&usg=AFQjCNHlytYIHiOiE0jqc8McfJwheyft8g) (`elegant`).
- [POTO pairing](https://ch.mathworks.com/matlabcentral/fileexchange/44253-three-different-bijections-or-pairing-functions-between-n-and-n%5E2--including-cantor-polynomials-) (`poto`). The formulas are derived from [here](http://www.cs.umb.edu/~marc/cs620/theo10-06.pdf).

There is also a **composition operator** available that can mix arbitrary (finite and infinite) pairings recursively. With this operator it is possible to encode lists of natural numbers into a single number and back.

This JavaSript module is written in ES2015 and transpiled with [babel](https://babeljs.io/). The module resides in the `lib` folder. The source code can be found in the folder `src/es2015`. In `src/ls` some outdated [LifeScript](http://livescript.net/) code is kept that used to be the source earlier.

## Installation

**Prerequisite**: [Node.js](https://nodejs.org/en/) needs to be installed.

1. Make a folder
2. Open a console in that new folder
3. Install locally with: `npm install number-pairings`

## Usage

```javascript
const np = require( "number-pairings" )
let pair = new np.Cantor()
console.log( pair.split( 100 ) )
// => [ 4, 9 ] ( = [x, y] )
console.log( pair.join( 4, 9 ) )
// => 100 ( = z )
```

Replace `np.Cantor` with e.g. `np.elegant` to try out the elegant pairing.

## Build

Build from source: `npm run build`.

## Limitations

- There are no overflow checks. Since `z` (result of the `join` functions) is always in the order of a multiplication of `x` and `y` (results of the `split` functions) the library only works up to some numbers. There are no warnings given. Use with caution.
- There are other possible number pairings that could be included. Some of them are not "dense", i.e. more than one pair may encode a number. Here the focus is on dense pairings.

## Further links

- [Goedel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering) is also related to pairing functions. It also works for more than two input numbers. Coding more numbers can be achieved with this library here by using the **composition operator** mentioned above.
- Some more [background](http://www.cs.upc.edu/~alvarez/calculabilitat/enumerabilitat.pdf) about pairing functions.
- Another [Cantor pairing JavaScript code](https://codepen.io/LiamKarlMitchell/pen/xnEca)  and [elegant pairing code](https://codepen.io/sachmata/post/elegant-pairing) on [codepen](https://codepen.io/#).

## License

MIT, see license file in the repository.

## Examples

```javascript
const np = require("number-pairings")
let p = np.Cantor()
p.join( 10, 34 ) // => 1024
p.split( 1024 ) // => [ 10, 34 ]
p = np.elegant()
p.join( 10, 34 ) // => 1200
p.split( 1200 ) // => [ 10, 34 ]
p = np.poto()
p.join( 10, 34 ) // => 70655
p.split( 70655 ) // => [ 10, 34 ]
p = np.half()
p.join( 10, 34 ) // => 605
p.join( 34, 10 ) // => 605
p.split( 605 ) // => [ 10, 34 ]
p = np.field( 2, 3 )
p.join( 1, 2 ) // => 5
p.join( 2, 2 ) // => undefined (out of bound)
p.split( 5 ) // => [ 1, 2 ]
p = np.stack_x( 5 )
p.join( 2, 4 ) // => 14
p.join( 2, 5 ) // => undefined (out of bound)
// note: use stack_y the same way as stack_x
p.split( 14 ) // => [ 2, 4 ]
p = np.composition( [ 2, 3, 4, 5 ] )
p.join( [ 0, 1, 2, 3 ] ) // => 86
p.split( 86 ) // => [ 0, 1, 2, 3 ]
p.join( [ 1, 0, 0, 0 ] ) // => 1
p.join( [ 0, 1, 0, 0 ] ) // => 2
p.join( [ 0, 0, 1, 0 ] ) // => 6
p.join( [ 0, 0, 0, 1 ] ) // => 24
```
