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


