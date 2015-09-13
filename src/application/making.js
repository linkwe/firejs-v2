var factory = require('./factory'),
    core = require('../core'),
    _tempPoint = new core.Point();

factory.bindClass('Image',core.Image,function(c,ops){
    ops = ops||{};
    var obj = new c({
        texture:ops.texture,
        url:ops.url,
        resId:ops.resId
    });
    return qset.call(obj,ops,null,['texture','url','resId']);
});

factory.bindClass('Image',core.Image,function(c,ops){
    ops = ops||{};
    var obj = new c({
        texture:ops.texture,
        url:ops.url,
        resId:ops.resId
    });
    return qset.call(obj,ops,null,['texture','url','resId']);
});


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