# number-pairings

**JavaScript number pairings functions**

This is a fun project about [pairing functions](https://en.wikipedia.org/wiki/Pairing_function), the coding of two natural numbers into one and vice versa. Now implemented are:

- Pairing for finite fields (both dimensions are limited).
- Pairings for one finite and one infinite dimension.
- [Cantor pairing](https://en.wikipedia.org/wiki/Pairing_function), it's inversion and a *half* variant for unique pairs.
- [elegant pairing](szudzik.com/ElegantPairing.pdf) and it's inversion.
- [POTO pairing](https://ch.mathworks.com/matlabcentral/fileexchange/44253-three-different-bijections-or-pairing-functions-between-n-and-n%5E2--including-cantor-polynomials-) and it's inversion. The formulas are derived from [here](http://www.cs.umb.edu/~marc/cs620/theo10-06.pdf). The inversion formula could not be found elsewhere.

This JavaSript nodejs module is written in [LiveScript](http://livescript.net/). The JavaScript library resides in the `lib` folder.

## Installation

**Prerequisite**: [Node.js](https://nodejs.org/en/) needs to be installed.

1. Make a folder
2. Open a console in that new folder
3. Install with: `npm install number-pairings` (ignore the error messages).

## Usage

```javascript
p = require( "number-pairings" );
pair = p.Cantor;
console.log( pair.xy( 100 ) );
//> [ 4, 9 ]
> console.log( pair.z( 4, 9 ) );
//> 100
```

Replace `p.Cantor` with e.g. `p.Elegant` to try out the elegant pairing.

## Build
Build from LiveScript: `lsc -co lib src`.

## Limitations

- There are no overflow checks. Since the `z` is always in the order of a multiplication of `x` and `y` the library only works up to some numbers. There are no warnings given.
- There are other number pairings. Some of them are not "dense", i.e. there are numbers not used by any pair. These other pairings

## Further links

- [Gödel numbering](https://en.wikipedia.org/wiki/G%C3%B6del_numbering) is also related to pairing functions. It works for more than two input numbers. Coding more numbers can be achieved with this library here by using the pairings recursively.
- Some more [background](http://www.cs.upc.edu/~alvarez/calculabilitat/enumerabilitat.pdf) about pairing functions.

## License

See license file in the repository.
