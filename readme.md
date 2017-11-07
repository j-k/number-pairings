# number-pairings

**JavaScript number pairing functions**

This is a fun project about [pairing functions](https://en.wikipedia.org/wiki/Pairing_function), the coding of two natural numbers into one and vice versa. Now implemented are:

- Pairing for finite fields (both dimensions are limited) (`field`).
- Pairings for one finite and one infinite dimension (`stackY`, `stackX`).
- [Cantor pairing](https://en.wikipedia.org/wiki/Pairing_function) (`Cantor`), and a *half* variant for unordered pairs (`half`).
- [elegant pairing](https://www.google.ch/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjUtpeoj_bRAhXDVxoKHYJBCGwQFggoMAA&url=http%3A%2F%2Fszudzik.com%2FElegantPairing.pdf&usg=AFQjCNHlytYIHiOiE0jqc8McfJwheyft8g) (`elegant`).
- [POTO pairing](https://ch.mathworks.com/matlabcentral/fileexchange/44253-three-different-bijections-or-pairing-functions-between-n-and-n%5E2--including-cantor-polynomials-) (`poto`). The formulas are derived from [here](http://www.cs.umb.edu/~marc/cs620/theo10-06.pdf).

There is also a **composition operator** available that can mix arbitrary (finite and infinite) pairings recursively. With this operator it is possible to encode lists of natural numbers into a single number.

This JavaSript nodejs module is written in ES2015 and transpiled with [babel](https://babeljs.io/). The module resides in the `lib` folder.

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
// => [ 4, 9 ]
console.log( pair.join( 4, 9 ) )
// => 100
```

Replace `np.Cantor` with e.g. `np.elegant` to try out the elegant pairing.

## Build

Build from LiveScript: `lsc -co lib src`.

## Limitations

- There are no overflow checks. Since the `z` (result of the `join` functions) is always in the order of a multiplication of `x` and `y` (results of the `split` functions) the library only works up to some numbers. There are no warnings given. Use with caution.
- There are other possible number pairings that could be included (e.g. [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering)). Some of them are not "dense", i.e. more than one pair may encode a number. Here the focus is on dense pairings.

## Further links

- [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering) is also related to pairing functions. It works for more than two input numbers. Coding more numbers can be achieved with this library here by using the pairings recursively.
- Some more [background](http://www.cs.upc.edu/~alvarez/calculabilitat/enumerabilitat.pdf) about pairing functions.
- Another [Cantor pairing JavaScript code](https://codepen.io/LiamKarlMitchell/pen/xnEca)  and [elegant pairing code](https://codepen.io/sachmata/post/elegant-pairing) on [codepen](https://codepen.io/#).

## License

MIT, see license file in the repository.

## Examples

```javascript
const np = require("number-pairings")
p = new np.Cantor()
p.join(10,34) // => 1024
p.split(1024) // => [ 10, 34 ]
p = new np.elegant()
p.join(10,34) // => 1200
p.split(1200) // => [ 10, 34 ]
p = new np.poto()
p.join(10,34) // => 70655
p.split(70655) // => [ 10, 34 ]
p = new np.half()
p.join(10,34) // => 605
p.join(34,10) // => 605
p.split(605) // => [ 10, 34 ]
p = new np.field(2,3)
p.join(1,2) // => 5
p.join(2,2) // => undefined (out of bound)
p = new np.stack_x(5)
p.join(2,4) // => 14
p.join(2,5) // => undefined (out of bound)
// note: use stack_y the same way as stack_x
p.split(14) // => [ 2, 4 ]
p = new np.composition([1,2,3,4])
p.join([0,1,2,3]) // => 23
p.split(23) // => [ 0, 1, 2, 3 ]
```
