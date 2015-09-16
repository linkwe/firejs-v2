


function Transitions( renderer, w, h, r ){
    

var ren = renderer;

var trnA = new RenderTexture(ren,w,h,null,r);
var trnB = new RenderTexture(ren,w,h,null,r);

// var imA = new _Image({texture:trnA});
// var imB = new _Image({texture:trnB});

!function(trn){

trn.default = trn.small = function(op){
   
    var imA = new _Image({
        texture:op.textureA,//new Texture(op.textureA.baseTexture),
        width:  op.textureA.width,
        height: op.textureA.height,
        x:0,
        y:0
    });

    var imB = new _Image({
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
        ease:miao.Tween.ease.Quartic.Out,
        onComplete:op.cak
    });

    imA.animate({
        to:{
            x:-op.textureB.width
        },
        time:1000,
        ease:miao.Tween.ease.Quartic.Out
    });
};

trn.default = trn.fadeIn = function(op){
   
    var imA = new _Image({
        texture:op.textureA,//new Texture(op.textureA.baseTexture),
        width:  op.textureA.width,
        height: op.textureA.height,
        x:0,
        y:0
    });

    var imB = new _Image({
        texture:op.textureB,//new Texture(op.textureB.baseTexture),
        width:  op.textureB.width,
        height: op.textureB.height,
        // x:op.textureB.width
    });

    op.container.addChild(imB);

    op.container.addChild(imA);


    imA.animate({
        to:{
            alpha:0
        },
        time:1200,
        // ease:miao.Tween.ease.Quartic.Out,
        onComplete:op.cak
    });

    // imA.animate({
    //     to:{
    //         x:-op.textureB.width
    //     },
    //     time:1000,
    //     ease:miao.Tween.ease.Quartic.Out
    // });
};

}(

//a过渡a  b过渡b c是过度效果的绘制对象c，没有责绘制在系统ui. d 过度后的回调。

miao.Transitions = function(op){

      var a = op.ta,
            b = op.tb,
            c = new Container(),
            d = op.cak,
            parent = op.container||miao.app.container ;

        trnA.resize(a.width,a.height);
        trnB.resize(b.width,b.height);
        
        trnA.render(a,false,true);
        trnB.render(b,false,true);


        miao.app.run = function(){
            miao.app.autoRender = false;
            miao.app.renderer.render(c);
        }

        var _enabled = miao.app.container.enabled;

        miao.app.container.enabled = false;

        if(op.wd !== false){
            var gui_v = miao.app.GUI.visible;
            var aty_v = miao.app.atyView.visible;
            miao.app.GUI.visible = false;
            miao.app.atyView.visible = false;
        }

        (op.transitions||miao.Transitions.default)({
            textureA:trnA,
            textureB:trnB,
            container:c,
            cak:function(){
                miao.app.autoRender = true ;
                miao.app.container.enabled = _enabled;
                if(op.wd !== false){
                    miao.app.GUI.visible = gui_v;
                    miao.app.atyView.visible = aty_v;
                }
                d&&d();
            }
        });
    });
};

core.WebGLRenderer.registerPlugin(  'transitions' , Transitions );
core.CanvasRenderer.registerPlugin( 'transitions' , Transitions );