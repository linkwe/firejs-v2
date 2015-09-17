var core = require('../core'),
    tween = require('./tween');


function Transitions( ren ){
   
    return;

    this.renderer = ren;

    this.trnA = new core.RenderTexture( ren, ren.width, 
        ren.height, null, ren.resolution );

    this.trnB = new core.RenderTexture( ren, ren.width, 
        ren.height, null, ren.resolution );

    this.container = new core.Container();

    this.container.enabled = false;

};


Transitions.prototype = Object.create(core.Container.prototype);
Transitions.prototype.constructor = Transitions;
module.exports = Transitions;


Transitions.prototype.update = function(){
    this.renderer.render(this.container);
};

Transitions.default = function( op ){
 
    var imA = new core.Image({
        texture:op.textureA ,//new Texture(op.textureA.baseTexture),
        width:  op.textureA.width ,
        height: op.textureA.height ,
        x: 0 ,
        y: 0
    });

    var imB = new core.Image({
        texture:op.textureB,//new Texture(op.textureB.baseTexture),
        width:  op.textureB.width,
        height: op.textureB.height,
        x:op.textureB.width
    });

    op.container.addChild(imA);
    op.container.addChild(imB);

    imB.animate({
        to:{
            x:0
        },
        time:1000,
        ease:tween.ease.Quartic.Out,
        onComplete:op.cak
    });

    imA.animate({
        to:{
            x:-op.textureB.width
        },
        time:1000,
        ease:tween.ease.Quartic.Out
    });

}

Transitions.prototype.switch = function(ops){
    var a = ops.ta,
        b = ops.tb,
        d = ops.cak,

        parent = ops.container;

        this.trnA.resize(a.width,a.height);
        this.trnB.resize(b.width,b.height);
        this.trnA.render(a,false,true);
        this.trnB.render(b,false,true);

        var autoRender = this.renderer.parent.autoRender ;
        var me = this ;
        this.renderer.parent.autoRender = false;

        core.ticker.shared.add( this.update );

        (op.transitions||Transitions.default)({
            textureA:trnA,
            textureB:trnB,
            container:this.container,
            cak:function(){
                core.ticker.shared.remove( me.update );
                me.renderer.parent.autoRender = autoRender ;
                d&&d();
            }
        });
};

core.WebGLRenderer.registerPlugin(  'transitions' , Transitions );
core.CanvasRenderer.registerPlugin( 'transitions' , Transitions );