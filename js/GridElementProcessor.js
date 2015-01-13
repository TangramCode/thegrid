/**
 * Created by Bartek on 2015-01-13.
 */


var GridElement = function(node){
    var gravity_x = "left";
    var gravity_y = "top";
    var width;
    var height;
    var col_x;
    var col_y;
    var margins = [0,0,0,0];
    var TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT=3;

    var getPixelValue = function(value) {
        return parseInt(value.substring(0, value.length-2));
    };

    var getGravity = function () {
        var gravity = node.getAttribute("g-gravity");
        var res = gravity.split("|");
        gravity_x = res[1];
        gravity_y = res[0];
    };

    var getAttributes = function() {
        width = node.getAttribute("g-width");
        height = node.getAttribute("g-height");
        col_x = node.getAttribute("g-col-x");
        col_y = node.getAttribute("g-col-y");
        console.log(width+"-"+height+"-"+col_x+"-"+col_y);
        var temp_margins = node.getAttribute("g-margins");

        if(temp_margins){
            margins = temp_margins.split(" ");
        }

    };

    var calculateHorizontalGravity = function() {
        if(gravity_x==="left") {
            var left = col_x * CELL_FULL_WIDTH;
            node.style.left = Math.floor(left)+"px";
        }  else if(gravity_x==="right") {
            var right = (node.parentNode.getAttribute("g-cols") - col_x - 1) * CELL_FULL_WIDTH;
            node.style.right = Math.ceil(right)+"px";
        }else if(gravity_x === "center_horizontal"){
            var left = col_x * CELL_FULL_WIDTH - (width * CELL_FULL_WIDTH)/2;
            node.style.left = Math.floor(left)+"px";
        }
    };

    var calculateVerticalGravity = function() {
        if(gravity_y === "top"){
            var top = col_y * CELL_FULL_HEIGHT;
            node.style.top = Math.floor(top)+"px";
        }else if(gravity_y ==="bottom"){
            var bottom = (node.parentNode.getAttribute("g-rows") - col_y - 1) * CELL_FULL_HEIGHT;
            node.style.bottom = Math.ceil(bottom)+"px";
        }else if(gravity_y === "center_vertical"){
            var top = col_y * CELL_FULL_HEIGHT;
            top+= height * CELL_FULL_HEIGHT /2;
            node.style.top = Math.floor(top)+"px";
        }
    };

    var calculateMargins = function() {

        if(node.style.top) {
            var margin = margins[TOP]/100 * window.innerHeight;
            node.style.top = Math.floor(node.offsetTop + margin)+"px";
            if(height!=="auto") {
                node.style.height = Math.floor(node.offsetHeight - 2*margin)+"px";
            }
        }
        if(node.style.bottom) {
            var margin = margins[BOTTOM]/100 * window.innerHeight;
            node.style.bottom = Math.floor(getPixelValue(node.style.bottom) + margin)+"px";
            if(height!=="auto") {
                node.style.height = Math.floor(node.offsetHeight - 2*margin)+"px";
            }
        }

        if(node.style.right) {
            var margin = margins[BOTTOM]/100 * window.innerWidth;
            node.style.right = Math.floor(getPixelValue(node.style.right) + margin)+"px";
            if(width!=="auto") {
                node.style.width = Math.floor(node.offsetWidth - 2*margin)+"px";
            }
        }

        if(node.style.left) {
            var margin = margins[LEFT]/100 * window.innerWidth;
            node.style.left = Math.floor(node.offsetLeft + margin)+"px";
            if(width!=="auto")
                node.style.width = Math.floor(node.offsetWidth - 2*margin)+"px";
        }


    };

    var  calculatePositionAndDimension = function() {
        if(width==="auto")
            node.style.width = "auto";
        else
            node.style.width = Math.floor(width * CELL_FULL_WIDTH)+"px";

        if(height==="auto")
            node.style.height = "auto";
        else
            node.style.height = Math.floor(height * CELL_FULL_HEIGHT)+"px";

        calculateHorizontalGravity();
        calculateVerticalGravity();
        calculateMargins();

    };


    GridElement.prototype.process = function(){
        getGravity();
        getAttributes();
        calculatePositionAndDimension();
    };
};
