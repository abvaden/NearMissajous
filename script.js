var amplitude1 = .5;
var amplitude2 = .5;
var speedRatio = 3;
var armALength = 2.5;
var armBLength = 2.5;
var dt = .05;
var baseVelocity = 2 / 2 * Math.PI;
var initialize2 = true;
var maxPoints = 250;

var svgWidth;
var svgHeight;
function scaleX(point) {
    return ((point.x - minX) / (maxX - minX) * svgWidth);
}
function scaleY(point) {
    return ((point.y - minY) / (maxY - minY) * svgHeight);
}

function plot() {
    var pointsLineFunction = d3.line()
        .x((point) => { return scaleX(point); })
        .y((point) => { return scaleY(point); })
        .curve(d3.curveCardinal);

    var wheelPointerLineFunction = d3.line()
        .x((point) => {return point.x / 10 * svgWidth; })
        .y((point) => {return point.y / 10 *  svgHeight; });
    const wheelAPointer = [
        {x: 0, y: 0}, 
        {
            x: state.wheelA.radius * Math.cos(state.wheelA.theta),
            y: state.wheelA.radius * Math.sin(state.wheelA.theta) 
        }
    ];
    const wheelBPointer = [
        {x: 0, y: 0}, 
        {
            x: state.wheelB.radius * Math.cos(state.wheelB.theta),
            y: state.wheelB.radius * Math.sin(state.wheelB.theta) 
        }
    ];

    const armAPoints = [
        {
            x: state.armA.x1,
            y: state.armA.y1
        },
        {
            x: state.armA.x2,
            y: state.armA.y2
        }
    ];

    const armBPoints = [
        {
            x: state.armB.x1,
            y: state.armB.y1
        },
        {
            x: state.armB.x2,
            y: state.armB.y2
        }
    ];

    svg.select("#wheelA_g")
        .attr("transform", `translate(${scaleX({x: state.wheelA.x})}, ${scaleY({y: state.wheelA.y})})`);
    svg.select("#wheelA_c")
        .attr("r", state.wheelA.radius / 10 * svgHeight);
    svg.select("#wheelA_p")
        .attr("d", wheelPointerLineFunction(wheelAPointer));

    
    svg.select("#wheelB_g")
        .attr("transform", `translate(${scaleX({x: state.wheelB.x})}, ${scaleY({y: state.wheelB.y})})`);
    svg.select("#wheelB_c")
        .attr("r", state.wheelB.radius / 10 * svgHeight);
    svg.select("#wheelB_p")
        .attr("d", wheelPointerLineFunction(wheelBPointer));

    svg.select("#armA")
        .attr("d", pointsLineFunction(armAPoints));

    svg.select("#armB")
        .attr("d", pointsLineFunction(armBPoints));
    
    
    svg.select("#nearMissPoints")
        .attr("d", pointsLineFunction(state.nearMissPoints));
    
    svg.select("#lissajousPoints")
        .data(state.lissajousPoints)
        .attr("d", pointsLineFunction(state.lissajousPoints));
        
}

var svg = d3.select("svg");
svgHeight = document.getElementById("svg").clientHeight;
svgWidth = document.getElementById("svg").clientWidth;

// WheelA Group
d3.select("svg")
    .append("g")
    .attr("id", "wheelA_g");
// WheelA circle
d3.select("#wheelA_g")
    .append("circle")
    .attr("id", "wheelA_c")
    .attr("class", "wheel");
// WheelA pointer
d3.select("#wheelA_g")
    .append("path")
    .attr("id", "wheelA_p")
    .attr("class", "wheelPointer");
    



// Wheel B Group
d3.select("svg")
    .append("g")
    .attr("id", "wheelB_g");
// Wheel B Circle
d3.select("#wheelB_g")
    .append("circle")
    .attr("id", "wheelB_c")
    .attr("class", "wheel");
// Wheel pointer
d3.select("#wheelB_g")
    .append("path")
    .attr("id", "wheelB_p")
    .attr("class", "wheelPointer");

// ArmA
d3.select("svg")
    .append("path")
    .attr("id", "armA")
    .attr("class", "arm");
// ArmB
d3.select("svg")
    .append("path")
    .attr("id", "armB")
    .attr("class", "arm");

// Paths to be traced
d3.select("svg")
    .append("path")
    .attr("id", "nearMissPoints")
    .attr("class", "penPath");
d3.select("svg")
    .append("path")
    .attr("id", "lissajousPoints")
    .attr("class", "lissajousPath");

const state = {
    initialize2: initialize2,
    lissajous_offset_x: 0,
    lissajous_offset_y: 0,
    wheelA: {
        x: 2,
        y: 0,
        theta: 0,
        thetaOffset: 0,
        radius: amplitude1,
        thetaDot: baseVelocity * 1.0
    },
    wheelB: {
        x: 0,
        y: 2,
        theta: 0,
        thetaOffset: 0,
        radius: amplitude2,
        thetaDot: baseVelocity * speedRatio
    },
    armA: {
        length: armALength,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    },
    armB: {
        length: armBLength,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    },
    nearMissPoints: [],
    lissajousPoints: []
};

