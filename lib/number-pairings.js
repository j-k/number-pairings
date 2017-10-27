"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// this modules implements some binary pairings
// - these are objects like {z:...,xy:...,bounds:...},
// - where
//   z: ( x, y ) -> z
//     maps the z ( x, y ) uniquely to z
//   xy: ( z ) -> ( x, y ) is the inverse of z
//   and bounds are the bounds of the two inputs (bound[0], bound[1])
//     and the output (bound[2])
// - a bound of 0 means unbounded, otherwise the bound is the maximum value plus one
// - all numbers are assumed to be positive integers including zero
// - there are also half-pairings for commutative relations

var fl = Math.floor;
var min = Math.min;
var max = Math.max;
var pow = Math.pow;
var sq = function sq(x) {
  return fl(Math.sqrt(x));
};
var tn = function tn(x) {
  return x * (x + 1) / 2;
}; //  sum of all n <= x (Gauss) - triangle numaers
var tr = function tr(x) {
  return fl((sq(1 + x * 8) - 1) / 2);
}; //  triangle root (inverse of tn())
var ext = function ext(x) {
  return x - tn(tr(x));
}; //  excess over last triangle numaer
//const range = (start, end) => {
//  return [...Array(1+end-start).keys()].map(v => start+v)
//}
var pushFront = function pushFront(e, a) {
  return [e].concat(a);
};

// Cantor pairing
var Cantor = exports.Cantor = {
  z: function z(x, y) {
    return tn(x + y) + y;
  },
  xy: function xy(z) {
    var t = tr(z);
    return [t * (t + 3) / 2 - z, z - t * (t + 1) / 2];
  },
  b: [0, 0, 0]

  // elegant pairing
};var elegant = exports.elegant = {
  z: function z(x, y) {
    if (y >= x) return y * (y + 1) + x;else return x * x + y;
  },
  xy: function xy(z) {
    var sq_z = sq(z);
    if (sq_z * sq_z > z) sq_z--;
    var t = z - sq_z * sq_z;
    if (t < sq_z) return [sq_z, t];else return [t - sq_z, sq_z];
  },
  b: [0, 0, 0]

  // power of two pairing
};var poto = exports.poto = {
  z: function z(x, y) {
    return pow(2, x) * (2 * y + 1) - 1;
  },
  xy: function xy(z) {
    var _z = z + 1;
    for (var x = 0; x < _z; x++) {
      var p = fl(pow(2, x));
      var q = _z / p;
      if (q % 2 === 1) return [x, fl(q / 2)];
    }
  },
  b: [0, 0, 0]

  // half pairing (only x<=y pairs)
};var half = exports.half = {
  z: function z(x, y) {
    var _x = max(x, y);
    var _y = min(x, y);
    return tn(_x) + _y;
  },
  xy: function xy(z) {
    var x = tr(z);
    var y = ext(z);
    return [x, y];
  },
  b: [0, 0, 0]

  // finite/finite pairing
};var field = exports.field = function field(sx, sy) {
  return {
    z: function z(x, y) {
      if (x < sx && y < sy) return sx * y + x % sx;
    },
    xy: function xy(z) {
      if (z < sx * sy) return [z % sx, fl(z / sx)];
    },
    b: [sx, sy, sx * sy]
  };
};

// x is finite y is infinite
var stack_y = exports.stack_y = function stack_y(sx) {
  return {
    z: function z(x, y) {
      if (x < sx) return sx * y + x % sx;
    },
    xy: function xy(z) {
      return [z % sx, fl(z / sx)];
    },
    b: [sx, 0, 0]
  };
};

// x is infinite and y is finite
var stack_x = exports.stack_x = function stack_x(sy) {
  return {
    z: function z(x, y) {
      if (y < sy) return y % sy + sy * x;
    },
    xy: function xy(z) {
      return [fl(z / sy), z % sy];
    },
    b: [0, sy, 0]
  };
};

// default infinite-infinite pairing
var def_iip = Cantor;

// selection
var select = function select(x, y) {
  var iip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : def_iip;

  if (x === 0 && y === 0) return iip;else if (x === 0) return stack_x(y);else if (y === 0) return stack_y(x);else return field(x, y);
};

// composition
var composition = exports.composition = function composition(l) {
  var iip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : def_iip;

  var arity = l.length;
  var pairings = [select(l[arity - 2], l[arity - 1])];
  for (var i = arity - 3; i >= 0; i--) {
    var new_pairing = select(l[i], pairings[0].b[2], iip);
    pairings = pushFront(new_pairing, pairings);
  }
  return {
    b: l.concat([pairings[0].b[2]]),
    join: function join(l) {
      var k = l.length;
      if (k !== arity) return;
      var n = pairings[k - 2].z(l[k - 2], l[k - 1]);
      for (var _i = k - 3; _i >= 0; _i--) {
        n = pairings[_i].z(l[_i], n);
      }
      return n;
    },
    split: function split(n) {
      var _pairings$0$xy = pairings[0].xy(n),
          _pairings$0$xy2 = _slicedToArray(_pairings$0$xy, 2),
          x = _pairings$0$xy2[0],
          y = _pairings$0$xy2[1];

      var l = [x];
      if (pairings.length > 1) {
        for (var k = 1; k < pairings.length; k++) {
          var _pairings$k$xy = pairings[k].xy(y);

          var _pairings$k$xy2 = _slicedToArray(_pairings$k$xy, 2);

          x = _pairings$k$xy2[0];
          y = _pairings$k$xy2[1];

          l.push(x);
        }
      }
      l.push(y);
      return l;
    }
  };
};