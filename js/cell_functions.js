/**
 * Created by mj on 2015-01-12.
 */

var gravity_x = "left";
var gravity_y = "top";
var width;
var node;

function getCellNode(node) {
    this.node = node;
    getGravity();
}

function getGravity() {
    var gravity = node.getAttribute("g-gravity");
    var res = gravity.split("|");
    gravity_x = res[1];
    gravity_y = res[0];
}
