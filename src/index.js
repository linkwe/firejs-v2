require('./polyfill');
var core =  require('./core');
var app = require('./application');

core.extras         = require('./extras');
core.filters        = require('./filters');
core.loaders        = require('./loaders');
core.mesh           = require('./mesh');
core.loader = new core.loaders.Loader();

core.require = app.require;
core.factory = app.factory;
core.req = app.req;
core.tween = app.tween;

module.exports = 
global.Q = global.PIXI =
Object.assign(function(){
    if(arguments.length==0)return null;
    var rt = null, a = arguments[0];
    if(arguments.length==1&& typeof a =='string'){
        a = arguments[0];
        // if(a[0]=='.'){
        //     rt = selector.tagCache[a];
        // }else if(a[0]=='#'){
        //     rt = selector.objCache[a];
        // }else{
        //     rt = g.selector.getByName(a);
        // }
    }else if(arguments.length==2){
        rt = app.factory.factoryObject(a,arguments[1]);
    }
    return rt;
},core);