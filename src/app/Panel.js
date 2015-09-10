var core = require('../core'),
var core = require('../core'),


function Panel(ops){

    core.Container.call(this);

    this._width  = null ;

    this._height = null ;

    this.needUpdateLayout = true;

    /**
     * hbox
     * vbox
     * grid
     * none
     */

    this.layout = '';


}




Panel.prototype.updateLayout = function(){

    this.needUpdateLayout = false;

}