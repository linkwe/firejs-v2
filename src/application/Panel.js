var core = require('../core'),
var layout = require('../core'),


function Panel(ops){

    core.Container.call(this);

    this._width  = ops.width ;

    this._height = ops.height ;

    this.needUpdateLayout = true;

    this.needmask = ops.needmask || false ;

    this._mask = new core.gRect({
        width:  this._width  ,
        height: this._height 
    });

    this._mask.parent = this;

    this._background = null ;

    /**
     * hbox
     * vbox
     * grid
     * none
     */

    this._layout = ops.layout || {
        type:

    };


}


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


Panel.prototype.updateLayout = function(){

    layout[this.layout.type]( this , this.children , this.layout)

    this.needUpdateLayout = false;

}

Panel.prototype.renderWebGL = function (renderer)
{

    // if the object is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
    {
        return;
    }

    var i, j;

    if(this._background){
        this._background.renderWebGL(renderer);
    }

    // do a quick check to see if this element has a mask or a filter.
    if (this._mask || this._filters)
    {
        renderer.currentRenderer.flush();

        // push filter first as we need to ensure the stencil buffer is correct for any masking
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
        for (i = 0, j = this.children.length; i < j; i++)
        {
            this.children[i].renderWebGL(renderer);
        }

        renderer.currentRenderer.flush();

        if (this._mask)
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

    if(this._background){
        this._background.renderCanvas(renderer);
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

                this._background.parent = this;

            }else{
                this._background.color = value;
            }
        }
    }
});