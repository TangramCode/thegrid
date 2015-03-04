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
