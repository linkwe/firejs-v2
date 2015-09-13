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



function InteractionData()
{
    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @member {Point}
     */
    this.global = new core.Point();


    this.start = new core.Point();

    /**
     * The target Sprite that was interacted with
     *
     * @member {Sprite}
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @member {Event}
     */
    this.originalEvent = null;


    this.stopped = false;

    this.type = null;
      
}

InteractionData.prototype.constructor = InteractionData;

/**
 * This will return the local coordinates of the specified displayObject for this InteractionData
 *
 * @param displayObject {DisplayObject} The DisplayObject that you would like the local coords off
 * @param [point] {Point} A Point object in which to store the value, optional (otherwise will create a new point)
 * param [globalPos] {Point} A Point object containing your custom global coords, optional (otherwise will use the current global coords)
 * @return {Point} A point containing the coordinates of the InteractionData position relative to the DisplayObject
 */
InteractionData.prototype.getLocalPosition = function (displayObject, point, globalPos)
{
    var worldTransform = displayObject.worldTransform;
    var global = globalPos ? globalPos : this.global;

    var a00 = worldTransform.a, a01 = worldTransform.c, a02 = worldTransform.tx,
        a10 = worldTransform.b, a11 = worldTransform.d, a12 = worldTransform.ty,
        id = 1 / (a00 * a11 + a01 * -a10);

    point = point || new core.Point();

    point.x = a11 * id * global.x + -a01 * id * global.x + (a12 * a01 - a02 * a11) * id;
    point.y = a00 * id * global.y + -a10 * id * global.y + (-a12 * a00 + a02 * a10) * id;

    return point;
};


InteractionData.prototype.stopPropagation = function ()
{
   this.stopped = true ;
};

/**
 * The interaction manager deals with mouse and touch events. Any DisplayObject can be interactive
 * if its interactive parameter is set to true
 * This manager also supports multitouch.
 * 
 * @class
 * @memberof PIXI.interaction
 * @param renderer {CanvasRenderer|WebGLRenderer} A reference to the current renderer
 * @param [options] { object }
 * @param [options.autoPreventDefault=true] {boolean} Should the manager automatically prevent default browser actions.
 * @param [options.interactionFrequency=10] {number} Frequency increases the interaction events will be checked.
 */
function InteractionManager(renderer, options)
{
    options = options || {};

    /**
     * The renderer this interaction manager works for.
     *
     * @member {SystemRenderer}
     */
    this.renderer = renderer;


    this.rocuo = 8;

    /**
     * Should default browser actions automatically be prevented.
     *
     * @member {boolean}
     * @default true
     */
    this.autoPreventDefault = options.autoPreventDefault !== undefined ? options.autoPreventDefault : true;

    /**
     * As this frequency increases the interaction events will be checked more often.
     *
     * @member {number}
     * @default 10
     */
    this.interactionFrequency = options.interactionFrequency || 10;

    /**
     * An event data object to handle all the event tracking/dispatching
     *
     * @member {EventData}
     */
    this.eventData = new InteractionData();

    this.touchPool = [];


    /**
     * Tiny little interactiveData pool !
     *
     * @member {Array}
     */
    this.interactiveDataPool = [];


    /**
     * The DOM element to bind to.
     *
     * @member {HTMLElement}
     * @private
     */
    this.interactionDOMElement = null;

    /**
     * Have events been attached to the dom element?
     *
     * @member {boolean}
     * @private
     */
    this.eventsAdded = false;

    //this will make it so that you don't have to call bind all the time

    /**
     * @member {Function}
     */
    this.onMouseUp = this.onMouseUp.bind(this);
    // this.processMouseUp = this.processMouseUp.bind( this );


    /**
     * @member {Function}
     */
    this.onMouseDown = this.onMouseDown.bind(this);
    // this.processMouseDown = this.processMouseDown.bind( this );

    /**
     * @member {Function}
     */
    this.onMouseMove = this.onMouseMove.bind( this );
    // this.processMouseMove = this.processMouseMove.bind( this );

    /**
     * @member {Function}
     */
    this.onMouseOut = this.onMouseOut.bind(this);
    // this.processMouseOverOut = this.processMouseOverOut.bind( this );


    /**
     * @member {Function}
     */
    this.onTouchStart = this.onTouchStart.bind(this);
    // this.processTouchStart = this.processTouchStart.bind(this);

    /**
     * @member {Function}
     */
    this.onTouchEnd = this.onTouchEnd.bind(this);
    // this.processTouchEnd = this.processTouchEnd.bind(this);

    /**
     * @member {Function}
     */
    this.onTouchMove = this.onTouchMove.bind(this);
    // this.processTouchMove = this.processTouchMove.bind(this);

    /**
     * @member {number}
     */
    this.last = 0;

    /**
     * The css style of the cursor that is being used
     * @member {string}
     */
    this.currentCursorStyle = 'inherit';

    /**
     * Internal cached var
     * @member {Point}
     * @private
     */
    this._tempPoint = new core.Point();

    /**
     * The current resolution
     * @member {number}
     */
    this.resolution = 1;

    this.setTargetElement(this.renderer.view, this.renderer.resolution);
}

