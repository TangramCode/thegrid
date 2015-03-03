/**
 * Created by mj on 2015-01-12.
 */

var Grid = function() {
    var fontSizeWithoutZoom = 10;
    var readDomNode = function(node) {
        if (node.classList && node.classList.contains('grid-container')) {
            var container = new Container(node);
            container.processGridContainer();
        }

        if (node.classList && node.classList.contains('grid-element')) {
            var element = new GridElement(node);
            element.process(fontSizeWithoutZoom);
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
        var zoomFactor = 1;
        if(window.devicePixelRatio !== undefined)
            zoomFactor = window.devicePixelRatio;
        else
            zoomFactor = screen.deviceXDPI / screen.logicalXDPI;

        var fontSize = 0;
        if(CELL_FULL_WIDTH/CELL_FULL_HEIGHT < HORIZONTAL_RATIO)
            fontSize = window.innerWidth /136.6;
        else
            fontSize = window.innerHeight /76.8;
        fontSizeWithoutZoom = fontSize;
        document.getElementsByTagName("html")[0].style.fontSize = (fontSize * zoomFactor)+"px";
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


