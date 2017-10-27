# number-pairings

**JavaScript number pairing functions**

This is a fun project about [pairing functions](https://en.wikipedia.org/wiki/Pairing_function), the coding of two natural numbers into one and vice versa. Now implemented are:

- Pairing for finite fields (both dimensions are limited) (`field`).
- Pairings for one finite and one infinite dimension (`stackY`, `stackX`).
- [Cantor pairing](https://en.wikipedia.org/wiki/Pairing_function) (`Cantor`), and a *half* variant for unordered pairs (`half`).
- [elegant pairing](https://www.google.ch/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjUtpeoj_bRAhXDVxoKHYJBCGwQFggoMAA&url=http%3A%2F%2Fszudzik.com%2FElegantPairing.pdf&usg=AFQjCNHlytYIHiOiE0jqc8McfJwheyft8g) (`elegant`).
- [POTO pairing](https://ch.mathworks.com/matlabcentral/fileexchange/44253-three-different-bijections-or-pairing-functions-between-n-and-n%5E2--including-cantor-polynomials-) (`poto`). The formulas are derived from [here](http://www.cs.umb.edu/~marc/cs620/theo10-06.pdf).

This JavaSript nodejs module is written in [LiveScript](http://livescript.net/). The JavaScript library resides in the `lib` folder.

## Installation

**Prerequisite**: [Node.js](https://nodejs.org/en/) needs to be installed.

1. Make a folder
2. Open a console in that new folder
3. Install locally with: `npm install number-pairings`

## Usage

```javascript
np = require( "number-pairings" )
pair = np.Cantor
console.log( pair.xy( 100 ) )
// => [ 4, 9 ]
> console.log( pair.z( 4, 9 ) )
// => 100
```

Replace `p.Cantor` with e.g. `p.elegant` to try out the elegant pairing.

## Build

Build from LiveScript: `lsc -co lib src`.

## Limitations

- There are no overflow checks. Since the `z` is always in the order of a multiplication of `x` and `y` the library only works up to some numbers. There are no warnings given.
- There are other possible number pairings that could be included (e.g. [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering)). Some of them are not "dense", i.e. more than one pair may encode a number. Here the focus is on dense pairings.

## Further links

- [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering) is also related to pairing functions. It works for more than two input numbers. Coding more numbers can be achieved with this library here by using the pairings recursively.
- Some more [background](http://www.cs.upc.edu/~alvarez/calculabilitat/enumerabilitat.pdf) about pairing functions.
- Another [Cantor pairing JavaScript code](https://codepen.io/LiamKarlMitchell/pen/xnEca)  and [elegant pairing code](https://codepen.io/sachmata/post/elegant-pairing) on [codepen](https://codepen.io/#).

## License

See license file in the repository.

## Examples

```javascript
np = require("number-pairings")
/* =>
{ Cantor: { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] },
  elegant: { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] },
  poto: { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] },
  half: { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] },
  field: [Function: field],
  stack_y: [Function: stack_y],
  stack_x: [Function: stack_x],
  composition: [Function: composition] }
*/
f = np.Cantor
// => { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] }
f.z(10,34)
// => 1024
f.xy(1024)
// => [ 10, 34 ]
f = np.elegant
// => { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] }
f.z(10,34)
// => 1200
f.xy(1200)
// => [ 10, 34 ]
f = np.poto
// => { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] }
f.z(10,34)
// => 70655
f.xy(70655)
// => [ 10, 34 ]
f = np.half
// => { z: [Function: z], xy: [Function: xy], b: [ 0, 0, 0 ] }
f.z(10,34)
// => 605
f.z(34,10)
// => 605
f.xy(605)
// => [ 34, 10 ]
f = np.field(2,3)
// => { z: [Function: z], xy: [Function: xy], b: [ 2, 3, 6 ] }
f.z(1,2)
// => 5
f.z(2,2)
undefined
f = np.stack_x(5)
// => { z: [Function: z], xy: [Function: xy], b: [ 0, 5, 0 ] }
f.z(2,4)
// => 14
f.z(2,5)
// => undefined
// note: use stack_y the same way
f.xy(14)
// => [ 2, 4 ]
f = np.composition([1,2,3,4])
/* =>
{ b: [ 1, 2, 3, 4, 24 ],
  join: [Function: join],
  split: [Function: split] }
*/
f.join([0,1,2,3])
// => 23
f.split(23)
// => [ 0, 1, 2, 3 ]
```
