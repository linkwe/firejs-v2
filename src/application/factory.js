


var __class = {};

/**
 * [bindClass description]
 * @param  {[type]} name    类名
 * @param  {[type]} source  类--构造函数
 * @param  {[type]} factory 如何价工厂化的实现，默认是将参数做为数组.
 * @return {[type]}         返回一个该类的工厂方法
 */
function bindClass( name, source, factory ){
    if(__class[name])return false;
    /**
     * 工厂化接口
     * @param  {[type]} _class 类的构造函数
     * @param  {[type]} ops    实例化的参数
     * @return {[type]}        返回实例化的对象
     */
    factory = factory || function( _class , ops){
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


/**
 * [factoryObject description]
 * @param  {[type]} name 需要实例化的名称
 * @param  {[type]} ops  实例化的参数
 * @return {[type]}      实例化一个对象，并且返回
 */
function factoryObject( name , ops ){
    return __class[name] && __class[name](ops) || null;
};


module.exports = {
    __class:__class,
    bindClass:bindClass,
    factoryObject:factoryObject
};