require('./polyfill');
var core =  require('./core');

core.extras         = require('./extras');
core.filters        = require('./filters');
core.loaders        = require('./loaders');
core.mesh           = require('./mesh');
core.loader = new core.loaders.Loader();
core.app = require('./application');


module.exports = 
global.Q = global.PIXI =
Object.assign(
function q(){

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
        rt = core.app.factory.factoryObject(a,arguments[1]);
    }

    return rt;
},core);