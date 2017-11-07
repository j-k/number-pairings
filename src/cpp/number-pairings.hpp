#ifndef _NUMBER_PAIRINGS_HPP_
#define _NUMBER_PAIRINGS_HPP_

// note: this is under construction

namespace number_pairings {

template<typename T>
struct pairing {
  T join( x, y ) = 0;
  T split( z ) = 0;
  T bound() = 0;
};

template<typename T>
struct Cantor : public pairing {
  T join( x, y ) { return tn( x + y ) + y }
  T split( z ) {
    T t = tr( z )
    return {
      ( t * ( t + 3 ) / 2 ) - z,
      z - ( ( t * ( t + 1 ) ) / 2 )
    }
  }
  T bound() { return T(0); }
};

template<typename T>
struct elegant : public pairing {
  T join( x, y ) {
    if ( y >= x )
      return y * ( y + 1 ) + x;
    else
      return x * x + y;
  }
  T split( z ) {
    T sq_z = sq( z );
    if ( sq_z * sq_z > z ) sq_z--;
    T t = z - sq_z * sq_z;
    if (t < sq_z) return { sq_z, t };
    else return { t - sq_z, sq_z };
  }
  T bound() { return T(0); }
};

}

#endif // ifndef _NUMBER_PAIRINGS_HPP_
