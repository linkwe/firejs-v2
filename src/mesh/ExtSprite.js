var Mesh = require('./Mesh');
var core = require('../core');

/**
 * The rope allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 * for (var i = 0; i < 20; i++) {
 *     points.push(new PIXI.Point(i * 50, 0));
 * };
 * var rope = new PIXI.Rope(PIXI.Texture.fromImage("snake.png"), points);
 *  ```
 *
 * @class
 * @extends PIXI.Mesh
 * @memberof PIXI.mesh
 * @param {Texture} texture - The texture to use on the rope.
 * @param {Array} points - An array of {Point} objects to construct this rope.
 *
 */
function ExtSprite(texture ,  aabb , width , height )
{

        this._anchor = new core.Point();

         var the = this;

        this.anchor = Object.defineProperties({}, {
            x: {
                get: function ()
                {
                    return the._anchor.x;
                },
                set: function (value)
                {
                    the.pivot.x = value * the._width;
                    the._anchor.x = value;
                }
            },
            y: {
                get: function ()
                {
                    return the._anchor.y;
                },
                set: function (value)
                {
                    the.pivot.y = value * the._width;
                    the._anchor.y = value;
                }
            }
        });

        /**
         * [_aabb description]
         * @type {[type]}
         */
        this._aabb = aabb || [ 0 , 0 , 0 , 0 ];

        Mesh.call( this , null ,  

                    new Float32Array( 16 * 2 ) , 

                    new Float32Array( 16 * 2 ) , 

                    new Uint16Array([ 0,1,4,4,1,5,1,2,5,5,2,6,2,
                                                    3,6,6,3,7,4,5,8,8,5,9,5,6,
                                                    9,9,6,10,6,7,10,10,7,11,8,
                                                    9,12,12,9,13,9,10,13,13,10,
                                                    14,10,11,14,14,11,15] ) ,

                     Mesh.DRAW_MODES.TRIANGLES );

        this._width = width || 0;

        this._height = height || 0;

        this.texture = texture || core.Texture.EMPTY;
                
}


ExtSprite.prototype = Object.create(Mesh.prototype);
ExtSprite.prototype.constructor = ExtSprite;

module.exports = ExtSprite;

Object.defineProperties(ExtSprite.prototype, {

    aabb: {
        get: function ()
        {
            return this._aabb;
        },
        set: function (value)
        {
            if( !Object.prototype.toString.call(value) === '[object Array]')
            {
                return;
            }

            var l = value.length;
            if(l === 1 ){
                this._aabb = [value[0],value[0],value[0],value[0]];
            }else if(l===2){
                this._aabb = [value[0],value[1],value[0],value[1]];
            }else if( l === 4){
                this._aabb = value;
            }else{
                this._aabb = [0,0,0,0];
            }
            this.refresh();
        }
    },
    /**
     * The width of the sprite, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof PIXI.Sprite#
     */
    width: {
        get: function ()
        {
            return this._width;
        },
        set: function (value)
        {
             var x2 = value - this._aabb[1],
                x3 = value,
                vs = this.vertices;
            
            vs[4] = x2;
            vs[6] = x3;

            vs[12] = x2;
            vs[14] = x3;

            vs[20] = x2;
            vs[22] = x3;

            vs[28] = x2;
            vs[30] = x3;

            this.pivot.x = this._anchor.x * value;

            this._width = value;
        }
    },

    /**
     * The height of the sprite, setting this will actually modify the scale to achieve the value set
     *
     * @member {number}
     * @memberof PIXI.Sprite#
     */
    height: {
        get: function ()
        {
            return  this._height;
        },
        set: function (value)
        {
            var y2 = value - this._aabb[1],
                   y3 = value,
                   vs = this.vertices;

            vs[17] = y2;
            vs[19] = y2;
            vs[21] = y2;
            vs[23] = y2;

            vs[25] = y3;
            vs[27] = y3;
            vs[29] = y3;
            vs[31] = y3;

            this.pivot.y = this._anchor.y * value;

            this._height = value;
        }
    }
});

/**
 * Refreshes
 *
 */
ExtSprite.prototype.refresh = function ()
{
    var frame = this.texture._frame ,
            uvs   = this.uvs ,
            aabb  = this._aabb ,
            tw    = this.texture.baseTexture.width ,
            th    = this.texture.baseTexture.height ;

        uvs[0] = frame.x / tw;
        uvs[1] = frame.y / th;
        uvs[2] = (frame.x + aabb[3] ) / tw;
        uvs[3] = uvs[1];
        uvs[4] = (frame.x + frame.width - aabb[1] ) / tw;
        uvs[5] = uvs[1];
        uvs[6] = (frame.x + frame.width ) / tw;
        uvs[7] = uvs[1];

        uvs[8]  = uvs[0];
        uvs[9]  = (frame.y+aabb[0]) / th;
        uvs[10] = uvs[2];
        uvs[11] = uvs[9];
        uvs[12] = uvs[4];
        uvs[13] = uvs[9];
        uvs[14] = uvs[6];
        uvs[15] = uvs[9];

        uvs[16] = uvs[0];
        uvs[17] = (frame.y + frame.height - aabb[2]) / th;
        uvs[18] = uvs[2];
        uvs[19] = uvs[17];
        uvs[20] = uvs[4];
        uvs[21] = uvs[17];
        uvs[22] = uvs[6];
        uvs[23] = uvs[17];

        uvs[24] = uvs[0];
        uvs[25] = (frame.y+frame.height) / th;
        uvs[26] = uvs[2];
        uvs[27] = uvs[25];
        uvs[28] = uvs[4];
        uvs[29] = uvs[25];
        uvs[30] = uvs[6];
        uvs[31] = uvs[25];

     var  vs = this.vertices, 
        offsetY = (this._height<<1)*this._anchor.y,
        offsetX = (this._width<<1  )*this._anchor.x,
       
        x0 = 0  + offsetX  ,
        x1 = aabb[3] + offsetX  ,
        x2 = this._width - aabb[1] + offsetX  ,
        x3 = this._width + offsetX  ,

        y0 = 0                                       +offsetY,
        y1 = aabb[0]                            +offsetY,
        y2 = this._height - aabb[2]    +offsetY,
        y3 = this._height                    +offsetY;

        vs[0] = x0;
        vs[1] = y0;
        vs[2] = x1;
        vs[3] = y0;
        vs[4] = x2;
        vs[5] = y0;
        vs[6] = x3;
        vs[7] = y0;

        vs[8] = x0;
        vs[9] = y1;
        vs[10] = x1;
        vs[11] = y1;
        vs[12] = x2;
        vs[13] = y1;
        vs[14] = x3;
        vs[15] = y1;

        vs[16] = x0;
        vs[17] = y2;
        vs[18] = x1;
        vs[19] = y2;
        vs[20] = x2;
        vs[21] = y2;
        vs[22] = x3;
        vs[23] = y2;

        vs[24] = x0;
        vs[25] = y3;
        vs[26] = x1;
        vs[27] = y3;
        vs[28] = x2;
        vs[29] = y3;
        vs[30] = x3;
        vs[31] = y3;

    this.dirty = true;
};

/**
 * Clear texture UVs when new texture is set
 *
 * @private
 */
ExtSprite.prototype._onTextureUpdate = function ()
{
    if (!this._width)
    {
        this._width = this.texture.frame.width;
    }

    if (!this._height)
    {
        this._height = this.texture.frame.height;
    }
    Mesh.prototype._onTextureUpdate.call(this);
    this.refresh();
};
