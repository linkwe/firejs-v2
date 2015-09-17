var core = require('../core'),
Loader = require('../loaders').Loader,
tween = require('./tween'),
EventEmitter = require('eventemitter3');

function Application(ops){

    if(global.Q.app) return global.Q.app;

    EventEmitter.call(this);

    global.Q.app = this;

    this.loader = new Loader(); 

    this.resolution = ops.resolution || 1 ;

    var _w, _h ;

    if(ops.element){

        this.element = ops.element;
        _w = this.element.clientWidth;
        _h = this.element.clientHeight;

    }else{

        this.element = document.body;
        _w = document.documentElement.clientWidth;
        _h = document.documentElement.clientHeight;
    }

    this.width  = _w ;
    this.height = _h ;

    this.atyView = new core.Container();

    this.renderer = core.autoDetectRenderer(this.width,this.height,{
        resolution:this.resolution,
        backgroundColor : 0xffffff
    });

    this.renderer.parent = this;

    this.element.appendChild(this.renderer.view);

    this._lastView = null;

    this.GUI = new core.Container() ;

    var container = new core.Container();

    container.addChild(this.atyView) ;

    container.addChild(this.GUI) ;

    this.container = container;

    this.autoRender = true;

    if(ops.listeners)for(var l in ops.listeners) this.on(l,ops.listeners[l]);
 
    core.ticker.shared.add( this.update, this);
    
    core.ticker.shared.add( tween.update, tween);

    this._initApplication(ops);

}

Application.prototype = Object.create(EventEmitter.prototype);
Application.prototype.constructor = Application;



module.exports = Application ;


Application.prototype._initApplication = function(ops){
    this.loadResources(ops.launch,ops.resources);
};


Application.prototype.go = function(name){
    
};

Application.prototype.loadResources = function(launch,resources){

    var me = this,loader = this.loader ;

    loader.on('progress',function(a,b){
        me.emit( 'progress', a, b );
    });

    if(launch){
        loader.add(launch).load(function(a,b){
            me.emit('launch',a,b);
        });
    }

    if(resources){
        loader.add(resources).load(function(a,b){
            me.emit('init',a,b);
        });
    }

    if(!resources) me.emit('init');

};

Application.prototype.initControllers = function() {

};

Application.prototype.getRes = function(name) {
    return this.loader.resources[name];
};

Application.prototype.update = function(){
    this.autoRender&&this.redraw();
};

Application.prototype.redraw = function() {
    this.renderer.render(this.container);
};



/*
var App = _class({
    
    className:'App',
    constructor:function(a){
        if(miao.app)return miao.app;

        a= a||{};

        Q.app = this;

        this.resolution = a.resolution || 1;

        var _w,_h;

        if(a.element){

            this.element = a.element;
            _w = this.element.clientWidth;
            _h = this.element.clientHeight;

        }else{

            this.element = document.body;
            _w = document.documentElement.clientWidth;
            _h = document.documentElement.clientHeight;

        }

        this.width  = _w;//this.resolution * _w ;
        this.height = _h;//this.resolution * _h ;

        this.atyView = new _class.View();

        this.renderer = null;

        this._lastView = null;

        this.GUI = new Container();

        var container = new Container();

        container.addChild(this.atyView);

        container.addChild(this.GUI);

        this.container =container;

        this.autoRender = true;

        utils.setRenderer(this,a.noWebGL);
        miao.Transitions(this.renderer,this.width,this.height,this.resolution);
        this.renderer.backgroundColor = 0x000000;
        pulse.setHand(this.update.bind(this));

         if(!miao.pulse.sw)pulse.start();

        if(a.listener){
            for(var i in a.listener){
                if(fn.isF(a.listener[i]))
                message.on(this,i,a.listener[i]);
            }
        }

        if(this._listener['advance']){
            message.trigger(this,'advance',this._init.bind(this,a));
        }else{
             this._init(a);
        }

    },
    update:function(){

        if(this.run)this.run();//this.atyView.run();
        this.autoRender&&this.renderer.render(this.container);
       
    },
    _init:function(a){

        message.inj(this,'down',function(e){

            // console.log('dsfdf')

            this.container.interaction(miao.event.now,'down',e);

        });

        message.inj(this,'move',function(e){

            this.container.interaction(miao.event.now,'move',e);
            // this.GUI.interaction(miao.event.now,'move');
            // message.trigger(this.atyView,'move');
        });

        message.inj(this,'up',function(e){

            this.container.interaction(miao.event.now,'up',e);
            // message.trigger(this.atyView,'up');
        });

       

        if(a.R){
            miao.R.loadRes(a.R,function(){

                message.trigger(miao.app,'init');
            },function(a,b,c,d){
                
                message.trigger(miao.app,'loading',{i:a,length:b,name:c,src:d});
            });
        }else{
            message.trigger(this,'init');
        }

    },
    // interaction:function(point,name,ops){



    //     message.trigger(this.atyView,name);

    //     this.GUI.interaction(miao.event.now,'move');
    //     message.trigger(this.atyView,name);

    // },

    backView:function(a,b){
        if(this._lastView)this.go(this._lastView,a,b);
        return this;
    },

    getView:function(a){
        if(!a){
            return this.atyView;
        }else if(g.viewsCache[a]){
            return g.viewsCache[a];
        }
    },

    go:function(a,b,c){

        var  acy;
        
        if(fn.isS(a)){

          acy = this.getView(a);
          if(!acy)return;

        }else if( fn.inof(a,'View') ) {

          acy = a;

        }else{return}

        g.selector = acy;

        var now = this._lastView = this.atyView;
        var the = this;
        // console.log(acy.backgroundColor, this.renderer.backgroundColor);

        if(this.renderer&&(acy.backgroundColor != this.renderer.backgroundColor))
            this.renderer.backgroundColor = acy.backgroundColor ;

        message.trigger(acy,'fast',b);

        if(fn.isF(c)){
            miao.Transitions({
                ta:now,
                tb:acy,
                cak:qie,
                transitions:c
            });

        }else{
            qie();
        }


        function qie(){

            acy.parent = the.container;
            the.container.children[0] = acy;

            if(now){
                message.trigger(now,'unload');
                //now.visible = false;
            }

            acy.visible = true; 
            the.atyView = acy;
            acy.renderer = the.renderer;
            message.trigger(acy,'init',b);
            message.trigger(acy,'toggle',b);

            the.run = acy.run || false;

            // console.log(the.run);

        }
    }
});
*/