/**
 * Created by mj on 2015-01-12.
 */

var walkDOM = function (node,func) {
    func(node);
    node = node.firstChild;
    while(node) {
        walkDOM(node,func);
        node = node.nextSibling;
    }

};

function processGridContainer(node){
    var cols = node.getAttribute('g-cols');
    var rows = node.getAttribute('g-rows');

    node.width = parseInt(cols) * CELL_FULL_WIDTH;
    node.height = parseInt(rows) * CELL_FULL_HEIGHT;


}

function readDomNode(node) {

    if (node.classList && node.classList.contains('grid-container')) {
        //alert(node.classList);
        processGridContainer(node);

    }

    if (node.classList && node.classList.contains('grid-element')) {
        var processor = new GridElementProcessor(node);
        processor.process();
    }
}



this.window.onload = walkDOM(document.body,function(node) {
    readDomNode(node);
});

this.window.onresize = function() {
    onGridLoad(); //reaload
    walkDOM(document.body,function(node) {
        readDomNode(node);
    });
}