var utils = require('../core').utils;


function Controller(){

    this._resf = ops.resf;
    this._control = ops.control;

    this.resf =null;
    this.control = null;

    this.name = ops.name || core.utils.uid();

    utils.controller[this.name] = this;

}

Controller.prototype.constructor = Container;

module.exports = Controller;

Controller.prototype._init = function(the){

    var _resf = this._resf;

    var control = this._control;
        obj , i , co;

    for(i in _resf){
        this.resf[i] = the.find(_resf[i]);
    }

    for(i in control){

        co = control[i];
        obj = this.resf[i];
        if(!obj)continue;
        for(var o in co){
            obj.on( o , this.fns[ co[o] ].bind( obj, this) );
        }
    }

};
