require('./polyfill');

var core = require('./core');

core.extras         = require('./extras');
core.filters        = require('./filters');
// core.interaction    = require('./interaction');
core.loaders        = require('./loaders');
core.mesh           = require('./mesh');

core.loader = new core.loaders.Loader();

// Object.assign(core, require('./deprecation'));


var __class = {},
    selector = {
        tagCache:{},
        content:{},
        objCache:{}
    },
    _tempPoint = new core.Point() ;



var bindClass = core.bindClass = function( name, source, factory ){
    if(__class[name])return false;

    factory = factory || function( _class, ops){
        var c, b = ops;
        if(Object.prototype.toString.call(ops)==='[object Array]'){
            switch(b.length)
            {
                case 1 :c = new _class[a](b[0]);break;
                case 2 :c = new _class[a](b[0],b[1]); break;
                case 3 :c = new _class[a](b[0],b[1],b[2]); break;
                case 4 :c = new _class[a](b[0],b[1],b[2],b[3]);break;
                case 5 :c = new _class[a](b[0],b[1],b[2],b[3],b[4]);break;
                case 6 :c = new _class[a](b[0],b[1],b[2],b[3],b[4],b[5]);break;
                default:c = new _class[a]();break;
            }
        }else{
            c = new _class(b);
        }
        return c;
    }
    __class[name] = factory.bind( null, source );
    return true;
};

var factoryObject = core.factoryObject = function( name , ops ){
    return __class[name] && __class[name](ops) || null;
};

bindClass('Image',core.Image,function(c,ops){
    ops = ops||{};
    var obj = new c({
        texture:ops.texture,
        url:ops.url,
        resId:ops.resId
    });
    return qset.call(obj,ops,null,['texture','url','resId']);
});

function qset( ops, isfunc, exc )
{
    ops = ops||{};
    var isCV = !!ops.cover && Object.prototype.toString.call(ops.cover)==='[object Object]';

    if(Object.prototype.toString.call(exc)!=='[object Array]')exc=[];

    if(isCV)exc.push('cover');

    for(var i in ops){
        if(exc.indexOf(i)!=-1)continue;
        if(this[i]!==undefined&&typeof this[i]!=='function')this[i]=ops[i];
    }

    if(isCV)for(var i in ops.cover)this[i]=ops.cover[i];

    if(isfunc!==false)for(var i in ops){
        if(exc.indexOf(i)!=-1)continue;
        if(this[i]==='function')this[i](ops[i]);
    }

    return this;
}

function q(){

    if(arguments.length==0)return null;

    var rt = null, a = arguments[0];

    if(arguments.length==1&& typeof a =='string'){
        a = arguments[0];
        if(a[0]=='.'){
            rt = selector.tagCache[a];
        }else if(a[0]=='#'){
            rt = selector.objCache[a];
        }else{
            rt = g.selector.getByName(a);
        }
    }else if(arguments.length==2){
        rt = factoryObject(a,arguments[1]);
    }

    return rt;
}


module.exports = qset.call( q, { cover:core } );


Object.defineProperties(core.DisplayObject.prototype,{

    interaction:{value:function( name, evDate, hit ){

        if( !this.enabled || evDate.stopped ) return ;
        this.containsPoint( evDate.global )&&this.emit( name, evDate );

    }},

    containsPoint:{value:function(point){ /** TODO:*/ }},

    enabled:{value:true},

    scaleX: {
        
        get: function ()
        {
            return this.scale.x;
        },
        set: function (value)
        {
            this.scale.x = value;
        }
    },
    scaleY: {
        get: function ()
        {
            return this.scale.y;
        },
        set: function (value)
        {
            this.scale.y = value;
        }
    },

    angle: {
        get: function ()
        {
            return this.rotation / core.CONST.DEG_TO_RAD;
        },
        set: function (value)
        {
            this.rotation = 
            value * core.CONST.DEG_TO_RAD ;
        }
    }
});


Object.defineProperties(core.Container.prototype,{

    interaction:{value:function( name , evDate, hit ){

        if(!this.enabled || evDate.stopped)return;

        this.containsPoint(evDate.global)&&this.emit(name,evDate);

        var children = this.children;

        if(this.interactiveChildren)
        {
            for (var i = children.length-1; i >= 0; i--)
            {
                if(evDate.stopped)return;
                children[i].interaction(name , evDate, hit);
            }
        }
    }},
    createItems:{value:function( ops ){

       
    }}
});


/**
 * CONST
 */
qset.call(core.utils,{
    cover:{
        getRes:function(){

        }
    }
});

