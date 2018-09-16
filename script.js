var amplitude1 = 1;
var amplitude2 = 1;
var speedRatio = 2.0;
var armALength = 2.51;
var armBLength = 2.5;
var dt = .05;
var baseVelocity = .5 / 2 * Math.PI;


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
    var pointsLineFunction = d3
        .line()
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
        .attr("r", state.wheelA.radius / 10 * svgHeight)
        .attr("fill", "rgba(255, 0, 0, .1)")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    svg.select("#wheelA_p")
        .attr("d", wheelPointerLineFunction(wheelAPointer));

    
    svg.select("#wheelB_g")
        .attr("transform", `translate(${scaleX({x: state.wheelB.x})}, ${scaleY({y: state.wheelB.y})})`);
    svg.select("#wheelB_c")
        .attr("r", state.wheelB.radius / 10 * svgHeight)
        .attr("fill", "rgba(255, 0, 0, .1)")
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    svg.select("#wheelB_p")
        .attr("d", wheelPointerLineFunction(wheelBPointer));

    svg.select("#armA")
        .attr("d", pointsLineFunction(armAPoints));

    svg.select("#armB")
        .attr("d", pointsLineFunction(armBPoints));
    
    
    var line = svg
        .select("#points")
        .data([data])
        .attr("d", pointsLineFunction(data));

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
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");
d3.select("svg")
    .append("path")
    .attr("id", "armA")
    .attr("stroke", "black")
    .attr("stroke-width", 15)
    .attr("fill", "none");



d3.select("svg")
    .append("g")
    .attr("id", "wheelB_g");
d3.select("#wheelB_g")
    .append("circle")
    .attr("id", "wheelB_c");
d3.select("#wheelB_g")
    .append("path")
    .attr("id", "wheelB_p")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");
d3.select("svg")
    .append("path")
    .attr("id", "armB")
    .attr("stroke", "black")
    .attr("stroke-width", 15)
    .attr("fill", "none");

d3.select("svg")
    .append("path")
    .attr("id", "points")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");


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
    length: armALength,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
};
const armB = {
    length: armBLength,
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
    if (t == 0) {
        wheelA.theta = wheelA.thetaOffset;
        wheelB.theta = wheelB.thetaOffset;

        armA.x = (Math.cos(wheelA.theta) * wheelA.radius) + wheelA.x;
        armA.y = (Math.sin(wheelA.theta) * wheelA.radius) + wheelA.y;
        armB.x = (Math.cos(wheelB.theta) * wheelB.radius) + wheelB.x;;
        armB.y = (Math.sin(wheelB.theta) * wheelB.radius) + wheelB.y;;
    }

    wheelA.theta = wheelA.theta + (dt * wheelA.thetaDot);
    wheelB.theta = wheelB.theta + (dt * wheelB.thetaDot);

    const wheelAConnectionX = (Math.cos(wheelA.theta) * wheelA.radius) + wheelA.x;
    const wheelAConnectionY = (Math.sin(wheelA.theta) * wheelA.radius) + wheelA.y;

    const wheelBConnectionX = (Math.cos(wheelB.theta) * wheelB.radius) + wheelB.x;
    const wheelBConnectionY = (Math.sin(wheelB.theta) * wheelB.radius) + wheelB.y;

    armA.x1 = wheelAConnectionX;
    armA.y1 = wheelAConnectionY;
    armB.x1 = wheelBConnectionX;
    armB.y1 = wheelBConnectionY;


    const intersections = intersectTwoCircles(armA.x1,armA.y1,armA.length, armB.x1, armB.y1, armB.length);
    const x_1 = intersections[0][0];
    const x_2 = intersections[1][0];

    const y_1 = intersections[0][1];
    const y_2 = intersections[1][1];

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

    t += dt;
    // console.log(`a: ${Math.sqrt(Math.pow(armA.x2 - armA.x1, 2) + Math.pow(armA.y2 - armA.y1, 2))}`)
    // console.log(`b: ${Math.sqrt(Math.pow(armB.x2 - armB.x1, 2) + Math.pow(armB.y2 - armB.y1, 2))}`)
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
    const x4 = 0 - D + r0 + r1;
    const x = x1 * x2 * x3 * x4;
    return .25 * Math.sqrt(x);
}


// function circleIntersections(c1, c2) {
//     const a = c1.x;
//     const b = c1.y;
//     const c = c1.x;
//     const d = c2.y;
//     const r0 = c1.r;
//     const r1 = c2.r;
//     const D = Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2))
    
//     if (((r0 + r1) < D) || (D < Math.abs(r0 - r1))) {
//         throw new Error("Arm constraint not solvable")
//     }

//     const xt1 = (a + c) / 2
//     const xt2 = ((c - a) * (Math.pow(r0, 2) - Math.pow(r1, 2))) / (2 * Math.pow(D, 2))
//     const xt3 = 2 * ((b - d) / Math.pow(D, 2)) * sigma(armA, armB)

//     const yt1 = (b + d) / 2;
//     const yt2 = ((d - b) * (Math.pow(r0, 2) - Math.pow(r1, 2))) / (2 * Math.pow(D, 2));
//     const yt3 = 2 * ((a - c) / Math.pow(D, 2)) * sigma(armA, armB);


//     const x_1 = xt1 + xt2 + xt3;
//     const x_2 = xt1 + xt2 - xt3;

//     const y_1 = yt1 + yt2 + yt3;
//     const y_2 = yt1 + yt2 - yt3;

//     const h1 = Math.sqrt(Math.pow(c1.x - x_1, 2) + Math.pow(c1.y - y_1, 2));
//     const h2 = Math.sqrt(Math.pow(c1.x - x_2, 2) + Math.pow(c1.y - y_1, 2));
//     const h3 = Math.sqrt(Math.pow(c1.x - x_1, 2) + Math.pow(c1.y - y_2, 2));
//     const h4 = Math.sqrt(Math.pow(c1.x - x_2, 2) + Math.pow(c1.y - y_2, 2));
//     console.log(`h1 ${h1} : h2 ${h2} : h3 ${h3} : h4 ${h4}`);

//     return [
//         {x: x_1, y: y_1},
//         {x: x_2, y: y_2}
//     ];
// }

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
const points = [];
setInterval(() => {
    doStep(dt);

    if (points.length >= maxPoints) {
        points.shift();
    }
    const point = {x: armA.x2, y: armA.y2};
    points.push(point);

    plot(points, svg);
}, dt *1000);