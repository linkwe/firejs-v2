var gRect = require('./gRect'),
    math = require('../math');

function gRoundedRect(ops){

    gRect.call(this,ops);
    
}


gRoundedRect.prototype = Object.create(gRect.prototype);
gRoundedRect.prototype.constructor = gRoundedRect;
module.exports = gRoundedRect;

gRoundedRect.prototype.initGraphics = function(ops){

    this._graphics = new math.RoundedRectangle( 0, 0, ops.width || 200, ops.height || 200, ops.radius || 12 );
    this.needupdate = true;

};

Object.defineProperties(gRoundedRect.prototype, {
   
    radius: {
        get: function ()
        {
            return this._graphics.radius;
        },
        set: function (value)
        {
            this._graphics.radius = value;
            this.needupdate = true;
        }
    }
});


