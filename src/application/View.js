var core = require('../core'),
factory = require('./factory');


function View(ops){

    core.Container.call(this);

    this._width  = ops.width ||Q.app.width;

    this._height = ops.height ||Q.app.height;

    this._background = null ;



    if(a.name){ g.viewsCache[a.name] = this };
    /**
     * hbox
     * vbox
     * grid
     * none
     */
}

View.prototype = Object.create(Panel.prototype);
View.prototype.constructor = View;
module.exports = View;

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