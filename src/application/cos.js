



/**
 * 通过查找表来快速输出正玄 余弦
 * @type {[type]}
 */
var abs = Math.abs;
(function() {
    var FTrig = (function() {
        var FTrig = function(accuracyLevel) {
            switch (accuracyLevel) {
                case FTrig.LOW:
                    this.sin = this.sinLow;
                    this.cos = this.cosLow;
                break;
                case FTrig.HIGH:
                    this.sin = this.sinHigh;
                    this.cos = this.cosHigh;
                break;
            }
        };

        FTrig.LOW  = 1;
        FTrig.HIGH = 2;

        FTrig.prototype = {
            sinHigh: function(x){
                var sin;
                if (x < -3.14159265) x += 6.28318531;
                else if (x >  3.14159265) x -= 6.28318531;

                if (x < 0) {
                    sin = 1.27323954 * x + .405284735 * x * x;
                    if (sin < 0) sin = .225 * (sin *-sin - sin) + sin;
                    else sin = .225 * (sin * sin - sin) + sin;
                } else {
                    sin = 1.27323954 * x - 0.405284735 * x * x;
                    if (sin < 0) sin = .225 * (sin *-sin - sin) + sin;
                    else sin = .225 * (sin * sin - sin) + sin;
                }
                return sin;
            },
            cosHigh: function(x){
                var cos;
                x += 1.57079632;
                if (x >  3.14159265) x -= 6.28318531;
                if (x < 0) {
                    cos = 1.27323954 * x + 0.405284735 * x * x;
                    if (cos < 0) cos = .225 * (cos *-cos - cos) + cos;
                    else cos = .225 * (cos * cos - cos) + cos;
                } else {
                    cos = 1.27323954 * x - 0.405284735 * x * x;
                    if (cos < 0) cos = .225 * (cos *-cos - cos) + cos;
                    else cos = .225 * (cos * cos - cos) + cos;
                }
                return cos;
            },
            sinLow: function(x){
                if (x < -3.14159265) x += 6.28318531;
                else if (x >  3.14159265) x -= 6.28318531;
                if (x < 0) return 1.27323954 * x + .405284735 * x * x;
                else return 1.27323954 * x - 0.405284735 * x * x;
            },
            cosLow: function(x){
                x += 1.57079632;
                if (x >  3.14159265) x -= 6.28318531;
                if (x < 0) return 1.27323954 * x + 0.405284735 * x * x
                else return 1.27323954 * x - 0.405284735 * x * x;
            }
        }

        return FTrig;
    })();

    module.exports  FTrig;
})();