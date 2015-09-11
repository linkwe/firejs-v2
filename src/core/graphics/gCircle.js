var gRect = require('./gRect'),
    math = require('../math');

function gCircle(ops){

    gRect.call(this,ops);
    
}


gCircle.prototype = Object.create(gRect.prototype);
gCircle.prototype.constructor = gCircle;
module.exports = gCircle;

gCircle.prototype.initGraphics = function(ops){

    this._graphics = new math.Circle(0,0, ops.radius||200);
    this.needupdate = true;

};

Object.defineProperties(gCircle.prototype, {
   
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
    },

    width: {
        get: function ()
        {
            return this.scale.x * this._graphics.radius*2;
        },
        set: function (value)
        {
            this._graphics.radius = value / 2;
            this.needupdate = true;
        }
    },

  
    height: {
        get: function ()
        {
            return this.scale.x * this._graphics.radius*2;
        },
        set: function (value)
        {
            this._graphics.radius = value / 2;
            this.needupdate = true;
        }
    }

});


