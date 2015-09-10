var Graphics = require('./Graphics'),
    math = require('../math');


function gRect(ops){

    Graphics.call(this);
   
    this._lineWidth = ops.lineWidth || 0 ;
    this._lineColor = ops.lineColor || 0 ;
    this._lineAlpha = ops.lineAlpha || 1 ;

    this.fillColor = ops.color || 0;
    this.fillAlpha = ops.fillAlpha || 1 ; 

    this.needupdate = false;
    this.initGraphics(ops);

}


gRect.prototype = Object.create(Graphics.prototype);
gRect.prototype.constructor = gRect;
module.exports = gRect;

gRect.prototype.initGraphics = function(ops){

    this._Rectangle = new math.Rectangle(0,0, ops.width||200, ops.height||200);
    this.needupdate = true;

};

Object.defineProperties(gRect.prototype, {
   
    width: {
        get: function ()
        {
            return this._Rectangle.width;
        },
        set: function (value)
        {
            this._Rectangle.width = value;
            this.needupdate = true;
        }
    },

    height: {
        get: function ()
        {
            return  this._Rectangle.height;
        },
        set: function (value)
        {
            this._Rectangle.height = value;
            this.needupdate = true;
        }
    },

    color: {
        get: function ()
        {
            return  this.fillColor;
        },
        set: function (value)
        {
            this.fillColor = value;
            this.needupdate = true;
        }
    },

    lineWidth: {
        get: function ()
        {
            return  this._lineWidth;
        },
        set: function (value)
        {
            this._lineWidth = value;
            this.needupdate = true;
        }
    },
    lineColor: {
        get: function ()
        {
            return  this._lineColor;
        },
        set: function (value)
        {
            this._lineColor = value;
            this.needupdate = true;
        }
    },

    lineAlpha: {
        get: function ()
        {
            return  this._lineAlpha;
        },
        set: function (value)
        {
            this._lineAlpha = value;
            this.needupdate = true;
        }
    }
});


gRect.prototype.updateGraphics = function(){

    this.clear();
   
    this.lineStyle(this._lineWidth,this._lineColor,this._lineAlpha);

    this.beginFill(this.fillColor,this.fillAlpha);

    this.drawShape(this._Rectangle);

   
    this.needupdate = false;

};

gRect.prototype.updateTransform = function ()
{
    if (!this.visible)
    {
        return;
    }

    this.displayObjectUpdateTransform();

    for (var i = 0, j = this.children.length; i < j; ++i)
    {
        this.children[i].updateTransform();
    }

    if(this.needupdate){
        this.updateGraphics();
    }
};


Graphics.prototype.clear = function ()
{
    // this.lineWidth = 0;
    this.filling = false;

    this.dirty = true;
    this.clearDirty = true;
    this.graphicsData = [];

    return this;
};