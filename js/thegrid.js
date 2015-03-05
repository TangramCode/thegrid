/**
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

    var getPixelValue = function(value) {
        return parseInt(value.substring(0, value.length-2));
    };

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
        is_static = getAttributeOrDefault("static", true);

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
            node.style.left = Math.floor(left + horizontalGravityOffset)+"px";
        }  else if(gravity_x==="right") {
            var right = (node.parentNode.getAttribute("g-cols") - col_x - 1) * CELL_FULL_WIDTH;
            node.style.right = Math.ceil(right - horizontalGravityOffset)+"px";
        }else if(gravity_x === "center_horizontal"){
            var left = col_x * CELL_FULL_WIDTH - (width * CELL_FULL_WIDTH)/2;
            node.style.left = Math.floor(left + horizontalGravityOffset)+"px";
        }
    };

    var calculateVerticalGravity = function(verticalGravityOffset) {
        if(gravity_y === "top"){
            var top = col_y * CELL_FULL_HEIGHT;
            node.style.top = Math.floor(top + verticalGravityOffset)+"px";
        }else if(gravity_y ==="bottom"){
            var bottom = (node.parentNode.getAttribute("g-rows") - col_y - 1) * CELL_FULL_HEIGHT;
            node.style.bottom = Math.ceil(bottom - verticalGravityOffset)+"px";
        }else if(gravity_y === "center_vertical"){
            var top = col_y * CELL_FULL_HEIGHT;
            top+= height * CELL_FULL_HEIGHT /2;
            node.style.top = Math.floor(top + verticalGravityOffset)+"px";
        }
    };

    var calculatePaddings = function(widescreen) {
        var paddingTop;
        var paddingBottom;
        var paddingLeft;
        var paddingRight;

        if(widescreen) {
           paddingTop = paddings[TOP]/100 *  VIEWPORT_HEIGHT;
           paddingBottom = paddings[BOTTOM]/100 * VIEWPORT_HEIGHT;
           paddingLeft = paddings[LEFT]/100 *  VIEWPORT_HEIGHT/9*16;
           paddingRight = paddings[RIGHT]/100 *  VIEWPORT_HEIGHT/9*16;
        } else {
           paddingTop = paddings[TOP]/100 * VIEWPORT_WIDTH/16*9;
           paddingBottom = paddings[BOTTOM]/100 * VIEWPORT_WIDTH/16*9;
           paddingLeft = paddings[LEFT]/100 * VIEWPORT_WIDTH;
           paddingRight = paddings[RIGHT]/100 * VIEWPORT_WIDTH;
        }

        node.style.paddingTop = paddingTop+"px";
        node.style.paddingRight = paddingRight+"px";
        node.style.paddingBottom = paddingBottom+"px";
        node.style.paddingLeft = paddingLeft+"px";
    };

    var  calculatePositionAndDimension = function() {
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

        if(CELL_FULL_WIDTH/CELL_FULL_HEIGHT >= 2.37)
            dimensions.widescreen =  true;
        else
            dimensions.widescreen = false;

        if(!is_static){
            dimensions = calculateDynamicDimensions(dimensions);
            dimensions = calculateDynamicSnap(dimensions);
        }

        node.style.width = Math.floor(dimensions.newWidth)+"px";
        node.style.height = Math.floor(dimensions.newHeight)+"px";

        calculateHorizontalGravity(dimensions.horizontalGravityOffset);
        calculateVerticalGravity(dimensions.verticalGravityOffset);
        calculatePaddings(dimensions.widescreen);

    };

    var calculateDynamicDimensions = function(dimensions){

        if(dimensions.widescreen) {
            dimensions.newWidth = CELL_FULL_HEIGHT*HORIZONTAL_RATIO*width;

        } else {
            dimensions.newHeight = CELL_FULL_WIDTH*VERTICAL_RATIO*height;
        }
        return dimensions;
    }

    var calculateDynamicSnap = function(dimensions) {
        if(snap_y === 'top') {

        } else if(snap_y == 'bottom') {
            dimensions.verticalGravityOffset = Math.floor(height * CELL_FULL_HEIGHT - dimensions.newHeight);
        } else if(snap_y == 'center'){
            dimensions.verticalGravityOffset = Math.floor((height * CELL_FULL_HEIGHT - dimensions.newHeight)/2);
        }

        if(snap_x === 'left') {

        } else if(snap_x == 'right') {
            dimensions.horizontalGravityOffset = Math.floor(width * CELL_FULL_WIDTH - dimensions.newWidth);
        } else if(snap_x == 'center'){
            dimensions.horizontalGravityOffset = Math.floor((width * CELL_FULL_WIDTH - dimensions.newWidth)/2);
        }
        return dimensions;
    }

    GridElement.prototype.process = function(){
        getGravity();
        getDynamicSnap();
        getAttributes();
        calculatePositionAndDimension();
    };
};


var Grid = function() {

    var readDomNode = function(node) {
        if (node.classList && node.classList.contains('grid-container')) {
            var container = new Container(node);
            container.processGridContainer();
        }

        if (node.classList && node.classList.contains('grid-element')) {
            var element = new GridElement(node);
            element.process();
        }
    };

    Grid.prototype.walkDOM = function (node) {
        readDomNode(node);
        node = node.firstChild;
        while(node) {
            Grid.prototype.walkDOM(node);
            node = node.nextSibling;
        }
    };

    Grid.prototype.calculateFontSize = function() {
       if(CELL_FULL_WIDTH/CELL_FULL_HEIGHT < HORIZONTAL_RATIO) {
         document.getElementsByTagName("html")[0].style.fontSize = VIEWPORT_WIDTH /136.6+"px";
       } else {
         document.getElementsByTagName("html")[0].style.fontSize = VIEWPORT_HEIGHT /76.8+"px";
       }
    };

    Grid.prototype.calculateZoomPosition = function() {
    var scrollX = window.innerWidth / (mouse.x / ZOOM);
    var scrollY = window.innerHeight / (mouse.y / ZOOM);

    window.scrollTo((VIEWPORT_WIDTH - (window.innerWidth )) / scrollX , ((VIEWPORT_HEIGHT - window.innerHeight) )/ scrollY );
    mouse.x = 0;
    mouse.y = 0 ;

    };
};

var Container = function(node) {

    Container.prototype.processGridContainer = function() {
        var cols = node.getAttribute('g-cols');
        var rows = node.getAttribute('g-rows');

        node.width = parseInt(cols) * CELL_FULL_WIDTH;
        node.height = parseInt(rows) * CELL_FULL_HEIGHT;
    };
};

/**
 * Created by Bartek on 2015-01-09.
 */
