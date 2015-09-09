 
function core( a, b ){
    var obj;
    if(typeof b == 'array'){
        obj = new resf.a()
        var l = b.length;
        switch(l){
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
        }
    }
}

var resf = {
    image:Q.class.image,
}

function qset(a){

    if(Object.prototype.toString.call(a)!== '[object Object]') return ;

    var i;

    for(i in a)(this[i]!==undefined&&(typeof this[i] !== 'function'))&&(this[i] = a[i]);

    if(Object.prototype.toString.call(a.cover) === '[object Object]'){
        for(j in a.cover) this[i] = a.cover[i];
    }

    for(i in a)(typeof this[i] === 'function')&&this[i](a[i]);

    return this;

}

var __class = {};

function bindClass( name, source, factory ){
    if(__class[name])return false;
    __class[name] = factory.bind( null, source );
    return true;
}

function factoryObject( name , ops ){
    return __class[name] && __class[name](ops) || null;
}
