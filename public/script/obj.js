// Overwrite fabric.Object

fabric.Object = fabric.util.createClass(fabric.CommonMethods, {
    id: null, // custom property
    type: 'object',
    originX: 'left',
    originY: 'top',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    flipX: false,
    flipY: false,
    opacity: 1,
    angle: 0,
    skewX: 0,
    skewY: 0,
    cornerSize: 13,
    touchCornerSize: 24,
    transparentCorners: true,
    hoverCursor: null,
    moveCursor: null,
    padding: 3, // change
    borderColor: 'rgb(178,204,255)',
    borderDashArray: null,
    cornerColor: 'rgb(178,204,255)',
    cornerStrokeColor: null,
    cornerStyle: 'circle', //  change from 'rect'
    cornerDashArray: null, // Array specifying dash pattern of an object's control (hasBorder must be true) type array (left-top -> rect?)
    centeredScaling: false,
    centeredRotation: true,
    fill: 'rgb(0,0,0)', // object default color (get color value automatically?)
    fillRule: 'nonzero',
    globalCompositeOperation: 'source-over',
    backgroundColor: '',
    /**
     * Selection Background color of an object. colored layer behind the object when it is active.
     * does not mix good with globalCompositeOperation methods.
     * @type String
     * @default
     */
    selectionBackgroundColor:          '',
    /**
     * When defined, an object is rendered via stroke and this property specifies its color
     * takes css colors https://www.w3.org/TR/css-color-3/
     * @type String
     * @default
     */
    stroke:                   null,
    /**
     * Width of a stroke used to render this object
     * @type Number
     * @default
     */
    strokeWidth:              1,
    /**
     * Array specifying dash pattern of an object's stroke (stroke must be defined)
     * @type Array
     */
    strokeDashArray:          null,
    /**
     * Line offset of an object's stroke
     * @type Number
     * @default
     */
    strokeDashOffset: 0,
    /**
     * Line endings style of an object's stroke (one of "butt", "round", "square")
     * @type String
     * @default
     */
    strokeLineCap:            'butt',
    /**
     * Corner style of an object's stroke (one of "bevil", "round", "miter")
     * @type String
     * @default
     */
    strokeLineJoin:           'miter',
    /**
     * Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke
     * @type Number
     * @default
     */
    strokeMiterLimit: 4,
    shadow: null,
    borderOpacityWhenMoving:  0.4,
    borderScaleFactor:        1,
    minScaleLimit:            0,
    selectable:               true,
    evented: true,
    visible: true, // When set to `false`, an object is not rendered on canvas (use with remove?)
    hasControls: true,
    hasBorders: true,
    /**
     * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
     * @type Boolean
     * @default
     */
    perPixelTargetFind:       false,
    /**
     * When `false`, default object's values are not included in its serialization
     * @type Boolean
     * @default
     */
    includeDefaultValues:     true,
    /**
     * When `true`, object horizontal movement is locked
     * @type Boolean
     * @default
     */
    lockMovementX:            false,
    /**
     * When `true`, object vertical movement is locked
     * @type Boolean
     * @default
     */
    lockMovementY:            false,
    /**
     * When `true`, object rotation is locked
     * @type Boolean
     * @default
     */
    lockRotation:             false,
    /**
     * When `true`, object horizontal scaling is locked
     * @type Boolean
     * @default
     */
    lockScalingX:             false,
    /**
     * When `true`, object vertical scaling is locked
     * @type Boolean
     * @default
     */
    lockScalingY:             false,
    /**
     * When `true`, object horizontal skewing is locked
     * @type Boolean
     * @default
     */
    lockSkewingX:             false,
    /**
     * When `true`, object vertical skewing is locked
     * @type Boolean
     * @default
     */
    lockSkewingY:             false,
    /**
     * When `true`, object cannot be flipped by scaling into negative values
     * @type Boolean
     * @default
     */
    lockScalingFlip:          false,
    /**
     * When `true`, object is not exported in OBJECT/JSON
     * @since 1.6.3
     * @type Boolean
     * @default
     */
    excludeFromExport:        false,
    /**
     * When `true`, object is cached on an additional canvas.
     * When `false`, object is not cached unless necessary ( clipPath )
     * default to true
     * @since 1.7.0
     * @type Boolean
     * @default true
     */
    objectCaching:            objectCaching,
    /**
     * When `true`, object properties are checked for cache invalidation. In some particular
     * situation you may want this to be disabled ( spray brush, very big, groups)
     * or if your application does not allow you to modify properties for groups child you want
     * to disable it for groups.
     * default to false
     * since 1.7.0
     * @type Boolean
     * @default false
     */
    statefullCache:            false,
    /**
     * When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
     * too much and will be redrawn with correct details at the end of scaling.
     * this setting is performance and application dependant.
     * default to true
     * since 1.7.0
     * @type Boolean
     * @default true
     */
    noScaleCache:              true,
    /**
     * When `false`, the stoke width will scale with the object.
     * When `true`, the stroke will always match the exact pixel size entered for stroke width.
     * default to false
     * @since 2.6.0
     * @type Boolean
     * @default false
     * @type Boolean
     * @default false
     */
    strokeUniform:              false,
    /**
     * When set to `true`, object's cache will be rerendered next render call.
     * since 1.7.0
     * @type Boolean
     * @default true
     */
    dirty:                true,
    /**
     * keeps the value of the last hovered corner during mouse move.
     * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
     * It should be private, but there is no harm in using it as
     * a read-only property.
     * @type number|string|any
     * @default 0
     */
    __corner: 0,
    /**
     * Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")
     * @type String
     * @default
     */
    paintFirst:           'fill',
    /**
     * List of properties to consider when checking if state
     * of an object is changed (fabric.Object#hasStateChanged)
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties: (
      'top left width height scaleX scaleY flipX flipY originX originY transformMatrix ' +
      'stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit ' +
      'angle opacity fill globalCompositeOperation shadow visible backgroundColor ' +
      'skewX skewY fillRule paintFirst clipPath strokeUniform'
    ).split(' '),
    /**
     * List of properties to consider when checking if cache needs refresh
     * Those properties are checked by statefullCache ON ( or lazy mode if we want ) or from single
     * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
     * and refreshed at the next render
     * @type Array
     */
    cacheProperties: (
      'fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform' +
      ' strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath'
    ).split(' '),
    /**
     * List of properties to consider for animating colors.
     * @type Array
     */
    colorProperties: (
      'fill stroke backgroundColor'
    ).split(' '),
    /**
     * a fabricObject that, without stroke define a clipping area with their shape. filled in black
     * the clipPath object gets used when the object has rendered, and the context is placed in the center
     * of the object cacheCanvas.
     * If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'
     * @type fabric.Object
     */
    clipPath: undefined,
    /**
     * Meaningful ONLY when the object is used as clipPath.
     * if true, the clipPath will make the object clip to the outside of the clipPath
     * since 2.4.0
     * @type boolean
     * @default false
     */
    inverted: false,
    /**
     * Meaningful ONLY when the object is used as clipPath.
     * if true, the clipPath will have its top and left relative to canvas, and will
     * not be influenced by the object transform. This will make the clipPath relative
     * to the canvas, but clipping just a particular object.
     * WARNING this is beta, this feature may change or be renamed.
     * since 2.4.0
     * @type boolean
     * @default false
     */
    absolutePositioned: false,
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    initialize: function(options) {
      if (options) {
        this.setOptions(options);
      }
    },

        /**
     * Create a the canvas used to keep the cached copy of the object
     * @private
     */
    _createCacheCanvas: function() {
        this._cacheProperties = {};
        this._cacheCanvas = fabric.util.createCanvasElement();
        this._cacheContext = this._cacheCanvas.getContext('2d');
        this._updateCacheCanvas();
        // if canvas gets created, is empty, so dirty.
        this.dirty = true;
      },
      /**
       * Limit the cache dimensions so that X * Y do not cross fabric.perfLimitSizeTotal
       * and each side do not cross fabric.cacheSideLimit
       * those numbers are configurable so that you can get as much detail as you want
       * making bargain with performances.
       * @param {Object} dims
       * @param {Object} dims.width width of canvas
       * @param {Object} dims.height height of canvas
       * @param {Object} dims.zoomX zoomX zoom value to unscale the canvas before drawing cache
       * @param {Object} dims.zoomY zoomY zoom value to unscale the canvas before drawing cache
       * @return {Object}.width width of canvas
       * @return {Object}.height height of canvas
       * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
       * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
       */
      _limitCacheSize: function(dims) {
        var perfLimitSizeTotal = fabric.perfLimitSizeTotal,
            width = dims.width, height = dims.height,
            max = fabric.maxCacheSideLimit, min = fabric.minCacheSideLimit;
        if (width <= max && height <= max && width * height <= perfLimitSizeTotal) {
          if (width < min) {
            dims.width = min;
          }
          if (height < min) {
            dims.height = min;
          }
          return dims;
        }
        var ar = width / height, limitedDims = fabric.util.limitDimsByArea(ar, perfLimitSizeTotal),
            capValue = fabric.util.capValue,
            x = capValue(min, limitedDims.x, max),
            y = capValue(min, limitedDims.y, max);
        if (width > x) {
          dims.zoomX /= width / x;
          dims.width = x;
          dims.capped = true;
        }
        if (height > y) {
          dims.zoomY /= height / y;
          dims.height = y;
          dims.capped = true;
        }
        return dims;
      },
      /**
       * Return the dimension and the zoom level needed to create a cache canvas
       * big enough to host the object to be cached.
       * @private
       * @return {Object}.x width of object to be cached
       * @return {Object}.y height of object to be cached
       * @return {Object}.width width of canvas
       * @return {Object}.height height of canvas
       * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
       * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
       */
      _getCacheCanvasDimensions: function() {
        var objectScale = this.getTotalObjectScaling(),
            // caculate dimensions without skewing
            dim = this._getTransformedDimensions(0, 0),
            neededX = dim.x * objectScale.scaleX / this.scaleX,
            neededY = dim.y * objectScale.scaleY / this.scaleY;
        return {
          // for sure this ALIASING_LIMIT is slightly creating problem
          // in situation in which the cache canvas gets an upper limit
          // also objectScale contains already scaleX and scaleY
          width: neededX + ALIASING_LIMIT,
          height: neededY + ALIASING_LIMIT,
          zoomX: objectScale.scaleX,
          zoomY: objectScale.scaleY,
          x: neededX,
          y: neededY
        };
      },
      /**
       * Update width and height of the canvas for cache
       * returns true or false if canvas needed resize.
       * @private
       * @return {Boolean} true if the canvas has been resized
       */
      _updateCacheCanvas: function() {
        var targetCanvas = this.canvas;
        if (this.noScaleCache && targetCanvas && targetCanvas._currentTransform) {
          var target = targetCanvas._currentTransform.target,
              action = targetCanvas._currentTransform.action;
          if (this === target && action.slice && action.slice(0, 5) === 'scale') {
            return false;
          }
        }
        var canvas = this._cacheCanvas,
            dims = this._limitCacheSize(this._getCacheCanvasDimensions()),
            minCacheSize = fabric.minCacheSideLimit,
            width = dims.width, height = dims.height, drawingWidth, drawingHeight,
            zoomX = dims.zoomX, zoomY = dims.zoomY,
            dimensionsChanged = width !== this.cacheWidth || height !== this.cacheHeight,
            zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY,
            shouldRedraw = dimensionsChanged || zoomChanged,
            additionalWidth = 0, additionalHeight = 0, shouldResizeCanvas = false;
        if (dimensionsChanged) {
          var canvasWidth = this._cacheCanvas.width,
              canvasHeight = this._cacheCanvas.height,
              sizeGrowing = width > canvasWidth || height > canvasHeight,
              sizeShrinking = (width < canvasWidth * 0.9 || height < canvasHeight * 0.9) &&
                canvasWidth > minCacheSize && canvasHeight > minCacheSize;
          shouldResizeCanvas = sizeGrowing || sizeShrinking;
          if (sizeGrowing && !dims.capped && (width > minCacheSize || height > minCacheSize)) {
            additionalWidth = width * 0.1;
            additionalHeight = height * 0.1;
          }
        }
        if (shouldRedraw) {
          if (shouldResizeCanvas) {
            canvas.width = Math.ceil(width + additionalWidth);
            canvas.height = Math.ceil(height + additionalHeight);
          }
          else {
            this._cacheContext.setTransform(1, 0, 0, 1, 0, 0);
            this._cacheContext.clearRect(0, 0, canvas.width, canvas.height);
          }
          drawingWidth = dims.x / 2;
          drawingHeight = dims.y / 2;
          this.cacheTranslationX = Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
          this.cacheTranslationY = Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
          this.cacheWidth = width;
          this.cacheHeight = height;
          this._cacheContext.translate(this.cacheTranslationX, this.cacheTranslationY);
          this._cacheContext.scale(zoomX, zoomY);
          this.zoomX = zoomX;
          this.zoomY = zoomY;
          return true;
        }
        return false;
      },
      /**
       * Sets object's properties from options
       * @param {Object} [options] Options object
       */
      setOptions: function(options) {
        this._setOptions(options);
        this._initGradient(options.fill, 'fill');
        this._initGradient(options.stroke, 'stroke');
        this._initPattern(options.fill, 'fill');
        this._initPattern(options.stroke, 'stroke');
      },
      /**
       * Transforms context when rendering an object
       * @param {CanvasRenderingContext2D} ctx Context
       */
      transform: function(ctx) {
        var needFullTransform = (this.group && !this.group._transformDone) ||
           (this.group && this.canvas && ctx === this.canvas.contextTop);
        var m = this.calcTransformMatrix(!needFullTransform);
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      },
      /**
       * Returns an object representation of an instance
       * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} Object representation of an instance
       */
      toObject: function(propertiesToInclude) {
        var NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS,
            object = {
              type:                     this.type,
              version:                  fabric.version,
              originX:                  this.originX,
              originY:                  this.originY,
              left:                     toFixed(this.left, NUM_FRACTION_DIGITS),
              top:                      toFixed(this.top, NUM_FRACTION_DIGITS),
              width:                    toFixed(this.width, NUM_FRACTION_DIGITS),
              height:                   toFixed(this.height, NUM_FRACTION_DIGITS),
              fill:                     (this.fill && this.fill.toObject) ? this.fill.toObject() : this.fill,
              stroke:                   (this.stroke && this.stroke.toObject) ? this.stroke.toObject() : this.stroke,
              strokeWidth:              toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
              strokeDashArray:          this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
              strokeLineCap:            this.strokeLineCap,
              strokeDashOffset:         this.strokeDashOffset,
              strokeLineJoin:           this.strokeLineJoin,
              // strokeUniform:            this.strokeUniform,
              strokeMiterLimit:         toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
              scaleX:                   toFixed(this.scaleX, NUM_FRACTION_DIGITS),
              scaleY:                   toFixed(this.scaleY, NUM_FRACTION_DIGITS),
              angle:                    toFixed(this.angle, NUM_FRACTION_DIGITS),
              flipX:                    this.flipX,
              flipY:                    this.flipY,
              opacity:                  toFixed(this.opacity, NUM_FRACTION_DIGITS),
              shadow:                   (this.shadow && this.shadow.toObject) ? this.shadow.toObject() : this.shadow,
              visible:                  this.visible,
              backgroundColor:          this.backgroundColor,
              fillRule:                 this.fillRule,
              paintFirst:               this.paintFirst,
              globalCompositeOperation: this.globalCompositeOperation,
              skewX:                    toFixed(this.skewX, NUM_FRACTION_DIGITS),
              skewY:                    toFixed(this.skewY, NUM_FRACTION_DIGITS),
            };
        if (this.clipPath) {
          object.clipPath = this.clipPath.toObject(propertiesToInclude);
          object.clipPath.inverted = this.clipPath.inverted;
          object.clipPath.absolutePositioned = this.clipPath.absolutePositioned;
        }
        fabric.util.populateWithProperties(this, object, propertiesToInclude);
        if (!this.includeDefaultValues) {
          object = this._removeDefaultValues(object);
        }
        return object;
      },
      /**
       * Returns (dataless) object representation of an instance
       * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} Object representation of an instance
       */
      toDatalessObject: function(propertiesToInclude) {
        // will be overwritten by subclasses
        return this.toObject(propertiesToInclude);
      },
      /**
       * @private
       * @param {Object} object
       */
      _removeDefaultValues: function(object) {
        var prototype = fabric.util.getKlass(object.type).prototype,
            stateProperties = prototype.stateProperties;
        stateProperties.forEach(function(prop) {
          if (prop === 'left' || prop === 'top') {
            return;
          }
          if (object[prop] === prototype[prop]) {
            delete object[prop];
          }
          var isArray = Object.prototype.toString.call(object[prop]) === '[object Array]' &&
                        Object.prototype.toString.call(prototype[prop]) === '[object Array]';
          // basically a check for [] === []
          if (isArray && object[prop].length === 0 && prototype[prop].length === 0) {
            delete object[prop];
          }
        });
        return object;
      },
      /**
       * Returns a string representation of an instance
       * @return {String}
       */
      toString: function() {
        return '#<fabric.' + capitalize(this.type) + '>';
      },
      /**
       * Return the object scale factor counting also the group scaling
       * @return {Object} object with scaleX and scaleY properties
       */
      getObjectScaling: function() {
        var options = fabric.util.qrDecompose(this.calcTransformMatrix());
        return { scaleX: Math.abs(options.scaleX), scaleY: Math.abs(options.scaleY) };
      },
      /**
       * Return the object scale factor counting also the group scaling, zoom and retina
       * @return {Object} object with scaleX and scaleY properties
       */
      getTotalObjectScaling: function() {
        var scale = this.getObjectScaling(), scaleX = scale.scaleX, scaleY = scale.scaleY;
        if (this.canvas) {
          var zoom = this.canvas.getZoom();
          var retina = this.canvas.getRetinaScaling();
          scaleX *= zoom * retina;
          scaleY *= zoom * retina;
        }
        return { scaleX: scaleX, scaleY: scaleY };
      },
      /**
       * Return the object opacity counting also the group property
       * @return {Number}
       */
      getObjectOpacity: function() {
        var opacity = this.opacity;
        if (this.group) {
          opacity *= this.group.getObjectOpacity();
        }
        return opacity;
      },
      /**
       * @private
       * @param {String} key
       * @param {*} value
       * @return {fabric.Object} thisArg
       */
      _set: function(key, value) {
        var shouldConstrainValue = (key === 'scaleX' || key === 'scaleY'),
            isChanged = this[key] !== value, groupNeedsUpdate = false;
        if (shouldConstrainValue) {
          value = this._constrainScale(value);
        }
        if (key === 'scaleX' && value < 0) {
          this.flipX = !this.flipX;
          value *= -1;
        }
        else if (key === 'scaleY' && value < 0) {
          this.flipY = !this.flipY;
          value *= -1;
        }
        else if (key === 'shadow' && value && !(value instanceof fabric.Shadow)) {
          value = new fabric.Shadow(value);
        }
        else if (key === 'dirty' && this.group) {
          this.group.set('dirty', value);
        }
        this[key] = value;
        if (isChanged) {
          groupNeedsUpdate = this.group && this.group.isOnACache();
          if (this.cacheProperties.indexOf(key) > -1) {
            this.dirty = true;
            groupNeedsUpdate && this.group.set('dirty', true);
          }
          else if (groupNeedsUpdate && this.stateProperties.indexOf(key) > -1) {
            this.group.set('dirty', true);
          }
        }
        return this;
      },
      /**
       * This callback function is called by the parent group of an object every
       * time a non-delegated property changes on the group. It is passed the key
       * and value as parameters. Not adding in this function's signature to avoid
       * Travis build error about unused variables.
       */
      setOnGroup: function() {
        // implemented by sub-classes, as needed.
      },
      /**
       * Retrieves viewportTransform from Object's canvas if possible
       * @method getViewportTransform
       * @memberOf fabric.Object.prototype
       * @return {Array}
       */
      getViewportTransform: function() {
        if (this.canvas && this.canvas.viewportTransform) {
          return this.canvas.viewportTransform;
        }
        return fabric.iMatrix.concat();
      },
      /*
       * @private
       * return if the object would be visible in rendering
       * @memberOf fabric.Object.prototype
       * @return {Boolean}
       */
      isNotVisible: function() {
        return this.opacity === 0 ||
          (!this.width && !this.height && this.strokeWidth === 0) ||
          !this.visible;
      },
      /**
       * Renders an object on a specified context
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      render: function(ctx) {
        // do not render if width/height are zeros or object is not visible
        if (this.isNotVisible()) {
          return;
        }
        if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
          return;
        }
        ctx.save();
        this._setupCompositeOperation(ctx);
        this.drawSelectionBackground(ctx);
        this.transform(ctx);
        this._setOpacity(ctx);
        this._setShadow(ctx, this);
        if (this.shouldCache()) {
          this.renderCache();
          this.drawCacheOnCanvas(ctx);
        }
        else {
          this._removeCacheCanvas();
          this.dirty = false;
          this.drawObject(ctx);
          if (this.objectCaching && this.statefullCache) {
            this.saveState({ propertySet: 'cacheProperties' });
          }
        }
        ctx.restore();
      },
      renderCache: function(options) {
        options = options || {};
        if (!this._cacheCanvas) {
          this._createCacheCanvas();
        }
        if (this.isCacheDirty()) {
          this.statefullCache && this.saveState({ propertySet: 'cacheProperties' });
          this.drawObject(this._cacheContext, options.forClipping);
          this.dirty = false;
        }
      },
      /**
       * Remove cacheCanvas and its dimensions from the objects
       */
      _removeCacheCanvas: function() {
        this._cacheCanvas = null;
        this.cacheWidth = 0;
        this.cacheHeight = 0;
      },
      /**
       * return true if the object will draw a stroke
       * Does not consider text styles. This is just a shortcut used at rendering time
       * We want it to be an aproximation and be fast.
       * wrote to avoid extra caching, it has to return true when stroke happens,
       * can guess when it will not happen at 100% chance, does not matter if it misses
       * some use case where the stroke is invisible.
       * @since 3.0.0
       * @returns Boolean
       */
      hasStroke: function() {
        return this.stroke && this.stroke !== 'transparent' && this.strokeWidth !== 0;
      },
      /**
       * return true if the object will draw a fill
       * Does not consider text styles. This is just a shortcut used at rendering time
       * We want it to be an aproximation and be fast.
       * wrote to avoid extra caching, it has to return true when fill happens,
       * can guess when it will not happen at 100% chance, does not matter if it misses
       * some use case where the fill is invisible.
       * @since 3.0.0
       * @returns Boolean
       */
      hasFill: function() {
        return this.fill && this.fill !== 'transparent';
      },
      /**
       * When set to `true`, force the object to have its own cache, even if it is inside a group
       * it may be needed when your object behave in a particular way on the cache and always needs
       * its own isolated canvas to render correctly.
       * Created to be overridden
       * since 1.7.12
       * @returns Boolean
       */
      needsItsOwnCache: function() {
        if (this.paintFirst === 'stroke' &&
          this.hasFill() && this.hasStroke() && typeof this.shadow === 'object') {
          return true;
        }
        if (this.clipPath) {
          return true;
        }
        return false;
      },
      /**
       * Decide if the object should cache or not. Create its own cache level
       * objectCaching is a global flag, wins over everything
       * needsItsOwnCache should be used when the object drawing method requires
       * a cache step. None of the fabric classes requires it.
       * Generally you do not cache objects in groups because the group outside is cached.
       * Read as: cache if is needed, or if the feature is enabled but we are not already caching.
       * @return {Boolean}
       */
      shouldCache: function() {
        this.ownCaching = this.needsItsOwnCache() || (
          this.objectCaching &&
          (!this.group || !this.group.isOnACache())
        );
        return this.ownCaching;
      },
      /**
       * Check if this object or a child object will cast a shadow
       * used by Group.shouldCache to know if child has a shadow recursively
       * @return {Boolean}
       */
      willDrawShadow: function() {
        return !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0);
      },
      /**
       * Execute the drawing operation for an object clipPath
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      drawClipPathOnCache: function(ctx) {
        var path = this.clipPath;
        ctx.save();
        // DEBUG: uncomment this line, comment the following
        // ctx.globalAlpha = 0.4
        if (path.inverted) {
          ctx.globalCompositeOperation = 'destination-out';
        }
        else {
          ctx.globalCompositeOperation = 'destination-in';
        }
        //ctx.scale(1 / 2, 1 / 2);
        if (path.absolutePositioned) {
          var m = fabric.util.invertTransform(this.calcTransformMatrix());
          ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        path.transform(ctx);
        ctx.scale(1 / path.zoomX, 1 / path.zoomY);
        ctx.drawImage(path._cacheCanvas, -path.cacheTranslationX, -path.cacheTranslationY);
        ctx.restore();
      },
      /**
       * Execute the drawing operation for an object on a specified context
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      drawObject: function(ctx, forClipping) {
        var originalFill = this.fill, originalStroke = this.stroke;
        if (forClipping) {
          this.fill = 'black';
          this.stroke = '';
          this._setClippingProperties(ctx);
        }
        else {
          this._renderBackground(ctx);
          this._setStrokeStyles(ctx, this);
          this._setFillStyles(ctx, this);
        }
        this._render(ctx);
        this._drawClipPath(ctx);
        this.fill = originalFill;
        this.stroke = originalStroke;
      },
      _drawClipPath: function(ctx) {
        var path = this.clipPath;
        if (!path) { return; }
        // needed to setup a couple of variables
        // path canvas gets overridden with this one.
        // TODO find a better solution?
        path.canvas = this.canvas;
        path.shouldCache();
        path._transformDone = true;
        path.renderCache({ forClipping: true });
        this.drawClipPathOnCache(ctx);
      },
      /**
       * Paint the cached copy of the object on the target context.
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      drawCacheOnCanvas: function(ctx) {
        ctx.scale(1 / this.zoomX, 1 / this.zoomY);
        ctx.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY);
      },
      /**
       * Check if cache is dirty
       * @param {Boolean} skipCanvas skip canvas checks because this object is painted
       * on parent canvas.
       */
      isCacheDirty: function(skipCanvas) {
        if (this.isNotVisible()) {
          return false;
        }
        if (this._cacheCanvas && !skipCanvas && this._updateCacheCanvas()) {
          // in this case the context is already cleared.
          return true;
        }
        else {
          if (this.dirty ||
            (this.clipPath && this.clipPath.absolutePositioned) ||
            (this.statefullCache && this.hasStateChanged('cacheProperties'))
          ) {
            if (this._cacheCanvas && !skipCanvas) {
              var width = this.cacheWidth / this.zoomX;
              var height = this.cacheHeight / this.zoomY;
              this._cacheContext.clearRect(-width / 2, -height / 2, width, height);
            }
            return true;
          }
        }
        return false;
      },
      /**
       * Draws a background for the object big as its untransformed dimensions
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _renderBackground: function(ctx) {
        if (!this.backgroundColor) {
          return;
        }
        var dim = this._getNonTransformedDimensions();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(
          -dim.x / 2,
          -dim.y / 2,
          dim.x,
          dim.y
        );
        // if there is background color no other shadows
        // should be casted
        this._removeShadow(ctx);
      },
      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _setOpacity: function(ctx) {
        if (this.group && !this.group._transformDone) {
          ctx.globalAlpha = this.getObjectOpacity();
        }
        else {
          ctx.globalAlpha *= this.opacity;
        }
      },
      _setStrokeStyles: function(ctx, decl) {
        if (decl.stroke) {
          ctx.lineWidth = decl.strokeWidth;
          ctx.lineCap = decl.strokeLineCap;
          ctx.lineDashOffset = decl.strokeDashOffset;
          ctx.lineJoin = decl.strokeLineJoin;
          ctx.miterLimit = decl.strokeMiterLimit;
          ctx.strokeStyle = decl.stroke.toLive
            ? decl.stroke.toLive(ctx, this)
            : decl.stroke;
        }
      },
      _setFillStyles: function(ctx, decl) {
        if (decl.fill) {
          ctx.fillStyle = decl.fill.toLive
            ? decl.fill.toLive(ctx, this)
            : decl.fill;
        }
      },
      _setClippingProperties: function(ctx) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'transparent';
        ctx.fillStyle = '#000000';
      },
      /**
       * @private
       * Sets line dash
       * @param {CanvasRenderingContext2D} ctx Context to set the dash line on
       * @param {Array} dashArray array representing dashes
       * @param {Function} alternative function to call if browser does not support lineDash
       */
      _setLineDash: function(ctx, dashArray, alternative) {
        if (!dashArray || dashArray.length === 0) {
          return;
        }
        // Spec requires the concatenation of two copies the dash list when the number of elements is odd
        if (1 & dashArray.length) {
          dashArray.push.apply(dashArray, dashArray);
        }
        if (supportsLineDash) {
          ctx.setLineDash(dashArray);
        }
        else {
          alternative && alternative(ctx);
        }
      },
      /**
       * Renders controls and borders for the object
       * @param {CanvasRenderingContext2D} ctx Context to render on
       * @param {Object} [styleOverride] properties to override the object style
       */
      _renderControls: function(ctx, styleOverride) {
        var vpt = this.getViewportTransform(),
            matrix = this.calcTransformMatrix(),
            options, drawBorders, drawControls;
        styleOverride = styleOverride || { };
        drawBorders = typeof styleOverride.hasBorders !== 'undefined' ? styleOverride.hasBorders : this.hasBorders;
        drawControls = typeof styleOverride.hasControls !== 'undefined' ? styleOverride.hasControls : this.hasControls;
        matrix = fabric.util.multiplyTransformMatrices(vpt, matrix);
        options = fabric.util.qrDecompose(matrix);
        ctx.save();
        ctx.translate(options.translateX, options.translateY);
        ctx.lineWidth = 1 * this.borderScaleFactor;
        if (!this.group) {
          ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
        }
        if (styleOverride.forActiveSelection) {
          ctx.rotate(degreesToRadians(options.angle));
          drawBorders && this.drawBordersInGroup(ctx, options, styleOverride);
        }
        else {
          ctx.rotate(degreesToRadians(this.angle));
          drawBorders && this.drawBorders(ctx, styleOverride);
        }
        drawControls && this.drawControls(ctx, styleOverride);
        ctx.restore();
      },
      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _setShadow: function(ctx) {
        if (!this.shadow) {
          return;
        }
        var shadow = this.shadow, canvas = this.canvas, scaling,
            multX = (canvas && canvas.viewportTransform[0]) || 1,
            multY = (canvas && canvas.viewportTransform[3]) || 1;
        if (shadow.nonScaling) {
          scaling = { scaleX: 1, scaleY: 1 };
        }
        else {
          scaling = this.getObjectScaling();
        }
        if (canvas && canvas._isRetinaScaling()) {
          multX *= fabric.devicePixelRatio;
          multY *= fabric.devicePixelRatio;
        }
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur * fabric.browserShadowBlurConstant *
          (multX + multY) * (scaling.scaleX + scaling.scaleY) / 4;
        ctx.shadowOffsetX = shadow.offsetX * multX * scaling.scaleX;
        ctx.shadowOffsetY = shadow.offsetY * multY * scaling.scaleY;
      },
      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _removeShadow: function(ctx) {
        if (!this.shadow) {
          return;
        }
        ctx.shadowColor = '';
        ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
      },
      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       * @param {Object} filler fabric.Pattern or fabric.Gradient
       * @return {Object} offset.offsetX offset for text rendering
       * @return {Object} offset.offsetY offset for text rendering
       */
      _applyPatternGradientTransform: function(ctx, filler) {
        if (!filler || !filler.toLive) {
          return { offsetX: 0, offsetY: 0 };
        }
        var t = filler.gradientTransform || filler.patternTransform;
        var offsetX = -this.width / 2 + filler.offsetX || 0,
            offsetY = -this.height / 2 + filler.offsetY || 0;
        if (filler.gradientUnits === 'percentage') {
          ctx.transform(this.width, 0, 0, this.height, offsetX, offsetY);
        }
        else {
          ctx.transform(1, 0, 0, 1, offsetX, offsetY);
        }
        if (t) {
          ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
        }
        return { offsetX: offsetX, offsetY: offsetY };
      },
      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _renderPaintInOrder: function(ctx) {
        if (this.paintFirst === 'stroke') {
          this._renderStroke(ctx);
          this._renderFill(ctx);
        }
        else {
          this._renderFill(ctx);
          this._renderStroke(ctx);
        }
      },
      /**
       * @private
       * function that actually render something on the context.
       * empty here to allow Obects to work on tests to benchmark fabric functionalites
       * not related to rendering
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _render: function(/* ctx */) {
      },
