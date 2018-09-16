var amplitude1 = .5;
var amplitude2 = .5;
var speedRatio = 3;


var maxPoints = 500;

var svgWidth = 500;
var svgHeight = 500;
function scaleX(point) {
    return ((point.x - minX) / (maxX - minX) * svgWidth);
}
function scaleY(point) {
    return ((point.y - minY) / (maxY - minY) * svgHeight);
}

function plot(data, svg) {
    var lineFunction = d3
        .line()
        .x((point) => { return scaleX(point); })
        .y((point) => { return scaleY(point); })
        .curve(d3.curveCardinal);

    const wheelAPointer = [
        {x: 0, y: 0}, 
        {
            y: state.wheelA.radius * Math.sin(state.wheelA.theta),
            x: state.wheelA.radius * Math.cos(state.wheelA.theta) 
        }
    ];
    const wheelBPointer = [
        {x: 0, y: 0}, 
        {
            y: state.wheelB.radius * Math.sin(state.wheelB.theta),
            x: state.wheelB.radius * Math.cos(state.wheelB.theta) 
        }
    ];
    svg.select("#wheelA_g")
        .attr("transform", `translate(${scaleX({x: state.wheelA.x})}, ${scaleY({y: state.wheelA.y})})`);
    svg.select("#wheelA_c")
        .attr("r", state.wheelA.radius / 10 * svgHeight)
        .attr("fill", "rgba(255, 0, 0, .1)")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    svg.select("#wheelA_p")
        .attr("d", lineFunction(wheelAPointer));

    
    svg.select("#wheelB_g")
        .attr("transform", `translate(${scaleX({x: state.wheelB.x})}, ${scaleY({y: state.wheelB.y})})`);
    svg.select("#wheelB_c")
        .attr("r", state.wheelB.radius / 10 * svgHeight)
        .attr("fill", "rgba(255, 0, 0, .1)")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    svg.select("#wheelB_p")
        .attr("d", lineFunction(wheelBPointer));

    
    
    var line = svg
        .select("#points")
        .data([data])
        .attr("d", lineFunction(data));

    line.enter()
        .append("path")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");;
        
}

var svg = d3.select("svg");
d3.select("svg")
    .append("g")
    .attr("id", "wheelA_g");
d3.select("#wheelA_g")
    .append("circle")
    .attr("id", "wheelA_c");
d3.select("#wheelA_g")
    .append("path")
    .attr("id", "wheelA_p")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

d3.select("svg")
    .append("g")
    .attr("id", "wheelB_g");
d3.select("#wheelB_g")
    .append("circle")
    .attr("id", "wheelB_c");
d3.select("#wheelB_g")
    .append("path")
    .attr("id", "wheelB_p");

d3.select("svg")
    .append("path")
    .attr("id", "points")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

var dt = .05;
var baseVelocity = .5 / 2 * Math.PI;
const wheelA = {
    x: 2,
    y: 0,
    theta: 0,
    thetaOffset: 0,
    radius: amplitude1,
    thetaDot: baseVelocity * 1.0
};

const wheelB = {
    x: 0,
    y: 2,
    theta: 0,
    thetaOffset: 0,
    radius: amplitude2,
    thetaDot: baseVelocity * speedRatio
};

const armA = {
    length: 2.5,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
};
const armB = {
    length: 2.5,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
};

const state = {
    wheelA: wheelA,
    wheelB: wheelB,
    armA: armA,
    armB: armB,
    points: []
};