var CELL_FULL_WIDTH;
var CELL_HALF_OPEN_WIDTH;
var CELL_OPEN_WIDTH;

var CELL_FULL_HEIGHT;
var CELL_HALF_OPEN_HEIGHT;
var CELL_OPEN_HEIGHT;

var GUTTER = 0.05;

var HORIZONTAL_RATIO = 2.37037;
var VERTICAL_RATIO = 0.421875;

var VIEWPORT_WIDTH;
var VIEWPORT_HEIGHT;

var ZOOM;

function onGridLoad(){
    var zoomFactor = 1;
    if(window.devicePixelRatio !== undefined)
        zoomFactor = window.devicePixelRatio;
    else
        zoomFactor = screen.deviceXDPI / screen.logicalXDPI;
    if(zoomFactor < 1)
        zoomFactor = 1;

    ZOOM = zoomFactor;

    VIEWPORT_WIDTH = zoomFactor * window.innerWidth;
    VIEWPORT_HEIGHT = zoomFactor * window.innerHeight;

    CELL_FULL_WIDTH = VIEWPORT_WIDTH * 0.96 /12;
    CELL_HALF_OPEN_WIDTH = CELL_FULL_WIDTH - (CELL_FULL_WIDTH) * GUTTER;
    CELL_OPEN_WIDTH = CELL_HALF_OPEN_WIDTH - (CELL_FULL_WIDTH) * GUTTER;

    CELL_FULL_HEIGHT = VIEWPORT_HEIGHT * 0.96 /16;
    CELL_HALF_OPEN_HEIGHT = CELL_FULL_HEIGHT - (CELL_FULL_HEIGHT) * GUTTER;
    CELL_OPEN_HEIGHT = CELL_HALF_OPEN_HEIGHT - (CELL_FULL_HEIGHT) * GUTTER;

}

onGridLoad(); //initial load