InteractionManager.prototype.constructor = InteractionManager;
module.exports = InteractionManager;

/**
 * Sets the DOM element which will receive mouse/touch events. This is useful for when you have
 * other DOM elements on top of the renderers Canvas element. With this you'll be bale to deletegate
 * another DOM element to receive those events.
 *
 * @param element {HTMLElement} the DOM element which will receive mouse and touch events.
 * @param [resolution=1] {number} THe resolution of the new element (relative to the canvas).
 * @private
 */
InteractionManager.prototype.setTargetElement = function (element, resolution)
{
    this.removeEvents();

    this.interactionDOMElement = element;

    this.resolution = resolution || 1;

    this.rocuo = this.resolution * 8 ;

    this.addEvents();
};

/**
 * Registers all the DOM events
 * @private
 */
InteractionManager.prototype.addEvents = function ()
{
    if (!this.interactionDOMElement)
    {
        return;
    }

    // core.ticker.shared.add(this.update, this);

    if (window.navigator.msPointerEnabled)
    {
        this.interactionDOMElement.style['-ms-content-zooming'] = 'none';
        this.interactionDOMElement.style['-ms-touch-action'] = 'none';
    }

    window.document.addEventListener('mousemove',    this.onMouseMove, true);
    this.interactionDOMElement.addEventListener('mousedown',    this.onMouseDown, true);
    this.interactionDOMElement.addEventListener('mouseout',     this.onMouseOut, true);

    this.interactionDOMElement.addEventListener('touchstart',   this.onTouchStart, true);
    this.interactionDOMElement.addEventListener('touchend',     this.onTouchEnd, true);
    this.interactionDOMElement.addEventListener('touchmove',    this.onTouchMove, true);

    window.addEventListener('mouseup',  this.onMouseUp, true);

    this.eventsAdded = true;
};

/**
 * Removes all the DOM events that were previously registered
 * @private
 */
InteractionManager.prototype.removeEvents = function ()
{
    if (!this.interactionDOMElement)
    {
        return;
    }

    // core.ticker.shared.remove(this.update);

    if (window.navigator.msPointerEnabled)
    {
        this.interactionDOMElement.style['-ms-content-zooming'] = '';
        this.interactionDOMElement.style['-ms-touch-action'] = '';
    }

    window.document.removeEventListener('mousemove', this.onMouseMove, true);
    this.interactionDOMElement.removeEventListener('mousedown', this.onMouseDown, true);
    this.interactionDOMElement.removeEventListener('mouseout',  this.onMouseOut, true);

    this.interactionDOMElement.removeEventListener('touchstart', this.onTouchStart, true);
    this.interactionDOMElement.removeEventListener('touchend',  this.onTouchEnd, true);
    this.interactionDOMElement.removeEventListener('touchmove', this.onTouchMove, true);

    this.interactionDOMElement = null;

    window.removeEventListener('mouseup',  this.onMouseUp, true);

    this.eventsAdded = false;
};

