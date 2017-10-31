"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
}; // triangle numaers
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

  _createClass(Cantor, null, [{
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
  }]);

  return Cantor;
}();

// elegant pairing


var elegant = exports.elegant = function () {
  function elegant() {
    _classCallCheck(this, elegant);
  }

  _createClass(elegant, null, [{
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
  }]);

  return elegant;
}();

// power of two pairing


var poto = exports.poto = function () {
  function poto() {
    _classCallCheck(this, poto);
  }

  _createClass(poto, null, [{
    key: "join",
    value: function join(x, y) {
      return pow(2, x) * (2 * y + 1) - 1;
    }
  }, {
    key: "split",
    value: function split(z) {
      var _z = z + 1;
      for (var x = 0; x < _z; x++) {
        var p = fl(pow(2, x));
        var q = _z / p;
        if (q % 2 === 1) return [x, fl(q / 2)];
      }
    }
  }]);

  return poto;
}();

// half pairing (only x<=y pairs)


var half = exports.half = function () {
  function half() {
    _classCallCheck(this, half);
  }

  _createClass(half, null, [{
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
      if (z < this._sz) return [z % this.sx, fl(z / this.sx)];
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
      return [fl(z / this._sy), z % this._sy];
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
  }]);

  return stack_y;
}();

// default infinite-infinite pairing


var def_iip = Cantor;

// selection
var select = function select(x, y) {
  var iip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : def_iip;

  if (x === 0 && y === 0) return iip;else if (x === 0) return stack_x(y);else if (y === 0) return stack_y(x);else return field(x, y);
};

/*
// composition
export const composition = ( l, iip = def_iip ) => {
  let arity = l.length
  for( let i = 0; i < arity; i++ ) {
    if( l[i] === 0 ) return
  }
  let pairings = [ select( l[arity-2], l[arity-1] ) ]
  for( let i=arity-3; i>=0; i-- ) {
    let new_pairing = select( l[i], pairings[0].b[2], iip )
    pairings = pushFront( new_pairing, pairings )
  }
  return {
    b: l.concat( [ pairings[0].b[2] ] ),
    join: ( l ) => {
      for( let i = 0; i<arity; i++) if( l[i] >= b[i] && b[i] > 0 ) return
      let k = l.length
      if( k !== arity) return
      let n = pairings[k-2].z( l[k-2], l[k-1] )
      for( let i=k-3; i>=0; i--)
        n = pairings[i].z( l[i], n )
      return n
    },
    split: ( n ) => {
      if( n >= b[arity] && b[arity] > 0 ) return
      let [ x, y ] = pairings[0].xy( n )
      let l = [ x ]
      if( pairings.length > 1 )
        for( let k = 1; k<pairings.length; k++ ) {
          [ x, y ] = pairings[k].xy( y )
          l.push( x )
        }
      l.push( y )
      return l
    }
  }
}
*/