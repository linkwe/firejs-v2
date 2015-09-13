var utils = require('../core').utils;

var _require = function(){

    var modules = [] , ms = [] ;
        
    var exe = function(_a){

        utils.loadScript(_a.src,function(){

            var _o = modules.length>1 ? modules:modules.length == 1 && modulesmodules[0] || null;

            modules = [];

            _a.name&&(ms[_a.name] = _o);

            _a.cak&&_a.cak(_o);

        });
    };

    return {

        load:function( options, progress, complete ){

            if( Array.isArray(options) ){
                var l = options.length , count = 0 , syn = [] , other = [] , i = 0 ;
                options.forEach(function(m){m.syn?syn.push(m):other.push(m)});
                !function req(_i){
                    var me,_cak;
                    if(i<syn.length){
                        me = syn[_i];
                        _cak = me.cak;
                        me.cak = function(op){
                            _cak(op);
                            count++;
                            progress&&progress({src:me.src,idx:count,length:l});
                            req(++i);
                        };
                        exe(me);
                    }else if(other.length>0){
                        other.forEach(function(m){
                            var __cak = me.cak;
                            me.cak = function(op){
                                count++;
                                progress&&progress({src:me.src,idx:count,length:l});
                                __cak(op);
                            }
                        });
                    }else{ complete&&complete() }
                }(i);

            }else{exe(options)}
        },

        getmodule:function(name){
            return ms[name];
        }
    }
}();

module.exports = _require;