/**
 * Updates the state of interactive objects.
 * Invoked by a throttled ticker update from
 * {@link PIXI.ticker.shared}.
 *
 * @param deltaTime {number}
 */
InteractionManager.prototype.update = function (deltaTime)
{
    this._deltaTime += deltaTime;

    if (this._deltaTime < this.interactionFrequency)
    {
        return;
    }

    this._deltaTime = 0;

    if (!this.interactionDOMElement)
    {
        return;
    }

    // if the user move the mouse this check has already been dfone using the mouse move!
    if(this.didMove)
    {
        this.didMove = false;
        return;
    }

    this.cursor = 'inherit';

    this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseOverOut, true );

    if (this.currentCursorStyle !== this.cursor)
    {
        this.currentCursorStyle = this.cursor;
        this.interactionDOMElement.style.cursor = this.cursor;
    }

    //TODO
};

/**
 * Dispatches an event on the display object that was interacted with
 * @param displayObject {Container|Sprite|TilingSprite} the display object in question
 * @param eventString {string} the name of the event (e.g, mousedown)
 * @param eventData {EventData} the event data object
 * @private
 */
InteractionManager.prototype.dispatchEvent = function ( displayObject, eventString, eventData )
{
    // if(!eventData.stopped)
    // {
    //     eventData.target = displayObject;
    //     eventData.type = eventString;

    //     displayObject.emit( eventString, eventData );

    //     if( displayObject[eventString] )
    //     {
    //         displayObject[eventString]( eventData );
    //     }
    // }
};

/**
 * Maps x and y coords from a DOM object and maps them correctly to the pixi view. 
 * The resulting value is stored in the point.
 * This takes into account the fact that the DOM element could be scaled and positioned anywhere on the screen.
 * @param  {Point} point the point that the result will be stored in
 * @param  {number} x     the x coord of the position to map
 * @param  {number} y     the y coord of the position to map
 */
InteractionManager.prototype.mapPositionToPoint = function ( point, x, y )
{
    var rect = this.interactionDOMElement.getBoundingClientRect();
    point.x = ( ( x - rect.left ) * (this.interactionDOMElement.width  / rect.width  ) ) / this.resolution;
    point.y = ( ( y - rect.top  ) * (this.interactionDOMElement.height / rect.height ) ) / this.resolution;
};

/**
 * This function is provides a neat way of crawling through the scene graph and running a specified function on all interactive objects it finds.
 * It will also take care of hit testing the interactive objects and passes the hit across in the function.
 *
 * @param  {Point} point the point that is tested for collision
 * @param  {Container|Sprite|TilingSprite} displayObject the displayObject that will be hit test (recurcsivly crawls its children)
 * @param  {function} func the function that will be called on each interactive object. The displayObject and hit will be passed to the function
 * @param  {boolean} hitTest this indicates if the objects inside should be hit test against the point
 * @return {boolean} returns true if the displayObject hit the point
 */
InteractionManager.prototype.processInteractive = function ( evdate, evname)
{
    if(!displayObject.enabled)
    {
        return false;
    }

    evdate.type = evname;

    this.renderer._lastObjectRendered.interaction(evname,evdate);

};




/**
 * Is called when the mouse button is pressed down on the renderer element
 *
 * @param event {Event} The DOM event of a mouse button being pressed down
 * @private
 */
InteractionManager.prototype.onMouseDown = function (event)
{
    this.eventData.originalEvent = event;
    this.eventData.stopped = false;

    // Update internal mouse reference
    this.mapPositionToPoint( this.eventData.global, event.clientX, event.clientY);

    this.eventData.start.x  = this.eventData.global.x;
    this.eventData.start.y  = this.eventData.global.y;

    if (this.autoPreventDefault)
    {
        this.eventData.originalEvent.preventDefault();
    }

    var isRightButton = event.button === 2 || event.which === 3;
    var isDown =  isRightButton ? 'mousedown' : 'mouseldown';

    this.processInteractive( this.eventData, isDown );

};

