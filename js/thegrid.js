/**
 * Created by Bartek on 2015-01-09.
 */
var CELL_FULL_WIDTH;

var CELL_FULL_HEIGHT;

var CELL_FULL_HEIGHT;

var VIEWPORT_WIDTH;
var VIEWPORT_HEIGHT;

var ZOOM;

function loadZoom() {
    var zoomFactor = 1;
    if(window.devicePixelRatio !== undefined)
        zoomFactor = window.devicePixelRatio;
    else
        zoomFactor = screen.deviceXDPI / screen.logicalXDPI;
    if(zoomFactor < 1)
        zoomFactor = 1;
    if(ZOOM === zoomFactor)
        return false;
    ZOOM = zoomFactor;
    return true;
}

function loadGrid() {
    VIEWPORT_WIDTH = ZOOM * window.innerWidth;
    VIEWPORT_HEIGHT = ZOOM * window.innerHeight;

    CELL_FULL_WIDTH = 8*ZOOM; //vh
    CELL_FULL_HEIGHT = 6*ZOOM; //vw
}

loadZoom();
loadGrid();

/**
>>>>>>> Stashed changes
 * Created by Bartek on 2015-01-13.
 */


var GridElement = function(node){
    var gravity_x = "left";
    var gravity_y = "top";
    var snap_x = "center";
    var snap_y = "center"
    var width;
    var height;
    var col_x;
    var col_y;
    var is_static = false;
    var paddings = [0,0,0,0];
    var TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT=3;

    var getGravity = function () {
        var gravity = getAttributeOrDefault("g-gravity","top|left");
        var res = gravity.split("|");
        gravity_x = res[1];
        gravity_y = res[0];
    };

    var getDynamicSnap = function() {
        var snapTo = getAttributeOrDefault("g-dynamic-snap","center|center");
        if(snapTo !== null) {
            var res = snapTo.split("|");
            snap_x = res[1];
            snap_y = res[0];
        }

    };

    var getAttributes = function() {
        width = getAttribute("g-width");
        height = getAttribute("g-height");
        col_x = getAttribute("g-col-x");
        col_y = getAttribute("g-col-y");
        var temp_paddings = getAttributeOrDefault("g-paddings",  "0 0 0 0");
        is_static = getAttributeOrDefault("static", false);

        if(temp_paddings){
            paddings = temp_paddings.split(" ");
        }

    };

    var getAttribute = function(attribute){
        var value = node.getAttribute(attribute);
        if (value === null || value === undefined){
            throw new Exception("Error: you should define attribute: "+attribute);
        }

        return value;
    }

    var getAttributeOrDefault = function(attribute, defValue){
        var attr = node.getAttribute(attribute);
       return  (attr === null || attr === undefined || attr ==="")? defValue: attr;
    }

    var calculateHorizontalGravity = function(horizontalGravityOffset) {
        if(width ==='match_window'){
            node.style.left = (-0.02 * VIEWPORT_WIDTH) +'px';
            return;
        }

        if(gravity_x==="left") {
            var left = col_x * CELL_FULL_WIDTH;
            node.style.left = left + horizontalGravityOffset+"vw";
        }  else if(gravity_x==="right") {
            var right = (node.parentNode.getAttribute("g-cols") - col_x - 1) * CELL_FULL_WIDTH;
            node.style.right = right - horizontalGravityOffset+"vw";
        }else if(gravity_x === "center_horizontal"){
            var left = col_x * CELL_FULL_WIDTH - (width * CELL_FULL_WIDTH)/2;
            node.style.left = left + horizontalGravityOffset+"vw";
        }
    };

    var calculateVerticalGravity = function(verticalGravityOffset) {
        if(gravity_y === "top"){
            var top = col_y * CELL_FULL_HEIGHT;
            node.style.top = top + verticalGravityOffset+"vh";
        }else if(gravity_y ==="bottom"){
            var bottom = (node.parentNode.getAttribute("g-rows") - col_y - 1) * CELL_FULL_HEIGHT;
            node.style.bottom = bottom - verticalGravityOffset+"vh";
        }else if(gravity_y === "center_vertical"){
            var top = col_y * CELL_FULL_HEIGHT;
            top+= height * CELL_FULL_HEIGHT /2;
            node.style.top = top + verticalGravityOffset+"vh";
        }
    };

    var calculatePaddings = function(widescreen) {
        var paddingTop;
        var paddingBottom;
        var paddingLeft;
        var paddingRight;

        if(widescreen) {
           var aspect = window.innerWidth / window.innerHeight;
           paddingTop = paddings[TOP];
           paddingBottom = paddings[BOTTOM];
           paddingLeft = 16/9*paddings[LEFT]/aspect;
           paddingRight = 16/9*paddings[RIGHT]/aspect;
        } else {
           var aspect = window.innerHeight / window.innerWidth;
           paddingTop = 9/16*paddings[TOP]/aspect;
           paddingBottom = 9/16*paddings[BOTTOM]/aspect;
           paddingLeft = paddings[LEFT];
           paddingRight = paddings[RIGHT];
        }

        node.style.paddingTop = paddingTop+"vh";
        node.style.paddingRight = paddingRight+"vw";
        node.style.paddingBottom = paddingBottom+"vh";
        node.style.paddingLeft = paddingLeft+"vw";
    };

    var calculateDynamicDimensions = function(dimensions){

        if(dimensions.widescreen) {
            var aspect = window.innerWidth / window.innerHeight;
            dimensions.newWidth = 16/9*CELL_FULL_WIDTH/aspect*width;
        } else {
             var aspect = window.innerHeight / window.innerWidth;
            dimensions.newHeight = 9/16* CELL_FULL_HEIGHT/aspect*height;
        }
        return dimensions;
    }

    var calculateDynamicSnap = function(dimensions) {
        if(snap_y === 'top') {

        } else if(snap_y == 'bottom') {
            dimensions.verticalGravityOffset = height * CELL_FULL_HEIGHT - dimensions.newHeight;
        } else if(snap_y == 'center'){
            dimensions.verticalGravityOffset = (height * CELL_FULL_HEIGHT - dimensions.newHeight)/2;
        }

        if(snap_x === 'left') {

        } else if(snap_x == 'right') {
            dimensions.horizontalGravityOffset = width * CELL_FULL_WIDTH - dimensions.newWidth;
        } else if(snap_x == 'center'){
            dimensions.horizontalGravityOffset = (width * CELL_FULL_WIDTH - dimensions.newWidth)/2;
        }
        return dimensions;
    }

    var  calculatePositionAndDimension = function () {
        var verticalGravityOffset = 0;
        var horizontalGravityOffset = 0;
        var newWidth;

        if(width === 'match_window'){

            newWidth= VIEWPORT_WIDTH;
        }else{
            newWidth = width * CELL_FULL_WIDTH;
        }

        var newHeight = height * CELL_FULL_HEIGHT;

        var dimensions = {"newWidth":newWidth, "newHeight": newHeight,
             "horizontalGravityOffset": horizontalGravityOffset, "verticalGravityOffset":verticalGravityOffset, "widescreen":false};

        if((window.innerWidth / window.innerHeight) >= 16/9)
            dimensions.widescreen =  true;
        else
            dimensions.widescreen = false;

        return dimensions;
    }

    var calculatePositionAndDimensionStatic = function() {
        var dimensions = calculatePositionAndDimension();

        node.style.width = dimensions.newWidth+"vw";
        node.style.height = dimensions.newHeight+"vh";

        calculateHorizontalGravity(dimensions.horizontalGravityOffset);
        calculateVerticalGravity(dimensions.verticalGravityOffset);
        calculatePaddings(dimensions.widescreen);

    };

    var calculatePositionAndDimensionDynamic = function() {

        var dimensions = calculatePositionAndDimension();

        dimensions = calculateDynamicDimensions(dimensions);
        dimensions = calculateDynamicSnap(dimensions);

        node.style.width = dimensions.newWidth+"vw";
        node.style.height = dimensions.newHeight+"vh";

        calculateHorizontalGravity(dimensions.horizontalGravityOffset);
        calculateVerticalGravity(dimensions.verticalGravityOffset);
        calculatePaddings(dimensions.widescreen);

    };

     GridElement.prototype.read = function(){
        getGravity();
        getDynamicSnap();
        getAttributes();
    };

    GridElement.prototype.process = function(isStatic){
        if(isStatic)
            calculatePositionAndDimensionStatic();
        else
            calculatePositionAndDimensionDynamic();
    };
};


