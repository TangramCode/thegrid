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

function getCellNode(node) {
    this.node = node;
    getGravity();
    getAttributes();
    calculatePosition();
}

function getGravity() {
    var gravity = node.getAttribute("g-gravity");
    var res = gravity.split("|");
    gravity_x = res[1];
    gravity_y = res[0];
}

function getAttributes() {
    width = node.getAttribute("g-width") * CELL_FULL_WIDTH;
    width = Math.floor(width);
    height = node.getAttribute("g-height") * CELL_FULL_HEIGHT;
    height = Math.floor(height);
    col_x = node.getAttribute("g-col-x");
    col_y = node.getAttribute("g-col-y");
    console.log(width+"-"+height+"-"+col_x+"-"+col_y);
}

function calculatePosition() {
    var top = col_y * CELL_FULL_HEIGHT;
    var left = col_x * CELL_FULL_WIDTH;
    node.style.top = Math.floor(top)+"px";
    node.style.left = Math.floor(left)+"px";
}
