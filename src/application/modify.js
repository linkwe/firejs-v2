
var core = require('../core');
// Mix interactiveTarget into core.DisplayObject.prototype
Object.assign(
    core.DisplayObject.prototype,
    {
        interactive: false,
        /**
         * @todo Needs docs.
         */
        buttonMode: false,
        /**
         * @todo Needs docs.
         */
        interactiveChildren: true,
        /**
         * @todo Needs docs.
         */
        defaultCursor: 'pointer',

        /**
         * @todo Needs docs.
         * @private
         */
        _over: false,
        /**
         * @todo Needs docs.
         * @private
         */
        _touchDown: false,

        /**
         * @todo Needs docs.
         * @private
         */
        enabled: false
    }
);

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
            return this.rotation / core.DEG_TO_RAD;
        },
        set: function (value)
        {
            this.rotation = 
            value * core.DEG_TO_RAD ;
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
// qset.call(core.utils,{
//     cover:{
//         getRes:function(){

//         }
//     }
// });