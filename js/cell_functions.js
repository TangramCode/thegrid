/**
 * Created by mj on 2015-01-12.
 */

var gravity_x = "left";
var gravity_y = "top";
var width;
var height;
var node;
var col_x;
var col_y;
var margins = [0,0,0,0];
var TOP = 0, RIGHT = 1, BOTTOM = 2, LEFT=3;

function processGridCell(node) {
    this.node = node;
    getGravity();
    getAttributes();
    calculatePositionAndDimension();
}

function getGravity() {
    var gravity = node.getAttribute("g-gravity");
    var res = gravity.split("|");
    gravity_x = res[1];
    gravity_y = res[0];
}

function getAttributes() {
    width = node.getAttribute("g-width");
    height = node.getAttribute("g-height");
    col_x = node.getAttribute("g-col-x");
    col_y = node.getAttribute("g-col-y");
    console.log(width+"-"+height+"-"+col_x+"-"+col_y);
    var temp_margins = node.getAttribute("g-margins");

    if(temp_margins){
        this.margins = temp_margins.split(" ");
    }

}

function calculateHorizontalGravity() {
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
}

function calculateVerticalGravity() {
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
}

function calculateMargins() {
    if(node.style.top) {
        var margin = margins[TOP]/100 * window.innerHeight;
        node.style.top = Math.floor(col_y * CELL_FULL_HEIGHT + margin)+"px";
        if(height!=="auto") {
            node.style.height = Math.floor(height * CELL_FULL_HEIGHT - 2*margin)+"px";
        }

    }
    if(node.style.bottom)
        //TODO:
    if(node.style.top)
        //TODO:
    if(node.style.left) {
        var margin = margins[LEFT]/100 * window.innerWidth;
        node.style.left = Math.floor(col_x * CELL_FULL_WIDTH + margin)+"px";
        if(width!=="auto")
            node.style.width = Math.floor(width * CELL_FULL_WIDTH - 2*margin)+"px";
    }

}

function calculatePositionAndDimension() {
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


}
