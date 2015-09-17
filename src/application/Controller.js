var utils = require('../core').utils;


function Controller(ops){

    ops = ops || {} ;

    this._resf = ops.resf;

    this._control = ops.control;

    this.resf = null;

    this.control = null;

    this.name = ops.name || utils.uid();

    utils.controller[this.name] = this;

    this._init();

}

Controller.prototype.constructor = Controller ;

module.exports = Controller;

Controller.prototype._init = function(){

    var _resf = this._resf;

    var control = this._control,
        obj , i , co;

    for(i in _resf){
        this.resf[i] = the.find(_resf[i]);
    }

    for(i in control){

        co = control[i];
        obj = this.resf[i];
        if(!obj)continue;
        for(var o in co){
            obj.on( o , this.fns[ co[o] ].bind( obj , this) );
        }
    }

};
