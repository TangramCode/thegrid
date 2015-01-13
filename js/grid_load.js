/**
 * Created by mj on 2015-01-12.
 */

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
    }

    Grid.prototype.walkDOM = function (node) {
        readDomNode(node);
        node = node.firstChild;
        while(node) {
            Grid.prototype.walkDOM(node);
            node = node.nextSibling;
        }
    };
};

var Container = function(node) {
    this.node = node;

    Container.prototype.processGridContainer = function() {
        var cols = this.node.getAttribute('g-cols');
        var rows = this.node.getAttribute('g-rows');

        this.node.width = parseInt(cols) * CELL_FULL_WIDTH;
        this.node.height = parseInt(rows) * CELL_FULL_HEIGHT;
    };
};

var grid = new Grid();

this.window.onload = function() {
    grid.walkDOM(document.body);
};

this.window.onresize = function() {
    grid.walkDOM(document.body);
}