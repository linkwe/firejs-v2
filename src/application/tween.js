
module.exports = Tween ;

var _tweens = [];


/**
 *obj: 需要操作的对象
 *to: 需要改变的属性
 *time:运动所用时间
 *delay:延时 时间
 *repeat：重复次数
 *inverse：是否反向运动
 *ease:运动曲线
 *start:是否自动开始
 *
 *interpolation:曲线函数
 * 
 * onStart：开始fn
 * onUpdate :每桢fn
 * onComplete 完成后
 *
 * 
 */

function Tween(object){
    var a = object
          ,_object = a.obj||{}
          ,_valuesStart = {}
          ,_valuesEnd = a.to||{}
          ,_valuesStartRepeat = {}
          ,_duration = a.time||1000
          ,_repeat = a.repeat<0?Infinity:a.repeat
          ,_yoyo = a.inverse||false
          ,_isPlaying = false
          ,_reversed = false
          ,_delayTime = a.delay||0
          ,_startTime = null
          ,_easingFunction = a.ease||Tween.ease.Linear.None
          ,_interpolationFunction = a.interpolation||Tween.Interpolation.Linear
          ,_chainedTweens = []
          ,_onStartCallback = a.onStart||null
          ,_onStartCallbackFired = false
          ,_onUpdateCallback = a.onUpdate||null
          ,_onCompleteCallback = a.onComplete|| null
          ,_onStopCallback = a.onStop||null
          ,o = Object.create(null);

    for ( var field in _object ) 
    _valuesStart[ field ] = parseFloat(object[field],10);
    o.start = function ( time ) {

        Tween.add( this );
        _isPlaying = true;
        _onStartCallbackFired = false;

        _startTime = Date.now();
        _startTime += _delayTime;

        for ( var property in _valuesEnd ) {

            if(typeof _valuesEnd[ property ] === 'string'){

                _valuesEnd[ property] = fn.getPix( _valuesEnd[ property] );

            }else if ( _valuesEnd[ property ] instanceof Array ) {

                if ( _valuesEnd[ property ].length === 0 ) {

                    continue;

                }

                _valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

            }

            _valuesStart[ property ] = _object[ property ];

            if( ( _valuesStart[ property ] instanceof Array ) === false ) {
                _valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
            }

            _valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

        }

        return this;
    };

    o.stopChainedTweens = function () {
        for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
            _chainedTweens[ i ].stop();
        }
    };

    o.chain = function () {
        _chainedTweens = arguments;
        return this;
    };

    o.stop = function () {
        if ( !_isPlaying ) {
            return this;
        }

        Tween.remove( this );
        _isPlaying = false;

        if ( _onStopCallback !== null ) {

            _onStopCallback.call( _object );

        }

        aa.stopChainedTweens();
        return this;
    };

    o.stopChainedTweens = function () {
        for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
            _chainedTweens[ i ].stop();
        }
    };

    o.update = function ( time ) {
        var property;

        if ( time < _startTime ) {

            return true;

        }

        if ( _onStartCallbackFired === false ) {

            if ( _onStartCallback !== null ) {

                _onStartCallback.call( _object );

            }

            _onStartCallbackFired = true;

        }

        var elapsed = ( time - _startTime ) / _duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        var value = _easingFunction( elapsed );

      

        for ( property in _valuesEnd ) {

            var start = _valuesStart[ property ] || 0;
            var end = _valuesEnd[ property ];

            if ( end instanceof Array ) {

                _object[ property ] = _interpolationFunction( end, value );

            } else {

                if ( typeof(end) === "string" ) {
                    end = start + parseFloat(end, 10);
                }

                if ( typeof(end) === "number" ) {
                    _object[ property ] = start + ( end - start ) * value;
                }

            }

        }

        if ( _onUpdateCallback !== null ) {

            _onUpdateCallback.call( _object, value );

        }

        if ( elapsed == 1 ) {

            if ( _repeat > 0 ) {

                if( isFinite( _repeat ) ) {
                    _repeat--;
                }

                for( property in _valuesStartRepeat ) {

                    if ( typeof( _valuesEnd[ property ] ) === "string" ) {
                        _valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
                    }

                    if (_yoyo) {
                        var tmp = _valuesStartRepeat[ property ];
                        _valuesStartRepeat[ property ] = _valuesEnd[ property ];
                        _valuesEnd[ property ] = tmp;
                    }

                    _valuesStart[ property ] = _valuesStartRepeat[ property ];

                }

                if (_yoyo) {
                    _reversed = !_reversed;
                }

                _startTime = time + _delayTime;

                return true;

            } else {

                if ( _onCompleteCallback !== null ) {

                    _onCompleteCallback.call( _object );

                }

                for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

                    _chainedTweens[ i ].start( time );

                }
                return false;
            }
        }
        return true;
    };

    if(a.start!==false)o.start();
    return o;
}


