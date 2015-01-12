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

var walkDOM = function (node,func) {
    func(node);
    node = node.firstChild;
    while(node) {
        walkDOM(node,func);
        node = node.nextSibling;
    }

};

function onGridLoad(){

    CELL_FULL_WIDTH = $(window).width /12;
    CELL_HALF_OPEN_WIDTH = CELL_FULL_WIDTH - (CELL_FULL_WIDTH) * GUTTER;
    CELL_OPEN_WIDTH = CELL_HALF_OPEN_WIDTH - (CELL_FULL_WIDTH) * GUTTER;

    CELL_FULL_HEIGHT = $(window).height /16;
    CELL_HALF_OPEN_HEIGHT = CELL_FULL_HEIGHT - (CELL_FULL_HEIGHT) * GUTTER;
    CELL_OPEN_HEIGHT = CELL_HALF_OPEN_HEIGHT - (CELL_FULL_HEIGHT) * GUTTER;

    walkDOM(document.body,function(node) {
        readDomNode(node);
    });

}

function readDomNode(node) {
    if (node.classList && node.classList.contains('grid-container')) {
        alert(node.classList);
        processGridContainer(node);

    }

    if (node.classList && node.classList.contains('grid-element')) {
        alert(node.classList);
    }
}

function processGridContainer(node){
    var cols = node.getAttribute('g-cols');
    var rows = node.getAttribute('g-rows');

    node.width = parseInt(cols) * CELL_FULL_WIDTH;
    node.height = parseInt(rows) * CELL_FULL_HEIGHT;


}




this.window.onload = onGridLoad();