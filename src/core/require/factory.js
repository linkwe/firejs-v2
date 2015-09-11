var __class = {},

selector = {
    tagCache:{},
    content:{},
    objCache:{}
},

_tempPoint = new core.Point();



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