var Grid = function() {

    var mouse = {x: 0, y: 0};

    var readDomNode = function(node, isStatic) {
            var element = new GridElement(node);
            element.read();
            element.process(isStatic);
    };

    Grid.prototype.getGridElements = function(isStatic) {
        var elements;
        if(isStatic)
            elements = document.getElementsByClassName("grid-element static");
        else
            elements = document.getElementsByClassName("grid-element dynamic");

        Array.prototype.forEach.call(elements, function(el) {
            readDomNode(el, isStatic);
        });
    }

    Grid.prototype.calculateFontSize = function() {
       if((window.innerWidth / window.innerHeight) >= 16/9) {
        document.getElementsByTagName("html")[0].style.fontSize = VIEWPORT_HEIGHT /76.8+"px";
       } else {
        document.getElementsByTagName("html")[0].style.fontSize = VIEWPORT_WIDTH /136.6+"px";
       }
    };

    Grid.prototype.calculateZoomPosition = function() {
        var scrollX = window.innerWidth / (mouse.x / ZOOM);
        var scrollY = window.innerHeight / (mouse.y / ZOOM);

        window.scrollTo((VIEWPORT_WIDTH - (window.innerWidth )) / scrollX , ((VIEWPORT_HEIGHT - window.innerHeight) )/ scrollY );
        mouse.x = 0;
        mouse.y = 0 ;

    };

    Grid.prototype.install = function(){

        window.onload = function() {
            loadZoom();
            loadGrid();
            grid.calculateFontSize();
            grid.getGridElements(true);
            grid.getGridElements(false);
            grid.calculateZoomPosition();
            document.getElementsByClassName("grid-container")[0].style.visibility = "visible";
        }
        window.onresize = function() {
                var loadStatics = loadZoom();
                loadGrid();
                grid.calculateFontSize();
                grid.getGridElements(false);
                if(loadStatics) {
                    grid.getGridElements(true);
                    grid.calculateZoomPosition();
                }

        }

        if (document.addEventListener) {
            document.addEventListener("mousewheel", MouseWheelHandler, false);
            document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
        }
        else
            document.attachEvent("onmousewheel", MouseWheelHandler);

        function MouseWheelHandler(e) {
            mouse.x = e.pageX;
            mouse.y = e.pageY;
        }
    };
};