/**
 * Is called when the mouse button is released on the renderer element
 *
 * @param event {Event} The DOM event of a mouse button being released
 * @private
 */
InteractionManager.prototype.onMouseUp = function (event)
{
    this.eventData.originalEvent = event;
    this.eventData.stopped = false;

    // Update internal mouse reference
    this.mapPositionToPoint( this.eventData.global, event.clientX, event.clientY);

    var isRightButton = event.button === 2 || event.which === 3;
        isDown =  isRightButton ? 'mouseup' : 'mouselup' ;

    this.processInteractive( this.eventData, isDown );

    var _x = this.eventData.global.x - this.eventData.start.x,
        _y = this.eventData.global.y - this.eventData.start.y;

    if(  Math.pow(_x*_x+_y*_y,.5) < this.rocuo)
    this.processInteractive( this.eventData, 'click' );
    

};


/**
 * Is called when the mouse moves across the renderer element
 *
 * @param event {Event} The DOM event of the mouse moving
 * @private
 */
InteractionManager.prototype.onMouseMove = function (event)
{
    this.eventData.originalEvent = event;
    this.eventData.stopped = false;

    this.mapPositionToPoint( this.eventData.global, event.clientX, event.clientY);

    this.didMove = true;

    this.cursor = 'inherit';

    this.processInteractive( this.eventData, 'mousemove' );

    if (this.currentCursorStyle !== this.cursor)
    {
        this.currentCursorStyle = this.cursor;
        this.interactionDOMElement.style.cursor = this.cursor;
    }

    //TODO BUG for parents ineractive object (border order issue)
};



/**
 * Is called when the mouse is moved out of the renderer element
 *
 * @param event {Event} The DOM event of a mouse being moved out
 * @private
 */
InteractionManager.prototype.onMouseOut = function (event)
{
    this.eventData.originalEvent = event;
    this.eventData.stopped = false;

    // Update internal mouse reference
    this.mapPositionToPoint( this.eventData.global, event.clientX, event.clientY);

    this.interactionDOMElement.style.cursor = 'inherit';

    // TODO optimize by not check EVERY TIME! maybe half as often? //
    this.mapPositionToPoint( this.mouse.global, event.clientX, event.clientY );

    this.processInteractive( this.eventData, 'mouseout' );
};

/**
 * Processes the result of the mouse over/out check and dispatches the event if need be
 *
 * @param displayObject {Container|Sprite|TilingSprite} The display object that was tested
 * @param hit {boolean} the result of the hit test on the display object
 * @private
 */
InteractionManager.prototype.processMouseOverOut = function ( displayObject, hit )
{
    // if(hit)
    // {
    //     if(!displayObject._over)
    //     {
    //         displayObject._over = true;
    //         this.dispatchEvent( displayObject, 'mouseover', this.eventData );
    //     }

    //     if (displayObject.buttonMode)
    //     {
    //         this.cursor = displayObject.defaultCursor;
    //     }
    // }
    // else
    // {
    //     if(displayObject._over)
    //     {
    //         displayObject._over = false;
    //         this.dispatchEvent( displayObject, 'mouseout', this.eventData);
    //     }
    // }
};


/**
 * Is called when a touch is started on the renderer element
 *
 * @param event {Event} The DOM event of a touch starting on the renderer view
 * @private
 */
InteractionManager.prototype.onTouchStart = function (event)
{
    if (this.autoPreventDefault)
    {
        event.preventDefault();
    }

    var changedTouches = event.changedTouches;
    var cLength = changedTouches.length, _x, _y;

    for (var i=0; i < cLength; i++)
    {

        var touchEvent = changedTouches[i];

        var touchData = this.getTouchData( touchEvent );

        touchData.originalEvent = event;
        touchData.stopped = false;

        touchEvent.startX = touchEvent.globalX;
        touchEvent.startY = touchEvent.globalY;

        this.processInteractive( touchData, 'touchstart');

        this.returnTouchData( touchData );
    }
};


