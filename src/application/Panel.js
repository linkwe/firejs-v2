var core = require('../core'),
factory = require('./factory');

function Panel(ops){

    core.Container.call(this);

    this._width  = 0;

    this._height = 0;

    this.needUpdateLayout = true;

    this.needmask = ops.needmask || true ;

    this.scroll = false;

    this._background = null ;
    
    this.width = ops.width||0;

    this.height = ops.height||0;

    core.utils.qset.call(this,ops,true,['items','background']);

    this.mask = new core.gRect({
        width:  this._width,
        height: this._height
    });

    if(ops.background)this.background = ops.background ;

    var con = new core.Container();

    this.container = con;

    con._width = this._width;
    con._height = this._height;


    this.addChild(con);

    if(ops.items) this.setItems( ops.items );

    this._layout = ops.layout ;

};

Panel.prototype = Object.create(core.Container.prototype);
Panel.prototype.constructor = Panel;
module.exports = Panel;

Panel.prototype.updateTransform = function ()
{
    if (!this.visible) {
        return;
    }

    this.displayObjectUpdateTransform();

    for (var i = 0, j = this.children.length; i < j; ++i) {
        this.children[i].updateTransform();
    }

    if(this.needUpdateLayout){
        this.updateLayout();
    }
};

Panel.prototype.containsPoint = function(_point){
    

    var point = this.position,
        anchor = this.anchor||{x:0,y:0},
        scale = this.scale,
        tw = this._width ,
        th = this._height;

    var _x = point.x - anchor.x * tw * scale.x,
        _y = point.y - anchor.y * th * scale.y;

    return !(_point.x<_x||_point.x>_x+tw*scale.x||
            _point.y<_y||_point.y>_y+th*scale.y);

}


Panel.prototype.updateLayout = function(){

    // layout[this.layout.type]( this, this.children, this.layout );
    // this.needUpdateLayout = false;

}


Panel.prototype.setItems = function(a){

    for(var i=0,l=a.length;i<l;i++){

        if(factory.__class[a[i].xtype]){
            var o = factory.factoryObject(a[i].xtype,a[i])
            this.container.addChild(o);
        }
    }
    return this;
    
}

Panel.prototype.renderWebGL = function (renderer)
{

    // if the object is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
    {
        return;
    }

    var i, j;

  
    if (this._mask || this._filters)
    {
        renderer.currentRenderer.flush();

        if (this._filters)
        {
            renderer.filterManager.pushFilter(this, this._filters);
        }

        if (this._mask && this.needmask)
        {
            renderer.maskManager.pushMask(this, this._mask);
        }

        renderer.currentRenderer.start();

        // add this object to the batch, only rendered if it has a texture.
        this._renderWebGL(renderer);

        // now loop through the children and make sure they get rendered
        if(this._background){
            this._background.renderWebGL(renderer);
        }
        for (i = 0, j = this.children.length; i < j; i++)
        {
            this.children[i].renderWebGL(renderer);
        }

        renderer.currentRenderer.flush();

        if (this._mask && this.needmask)
        {
            renderer.maskManager.popMask(this, this._mask);
        }

        if (this._filters)
        {
            renderer.filterManager.popFilter();

        }
        renderer.currentRenderer.start();
    }
    else
    {
        this._renderWebGL(renderer);

        if(this._background){
            this._background.renderWebGL(renderer);
        }

        // simple render children!
        for (i = 0, j = this.children.length; i < j; ++i)
        {
            this.children[i].renderWebGL(renderer);
        }
    }
};


Panel.prototype.renderCanvas = function (renderer)
{
    // if not visible or the alpha is 0 then no need to render this
    if (!this.visible || this.alpha <= 0 || !this.renderable)
    {
        return;
    }

    

    if (this._mask && this.needmask)
    {
        renderer.maskManager.pushMask(this._mask, renderer);
    }

    this._renderCanvas(renderer);
    for (var i = 0, j = this.children.length; i < j; ++i)
    {
        this.children[i].renderCanvas(renderer);
    }

    if (this._mask)
    {
        renderer.maskManager.popMask(renderer);
    }
};





Object.defineProperties(Panel.prototype, {

    width: {
        get: function ()
        {
            return this._width;
        },
        set: function (value)
        {

            if(typeof value === 'string')
            value = core.utils.getPix(value);
            this._width = value;
        }
    },

    height: {
        get: function ()
        {
            return this._height;
        },
        set: function (value)
        {
            if(typeof value === 'string')
            value = core.utils.getPix(value);
            this._height = value;
        }
    },

    mask: {
        get: function ()
        {
            return this._mask;
        },
        set: function (value)
        {
            
            if (this._mask)
            {
                this.removeChild(this._mask);
            }
            this._mask = value;
            this.addChild(this._mask);
            this._mask.renderable = false;
        }
    },
   
    background: {
        get: function ()
        {
            return this._background ? this._background.fillColor : null ;
        },
        set: function (value)
        {
            if(!this._background){

                this._background = new core.gRect({
                    width:this._width,
                    height:this._height,
                    color:value
                });

                this._background.depth = -100;
                this.addChild(this._background);

            }else{
                if(value===null&&this._background){
                    this.removeChild(this._background);
                    this._background = value;

                }else{
                    this._background.color = value;
                }
                
            }
        }
    }
});