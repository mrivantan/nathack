var diameter = 40;
var spread = 5;
var points = [];
var circles = [];
var sizes = [];
var initialised = false;
view.onFrame = function draw() {
    var dat = camFilter.getData();
    if (dat == undefined) return;
    if (!initialised) init(dat);
    for (var i = 0; i < dat.length; i++) {
        var gs = (dat[i][0] + dat[i][1] + dat[i][2]) / 765;
        circles[i].fillColor = new Color(dat[i][0] / 255, dat[i][1] / 255, dat[i][2] / 255);

        if (sizes[i] > gs) {
            circles[i].scale(0.9);
            sizes[i] *= 0.9;
        } else {
            circles[i].scale(1.1);
            sizes[i] *= 1.1;
        }

    }

};

function init(dat) {
    for (var i = 0; i < dat.length; i++) {
        var start = new Point(dat[i][3] * (diameter + spread) + spread, dat[i][4] * (diameter + spread) + spread);
        var circle = new Path.Circle(start, diameter * 0.5);
        sizes.push(1);
        circles.push(circle);
    }
    initialised = true;
}