/**
 * Is called when a touch ends on the renderer element
 * @param event {Event} The DOM event of a touch ending on the renderer view
 *
 */
InteractionManager.prototype.onTouchEnd = function (event)
{
    if (this.autoPreventDefault)
    {
        event.preventDefault();
    }

    var changedTouches = event.changedTouches;
    var cLength = changedTouches.length , _x , _y;

    for (var i=0; i < cLength; i++)
    {
        var touchEvent = changedTouches[i];

        var touchData = this.getTouchData( touchEvent );

        touchData.originalEvent = event;
        touchData.stopped = false;

        this.processInteractive( touchData, 'touchend' );

        _x = touchEvent.globalX - touchEvent.startX ;
        _y = touchEvent.globalY - touchEvent.startY ;

        if(  Math.pow(_x*_x+_y*_y,.5) < this.rocuo)
        this.processInteractive( touchData, 'tap' );

        this.returnTouchData( touchData );
    }
};



/**
 * Is called when a touch is moved across the renderer element
 *
 * @param event {Event} The DOM event of a touch moving across the renderer view
 * @private
 */
InteractionManager.prototype.onTouchMove = function (event)
{
    if (this.autoPreventDefault)
    {
        event.preventDefault();
    }

    var changedTouches = event.changedTouches;
    var cLength = changedTouches.length;

    for (var i=0; i < cLength; i++)
    {
        var touchEvent = changedTouches[i];

        var touchData = this.getTouchData( touchEvent );

        touchData.originalEvent = event;
        touchData.stopped = false;

        this.processInteractive( touchData, 'touchmove' );

        this.returnTouchData( touchData );
    }
};



/**
 * Grabs an interaction data object from the internal pool
 *
 * @param touchEvent {EventData} The touch event we need to pair with an interactionData object
 *
 * @private
 */
InteractionManager.prototype.getTouchData = function ( touchEvent , id )
{

    var touchData = this.interactiveDataPool.pop();


    // var touchData = this.touchPool[id] ;


     // || this.interactiveDataPool.pop();

    if(!touchData)
    {
        touchData = new InteractionData();
        // this.touchPool[id] = touchData;
    }

    touchData.identifier = touchEvent.identifier;
    this.mapPositionToPoint( touchData.global, touchEvent.clientX, touchEvent.clientY );

    if(navigator.isCocoonJS)
    {
        touchData.global.x = touchData.global.x / this.resolution;
        touchData.global.y = touchData.global.y / this.resolution;
    }

    touchEvent.globalX = touchData.global.x;
    touchEvent.globalY = touchData.global.y;

    return touchData;
};

/**
 * Returns an interaction data object to the internal pool
 *
 * @param touchData {InteractionData} The touch data object we want to return to the pool
 *
 * @private
 */
InteractionManager.prototype.returnTouchData = function ( touchData )
{
    this.interactiveDataPool.push( touchData );
};

/**
 * Destroys the interaction manager
 */
InteractionManager.prototype.destroy = function () {

    this.removeEvents();

    this.renderer = null;

    this.mouse = null;

    this.eventData = null;

    this.interactiveDataPool = null;

    this.interactionDOMElement = null;

    this.onMouseUp = null;
    this.processMouseUp = null;


    this.onMouseDown = null;
    this.processMouseDown = null;

    this.onMouseMove = null;
    this.processMouseMove = null;

    this.onMouseOut = null;
    this.processMouseOverOut = null;


    this.onTouchStart = null;
    this.processTouchStart = null;

    this.onTouchEnd = null;
    this.processTouchEnd = null;

    this.onTouchMove = null;
    this.processTouchMove = null;

    this._tempPoint = null;

};

core.WebGLRenderer.registerPlugin('interaction', InteractionManager);
core.CanvasRenderer.registerPlugin('interaction', InteractionManager);
