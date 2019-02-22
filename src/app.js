require('html-loader!./index.html');

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';


import './styles.css';
var d3 = require('d3');

var amplitude1 = .5;
var amplitude2 = .5;
var speedRatio = 2;
var armALength = 3.5;
var armBLength = 3.5;
var dt = .05;
var baseVelocity = .5 / 2 * Math.PI;
var initialize2 = true;
var maxPoints = 500;

function plot() {
    
    var wheelPointerLineFunction = d3.line()
        .x(function(point) {return point.x})
        .y(function(point) {return point.y});
    
    

    var wheelAPointer = [
        {x: state.wheelA.x, y: state.wheelA.y}, 
        {
            x: state.armA.x1,
            y: state.armA.y1 
        }
    ];
    svgD3.select("#wheelA_c")
        .attr("r", state.wheelA.radius)
        .attr("cx", state.wheelA.x)
        .attr("cy", state.wheelA.y);
    svgD3.select("#wheelA_p")
        .attr("d", wheelPointerLineFunction(wheelAPointer));

    
    var wheelBPointer = [
        {x: state.wheelB.x, y: state.wheelB.y}, 
        {
            x: state.armB.x1,
            y: state.armB.y1 
        }
    ];
    svgD3.select("#wheelB_c")
        .attr("r", state.wheelB.radius)
        .attr("cx", state.wheelB.x)
        .attr("cy", state.wheelB.y);
    svgD3.select("#wheelB_p")
        .attr("d", wheelPointerLineFunction(wheelBPointer));


    var armAPoints = [
        {
            x: state.armA.x1,
            y: state.armA.y1
        },
        {
            x: state.armA.x2,
            y: state.armA.y2
        }
    ];
    var armBPoints = [
        {
            x: state.armB.x1,
            y: state.armB.y1
        },
        {
            x: state.armB.x2,
            y: state.armB.y2
        }
    ];
    svgD3.select("#armA")
        .attr("d", wheelPointerLineFunction(armAPoints));
    svgD3.select("#armB")
        .attr("d", wheelPointerLineFunction(armBPoints));
    
    

    var pointsLineFunction = d3.line()
        .x(function(point) { return point.x; })
        .y(function(point) { return point.y; })
        .curve(d3.curveCardinal);
    svgD3.select("#nearMissPoints")
        .attr("d", pointsLineFunction(state.nearMissPoints))
        .style("opacity", state.showNearMissajoue ? 1 : 0);
    svgD3.select("#lissajousPoints")
        .attr("d", pointsLineFunction(state.lissajousPoints))
        .style("opacity", state.showLissajoue ? 1 : 0);
    svgD3.select("#lissajousPoint")
        .attr("cx", state.lissajousPoint.x)
        .attr("cy", state.lissajousPoint.y)
        .style("opacity", state.showLissajoue ? 1 : 0);
}

var svgD3 = d3.select("#svg");


// Paper border
svgD3.append("rect")
    .attr("class", "paper-rect")
    .attr("width", 5)
    .attr("height", 5)
    .attr("x", 1)
    .attr("y", 1);

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
    .attr("class", "nearMissPoints");
d3.select("svg")
    .append("circle")
    .attr("id", "lissajousPoint")
    .attr("r", .05)
    .attr("class", "lissajousPoint");
d3.select("svg")
    .append("path")
    .attr("id", "lissajousPoints")
    .attr("class", "lissajousPath");

var state = {
    initialize2: initialize2,
    lissajous_offset_x: 0,
    lissajous_offset_y: 0,
    rotationRatio: 2,
    baseVelocity: .33,
    wheelAThetaOffsetBase: 0,
    wheelBThetaOffsetBase: 0,
    showNearMissajoue: true,
    showLissajoue: true,
    wheelA: {
        // x: 3.5,
        // y: 7,
        x: 0,
        y: 3,
        theta: 0,
        thetaOffset: 0,
        radius: .75,
        thetaDot: 0
    },
    wheelB: {
        // x: 7,
        // y: 3.5,
        x: 3,
        y: 0,
        theta: 0,
        thetaOffset: 0,
        radius: .75,
        thetaDot: 0
    },
    armA: {
        length: 3.5,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    },
    armB: {
        length: 3.5,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    },
    lissajousPoint: { x: 0, y: 0 },
    nearMissPoints: [],
    lissajousPoints: []
};

