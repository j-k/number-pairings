"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var Cantor = exports.Cantor = function () {
  function Cantor() {
    _classCallCheck(this, Cantor);
  }

  _createClass(Cantor, [{
    key: "join",
    value: function join(x, y) {
      return tn(x + y) + y;
    }
  }, {
    key: "split",
    value: function split(z) {
      var t = tr(z);
      return [t * (t + 3) / 2 - z, z - t * (t + 1) / 2];
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [0, 0, 0];
    }
  }]);

  return Cantor;
}();

// elegant pairing


var elegant = exports.elegant = function () {
  function elegant() {
    _classCallCheck(this, elegant);
  }

  _createClass(elegant, [{
    key: "join",
    value: function join(x, y) {
      if (y >= x) return y * (y + 1) + x;else return x * x + y;
    }
  }, {
    key: "split",
    value: function split(z) {
      var sq_z = sq(z);
      if (sq_z * sq_z > z) sq_z--;
      var t = z - sq_z * sq_z;
      if (t < sq_z) return [sq_z, t];else return [t - sq_z, sq_z];
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [0, 0, 0];
    }
  }]);

  return elegant;
}();

// power of two pairing


var poto = exports.poto = function () {
  function poto() {
    _classCallCheck(this, poto);
  }

  _createClass(poto, [{
    key: "join",
    value: function join(x, y) {
      return pow(2, x) * (2 * y + 1) - 1;
    }
  }, {
    key: "split",
    value: function split(z) {
      // this is the transpiled code from LiveScript
      // another "own" try didn't work
      // -> find out why
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
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [0, 0, 0];
    }
  }]);

  return poto;
}();

// half pairing (only x<=y pairs)


var half = exports.half = function () {
  function half() {
    _classCallCheck(this, half);
  }

  _createClass(half, [{
    key: "join",
    value: function join(x, y) {
      var _x = max(x, y);
      var _y = min(x, y);
      return tn(_x) + _y;
    }
  }, {
    key: "split",
    value: function split(z) {
      var x = ext(z);
      var y = tr(z);
      return [x, y];
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [0, 0, 0];
    }
  }]);

  return half;
}();

// finite/finite pairing
// sx: size in x
// sy: size in y


var field = exports.field = function () {
  function field(sx, sy) {
    _classCallCheck(this, field);

    this._sx = sx;
    this._sy = sy;
    this._sz = sx * sy;
  }

  _createClass(field, [{
    key: "join",
    value: function join(x, y) {
      if (x < this._sx && y < this._sy) return this._sx * y + x % this._sx;
    }
  }, {
    key: "split",
    value: function split(z) {
      if (z < this._sz) return [z % this._sx, fl(z / this._sx)];
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [this._sx, this._sy, this._sz];
    }
  }]);

  return field;
}();

// x is infinite and y is finite


var stack_x = exports.stack_x = function () {
  function stack_x(sy) {
    _classCallCheck(this, stack_x);

    this._sy = sy;
  }

  _createClass(stack_x, [{
    key: "join",
    value: function join(x, y) {
      if (y < this._sy) return y % this._sy + this._sy * x;
    }
  }, {
    key: "split",
    value: function split(z) {
      var x = fl(z / this._sy);
      var y = z % this._sy;
      return [x, y];
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [0, this._sy, 0];
    }
  }]);

  return stack_x;
}();

// x is finite y is infinite


var stack_y = exports.stack_y = function () {
  function stack_y(sx) {
    _classCallCheck(this, stack_y);

    this._sx = sx;
  }

  _createClass(stack_y, [{
    key: "join",
    value: function join(x, y) {
      if (x < this._sx) return this._sx * y + x % this._sx;
    }
  }, {
    key: "split",
    value: function split(z) {
      return [z % this._sx, fl(z / this._sx)];
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return [this._sx, 0, 0];
    }
  }]);

  return stack_y;
}();

// default infinite-infinite pairing


var def_iip = Cantor;

// selection
var select = function select(x, y) {
  var iip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : def_iip;

  if (x === 0 && y === 0) return new iip();else if (x === 0) return new stack_x(y);else if (y === 0) return new stack_y(x);else return new field(x, y);
};

// composition operator

var composition = exports.composition = function () {
  function composition(l) {
    var iip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : def_iip;

    _classCallCheck(this, composition);

    this._arity = l.length;
    this._iip = new def_iip();
    var first = select(l[this._arity - 2], l[this._arity - 1]);
    this._pairings = [first];
    for (var i = this._arity - 3; i >= 0; i--) {
      var new_pairing = select(l[i], this._pairings[0].bounds()[2], iip);
      this._pairings = pushFront(new_pairing, this._pairings);
    }
    this._bounds = l.concat([this._pairings[0].bounds()[2]]);
  }

  _createClass(composition, [{
    key: "join",
    value: function join(l) {
      for (var i = 0; i < this._arity; i++) {
        if (l[i] >= this._bounds[i] && this._bounds[i] > 0) return;
      }var k = l.length;
      if (k !== this._arity) return;
      var n = this._pairings[k - 2].join(l[k - 2], l[k - 1]);
      for (var _i = k - 3; _i >= 0; _i--) {
        n = this._pairings[_i].join(l[_i], n);
      }return n;
    }
  }, {
    key: "split",
    value: function split(n) {
      if (n >= this._bounds[this._arity] && this._bounds[this._arity] > 0) return;

      var _pairings$0$split = this._pairings[0].split(n),
          _pairings$0$split2 = _slicedToArray(_pairings$0$split, 2),
          x = _pairings$0$split2[0],
          y = _pairings$0$split2[1];

      var l = [x];
      if (this._pairings.length > 1) for (var k = 1; k < this._pairings.length; k++) {
        var _pairings$k$split = this._pairings[k].split(y);

        var _pairings$k$split2 = _slicedToArray(_pairings$k$split, 2);

        x = _pairings$k$split2[0];
        y = _pairings$k$split2[1];

        l.push(x);
      }
      l.push(y);
      return l;
    }
  }]);

  return composition;
}();