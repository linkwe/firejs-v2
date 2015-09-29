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
    return core.utils.qset.call(obj,ops,true,['texture','url','resId']);

},factory.TYPE_FAC);


factory.bindClass('App',require('./Application'),null,factory.TYPE_CON);

factory.bindClass('Panel',require('./Panel'),null,factory.TYPE_CON);

factory.bindClass('Rect',core.gRect,null,factory.TYPE_CON);