var interval;

function inputParameterChanged() {
    maxPoints = parseFloat(maxPointsInput.value);
    state.baseVelocity = parseFloat(baseVelocityInput.value);
    state.rotationRatio = parseFloat(rotationRatioInput.value);
    state.wheelA.radius = parseFloat(wheelARadiusInput.value);
    state.wheelB.radius = parseFloat(wheelBRadiusInput.value);
    state.armA.length = parseFloat(armALengthInput.value);
    state.armB.length = parseFloat(armBLengthInput.value);
    state.wheelAThetaOffsetBase = parseFloat(wheelAThetaOffsetInput.value);
    state.wheelBThetaOffsetBase = parseFloat(wheelBThetaOffsetInput.value);
    state.showLissajoue = showLissajoueInput.checked;
    state.showNearMissajoue = showNearMissajoueInput.checked;

    Initialize();
    rebindValues();
    plot();
}

function playPauseClick() {
    var btn = document.getElementById("playPauseBtn");
    var controls = [wheelARadiusInput, rotationRatioInput, wheelBRadiusInput, armALengthInput, armBLengthInput, ];//wheelAThetaOffsetInput, wheelBThetaOffsetInput];
    if (interval) {
        btn.innerHTML = "Play"
        clearInterval(interval);
        interval = undefined;

        controls.forEach(function(x) { x.disabled = false});
        document.getElementById("lissajousPoint").style.setProperty("visibility", "hidden");
    } else {
        btn.innerHTML = "Stop"
        document.getElementById("lissajousPoint").style.setProperty("visibility", "visible");
        controls.forEach(function(x) {x.disabled = true});

        Initialize();
        interval = setInterval(function() {
            doStep(dt);
        
            plot();
        }, dt * 1000);
    }
}

