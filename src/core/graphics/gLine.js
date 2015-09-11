var Graphics = require('./Graphics'),
    math = require('../math'),
    CONST = require('../const'),
    GraphicsData = require('./GraphicsData');


function gLine(ops){

    Graphics.call(this);
    this._lineWidth = ops.lineWidth || 0 ;
    this._lineColor = ops.lineColor || 0 ;
    this._lineAlpha = ops.lineAlpha || 1 ;
    this.needupdate = false;
    this.initGraphics(ops);

}


gLine.prototype = Object.create(Graphics.prototype);
gLine.prototype.constructor = gLine;
module.exports = gLine;

gLine.prototype.initGraphics = function(ops){

    if(!ops.paths) return;
    this.closed = ops.closed || false;
    this._paths = ops.paths;
    this.needupdate = true;

};

gLine.prototype.updateGraphics = function(){

    this.clear();
   
    this.lineStyle( this._lineWidth, this._lineColor, this._lineAlpha );

    this.moveTo(this._paths[0].x,this._paths[0].y);

    for(var i=1,l=this._paths.length;i<l;i++){

        this.lineTo(this._paths[i].x,this._paths[i].y);

    }


    this.needupdate = false;

};

Object.defineProperties(gLine.prototype, {
   
    paths: {
        get: function ()
        {
            return this._paths;
        },
        set: function (value)
        {
            this._paths = value;
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




gLine.prototype.updateTransform = function ()
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


gLine.prototype.clear = function ()
{

    this.filling = false;
    this.dirty = true;
    this.clearDirty = true;
    this.graphicsData = [];

    return this;

};

gLine.prototype.drawShape = function (shape)
{
    if (this.currentPath)
    {
        // check current path!
        if (this.currentPath.shape.points.length <= 2)
        {
            this.graphicsData.pop();
        }
    }

    this.currentPath = null;

    var data = new GraphicsData(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, shape);

    this.graphicsData.push(data);

    if (data.type === CONST.SHAPES.POLY)
    {
        data.shape.closed = this.closed;
        this.currentPath = data;
    }

    this.dirty = this.boundsDirty = true;

    return data;
};