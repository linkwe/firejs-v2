var core = require('../core');



function View(ops){

    core.Container.call(this);

    this._width  = ops.width ;

    this._height = ops.height ;

    this.needUpdateLayout = true;

    this.needmask = ops.needmask || false ;

    this._mask = new core.gRect({
        width:  this._width,
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
}

View.prototype = Object.create(Container.prototype);
View.prototype.constructor = View;
module.exports = View;