var t = 0;
function doStep(dt) {
    state.wheelA.theta = state.wheelA.theta + (dt * state.wheelA.thetaDot);
    state.wheelB.theta = state.wheelB.theta + (dt * state.wheelB.thetaDot);

    var wheelAConnectionX = (Math.cos(state.wheelA.theta) * state.wheelA.radius) + state.wheelA.x;
    var wheelAConnectionY = (Math.sin(state.wheelA.theta) * state.wheelA.radius) + state.wheelA.y;

    var wheelBConnectionX = (Math.cos(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.x;
    var wheelBConnectionY = (Math.sin(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.y;

    state.armA.x1 = wheelAConnectionX;
    state.armA.y1 = wheelAConnectionY;
    state.armB.x1 = wheelBConnectionX;
    state.armB.y1 = wheelBConnectionY;

    armA.x1 = wheelAConnectionX;
    armA.y1 = wheelAConnectionY;
    armB.x1 = wheelBConnectionX;
    armB.y1 = wheelBConnectionY;


    var intersections = intersectTwoCircles(
        state.armA.x1,
        state.armA.y1,
        state.armA.length, 
        state.armB.x1, 
        state.armB.y1, 
        state.armB.length);
    var x_1 = intersections[0][0];
    var x_2 = intersections[1][0];

    var y_1 = intersections[0][1];
    var y_2 = intersections[1][1];

    var d1 = Math.sqrt(Math.pow(state.armA.x2 - x_1, 2) + Math.pow(state.armA.y2 - y_1, 2));
    var d2 = Math.sqrt(Math.pow(state.armA.x2 - x_2, 2) + Math.pow(state.armA.y2 - y_2, 2));

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
        x: Math.cos(state.wheelA.theta) * state.wheelA.radius + state.lissajous_offset_x,
        y: Math.sin(state.wheelB.theta) * state.wheelB.radius + state.lissajous_offset_y
    }

    while (state.nearMissPoints.length >= maxPoints) {
        state.nearMissPoints.shift();
        state.lissajousPoints.shift();
    }
    var point = {x: state.armA.x2, y: state.armA.y2};
    state.nearMissPoints.push(point);
    state.lissajousPoints.push(state.lissajousPoint);

    t += dt;
}

// Initialize the state after a simulation has been run
function Initialize() {
    if (!interval) {
        state.wheelA.theta = state.wheelAThetaOffsetBase * Math.PI;
        state.wheelB.theta = state.wheelBThetaOffsetBase * Math.PI;
        state.wheelA.thetaOffset = state.wheelAThetaOffsetBase * Math.PI;
        state.wheelB.thetaOffset = state.wheelBThetaOffsetBase * Math.PI;

        state.armA.x1 = (Math.cos(state.wheelA.theta + Math.PI / 2) * state.wheelA.radius) + state.wheelA.x;
        state.armA.y1 = (Math.sin(state.wheelA.theta + Math.PI / 2) * state.wheelA.radius) + state.wheelA.y;
        state.armB.x1 = (Math.cos(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.x;;
        state.armB.y1 = (Math.sin(state.wheelB.theta) * state.wheelB.radius) + state.wheelB.y;;

        var intersections = intersectTwoCircles(
            state.armA.x1, 
            state.armA.y1, 
            state.armA.length, 
            state.armB.x1, 
            state.armB.y1, 
            state.armB.length);
        
        var intersection = (intersections[0][0] > 0 && intersections[0][11] > 0) ? intersections[0] : intersections[1];
        state.armA.x2 = intersection[0];
        state.armA.y2 = intersection[1];
        state.armB.x2 = intersection[0];
        state.armB.y2 = intersection[1];

        state.lissajous_offset_x = intersection[0];
        state.lissajous_offset_y = intersection[1];

        state.nearMissPoints = [];
        state.lissajousPoints = [];
    } else {
        var aDiff = state.wheelA.thetaOffset - state.wheelAThetaOffsetBase;
        var bDiff = state.wheelB.thetaOffset - state.wheelBThetaOffsetBase;
        state.wheelA.theta += aDiff;
        state.wheelA.thetaOffset = state.wheelAThetaOffsetBase;
        state.wheelB.theta += bDiff;
        state.wheelB.thetaOffset = state.wheelBThetaOffsetBase;
    }
    state.wheelA.thetaDot = state.baseVelocity * Math.PI;
    state.wheelB.thetaDot = state.baseVelocity * Math.PI * state.rotationRatio;
    
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

var wheelARadiusInput, wheelBRadiusInput, rotationRatioInput, baseVelocityInput, armALengthInput, armBLengthInput, maxPointsInput;
var wheelAThetaOffsetInput, wheelBThetaOffsetInput;
var showNearMissajoueInput, showLissajoueInput;
var maxPointsValue, wheelARadiusInputValue, wheelBRadiusInputValue;

function rebindValues() {
    if (maxPointsInput.value != maxPoints) {
        maxPointsInput.value = maxPoints;
    }
    if (wheelARadiusInput.value != state.wheelA.radius) {
        wheelARadiusInput.value = state.wheelA.radius.toString();
    }
    if (wheelBRadiusInput.value != state.wheelB.radius) {
        wheelBRadiusInput.value = state.wheelB.radius;
    }
    if (wheelAThetaOffsetInput.value != state.wheelAThetaOffsetBase) {
        wheelAThetaOffsetInput.value = state.wheelAThetaOffsetBase;
    }
    if (wheelBThetaOffsetInput.value != state.wheelBThetaOffsetBase) {
        wheelBThetaOffsetInput.value = state.wheelBThetaOffsetBase;
    }
    if (rotationRatioInput.value != state.rotationRatio) {
        rotationRatioInput.value = state.rotationRatio
    }
    if (baseVelocityInput.value != state.baseVelocity) {
        baseVelocityInput.value = state.baseVelocity;
    }
    if (armALengthInput.value != state.armA.length) {
        armALengthInput.value = state.armA.length;
    }
    if (armBLengthInput.value != state.armB.length) {
        armBLengthInput.value = state.armB.length;
    }
    if (wheelAThetaOffsetInput.value != state.wheelAThetaOffsetBase) {
        wheelAThetaOffsetInput.value = state.wheelAThetaOffsetBase;
    }
    if (wheelBThetaOffsetInput.value != state.wheelBThetaOffsetBase) {
        wheelBThetaOffsetInput.value = state.wheelBThetaOffsetBase;
    }
    if (showLissajoueInput.checked != state.showLissajoue) {
        showLissajoueInput.checked = state.showLissajoue;
    }
    if (showNearMissajoueInput.checked != state.showNearMissajoue) {
        showNearMissajoueInput.checked = state.showNearMissajoue;
    }

    maxPointsValue.innerHTML = maxPoints.toPrecision(1);
    wheelARadiusInput.innerText = state.wheelA.radius.toPrecision(2);
    wheelBRadiusInput.innerText = state.wheelB.radius.toPrecision(2);
    
}

function onLoad() {

    console.log('temp');

    wheelARadiusInput = document.getElementById("wheelARadiusInput");
    wheelARadiusInput.onchange = inputParameterChanged;
    wheelARadiusInput.oninput = inputParameterChanged;
    wheelBRadiusInput = document.getElementById("wheelBRadiusInput");
    wheelBRadiusInput.onchange = inputParameterChanged;
    wheelBRadiusInput.oninput = inputParameterChanged;
    wheelARadiusInputValue = document.getElementById("wheelARadiusInputValue");
    wheelBRadiusInputValue = document.getElementById("wheelBRadiusInputValue");
    rotationRatioInput = document.getElementById("rotationRatioInput");
    rotationRatioInput.onchange = inputParameterChanged;
    rotationRatioInput.oninput = inputParameterChanged;
    baseVelocityInput = document.getElementById("baseVelocityInput");
    baseVelocityInput.onchange = inputParameterChanged;
    baseVelocityInput.oninput = inputParameterChanged;
    armALengthInput = document.getElementById("armALengthInput");
    armALengthInput.onchange = inputParameterChanged;
    armALengthInput.oninput = inputParameterChanged;
    armBLengthInput = document.getElementById("armBLengthInput");
    armBLengthInput.onchange = inputParameterChanged;
    armBLengthInput.oninput = inputParameterChanged;
    maxPointsInput = document.getElementById("maxPointsInput");
    maxPointsInput.onchange = inputParameterChanged;
    maxPointsInput.oninput = inputParameterChanged;
    maxPointsValue = document.getElementById("maxPointsValue");
    wheelAThetaOffsetInput = document.getElementById("wheelAThetaOffsetInput");
    wheelAThetaOffsetInput.oninput = inputParameterChanged;
    wheelAThetaOffsetInput.onchange = inputParameterChanged;
    wheelBThetaOffsetInput = document.getElementById("wheelBThetaOffsetInput");
    wheelBThetaOffsetInput.oninput = inputParameterChanged;
    wheelBThetaOffsetInput.onchange = inputParameterChanged;
    showLissajoueInput = document.getElementById("showLissajoueInput");
    showLissajoueInput.oninput = inputParameterChanged;
    showNearMissajoueInput = document.getElementById("showNearMissajoueInput");
    showNearMissajoueInput.oninput = inputParameterChanged;

    document.getElementById("playPauseBtn").onclick = playPauseClick;
    Initialize();

    rebindValues();

    document.getElementById("lissajousPoint").style.setProperty("visibility", "hidden");
    plot();
}

window.onload = function (e) {
    onLoad();
};