var t = 0;
function doStep(dt) {
    t += dt;
    wheelA.theta = wheelA.theta + (dt * wheelA.thetaDot);
    wheelB.theta = wheelB.theta + (dt * wheelB.thetaDot);

    const wheelAConnectionX = (Math.sin(wheelA.theta) * wheelA.radius) + wheelA.x;
    const wheelAConnectionY = (Math.cos(wheelA.theta) * wheelA.radius) + wheelA.y;

    const wheelBConnectionX = (Math.sin(wheelB.theta) * wheelB.radius) + wheelB.x;
    const wheelBConnectionY = (Math.cos(wheelB.theta) * wheelB.radius) + wheelB.y;

    armA.x1 = wheelAConnectionX;
    armA.y1 = wheelAConnectionY;
    armB.x1 = wheelBConnectionX;
    armB.y1 = wheelBConnectionY;

    const a = armA.x1;
    const b = armA.y1;
    const c = armB.x1;
    const d = armB.y1;
    const r0 = armA.length;
    const r1 = armB.length;
    const D = Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2))
    
    if (((r0 + r1) < D) || (D < Math.abs(r0 - r1))) {
        throw new Error("Arm constraint not solvable")
    }

    const xt1 = (a + c) / 2
    const xt2 = ((c - a)* (Math.pow(r0, 2) - Math.pow(r1, 2))) / (2 * Math.pow(D, 2))
    const xt3 = 2 * ((b - d) / Math.pow(D, 2)) * sigma(armA, armB)

    const yt1 = (b + d) / 2;
    const yt2 = ((d - b) * (Math.pow(r0, 2) - Math.pow(r1, 2))) / (2 * Math.pow(D, 2));
    const yt3 = 2 * ((a - c) / Math.pow(D, 2)) * sigma(armA, armB);


    const x_1 = xt1 + xt2 + xt3;
    const x_2 = xt1 + xt2 - xt3;

    const y_1 = yt1 + yt2 + yt3;
    const y_2 = yt1 + yt2 - yt3;

    const d1 = Math.sqrt(Math.pow(armA.x2 - x_1, 2) + Math.pow(armA.y2 - y_1, 2));
    const d2 = Math.sqrt(Math.pow(armA.x2 - x_2, 2) + Math.pow(armA.y2 - y_2, 2));

    if (d1 < d2) {
        armA.x2 = x_1;
        armA.y2 = y_1;

        armB.x2 = x_1;
        armB.y2 = y_1;
    } else {
        armA.x2 = x_2;
        armA.y2 = y_2;

        armB.x2 = x_2;
        armB.y2 = y_2;
    }
}

function sigma(armA, armB) {
    const a = armA.x1;
    const b = armA.y1;
    const c = armB.x1;
    const d = armB.y1;
    const D = Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2))
    const r0 = armA.length;
    const r1 = armB.length;
    
    const x1 = D + r0 + r1;
    const x2 = D + r0 - r1;
    const x3 = D - r0 + r1;
    const x4 = (-1 * D) + r0 + r1;
    const x = x1 * x2 * x3 * x4;
    if (x <= 0) {
        return false;
    } else {
        return .25 * Math.sqrt(x);
    }
}


var minX = -5;
var maxX = 5;
var minY = -5;
var maxY = 5;
const points = [];
setInterval(() => {
    doStep(dt);

    if (points.length >= maxPoints) {
        points.shift();
    }
    const point = {x: armA.x2, y: armA.y2};
    points.push(point);

    var stepMinX = points.reduce((x, y) => {
        if (x < y.x) {
            return x;
        } else {
            return y.x;
        }
    }, points[0].x);
    var stepMaxX = points.reduce((x, y) => {
        if (x > y.x) {
            return x;
        } else {
            return y.x;
        }
    }, points[0].x);
    var stepMinY = points.reduce((x, y) => {
        if (x < y.y) {
            return x;
        } else {
            return y.y;
        }
    }, points[0].y);
    var stepMaxY = points.reduce((x, y) => {
        if (x > y.y) {
            return x;
        } else {
            return y.y;
        }
    }, points[0].y);

    var reScale = false;
    if (stepMaxX > maxX) {
        reScale = true;  
    } else if (stepMaxY > maxY) {
        reScale = true;  
    } else if (stepMinX < minX) {
        reScale = true;  
    } else if (stepMinY < minY) {
        reScale = true;
    }

    if (reScale) {
        maxX = stepMaxX < maxX ? maxX : stepMaxX;
        maxY = stepMaxY < maxY ? maxY : stepMaxY;
        minX = stepMinX > minX ? minX : stepMinX;
        minY = stepMinY > minY ? minY : stepMinY;
    }
    plot(points, svg);
}, dt *1000);