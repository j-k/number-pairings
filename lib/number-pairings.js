"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.Cantor = Cantor;
exports.elegant = elegant;
exports.poto = poto;
exports.half = half;
exports.field = field;
exports.stack_x = stack_x;
exports.stack_y = stack_y;
exports.composition = composition;
// Copyright (C) 2017 Jens Kubacki - All Rights Reserved
// see license file

// this modules implements some binary pairings
// - these are objects like {join:...,split:...,bounds:...},
// - where
//   join: ( x, y ) -> z
//     maps the z ( x, y ) uniquely to z
//   split: ( z ) -> ( x, y ) is the inverse of z
//   and bounds are the bounds of the two inputs (bound[0], bound[1])
//     and the output (bound[2])
// - a bound of 0 means unbounded, otherwise the bound is the maximum value plus one
// - all numbers are assumed to be positive integers including zero
// - there are also half-pairings for commutative relations

// todo: check bounds

var fl = Math.floor;
var min = Math.min;
var max = Math.max;
var pow = Math.pow;
var sq = function sq(x) {
  return fl(Math.sqrt(x));
};
var tn = function tn(x) {
  return x * (x + 1) / 2;
}; // triangle numbers
var tr = function tr(x) {
  return fl((sq(1 + x * 8) - 1) / 2);
}; //  triangle root
var ext = function ext(x) {
  return x - tn(tr(x));
}; //  excess over last triangle numaer
var pushFront = function pushFront(e, a) {
  return [e].concat(a);
};

// Cantor pairing
function Cantor() {
  return {
    join: function join(x, y) {
      return tn(x + y) + y;
    },
    split: function split(z) {
      var t = tr(z);
      return [t * (t + 3) / 2 - z, z - t * (t + 1) / 2];
    },
    bounds: function bounds() {
      return [0, 0, 0];
    }
  };
}

// elegant pairing
function elegant() {
  return {
    join: function join(x, y) {
      if (y >= x) return y * (y + 1) + x;else return x * x + y;
    },
    split: function split(z) {
      var sq_z = sq(z);
      if (sq_z * sq_z > z) sq_z--;
      var t = z - sq_z * sq_z;
      if (t < sq_z) return [sq_z, t];else return [t - sq_z, sq_z];
    },
    bounds: function bounds() {
      return [0, 0, 0];
    }
  };
}

// power of two pairing
function poto() {
  return {
    join: function join(x, y) {
      return pow(2, x) * (2 * y + 1) - 1;
    },
    split: function split(z) {
      var _z, i$, x, p, q;
      _z = z + 1;
      for (i$ = 0; i$ < _z; ++i$) {
        x = i$;
        p = fl(pow(2, x));
        q = _z / p;
        if (q % 2 === 1) {
          return [x, fl(q / 2)];
        }
      }
    },
    bounds: function bounds() {
      return [0, 0, 0];
    }
  };
}

// half pairing (only x <= y pairs)
function half() {
  return {
    join: function join(x, y) {
      return tn(max(x, y)) + min(x, y);
    },
    split: function split(z) {
      return [ext(z), tr(z)];
    },
    bounds: function bounds() {
      return [0, 0, 0];
    }
  };
}

// finite field (matrix) of two dimensions
function field(sx, sy) {
  var sz = sx * sy;
  return {
    join: function join(x, y) {
      if (x < sx && y < sy) return sx * y + x % sx;
    },
    split: function split(z) {
      if (z < sz) return [z % sx, fl(z / sx)];
    },
    bounds: function bounds() {
      return [sx, sy, sz];
    }
  };
}

// x is infinite and y is finite
// sy: size in y
function stack_x(sy) {
  return {
    join: function join(x, y) {
      if (y < sy) return y % sy + sy * x;
    },
    split: function split(z) {
      return [fl(z / sy), z % sy];
    },
    bounds: function bounds() {
      return [0, sy, 0];
    }
  };
}

// x is finite y is infinite
// sx: size in x
function stack_y(sx) {
  return {
    join: function join(x, y) {
      if (x < sx) return x % sx + sx * y;
    },
    split: function split(z) {
      return [z % sx, fl(z / sx)];
    },
    bounds: function bounds() {
      return [sx, 0, 0];
    }
  };
}

// default infinite-infinite pairing
var def_iip = Cantor;

// selection
var select = function select(x, y) {
  var iip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : def_iip;

  if (x === 0 && y === 0) return iip;else if (x === 0) return stack_x(y);else if (y === 0) return stack_y(x);else return field(x, y);
};

// composition operator
function composition(l) {
  var iip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : def_iip;

  var _arity = l.length;
  var _iip = new def_iip();
  var _pairings = [select(l[_arity - 2], l[_arity - 1])];
  for (var i = _arity - 3; i >= 0; i--) {
    var new_pairing = select(l[i], _pairings[0].bounds()[2], iip);
    _pairings = pushFront(new_pairing, _pairings);
  }
  var _bounds = l.concat([_pairings[0].bounds()[2]]);
  return {
    join: function join(l) {
      for (var _i = 0; _i < _arity; _i++) {
        if (l[_i] >= _bounds[_i] && _bounds[_i] > 0) return;
      }var k = l.length;
      if (k !== _arity) return;
      var n = _pairings[k - 2].join(l[k - 2], l[k - 1]);
      for (var _i2 = k - 3; _i2 >= 0; _i2--) {
        n = _pairings[_i2].join(l[_i2], n);
      }return n;
    },
    split: function split(n) {
      if (n >= _bounds[_arity] && _bounds[_arity] > 0) return;

      var _pairings$0$split = _pairings[0].split(n),
          _pairings$0$split2 = _slicedToArray(_pairings$0$split, 2),
          x = _pairings$0$split2[0],
          y = _pairings$0$split2[1];

      var l = [x];
      if (_pairings.length > 1) for (var k = 1; k < _pairings.length; k++) {
        var _pairings$k$split = _pairings[k].split(y);

        var _pairings$k$split2 = _slicedToArray(_pairings$k$split, 2);

        x = _pairings$k$split2[0];
        y = _pairings$k$split2[1];

        l.push(x);
      }
      l.push(y);
      return l;
    }
  };
}