var points = []; // for effects other than circles
var filter = 0; // filter index pointer
var initialised = false; // if there's a way to sync the init better, i'll change this

// 1. create filters as standalone objects
// FILTER 0: circles
var circles = {
    sizes: [],
    shapes: [],
    initialised: false,
    init: function (points) {
        var radius = 30;
        for (var i = 0; i < points.length; i++) {
            var circle = new Path.Circle(points[i], radius);
            this.sizes.push(1);
            this.shapes.push(circle);
        }
        this.initialised = true;
    },
    update: function (dat) {
        for (var i = 0; i < dat.length; i++) {
            //calculate rgb values from 0.00 - 1.00
            var r = dat[i][0] / 255;
            var g = dat[i][1] / 255;
            var b = dat[i][2] / 255;
            var gs = greyScale(r, g, b);
            this.shapes[i].fillColor = new Color(r, g, b);

            //set tolerance for scaling
            if (Math.abs(this.sizes[i] - gs) > 0.1) {
                //smooth scaling
                if (this.sizes[i] > gs) {
                    this.shapes[i].scale(0.9);
                    this.sizes[i] *= 0.9;
                } else {
                    this.shapes[i].scale(1.1);
                    this.sizes[i] *= 1.1;
                }
            }
        }
    },
    end: function () {
        // dereference values for garbage collection
        this.sizes = [];
        this.shapes = [];
        this.initialised = false;
    }
};

// Follow same pattern as circles to create more filters
// init, update, end


// 2. Add new filter object to array
var filterObjects = [circles];

// don't need to touch: on every frame update event
view.onFrame = function draw() {
    var dat = camFilter.getData();
    if (dat == undefined) return;
    if (!initialised) initPoints(dat);
    if (filterObjects[filter].initialised) filterObjects[filter].update(dat);
};

// don't need to touch: on spacebar up event
tool.onKeyUp = function (event) {
    if (event.key == 'space') {
        // end current filter
        filterObjects[filter].end();
        // remove from canvas
        project.activeLayer.removeChildren();
        // refresh view
        paper.view.draw();
        // increase counter to next filter in array
        filter = (filter > filterObjects.length-2) ? 0 : filter + 1;
        console.log('next filter:'+ filter);
        // initialise the new filter
        filterObjects[filter].init(points);
    }
};

function initPoints(dat) {
    // initialisation of points at start of video feed
    var gridSize = camFilter.getSize();
    var xCount = gridSize[0];
    var yCount = gridSize[1];
    // calculate distance of points to even spread across screen
    spread = view.size.width / (xCount + 1);
    view.size.height = (yCount + 1) * spread;

    // plot points onto canvas.
    // These same points will be used by all filters
    for (var i = 0; i < dat.length; i++) {
        var point = new Point((dat[i][3]) * spread, (dat[i][4] * spread) + (spread / 2));
        points.push(point);
    }
    initialised = true;
    // init the first filter
    filterObjects[0].init(points);
}


function greyScale(r, g, b) {
    //greyscale is used for heightfield representations
    // ie: brightness of bulb / size of shape / displacement magnitude
    return (r + g + b) / 3;
}