var t = 0;
function doStep(dt) {
    state.wheelA.theta = state.wheelA.theta + (dt * state.wheelA.thetaDot);
    state.wheelB.theta = state.wheelB.theta + (dt * state.wheelB.thetaDot);

    const wheelAConnectionX = (Math.cos(state.wheelA.theta) * state.wheelA.radius) + state.wheelA.x;
    const wheelAConnectionY = (Math.sin(state.wheelA.theta) * state.wheelA.radius) + state.wheelA.y;

    const wheelBConnectionX = (Math.cos(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.x;
    const wheelBConnectionY = (Math.sin(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.y;

    state.armA.x1 = wheelAConnectionX;
    state.armA.y1 = wheelAConnectionY;
    state.armB.x1 = wheelBConnectionX;
    state.armB.y1 = wheelBConnectionY;

    armA.x1 = wheelAConnectionX;
    armA.y1 = wheelAConnectionY;
    armB.x1 = wheelBConnectionX;
    armB.y1 = wheelBConnectionY;


    const intersections = intersectTwoCircles(
        state.armA.x1,
        state.armA.y1,
        state.armA.length, 
        state.armB.x1, 
        state.armB.y1, 
        state.armB.length);
    const x_1 = intersections[0][0];
    const x_2 = intersections[1][0];

    const y_1 = intersections[0][1];
    const y_2 = intersections[1][1];

    const d1 = Math.sqrt(Math.pow(state.armA.x2 - x_1, 2) + Math.pow(state.armA.y2 - y_1, 2));
    const d2 = Math.sqrt(Math.pow(state.armA.x2 - x_2, 2) + Math.pow(state.armA.y2 - y_2, 2));

    if (d1 < d2) {
        state.armA.x2 = x_1;
        state.armA.y2 = y_1;

        state.armB.x2 = x_1;
        state.armB.y2 = y_1;
    } else {
        state.armA.x2 = x_2;
        state.armA.y2 = y_2;

        state.armB.x2 = x_2;
        state.armB.y2 = y_2;
    }

    state.lissajousPoint = {
        x: Math.sin(state.wheelA.theta) * state.wheelA.radius + state.lissajous_offset_x,
        y: Math.cos(state.wheelB.theta) * state.wheelB.radius + state.lissajous_offset_y
    }

    if (state.nearMissPoints.length >= maxPoints) {
        state.nearMissPoints.shift();
        state.lissajousPoints.shift();
    }
    const point = {x: state.armA.x2, y: state.armA.y2};
    state.nearMissPoints.push(point);
    state.lissajousPoints.push(state.lissajousPoint);

    t += dt;
}

function Initialize() {
    state.wheelA.theta = state.wheelA.thetaOffset;
    state.wheelB.theta = state.wheelB.thetaOffset;

    state.armA.x1 = (Math.cos(state.wheelA.theta) * state.wheelA.radius) + state.wheelA.x;
    state.armA.y1 = (Math.sin(state.wheelA.theta) * state.wheelA.radius) + state.wheelA.y;
    state.armB.x1 = (Math.cos(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.x;;
    state.armB.y1 = (Math.sin(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.y;;

    const intersections = intersectTwoCircles(
        state.armA.x1, 
        state.armA.y1, 
        state.armA.length, 
        state.armB.x1, 
        state.armB.y1, 
        state.armB.length);
    const intersection = state.initialize2 ? intersections[0] : intersections[1];
    state.armA.x2 = intersection[0];
    state.armA.y2 = intersection[1];
    state.armB.x2 = intersection[0];
    state.armB.y2 = intersection[1];

    state.lissajous_offset_x = intersection[0];
    state.lissajous_offset_y = intersection[1];
}

// Special thanks to jupdike
// https://gist.github.com/jupdike/bfe5eb23d1c395d8a0a1a4ddd94882ac
function intersectTwoCircles(x1,y1,r1, x2,y2,r2) {
    var centerdx = x1 - x2;
    var centerdy = y1 - y2;
    var R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) { // no intersection
      return []; // empty list of results
    }
    // intersection(s) should exist
  
    var R2 = R*R;
    var R4 = R2*R2;
    var a = (r1*r1 - r2*r2) / (2 * R2);
    var r2r2 = (r1*r1 - r2*r2);
    var c = Math.sqrt(2 * (r1*r1 + r2*r2) / R2 - (r2r2 * r2r2) / R4 - 1);
  
    var fx = (x1+x2) / 2 + a * (x2 - x1);
    var gx = c * (y2 - y1) / 2;
    var ix1 = fx + gx;
    var ix2 = fx - gx;
  
    var fy = (y1+y2) / 2 + a * (y2 - y1);
    var gy = c * (x1 - x2) / 2;
    var iy1 = fy + gy;
    var iy2 = fy - gy;
  
    // note if gy == 0 and gx == 0 then the circles are tangent and there is only one solution
    // but that one solution will just be duplicated as the code is currently written
    return [[ix1, iy1], [ix2, iy2]];
}
  

var minX = -5;
var maxX = 5;
var minY = -5;
var maxY = 5;
Initialize();
setInterval(() => {
    doStep(dt);

    plot();
}, dt *1000);