Object.assign(Tween,{
    getAll: function () {
        return _tweens;
    },
    removeAll: function () {
        _tweens = [];
    },
    add: function ( tween ) {
        _tweens.push( tween );
    },

    remove: function ( tween ) {
        var i = _tweens.indexOf( tween );
        if ( i !== -1 ) {
            _tweens.splice( i, 1 );
        }
    },

    update: function ( time ) {

        if ( _tweens.length === 0 ) return false;

        var i = 0;

        time = Date.now();

        while ( i < _tweens.length ) {

            if ( _tweens[ i ].update( time ) ) {

                i++;

            } else {

                _tweens.splice( i, 1 );

            }

        }

        return true;

    },
    ease:{

        Linear: {

            None: function ( k ) {

                return k;

            }

        },

        Quadratic: {

            In: function ( k ) {

                return k * k;

            },

            Out: function ( k ) {

                return k * ( 2 - k );

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
                return - 0.5 * ( --k * ( k - 2 ) - 1 );

            }

        },

        Cubic: {

            In: function ( k ) {

                return k * k * k;

            },

            Out: function ( k ) {

                return --k * k * k + 1;

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k + 2 );

            }

        },

        Quartic: {

            In: function ( k ) {

                return k * k * k * k;

            },

            Out: function ( k ) {

                return 1 - ( --k * k * k * k );

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
                return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

            }

        },

        Quintic: {

            In: function ( k ) {

                return k * k * k * k * k;

            },

            Out: function ( k ) {

                return --k * k * k * k * k + 1;

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
                return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

            }

        },

        Sinusoidal: {

            In: function ( k ) {

                return 1 - Math.cos( k * Math.PI / 2 );

            },

            Out: function ( k ) {

                return Math.sin( k * Math.PI / 2 );

            },

            InOut: function ( k ) {

                return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

            }

        },

        Exponential: {

            In: function ( k ) {

                return k === 0 ? 0 : Math.pow( 1024, k - 1 );

            },

            Out: function ( k ) {

                return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

            },

            InOut: function ( k ) {

                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
                return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

            }

        },

        Circular: {

            In: function ( k ) {

                return 1 - Math.sqrt( 1 - k * k );

            },

            Out: function ( k ) {

                return Math.sqrt( 1 - ( --k * k ) );

            },

            InOut: function ( k ) {

                if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
                return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

            }

        },

        Elastic: {

            In: function ( k ) {

                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

            },

            Out: function ( k ) {

                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

            },

            InOut: function ( k ) {

                var s, a = 0.1, p = 0.4;
                if ( k === 0 ) return 0;
                if ( k === 1 ) return 1;
                if ( !a || a < 1 ) { a = 1; s = p / 4; }
                else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
                if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

            }

        },

        Back: {

            In: function ( k ) {

                var s = 1.70158;
                return k * k * ( ( s + 1 ) * k - s );

            },

            Out: function ( k ) {

                var s = 1.70158;
                return --k * k * ( ( s + 1 ) * k + s ) + 1;

            },

            InOut: function ( k ) {

                var s = 1.70158 * 1.525;
                if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
                return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

            }

        },

        Bounce: {

            In: function ( k ) {

                return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

            },

            Out: function ( k ) {

                if ( k < ( 1 / 2.75 ) ) {

                    return 7.5625 * k * k;

                } else if ( k < ( 2 / 2.75 ) ) {

                    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

                } else if ( k < ( 2.5 / 2.75 ) ) {

                    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

                } else {

                    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

                }

            },

            InOut: function ( k ) {

                if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
                return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

            }

        }

    },
    Interpolation:{

        Linear: function ( v, k ) {

            var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

            if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
            if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

            return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

        },

        Bezier: function ( v, k ) {

            var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

            for ( i = 0; i <= n; i++ ) {
                b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
            }

            return b;

        },

        CatmullRom: function ( v, k ) {

            var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

            if ( v[ 0 ] === v[ m ] ) {

                if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

                return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

            } else {

                if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
                if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

                return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

            }

        },

        Utils: {

            Linear: function ( p0, p1, t ) {

                return ( p1 - p0 ) * t + p0;

            },

            Bernstein: function ( n , i ) {

                var fc = TWEEN.Interpolation.Utils.Factorial;
                return fc( n ) / fc( i ) / fc( n - i );

            },

            Factorial: ( function () {

                var a = [ 1 ];

                return function ( n ) {

                    var s = 1, i;
                    if ( a[ n ] ) return a[ n ];
                    for ( i = n; i > 1; i-- ) s *= i;
                    return a[ n ] = s;

                };

            } )(),

            CatmullRom: function ( p0, p1, p2, p3, t ) {

                var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
                return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

            }

        }

    }
});