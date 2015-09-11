var gRect = require('./gRect'),
    math = require('../math');

function gEllipse(ops){

    gRect.call(this,ops);
    
}

gEllipse.prototype = Object.create(gRect.prototype);
gEllipse.prototype.constructor = gEllipse;
module.exports = gEllipse;

gEllipse.prototype.initGraphics = function(ops){

    this._graphics = new math.Ellipse( 0, 0, ops.width || 200, ops.height || 200 );
    this.needupdate = true;

};

Object.defineProperties(gEllipse.prototype, {
    width: {
        get: function ()
        {
            return this._graphics.width;
        },
        set: function (value)
        {
            this._graphics.width = value;
            this.needupdate = true;
        }
    },

    height: {
        get: function ()
        {
            return  this._graphics.height;
        },
        set: function (value)
        {
            this._graphics.height = value;
            this.needupdate = true;
        }
    }
});


