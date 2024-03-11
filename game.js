/*
------------------------------------------------------Changelog------------------------------------------------------
27/02/2024
 • imported AIcode project

28/02/2024
 • created skibidi toilet model (based of skibidi toilet from skibidi toilet)
 • reworked collision, bullets, rendering, healthbars
 • created github repo
 • added laser cannon weapon (based of laser cannon from bloons tower defence 5)
 • added standard skibidi toilet enemy
 • added fast skibidi toilet enemy
 • created cameraman model (based of cameraman from skibidi toilet)

29/02/2024
 • added machine gun skibidi toilet enemy
 • added laser eye skibidi toilet enemy
 • added pistol weapon
 • added cannon weapon
 • added shotgun weapon
 • added rifle weapon
 • added sniper weapon
 • added plasma cannon weapon (based of plsama blasts from bloons tower defence 6)
 • created laser cannon model (based of laser cannon from bloons tower defence 5)
 • added upgrades menu
 • added economy

01/03/2024
 • created heavy sniper model (based of U-Marksman from starblast.io)

2/03/2024
 • imported rifle model 
 • created plasma cannon model
 • added railgun
 • imported railgun model
 • changed sniper bullet to laser

3/03/2024
 • some progress

4/03/2024
 • more progress

---------------------------------------------------------------------------------------------------------------------
*/

// The support functions that might not be necessary
function isin(a, b) { // check is a in b
    for (var i = 0; i < b.length; i += 1) {
        if (a == b[i]) {
            return true;
        }
    }
    return false;
};

function randchoice(list, remove = false) { // chose 1 from a list and update list
    let length = list.length;
    let choice = randint(0, length-1);
    if (remove) {
        let chosen = list.splice(choice, 1);
        return [chosen, list];
    }
    return list[choice];
};

// Randint returns random interger between min and max (both included)
function randint(min, max, notequalto=false) {
    if (max - min < 1) {
        return min;
    }
    
    var gen;
    var i = 0;
    do {
        gen = Math.floor(Math.random() * (max - min + 1)) + min;
        i += 1;
        if (i >= 100) {
            console.log('ERROR: could not generate suitable number');
            return gen;
        }
    } while (notequalto && (gen === min || gen === max));
    
    return gen;
}
/*
function randint(min, max, notequalto=false) {
    if (max - min <= 1) {
        return min;
    }
    var gen = Math.floor(Math.random() * (max - min + 1)) + min;
    var i = 0; // 
    while (gen != min && gen != max && notequalto && i < 100) { // loop max 100 times
        gen = Math.floor(Math.random() * (max - min + 1)) + min;
        i += 1;
        console.log('calculating...');
    }
    if (i >= 100) {
        console.log('ERROR: could not generate suitable number');
    }
    return gen;
};*/

function replacehtml(text) {
    document.getElementById("game").innerHTML = text;
};

function addImage(img, x, y, cx, cy, scale, r, absolute, opacity=1) {
    var c = document.getElementById('main');
    var ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
    if (absolute) {
        ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        ctx.rotate(r);
        ctx.drawImage(img, -cx, -cy);
    } else {
        ctx.setTransform(scale, 0, 0, scale, x-player.x+display.x/2, y-player.y+display.y/2); // position relative to player
        ctx.rotate(r);
        ctx.drawImage(img, -cx, -cy);
    }
    ctx.globalAlpha = 1.0;
};

function clearCanvas(canvas) {
    var c = document.getElementById(canvas);
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, display.x, display.y);
    ctx.restore();
};

function drawLine(pos, r, length, style, absolute) {
    var c = document.getElementById("main");
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (style) {
        ctx.strokeStyle = style.colour;
        ctx.lineWidth = style.width*data.constants.zoom;
        ctx.globalAlpha = style.opacity;
    }
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo(pos.x*data.constants.zoom, pos.y*data.constants.zoom);
        ctx.lineTo((pos.x + length * Math.cos(r))*data.constants.zoom, (pos.y + length * Math.sin(r))*data.constants.zoom);
    } else {
        ctx.moveTo((pos.x-player.x)*data.constants.zoom+display.x/2, (pos.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((pos.x-player.x + length * Math.cos(r))*data.constants.zoom+display.x/2, (pos.y-player.y + length * Math.sin(r))*data.constants.zoom+display.y/2);
    }
    ctx.stroke();
    ctx.restore();
};

function renderLine(pos, r, length, style) {
    let ns = undefined;
    switch (style) {
        case 'red':
            ns = data.red;
            break;
        case 'green':
            ns = data.green;
            break;
        case 'blue':
            ns = data.blue;
            break;
        case 'black':
            ns = data.black;
            break;
        case 'white':
        default:
            ns = data.white;
            break;
    }
    drawLine(pos, r-Math.PI/2, length, ns, false);
};

function getDist(sPos, tPos) { 
    // Mathematics METHods
    var dx = tPos.x - sPos.x;
    var dy = tPos.y - sPos.y;
    var dist = Math.sqrt(dx*dx+dy*dy);
    return dist;
};

function correctAngle(a) {
    a = a%(Math.PI*2);
    return a;
};

function adjustAngle(a) {
    if (a > Math.PI) {
        a -= 2*Math.PI;
    }
    return a;
};

function rotateAngle(r, rTarget, increment) {
    if (Math.abs(r) > Math.PI*4 || Math.abs(rTarget) > Math.PI*4) {
        throw "Error: You f*cked up the angle thing again...";
        console.log(r, rTarget);
        r = correctAngle(r);
        rTarget = correctAngle(rTarget);
    }
    if (r == rTarget) {
        return correctAngle(r);
    }else if (rTarget - r <= Math.PI && rTarget - r > 0) {
        if (rTarget - r < increment) {
            r = rTarget;
        } else {
            r += increment;
        }
        return r;
    } else if (r - rTarget < Math.PI && r - rTarget > 0) {
        if (r - rTarget < increment) {
            r = rTarget;
        } else {
            r -= increment;
        }
        return correctAngle(r);
    } else {
        if (r < rTarget) {
            r += Math.PI*2;
        } else {
            rTarget += Math.PI*2;
        }
        return correctAngle(rotateAngle(r, rTarget, increment));
    }
};

function aim(initial, final) {
    if (initial == final) { 
        return 0;
    }
    let diff = {x: final.x - initial.x, y: initial.y - final.y};
    if (diff.x == 0) {
        if (diff.y > 0) {
            return 0;
        } else {
            return Math.PI;
        }
    } else if (diff.y == 0) {
        if (diff.x > 0) {
            return Math.PI/2;
        } else {
            return 3*Math.PI/2;
        }
    }
    let angle = Math.atan(Math.abs(diff.y / diff.x));
    if (diff.x > 0 && diff.y > 0) {
        return Math.PI/2 - angle;
    } else if (diff.x > 0 && diff.y < 0) {
        return Math.PI/2 + angle;
    } else if (diff.x < 0 && diff.y < 0) {
        return 3*Math.PI/2 - angle;
    } else {
        return 3*Math.PI/2 + angle;
    }
};

function offsetPoints(points, offset) {
    for (let i = 0; i < points.length; i++){
        points[i].x += offset.x;
        points[i].y += offset.y;
    }
    return points;
};

function roman(number) {
    if (number <= 0 || number >= 4000) {
        var symbols = ['0','1','2','3','4','5','6','7','8','9','¡','£','¢','∞','§','¶','œ','ß','∂','∫','∆','√','µ','†','¥','ø'];
        return `${randchoice(symbols)}${randchoice(symbols)}${randchoice(symbols)}`;
    }
    
    const romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    
    let romanNumeral = '';
    
    for (let key in romanNumerals) {
        while (number >= romanNumerals[key]) {
            romanNumeral += key;
            number -= romanNumerals[key];
        }
    }
    return romanNumeral;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function toColour(colour) {
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
};

function drawCircle(x, y, radius, fill, stroke, strokeWidth, opacity, absolute) { // draw a circle
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    if (absolute) {
        ctx.arc(x*data.constants.zoom, y*data.constants.zoom, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    } else {
        ctx.arc((-player.x+x)*data.constants.zoom+display.x/2, (-player.y+y)*data.constants.zoom+display.y/2, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    }
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth*data.constants.zoom;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
};

function displaytxt(txt, pos) {
    var canvas = document.getElementById("canvasOverlay");
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Set the font and text color
    ctx.font = "20px Verdana";
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    // Display the points on the canvas
    ctx.fillText(txt, pos.x*data.constants.zoom, pos.y*data.constants.zoom);
    ctx.stroke();
    ctx.restore();
};

function rotatePolygon(point, r) {
    let points = JSON.parse(JSON.stringify(point));
    for (let i = 0; i < points.length; i++) {
        points[i].x = point[i].x * Math.cos(r) - point[i].y * Math.sin(r); 
        points[i].y = point[i].x * Math.sin(r) + point[i].y * Math.cos(r); 
    }
    return points
};

function drawPolygon(point, offset, r, fill, stroke, absolute, debug=false) {
    let points = JSON.parse(JSON.stringify(point));
    //console.log(points);
    if (points.length < 3) {
        throw "Error: Your polygon needs to have at least 3 points dumbass";
    }
    points = rotatePolygon(points, r)
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo((points[0].x + offset.x)*data.constants.zoom, (points[0].y + offset.y)*data.constants.zoom);
        if (debug) {displaytxt(`(${Math.round((points[0].x + offset.x)*data.constants.zoom)}, ${Math.round((points[0].y + offset.y)*data.constants.zoom)})`, {x: (points[0].x + offset.x)*data.constants.zoom, y: (points[0].y + offset.y)*data.constants.zoom});}
    } else {
        ctx.moveTo((points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2, (points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2);
        if (debug) {displaytxt(`(${Math.round((points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2)}, ${Math.round((points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2)})`, {x: (points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2, y: (points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2});}
        //if (debug) {displaytxt(`(${Math.round(points[0].x-player.x+display.x/2 + offset.x)}, ${Math.round(points[0].y-player.y+display.y/2 + offset.y)})`, {x: points[0].x-player.x+display.x/2 + offset.x, y: points[0].y-player.y+display.y/2 + offset.y});}
    }
    for (let i = 1; i < points.length; i++) {
        if (absolute) {
            ctx.lineTo((points[i].x + offset.x)*data.constants.zoom, (points[i].y + offset.y)*data.constants.zoom);
            if (debug) {displaytxt(`(${Math.round((points[i].x + offset.x)*data.constants.zoom)}, ${Math.round((points[i].y + offset.y)*data.constants.zoom)})`, {x: (points[i].x + offset.x)*data.constants.zoom, y: (points[i].y + offset.y)*data.constants.zoom});}
        } else {
            ctx.lineTo((points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2, (points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2);
            if (debug) {displaytxt(`(${Math.round((points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2)}, ${Math.round((points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2)})`, {x: (points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2, y: (points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2});}
            //if (debug) {displaytxt(`(${Math.round(points[i].x-player.x+display.x/2 + offset.x)}, ${Math.round(points[i].y-player.y+display.y/2 + offset.y)})`, {x: points[i].x-player.x+display.x/2 + offset.x, y: points[i].y-player.y+display.y/2 + offset.y});}
        }
    }
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = stroke.width*data.constants.zoom;
        ctx.strokeStyle = stroke.colour;
        ctx.stroke();
    }
};

function rect(coords, size, style, absolute=false, canvas='main') {
    var canvas = document.getElementById(canvas);
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo(coords.x*data.constants.zoom, coords.y*data.constants.zoom);
        ctx.lineTo(coords.x*data.constants.zoom, (coords.y+size.y)*data.constants.zoom);
        ctx.lineTo((coords.x+size.x)*data.constants.zoom, (coords.y+size.y)*data.constants.zoom);
        ctx.lineTo((coords.x+size.x)*data.constants.zoom, coords.y*data.constants.zoom);
    } else {
        ctx.moveTo((coords.x-player.x)*data.constants.zoom+display.x/2, (coords.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((coords.x-player.x)*data.constants.zoom+display.x/2, (coords.y+size.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((coords.x+size.x-player.x)*data.constants.zoom+display.x/2, (coords.y+size.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((coords.x+size.x-player.x)*data.constants.zoom+display.x/2, (coords.y-player.y)*data.constants.zoom+display.y/2);
    }
    ctx.closePath();
    ctx.fillStyle = style.fill;
    ctx.fill();
    ctx.lineWidth = style.stroke.width*data.constants.zoom;
    ctx.strokeStyle = style.stroke.colour;
    ctx.stroke();
}

function renderBar(centre, shift, size, value, increments, padding, spacing, bgStyle, fillStyle) {
    let vPadding = {x: padding, y: padding};
    let startPos = vMath(centre, vMath(size, 0.5, '*'), '-');
    if (shift != 0) {
        startPos = vMath(startPos, shift, '+');
    }
    let blockSize = {x: (size.x - spacing * (increments-1)) / increments, y: size.y};
    rect(vMath(startPos, vPadding, '-'), vMath(size, vMath(vPadding, 2, '*'), '+'), bgStyle);
    for (let i = 0; i < value; i++) {
        rect(startPos, blockSize, fillStyle);
        startPos.x += spacing + blockSize.x;
    }
};

function drawLight(x, y, radius) {
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    if (false) {
        ctx.arc(x*data.constants.zoom, y*data.constants.zoom, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    } else {
        ctx.arc((player.x+x)*data.constants.zoom+display.x/2, (player.y+y)*data.constants.zoom+display.y/2, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    }
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;

    ctx.fill();
};

function grid(spacing, reference) { // TODO: update colours
    for (let i = 0; i >= reference.x - (display.x/2 + spacing*5)/data.constants.zoom; i -= spacing) {
        drawLine({x: i, y: reference.y + (display.y/2 + spacing)/data.constants.zoom}, 3*Math.PI/2, (display.y + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
    for (let i = 0; i <= reference.x + (display.x/2 + spacing*5)/data.constants.zoom; i += spacing) {
        drawLine({x: i, y: reference.y + (display.y/2 + spacing)/data.constants.zoom}, 3*Math.PI/2, (display.y + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
    for (let i = 0; i >= reference.y - (display.y/2 + spacing*5)/data.constants.zoom; i -= spacing) {
        drawLine({x: reference.x + (display.x/2 + spacing)/data.constants.zoom, y: i}, Math.PI, (display.x + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
    for (let i = 0; i <= reference.y + (display.y/2 + spacing*5)/data.constants.zoom; i += spacing) {
        drawLine({x: reference.x + (display.x/2 + spacing)/data.constants.zoom, y: i}, Math.PI, (display.x + spacing*2)/data.constants.zoom, {colour:'#000000',width:10,opacity:0.05}, false);
    }
};

function renderExplosion(explosion) {
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, explosion.r, '#fccbb1', '#f7b28d', 0.1, 0.2*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, explosion.r, false, '#f7b28d', 5, 0.2);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-20, 0), false, '#fcd8d2', 20, 0.1*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-15, 0), false, '#fcd8d2', 15, 0.1*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-10, 0), false, '#fcd8d2', 10, 0.1*explosion.transparancy, false);
    drawCircle(explosion.x-explosion.r, explosion.y-explosion.r, Math.max(explosion.r-5, 0), false, '#fcd8d2', 5, 0.1*explosion.transparancy, false);
    drawLight(explosion.x-explosion.r, explosion.y-explosion.r, explosion.r*1.1);
};

function handleExplosion(explosion) {
    //console.log(explosion);
    if (explosion.r >= explosion.maxR) {
        explosion.transparancy *= 0.75;
        explosion.r *= 1.2;
        explosion.active = false;
    }
    if (explosion.r < explosion.maxR) {
        explosion.active = true;
        explosion.r += explosion.expandSpeed;
        if (explosion.r > explosion.maxR) {
            explosion.r = explosion.maxR;
        }
    }
    if (explosion.transparancy > 0.25) {
        return explosion;
    } return false;
};

function normalDistribution(mean, sDiv) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); 
    while (v === 0) v = Math.random(); 
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return mean + z * sDiv;
};

function raySegmentIntersection(pointIn, segmentIn) {
    let point = vMath(pointIn, 1.1, 'multiply');
    let segment = {start: vMath(segmentIn.start, 1.1, 'multiply'), end: vMath(segmentIn.end, 1.1, 'multiply')};
    let A1 = adjustAngle(correctAngle(aim(point, segment.start)));
    let A2 = adjustAngle(correctAngle(aim(point, segment.end)));
    if ((A1 >= 0 && A2 <= 0 || A2 >= 0 && A1 <= 0) && Math.abs(A1) + Math.abs(A2) < Math.PI) {
        return true;
    }
    return false;
};

function pointInPolygon(point, polygon) {
    let inside = false;
    let cnt = 0;
    if (raySegmentIntersection(point, {start: polygon[0], end: polygon[polygon.length-1]})) {
        inside = !inside;
        cnt++;
    }
    for (let i = 0; i < polygon.length-1; i++) {
        if (raySegmentIntersection(point, {start: polygon[i], end: polygon[i+1]})) {
            inside = !inside;
            cnt++;
        }
    }
    return inside;
};

function vMath(v1, v2, mode) { 
    switch (mode) {
        case '||':
        case 'magnitude':
            return Math.sqrt(v1.x**2+v1.y**2);
        case '+': 
        case 'addition':
        case 'add':
            return {x: v1.x+v2.x, y: v1.y+v2.y};
        case '-': 
        case 'subtraction':
        case 'subtract':
            return {x: v1.x-v2.x, y: v1.y-v2.y};
        case '*': 
        case 'x': 
        case 'scalar multiplication':
        case 'multiplication':
        case 'multiply': // v2 is now a scalar
            return {x: v1.x*v2, y: v1.y*v2};
        case '/': 
        case 'division':
        case 'divide': // v2 is now a scalar
            return {x: v1.x/v2, y: v1.y/v2};
        case '•': 
        case '.': 
        case 'dot product': 
            return v1.x * v2.x + v1.y * v2.y;
        case 'cross product': // chat gpt, I believe in you (I doubt this is correct)
            return v1.x * v2.y - v1.y * v2.x;
        case 'projection':
        case 'vector resolute':
        return vMath(v2, vMath(v1, v2, '.')/vMath(v2, null, '||')**2, 'x');
        default:
            throw 'what are you trying to do to to that poor vector?';
    }
};

function toComponent(m, r) {
    return {x: m * Math.sin(r), y: -m * Math.cos(r)};
};

function toPol(i, j) {
    return {m: Math.sqrt(i**2+j**2), r: aim({x: 0, y: 0}, {x: i, y: j})};
};

function circleToPolygon(pos, r, sides) {
    let step = Math.PI*2/sides;
    let polygon = [];
    for(let i = 0; i < sides; i++) {
        polygon.push(vMath(toComponent(r, step*i),pos,'add'));
    }
    return polygon;
};

function pressKey(key) {
    orders.push({id: key, value: true});
}

function releaseKey(key) {
    orders.push({id: key, value: false});
}

const noAI = `
let orders = [];
return orders;
`;

const basicTurretAI = `
let orders = [];
let target = entities[0];
orders.push({id: 'aim', value: {x: target.x, y: target.y}});
orders.push({id: 'click', value: true});
return orders;
`;

const basicShootingAI = `
let orders = [];
let target = entities[0];
let nr = adjustAngle(correctAngle(aim(unit, target)-unit.r));
if (Math.abs(nr) > Math.PI/48) {
    if (nr > 0) {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    } else {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    }
}
let dist = getDist(unit, target);
if (Math.abs(nr) < Math.PI/6 && dist > 750) {
    orders.push({id: 'w', value: true});
    orders.push({id: 's', value: false});
}
if (dist < 750) {
    orders.push({id: 's', value: true});
    orders.push({id: 'w', value: false});
}
if ((Math.abs(aim(unit, entities[0])) < Math.PI || Math.PI*2-Math.abs(aim(unit, entities[0])) < Math.PI) && dist < 1250) {
    orders.push({id: 'click', value: true});
} else {
    orders.push({id: 'click', value: false});
}
return orders;
`;

const ramAI = `
let orders = [];
let target = entities[0];
orders.push({id: 'aim', value: {x: target.x, y: target.y}});
orders.push({id: 'click', value: true});
let nr = adjustAngle(correctAngle(aim(unit, target)-unit.r));
if (Math.abs(nr) > Math.PI/48) {
    if (nr > 0) {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    } else {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    }
}
let dist = getDist(unit, target);
if (Math.abs(nr) < Math.PI/6 && dist > 200) {
    orders.push({id: 'w', value: true});
    orders.push({id: 's', value: false});
}if (dist < 200) {
    orders.push({id: 's', value: true});
    orders.push({id: 'w', value: false});
}
if ((Math.abs(aim(unit, entities[0])) < Math.PI || Math.PI*2-Math.abs(aim(unit, entities[0])) < Math.PI) && dist < 400) {
    orders.push({id: 'click', value: true});
} else {
    orders.push({id: 'click', value: false});
}
return orders;
`;

const basicMovingTargetAI = `
let orders = [];
let target = entities[0];
if (unit.x > 1500) {
    orders.push({id: 'a', value: true});
    orders.push({id: 'd', value: false});
} else if (unit.x < -1500) {
    orders.push({id: 'a', value: false});
    orders.push({id: 'd', value: true});
}
return orders;
`;

const betterTurretAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    orders.push({id: 'aim', value: {x: target.x, y: target.y}});
    orders.push({id: 'click', value: true});
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const shieldAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let caim = toPol(target.x-unit.x, target.y-unit.y);
    caim.r -= Math.PI/2;
    let naim = vMath(toComponent(caim.m, caim.r), unit, '+');
    orders.push({id: 'aim', value: naim});
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
}

return orders;
`;

// Aim assist program
const advancedTurretAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=30;
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    drawLine(unit, aim(unit, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony})-Math.PI/2, 5000, data.red.stroke, false);
    orders.push({id: 'aim', value: {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony}});
    if (dist < 3500) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const sniperTurretAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=50;
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    drawLine(unit, aim(unit, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony})-Math.PI/2, 5000, data.red.stroke, false);
    orders.push({id: 'aim', value: {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony}});
    if (dist < 3500) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
console.log(orders);
return orders;
`;

const aimAssistAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=10;
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    drawLine(unit, aim(unit, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony})-Math.PI/2, 5000, data.green.stroke, false);
    orders.push({id: 'aim', value: {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony}});
    if (dist < 5000) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const leftArmAssistAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=30;
    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    let aimr = aim(newpos, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony});
    renderLine(unit, aimr, 5000, 'green');
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    if (dist < 5000) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const rightArmAssistAI = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=30;
    let offset = toPol(100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    let aimr = aim(newpos, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony});
    renderLine(unit, aimr, 5000, 'green');
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    if (dist < 5000) {
        orders.push({id: 'click', value: true});
    } else {
        orders.push({id: 'click', value: false});
    }
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y}});
    orders.push({id: 'click', value: false});
}
return orders;
`;

const scriptMovementI = `
let orders = [];
orders.push({id: 'w', value: true});
return orders;
`;

const scriptMovementII = `
let orders = [];
if (unit.y > -2000) {
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 'd', value: true});
}
return orders;
`;

const scriptMovementIV = `
let orders = [];

let aDist = 200;
let target = undefined;
let minDist = 9999999;
let minR = 9999999;
for (let i = 1; i < entities.length; i++) {
    let dist = getDist(unit, entities[i]);
    let r = aim(unit, entities[i]);
    if (dist < minDist || (dist < 475 && Math.abs(r - unit.r) < minR)) {
        target = entities[i];
        minDist = dist;
        minR = r;
    }
}

if (!target) {
    target = checkpoint;
    aDist = 50;
}
let xdist = target.x - unit.x;
let ydist = target.y - unit.y;

let dist = getDist(unit, target);
if (Math.abs(dist) > aDist) {
    if (xdist > aDist) {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    } else if (xdist < -aDist) {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    } else {
        orders.push({id: 'a', value: false});
        orders.push({id: 'd', value: false});
    }
    if (ydist > aDist) {
        orders.push({id: 's', value: true});
        orders.push({id: 'w', value: false});
    } else if (ydist < -aDist) {
        orders.push({id: 'w', value: true});
        orders.push({id: 's', value: false});
    } else {
        orders.push({id: 'w', value: false});
        orders.push({id: 's', value: false});
    }
} else if (Math.abs(dist) < 125) {
    console
    if (xdist > 0) {
        orders.push({id: 'a', value: true});
        orders.push({id: 'd', value: false});
    } else {
        orders.push({id: 'd', value: true});
        orders.push({id: 'a', value: false});
    }
    if (ydist > 0) {
        orders.push({id: 'w', value: true});
        orders.push({id: 's', value: false});
    } else {
        orders.push({id: 's', value: true});
        orders.push({id: 'w', value: false});
    }
}

let offset = toPol(100, 0);
offset.r += aim(unit, {x: target.x, y: target.y});
offset = toComponent(offset.m, offset.r);
let newpos = vMath(unit, offset, '+');
let aimr = aim(newpos, {x: target.x, y: target.y});

orders.push({id: 'aim', value: vMath(vMath(unit, toComponent(dist, aimr), '+'), {x: randint(0,20)-10, y: randint(0,20)-10}, '+')});
if (dist < 600) {
    orders.push({id: 'click', value: true});
} else {
    orders.push({id: 'click', value: false});
}
return orders;
`;

const scriptAimingI = `
let orders = [];
let target = entities[1];

if (target) {
    let dist = getDist(unit, target);

    let offset = toPol(100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let aimr = aim(newpos, {x: target.x, y: target.y});

    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});
}
return orders;
`;

const scriptAimingII = `
let orders = [];
let target = entities[1];

if (target) {
    orders.push({id: 'aim', value: target});
    orders.push({id: 'click', value: true});
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 's', value: true});
    orders.push({id: 'click', value: false});
}

return orders;
`;

const scriptAimingIII = `
let orders = [];
let target = entities[1];

if (target) {
    let dist = getDist(unit, target);

    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let aimr = aim(newpos, {x: target.x, y: target.y});

    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 's', value: true});
    orders.push({id: 'click', value: false});
}

return orders;
`;

const scriptAimingIV = `
let orders = [];
let target = undefined;
for (let i = 0; i < entities.length; i++) {
    if (entities[i].team != unit.team) {
        if (target == undefined || getDist(unit, entities[i]) < getDist(unit, target)) {
            target = entities[i];
        }
    }
}
if (target) {
    let dist = getDist(unit, target);
    const bulletVelocity=55;
    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let time = dist/bulletVelocity;
    let enemymotionx = time*target.vx;
    let enemymotiony = time*target.vy;
    let playermotionx = unit.v*Math.cos(unit.r);
    let playermotiony = unit.v*Math.sin(unit.r);
    let aimr = aim(newpos, {x: target.x+enemymotionx+playermotionx, y: target.y+enemymotiony+playermotiony});
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});
    orders.push({id: 'w', value: true});
} else {
    orders.push({id: 'w', value: false});
    orders.push({id: 's', value: true});
    orders.push({id: 'click', value: false});
}

return orders;
`;

const scriptCombatI = `
let orders = [];
let target = entities[1];

if (target) {
    orders.push({id: 'aim', value: {x: target.x, y: target.y}});
    orders.push({id: 'click', value: true});
}
return orders;
`;

const scriptCombatII = `
let orders = [];
let target = entities[1];
if (target) {
    let dist = getDist(unit, target);
    let offset = toPol(-100, 0);
    offset.r += aim(unit, {x: target.x, y: target.y});
    offset = toComponent(offset.m, offset.r);
    let newpos = vMath(unit, offset, '+');
    let aimr = aim(newpos, {x: target.x, y: target.y});
    orders.push({id: 'aim', value: vMath(unit, toComponent(dist, aimr), '+')});
    orders.push({id: 'click', value: true});orders.push({id: 'd', value: true});
} else {
    orders.push({id: 'aim', value: {x: unit.x, y: unit.y+1}});
    orders.push({id: 'click', value: false});
    orders.push({id: 'd', value: false});
    orders.push({id: 'a', value: true});
}
return orders;
`;

// The return of the excessively overcomplicated data storage system
const laser = [
    {
        id: 'laserOutlineMain',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 25,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.8)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserOutlineTail',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -25, y: 0},
            {x: 0, y: 55},
            {x: 25, y: 0},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.8)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserBodyMain',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 20,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.9)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserBodyTail',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -20, y: 0},
            {x: 0, y: 50},
            {x: 20, y: 0},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.9)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserGlow',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 30,
        scale: {x: 1, y: 2},
        offset: {x: 0, y: 15},
        style: {
            fill: 'rgba(255, 0, 0, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const laser2 = [
    {
        id: 'laserOutlineMain',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 25,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(236, 90, 199, 0.8)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserOutlineTail',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -25, y: 0},
            {x: 0, y: 55},
            {x: 25, y: 0},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(236, 90, 199, 0.8)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserBodyMain',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 20,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.7)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserBodyTail',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -20, y: 0},
            {x: 0, y: 50},
            {x: 20, y: 0},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.7)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserGlow',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 30,
        scale: {x: 1, y: 2},
        offset: {x: 0, y: 15},
        style: {
            fill: 'rgba(236, 90, 199, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const laserBeam = [
    {
        id: 'laserOutlineMain',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 10,
        scale: {x: 1, y: 4},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.8)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserBodyMain',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 7,
        scale: {x: 1, y: 4},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.9)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'laserGlow',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 12,
        scale: {x: 1, y: 5},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const skibidiHead = [
    {
        id: 'neck',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -50, y: 20}, 
            {x: -40, y: -300}, 
            {x: 40, y: -300}, 
            {x: 50, y: 20}, 
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(235, 197, 139, 1)',
            stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
        },
    },
    {
        id: 'head',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 50,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: -320},
        style: {
            fill: 'rgba(235, 197, 139, 1)',
            stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
        },
    },
    {
        id: 'eye1',
        facing: 'body',
        type: 'circle', 
        rOffset: -Math.PI/6,
        size: 8,
        scale: {x: 1.2, y: 1},
        offset: {x: -29, y: -335},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
        },
    },
    {
        id: 'eye2',
        facing: 'body',
        type: 'circle', 
        rOffset: Math.PI/6,
        size: 8,
        scale: {x: 1.2, y: 1},
        offset: {x: 29, y: -335},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
        },
    },
    {
        id: 'pupil1',
        facing: 'body',
        type: 'circle', 
        rOffset: -Math.PI/6,
        size: 4,
        scale: {x: 1.2, y: 1},
        offset: {x: -30, y: -338},
        style: {
            fill: 'rgba(0, 0, 0, 1)',
            stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
        },
    },
    {
        id: 'pupil1',
        facing: 'body',
        type: 'circle', 
        rOffset: Math.PI/6,
        size: 4,
        scale: {x: 1.2, y: 1},
        offset: {x: 30, y: -338},
        style: {
            fill: 'rgba(0, 0, 0, 1)',
            stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
        },
    },
    {
        id: 'eyebrow1',
        facing: 'body',
        type: 'polygon', 
        rOffset: -Math.PI/6,
        size: [
            {x: -12, y: 4}, 
            {x: -12, y: -4}, 
            {x: 12, y: -4}, 
            {x: 12, y: 4}, 
        ],
        scale: {x: 1, y: 1},
        offset: {x: -27, y: -328},
        style: {
            fill: 'rgba(0, 0, 0, 0.6)',
            stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
        },
    },
    {
        id: 'eyebrow2',
        facing: 'body',
        type: 'polygon', 
        rOffset: Math.PI/6,
        size: [
            {x: -12, y: 4}, 
            {x: -12, y: -4}, 
            {x: 12, y: -4}, 
            {x: 12, y: 4}, 
        ],
        scale: {x: 1, y: 1},
        offset: {x: 27, y: -328},
        style: {
            fill: 'rgba(0, 0, 0, 0.6)',
            stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
        },
    },
];

const bullet = [
    {
        id: 'bullet',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 10,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(150, 150, 150, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
        },
    },
];

const cannonBall = [
    {
        id: 'cannonBall',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 25,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(100, 100, 100, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
        },
    },
];

const sniperShot = [
    {
        id: 'sniperShot',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -10, y: 9},
            {x: -10, y: -24},
            {x: 0, y: -27},
            {x: 10, y: -24},
            {x: 10, y: 9},
            {x: 0, y: 12},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.8)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'sniperShotInner',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -6, y: 5},
            {x: -6, y: -20},
            {x: 0, y: -23},
            {x: 6, y: -20},
            {x: 6, y: 5},
            {x: 0, y: 8},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.9)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'sniperShotGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -18, y: 15},
            {x: -18, y: -30},
            {x: 0, y: -33},
            {x: 18, y: -30},
            {x: 18, y: 15},
            {x: 0, y: 18},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const plasmaBlast = [
    {
        id: 'plasmaOutline',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 40,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(236, 90, 199, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'plasmaBody',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 30,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.9)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'plasmaGlow',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 50,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(236, 90, 199, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const fusionBlast = [
    {
        id: 'plasmaOutline',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 15,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 200, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'plasmaBody',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 10,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 0.9)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'plasmaGlow',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 25,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 200, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const singularity = [
    {
        id: 'body',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 10,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 1)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'spiral1',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 0, y: 0},
            {x: -5, y: 0},
            {x: -5, y: 30},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'spiral2',
        facing: 'body',
        type: 'polygon', 
        rOffset: 2*Math.PI/5,
        size: [
            {x: 0, y: 0},
            {x: -5, y: 0},
            {x: -5, y: 30},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'spiral3',
        facing: 'body',
        type: 'polygon', 
        rOffset: 4*Math.PI/5,
        size: [
            {x: 0, y: 0},
            {x: -5, y: 0},
            {x: -5, y: 30},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'spiral4',
        facing: 'body',
        type: 'polygon', 
        rOffset: 6*Math.PI/5,
        size: [
            {x: 0, y: 0},
            {x: -5, y: 0},
            {x: -5, y: 30},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'spiral5',
        facing: 'body',
        type: 'polygon', 
        rOffset: 8*Math.PI/5,
        size: [
            {x: 0, y: 0},
            {x: -5, y: 0},
            {x: -5, y: 30},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.5)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'glow1',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 20,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'glow2',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 25,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
    {
        id: 'glow3',
        facing: 'body',
        type: 'circle', 
        rOffset: 0,
        size: 30,
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 0.2)',
            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
        },
    },
];

const railDart = [
    {
        id: 'railDart',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: -4, y: 0},
            {x: 4, y: 0},
            {x: 4, y: -8},
            {x: 2, y: -10},
            {x: 2, y: -35},
            {x: 0, y: -40},
            {x: -2, y: -35},
            {x: -2, y: -10},
            {x: -4, y: -8},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 0, 0, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

const redBeam = [
    {
        id: 'beamOutline',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 10, y: 0},
            {x: -10, y: 0},
            {x: -10, y: -2500},
            {x: 10, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.7)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamCore',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 6, y: 0},
            {x: -6, y: 0},
            {x: -6, y: -2500},
            {x: 6, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 15, y: 0},
            {x: -15, y: 0},
            {x: -15, y: -2500},
            {x: 15, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 0, 0, 0.2)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

const orangeBeam = [
    {
        id: 'beamOutline',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 10, y: 0},
            {x: -10, y: 0},
            {x: -10, y: -2500},
            {x: 10, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 165, 0, 0.7)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamCore',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 6, y: 0},
            {x: -6, y: 0},
            {x: -6, y: -2500},
            {x: 6, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 15, y: 0},
            {x: -15, y: 0},
            {x: -15, y: -2500},
            {x: 15, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 165, 0, 0.2)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

const greenBeam = [
    {
        id: 'beamOutline',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 10, y: 0},
            {x: -10, y: 0},
            {x: -10, y: -2500},
            {x: 10, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 255, 0, 0.7)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamCore',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 6, y: 0},
            {x: -6, y: 0},
            {x: -6, y: -2500},
            {x: 6, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 15, y: 0},
            {x: -15, y: 0},
            {x: -15, y: -2500},
            {x: 15, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 255, 0, 0.2)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

const railBeam = [
    {
        id: 'beamOutline',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 15, y: 0},
            {x: -15, y: 0},
            {x: -15, y: -2500},
            {x: 15, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 200, 255, 0.7)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamCore',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 8, y: 0},
            {x: -8, y: 0},
            {x: -8, y: -2500},
            {x: 8, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 25, y: 0},
            {x: -25, y: 0},
            {x: -25, y: -2500},
            {x: 25, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 200, 255, 0.2)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

const railBeamWide = [
    {
        id: 'beamOutline',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 20, y: 0},
            {x: -20, y: 0},
            {x: -20, y: -2500},
            {x: 20, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 200, 255, 0.7)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamCore',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 14, y: 0},
            {x: -14, y: 0},
            {x: -14, y: -2500},
            {x: 14, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 33, y: 0},
            {x: -33, y: 0},
            {x: -33, y: -2500},
            {x: 33, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 200, 255, 0.2)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

const gravitonBeam = [
    {
        id: 'beamOutline',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 20, y: 0},
            {x: -20, y: 0},
            {x: -20, y: -2500},
            {x: 20, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 255, 0, 0.7)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamCore',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 14, y: 0},
            {x: -14, y: 0},
            {x: -14, y: -2500},
            {x: 14, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(255, 255, 255, 1)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
    {
        id: 'beamGlow',
        facing: 'body',
        type: 'polygon', 
        rOffset: 0,
        size: [
            {x: 33, y: 0},
            {x: -33, y: 0},
            {x: -33, y: -2500},
            {x: 33, y: -2500},
        ],
        scale: {x: 1, y: 1},
        offset: {x: 0, y: 0},
        style: {
            fill: 'rgba(0, 255, 0, 0.2)',
            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
        },
    },
];

var data = {
    constants: {
        zoom: 0.5,
        TPS: 60,
        FPS: 60,
        extraEnemies: 0,
    },
    mech: { // cameraman
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        lastMoved: 69,
        v: 10, // normal walking speed
        vr: 540 / 60 / 180 * Math.PI, // rotation of tracks (feet)
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 2100,
        groundCollisionR: 80,
        tallCollisionR: 150,
        directControl: false,
        noClip: false,
        type: 'mech',
        unitType: 'mech',
        hp: 10,
        value: 0,
        alive: true,
        hitbox: [
            {
                id: 'mainBody',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -70, y: 40},
                    {x: 70, y: 40},
                    {x: 70, y: -40},
                    {x: -70, y: -40},
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
            },
            {
                id: 'armRight',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -25, y: 50},
                    {x: 25, y: 50},
                    {x: 25, y: -70},
                    {x: -25, y: -70},
                ],
                scale: {x: 1, y: 1},
                offset: {x: 100, y: 0},
            },
            {
                id: 'armLeft',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -25, y: 50},
                    {x: 25, y: 50},
                    {x: 25, y: -70},
                    {x: -25, y: -70},
                ],
                scale: {x: 1, y: 1},
                offset: {x: -100, y: 0},
            },
        ],
        parts: [
            {
                id: 'LowerBodyContainer',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 35,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(140, 140, 140, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                },
            },
            {
                id: 'foot1',
                type: 'polygon', 
                facing: 'body',
                rOffset: 0,
                size: [
                    {x: -10, y: 60},
                    {x: 10, y: 60},
                    {x: 15, y: 50},
                    {x: 15, y: -50},
                    {x: 10, y: -60},
                    {x: -10, y: -60},
                    {x: -15, y: -50},
                    {x: -15, y: 50},
                ],
                scale: {x: 1, y: 1},
                offset: {x: -30, y: -5},
                style: {
                    fill: 'rgba(130, 130, 130, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                },
            },
            {
                id: 'foot2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -10, y: 60},
                    {x: 10, y: 60},
                    {x: 15, y: 50},
                    {x: 15, y: -50},
                    {x: 10, y: -60},
                    {x: -10, y: -60},
                    {x: -15, y: -50},
                    {x: -15, y: 50},
                ],
                scale: {x: 1, y: 1},
                offset: {x: 30, y: -5},
                style: {
                    fill: 'rgba(130, 130, 130, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                },
            },
            {
                id: 'lowerBody',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 35,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(140, 140, 140, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                },
            },
            {
                id: 'mainBodycontainer',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -60, y: 40},
                    {x: 60, y: 40},
                    {x: 70, y: 30},
                    {x: 70, y: -30},
                    {x: 60, y: -40},
                    {x: -60, y: -40},
                    {x: -70, y: -30},
                    {x: -70, y: 30},
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(210, 210, 210, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 10},
                },
            },
            {
                id: 'armLeft',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -20, y: 50},
                    {x: 20, y: 50},
                    {x: 25, y: 40},
                    {x: 25, y: -60},
                    {x: 20, y: -70},
                    {x: -20, y: -70},
                    {x: -25, y: -60},
                    {x: -25, y: 40},
                ],
                scale: {x: 1, y: 1},
                offset: {x: -100, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 10},
                },
            },
            {
                id: 'leftArmMain',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
            },
            {
                id: 'leftArmSide',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
            },
            {
                id: 'armRight',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -20, y: 50},
                    {x: 20, y: 50},
                    {x: 25, y: 40},
                    {x: 25, y: -60},
                    {x: 20, y: -70},
                    {x: -20, y: -70},
                    {x: -25, y: -60},
                    {x: -25, y: 40},
                ],
                scale: {x: 1, y: 1},
                offset: {x: 100, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 10},
                },
            },
            {
                id: 'rightArmMain',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
            },
            {
                id: 'rightArmSide',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
            },
            {
                id: 'mainBody',
                facing: 'turret',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -60, y: 40},
                    {x: 60, y: 40},
                    {x: 70, y: 30},
                    {x: 70, y: -30},
                    {x: 60, y: -40},
                    {x: -60, y: -40},
                    {x: -70, y: -30},
                    {x: -70, y: 30},
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(210, 210, 210, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 10},
                },
            },
            {
                id: 'back',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                scale: {x: 1, y: 1},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
            },
            {
                id: 'cameraHead',
                facing: 'turret',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -15, y: -20}, 
                    {x: 15, y: -20}, 
                    {x: 20, y: 20}, 
                    {x: -20, y: 20}, 
                ],
                scale: {x: 1.5, y: 1.5},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                },
            },
            {
                id: 'cameraHead2',
                facing: 'turret',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 20}, 
                    {x: -30, y: 35}, 
                    {x: 30, y: 35}, 
                    {x: 20, y: 20}, 
                ],
                scale: {x: 1.5, y: 1.5},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                },
            },
            {
                id: 'headTurret',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
            },
        ],
        effects: [],
    },
    skibidiToilet: { // bite attack
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        v: 7, // top speed
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        vr: Math.PI/120,
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 2100,
        groundCollisionR: 0,
        tallCollisionR: 0,
        isMoving: false,
        directControl: false,
        noClip: false,
        type: 'tank',
        unitType: 'skibidiToilet',
        hp: 5,
        value: 50,
        alive: true,
        hitbox: [
            {
                id: 'skibidi toilet',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -50}, 
                    {x: 25, y: -50}, 
                    {x: 15, y: 30}, 
                    {x: -15, y: 30}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
            },
        ],
        parts: [
            {
                id: 'toiletBody',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -20, y: 10}, 
                    {x: -15, y: 25}, 
                    {x: -5, y: 33}, 
                    {x: 0, y: 34}, 
                    {x: 5, y: 33}, 
                    {x: 15, y: 25}, 
                    {x: 20, y: 10}, 
                    {x: 20, y: 0}, 
                    {x: 17, y: -20}, 
                    {x: -17, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowl',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 17}, 
                    {x: -10, y: 23}, 
                    {x: -5, y: 27}, 
                    {x: 0, y: 28}, 
                    {x: 5, y: 27}, 
                    {x: 10, y: 23}, 
                    {x: 13, y: 17}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 9}, 
                    {x: -10, y: 12}, 
                    {x: -5, y: 14}, 
                    {x: 0, y: 15}, 
                    {x: 5, y: 14}, 
                    {x: 10, y: 12}, 
                    {x: 13, y: 9}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.2)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankSide',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -17, y: -20}, 
                    {x: -25, y: -35}, 
                    {x: 25, y: -35}, 
                    {x: 17, y: -20}, 
                    ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankTop',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -35}, 
                    {x: -25, y: -55}, 
                    {x: 25, y: -55}, 
                    {x: 25, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'flushButton',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 20,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 180},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -23, y: -35}, 
                    {x: -20, y: -41}, 
                    {x: -15, y: -44}, 
                    {x: -5, y: -48}, 
                    {x: 5, y: -48}, 
                    {x: 15, y: -44}, 
                    {x: 20, y: -41}, 
                    {x: 23, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletSeat',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatInner',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 3, y: 3},
                offset: {x: 0, y: 7},
                style: {
                    fill: 'rgba(195, 195, 195, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'head',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 50,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -20},
                style: {
                    fill: 'rgba(235, 197, 139, 1)',
                    stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 120},
                    spread: 0,
                    bullet: {
                        v: 0,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 1,
                        parts: skibidiHead,
                        cType: 'line',
                        cSize: {
                            start: {x: 0, y: -100},
                            end: {x: 0, y: -400},
                        },
                        life: 12, 
                        dmg: 2,
                        persistent: true,
                    },
                }
            },
            {
                id: 'eye1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: -29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eye2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: 29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: -30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: 30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eyebrow1',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'eyebrow2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -15, y: 5}, 
                    {x: -10, y: 7}, 
                    {x: 0, y: 8}, 
                    {x: 10, y: 7}, 
                    {x: 15, y: 5}, 
                    {x: 20, y: 0}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -50},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
        ],
        effects: [],
    },
    jetSkibidiToilet: { // bite attack
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        v: 14, // top speed
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        vr: Math.PI/180,
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 2100,
        groundCollisionR: 0,
        tallCollisionR: 0,
        isMoving: false,
        directControl: false,
        noClip: false,
        type: 'tank',
        unitType: 'jetSkibidiToilet',
        hp: 8,
        value: 400,
        alive: true,
        hitbox: [
            {
                id: 'skibidi toilet',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -50}, 
                    {x: 25, y: -50}, 
                    {x: 15, y: 30}, 
                    {x: -15, y: 30}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
            },
        ],
        parts: [
            {
                id: 'toiletBody',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -20, y: 10}, 
                    {x: -15, y: 25}, 
                    {x: -5, y: 33}, 
                    {x: 0, y: 34}, 
                    {x: 5, y: 33}, 
                    {x: 15, y: 25}, 
                    {x: 20, y: 10}, 
                    {x: 20, y: 0}, 
                    {x: 17, y: -20}, 
                    {x: -17, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowl',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 17}, 
                    {x: -10, y: 23}, 
                    {x: -5, y: 27}, 
                    {x: 0, y: 28}, 
                    {x: 5, y: 27}, 
                    {x: 10, y: 23}, 
                    {x: 13, y: 17}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 9}, 
                    {x: -10, y: 12}, 
                    {x: -5, y: 14}, 
                    {x: 0, y: 15}, 
                    {x: 5, y: 14}, 
                    {x: 10, y: 12}, 
                    {x: 13, y: 9}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.2)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankSide',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -17, y: -20}, 
                    {x: -25, y: -35}, 
                    {x: 25, y: -35}, 
                    {x: 17, y: -20}, 
                    ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankTop',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -35}, 
                    {x: -25, y: -55}, 
                    {x: 25, y: -55}, 
                    {x: 25, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'flushButton',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 20,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 180},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -23, y: -35}, 
                    {x: -20, y: -41}, 
                    {x: -15, y: -44}, 
                    {x: -5, y: -48}, 
                    {x: 5, y: -48}, 
                    {x: 15, y: -44}, 
                    {x: 20, y: -41}, 
                    {x: 23, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletSeat',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatInner',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 3, y: 3},
                offset: {x: 0, y: 7},
                style: {
                    fill: 'rgba(195, 195, 195, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'head',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 50,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -20},
                style: {
                    fill: 'rgba(235, 197, 139, 1)',
                    stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 90},
                    spread: 0,
                    bullet: {
                        v: 0,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 1,
                        parts: skibidiHead,
                        cType: 'line',
                        cSize: {
                            start: {x: 0, y: -100},
                            end: {x: 0, y: -400},
                        },
                        life: 12, 
                        dmg: 2,
                        persistent: true,
                    },
                }
            },
            {
                id: 'eye1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: -29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eye2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: 29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: -30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: 30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eyebrow1',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'eyebrow2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -15, y: 5}, 
                    {x: -10, y: 7}, 
                    {x: 0, y: 8}, 
                    {x: 10, y: 7}, 
                    {x: 15, y: 5}, 
                    {x: 20, y: 0}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -50},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'JetSpikeFront1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -15, y: 15}, 
                    {x: 0, y: 30}, 
                    {x: 15, y: 15}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: -250, y: 300},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetCapFront1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -50, y: 0}, 
                    {x: -45, y: 15}, 
                    {x: 45, y: 15}, 
                    {x: 50, y: 0}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: -250, y: 300},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetMainBody1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -50, y: 0}, 
                    {x: -50, y: -50}, 
                    {x: 50, y: -50}, 
                    {x: 50, y: 0},
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: -250, y: 300},
                style: {
                    fill: 'rgba(250, 50, 50, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetLowerBody1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -50, y: -50}, 
                    {x: -45, y: -100}, 
                    {x: -35, y: -125}, 
                    {x: 35, y: -125}, 
                    {x: 45, y: -100}, 
                    {x: 50, y: -50}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: -250, y: 300},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetCapBack1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -35, y: -125}, 
                    {x: -30, y: -135}, 
                    {x: 30, y: -135}, 
                    {x: 35, y: -125}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: -250, y: 300},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetSpikeBack1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: -135}, 
                    {x: -5, y: -175}, 
                    {x: 0, y: -180}, 
                    {x: 5, y: -175}, 
                    {x: 20, y: -135}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: -250, y: 300},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetSpikeFront2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -15, y: 15}, 
                    {x: 0, y: 30}, 
                    {x: 15, y: 15}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: 250, y: 300},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetCapFront2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -50, y: 0}, 
                    {x: -45, y: 15}, 
                    {x: 45, y: 15}, 
                    {x: 50, y: 0}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: 250, y: 300},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetMainBody2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -50, y: 0}, 
                    {x: -50, y: -50}, 
                    {x: 50, y: -50}, 
                    {x: 50, y: 0},
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: 250, y: 300},
                style: {
                    fill: 'rgba(250, 50, 50, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetLowerBody2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -50, y: -50}, 
                    {x: -45, y: -100}, 
                    {x: -35, y: -125}, 
                    {x: 35, y: -125}, 
                    {x: 45, y: -100}, 
                    {x: 50, y: -50}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: 250, y: 300},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetCapBack2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -35, y: -125}, 
                    {x: -30, y: -135}, 
                    {x: 30, y: -135}, 
                    {x: 35, y: -125}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: 250, y: 300},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'JetSpikeBack2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: -135}, 
                    {x: -5, y: -175}, 
                    {x: 0, y: -180}, 
                    {x: 5, y: -175}, 
                    {x: 20, y: -135}, 
                ],
                scale: {x: 0.5, y: 0.5},
                offset: {x: 250, y: 300},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
        ],
        effects: [],
    },
    laserSkibidiToilet: { // laser eye attack
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        v: 7, // top speed
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        vr: Math.PI/360,
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 2100,
        groundCollisionR: 0,
        tallCollisionR: 0,
        isMoving: false,
        directControl: false,
        noClip: false,
        type: 'tank',
        unitType: 'laserSkibidiToilet',
        hp: 3,
        value: 100,
        alive: true,
        hitbox: [
            {
                id: 'skibidi toilet',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -50}, 
                    {x: 25, y: -50}, 
                    {x: 15, y: 30}, 
                    {x: -15, y: 30}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
            },
        ],
        parts: [
            {
                id: 'toiletBody',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -20, y: 10}, 
                    {x: -15, y: 25}, 
                    {x: -5, y: 33}, 
                    {x: 0, y: 34}, 
                    {x: 5, y: 33}, 
                    {x: 15, y: 25}, 
                    {x: 20, y: 10}, 
                    {x: 20, y: 0}, 
                    {x: 17, y: -20}, 
                    {x: -17, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowl',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 17}, 
                    {x: -10, y: 23}, 
                    {x: -5, y: 27}, 
                    {x: 0, y: 28}, 
                    {x: 5, y: 27}, 
                    {x: 10, y: 23}, 
                    {x: 13, y: 17}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 9}, 
                    {x: -10, y: 12}, 
                    {x: -5, y: 14}, 
                    {x: 0, y: 15}, 
                    {x: 5, y: 14}, 
                    {x: 10, y: 12}, 
                    {x: 13, y: 9}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.2)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankSide',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -17, y: -20}, 
                    {x: -25, y: -35}, 
                    {x: 25, y: -35}, 
                    {x: 17, y: -20}, 
                    ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankTop',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -35}, 
                    {x: -25, y: -55}, 
                    {x: 25, y: -55}, 
                    {x: 25, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'flushButton',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 20,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 180},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -23, y: -35}, 
                    {x: -20, y: -41}, 
                    {x: -15, y: -44}, 
                    {x: -5, y: -48}, 
                    {x: 5, y: -48}, 
                    {x: 15, y: -44}, 
                    {x: 20, y: -41}, 
                    {x: 23, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletSeat',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatInner',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 3, y: 3},
                offset: {x: 0, y: 7},
                style: {
                    fill: 'rgba(195, 195, 195, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'head',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 50,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -20},
                style: {
                    fill: 'rgba(235, 197, 139, 1)',
                    stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
                },
            },
            {
                id: 'eye1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: -29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eye2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: 29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: -30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'emitter1',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 1,
                scale: {x: 1, y: 1},
                offset: {x: -30, y: -108},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 90},
                    spread: Math.PI/96,
                    bullet: {
                        v: 25,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 0,
                        parts: laserBeam,
                        cType: 'point',
                        cSize: null,
                        life: 120, 
                        dmg: 1,
                    },
                }
            },
            {
                id: 'pupil2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: 30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'emitter2',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 1,
                scale: {x: 1, y: 1},
                offset: {x: 30, y: -108},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 90},
                    spread: Math.PI/96,
                    bullet: {
                        v: 25,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 0,
                        parts: laserBeam,
                        cType: 'point',
                        cSize: null,
                        life: 120, 
                        dmg: 1,
                    },
                }
            },
            {
                id: 'eyebrow1',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'eyebrow2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -15, y: 5}, 
                    {x: -10, y: 7}, 
                    {x: 0, y: 8}, 
                    {x: 10, y: 7}, 
                    {x: 15, y: 5}, 
                    {x: 20, y: 0}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -50},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
        ],
        effects: [],
    },
    mgSkibidiToilet: { // machineguns
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        v: 8, // top speed
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        vr: Math.PI/90,
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 2100,
        groundCollisionR: 0,
        tallCollisionR: 0,
        isMoving: false,
        directControl: false,
        noClip: false,
        type: 'tank',
        unitType: 'mgSkibidiToilet',
        hp: 3,
        value: 150,
        alive: true,
        hitbox: [
            {
                id: 'skibidi toilet',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -50}, 
                    {x: 25, y: -50}, 
                    {x: 15, y: 30}, 
                    {x: -15, y: 30}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
            },
        ],
        parts: [
            {
                id: 'gunBase1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 15, y: 100}, 
                    {x: 15, y: 25}, 
                    {x: 0, y: 0}, 
                    {x: -15, y: 0}, 
                    {x: -15, y: 100}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -75, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'gunBase2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -15, y: 100}, 
                    {x: -15, y: 25}, 
                    {x: 0, y: 0}, 
                    {x: 15, y: 0}, 
                    {x: 15, y: 100}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 75, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'gunBarrel1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 10, y: 75},  
                    {x: 10, y: 0}, 
                    {x: -10, y: 0}, 
                    {x: -10, y: 75}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -75, y: -100},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'gunBarrel2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 10, y: 75},  
                    {x: 10, y: 0}, 
                    {x: -10, y: 0}, 
                    {x: -10, y: 75}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 75, y: -100},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'emitter1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -5, y: -15}, 
                    {x: -5, y: 0}, 
                    {x: 5, y: 0}, 
                    {x: 5, y: -15}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -75, y: -175},
                style: {
                    fill: 'rgba(100, 100, 100, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 15},
                    spread: Math.PI/48,
                    bullet: {
                        v: 15,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 0,
                        parts: bullet,
                        cType: 'point',
                        cSize: null,
                        life: 60, 
                        dmg: 1,
                    },
                }
            },
            {
                id: 'emitter2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -5, y: -15}, 
                    {x: -5, y: 0}, 
                    {x: 5, y: 0}, 
                    {x: 5, y: -15}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 75, y: -175},
                style: {
                    fill: 'rgba(100, 100, 100, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 15},
                    spread: Math.PI/48,
                    bullet: {
                        v: 15,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 0,
                        parts: bullet,
                        cType: 'point',
                        cSize: null,
                        life: 60, 
                        dmg: 1,
                    },
                }
            },
            {
                id: 'deco1.1',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: 75, y: -110},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco1.2',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: 75, y: -130},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco1.3',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: 75, y: -150},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco1.4',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: 75, y: -170},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco2.1',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: -75, y: -110},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco2.2',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: -75, y: -130},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco2.3',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: -75, y: -150},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'deco2.4',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 6,
                scale: {x: 1, y: 1},
                offset: {x: -75, y: -170},
                style: {
                    fill: 'rgba(125, 125, 125, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                },
            },
            {
                id: 'toiletBody',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -20, y: 10}, 
                    {x: -15, y: 25}, 
                    {x: -5, y: 33}, 
                    {x: 0, y: 34}, 
                    {x: 5, y: 33}, 
                    {x: 15, y: 25}, 
                    {x: 20, y: 10}, 
                    {x: 20, y: 0}, 
                    {x: 17, y: -20}, 
                    {x: -17, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowl',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 17}, 
                    {x: -10, y: 23}, 
                    {x: -5, y: 27}, 
                    {x: 0, y: 28}, 
                    {x: 5, y: 27}, 
                    {x: 10, y: 23}, 
                    {x: 13, y: 17}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 9}, 
                    {x: -10, y: 12}, 
                    {x: -5, y: 14}, 
                    {x: 0, y: 15}, 
                    {x: 5, y: 14}, 
                    {x: 10, y: 12}, 
                    {x: 13, y: 9}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.2)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankSide',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -17, y: -20}, 
                    {x: -25, y: -35}, 
                    {x: 25, y: -35}, 
                    {x: 17, y: -20}, 
                    ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankTop',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -35}, 
                    {x: -25, y: -55}, 
                    {x: 25, y: -55}, 
                    {x: 25, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'flushButton',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 20,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 180},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -23, y: -35}, 
                    {x: -20, y: -41}, 
                    {x: -15, y: -44}, 
                    {x: -5, y: -48}, 
                    {x: 5, y: -48}, 
                    {x: 15, y: -44}, 
                    {x: 20, y: -41}, 
                    {x: 23, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletSeat',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(200, 200, 200, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatInner',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 3, y: 3},
                offset: {x: 0, y: 7},
                style: {
                    fill: 'rgba(195, 195, 195, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'head',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 50,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -20},
                style: {
                    fill: 'rgba(235, 197, 139, 1)',
                    stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
                },
            },
            {
                id: 'eye1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: -29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eye2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: 29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: -30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: 30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eyebrow1',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'eyebrow2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -15, y: 5}, 
                    {x: -10, y: 7}, 
                    {x: 0, y: 8}, 
                    {x: 10, y: 7}, 
                    {x: 15, y: 5}, 
                    {x: 20, y: 0}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -50},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
        ],
        effects: [],
    },
    reinforcedSkibidiToilet: { // bite attack
        x: 0,
        y: 0,
        r: 0, // direction of motion
        vx: 0,
        vy: 0,
        mouseR: 0, // current Aim
        v: 6, // top speed
        tr: 360 / 60 / 180 * Math.PI, // rotation of turret (main body)
        vr: Math.PI/120,
        keyboard: [],
        aimPos: {x: 69, y: 69},
        collisionR: 2100,
        groundCollisionR: 0,
        tallCollisionR: 0,
        isMoving: false,
        directControl: false,
        noClip: false,
        type: 'tank',
        unitType: 'reinforcedSkibidiToilet',
        hp: 15,
        value: 300,
        alive: true,
        hitbox: [
            {
                id: 'skibidi toilet',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -50}, 
                    {x: 25, y: -50}, 
                    {x: 15, y: 30}, 
                    {x: -15, y: 30}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
            },
        ],
        parts: [
            {
                id: 'toiletBody',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -20, y: 10}, 
                    {x: -15, y: 25}, 
                    {x: -5, y: 33}, 
                    {x: 0, y: 34}, 
                    {x: 5, y: 33}, 
                    {x: 15, y: 25}, 
                    {x: 20, y: 10}, 
                    {x: 20, y: 0}, 
                    {x: 17, y: -20}, 
                    {x: -17, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowl',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 17}, 
                    {x: -10, y: 23}, 
                    {x: -5, y: 27}, 
                    {x: 0, y: 28}, 
                    {x: 5, y: 27}, 
                    {x: 10, y: 23}, 
                    {x: 13, y: 17}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: 0, y: -13}, 
                    {x: -5, y: -12}, 
                    {x: -10, y: -9}, 
                    {x: -13, y: -5}, 
                    {x: -15, y: 5}, 
                    {x: -13, y: 9}, 
                    {x: -10, y: 12}, 
                    {x: -5, y: 14}, 
                    {x: 0, y: 15}, 
                    {x: 5, y: 14}, 
                    {x: 10, y: 12}, 
                    {x: 13, y: 9}, 
                    {x: 15, y: 5}, 
                    {x: 13, y: -5}, 
                    {x: 10, y: -9}, 
                    {x: 5, y: -12}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.2)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: 0,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -50, y: 75},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankSide',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -17, y: -20}, 
                    {x: -25, y: -35}, 
                    {x: 25, y: -35}, 
                    {x: 17, y: -20}, 
                    ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(150, 150, 150, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankTop',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -25, y: -35}, 
                    {x: -25, y: -55}, 
                    {x: 25, y: -55}, 
                    {x: 25, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(165, 165, 165, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'flushButton',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 20,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: 180},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'waterTankShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -23, y: -35}, 
                    {x: -20, y: -41}, 
                    {x: -15, y: -44}, 
                    {x: -5, y: -48}, 
                    {x: 5, y: -48}, 
                    {x: 15, y: -44}, 
                    {x: 20, y: -41}, 
                    {x: 23, y: -35}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0.1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
            {
                id: 'toiletSeat',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 4, y: 4},
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatInner',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -18, y: -20}, 
                    {x: -23, y: -25}, 
                    {x: -24, y: -30}, 
                    {x: -22, y: -35}, 
                    {x: -20, y: -38}, 
                    {x: -15, y: -41}, 
                    {x: -5, y: -43}, 
                    {x: 5, y: -43}, 
                    {x: 15, y: -41}, 
                    {x: 20, y: -38}, 
                    {x: 22, y: -35}, 
                    {x: 24, y: -30}, 
                    {x: 23, y: -25}, 
                    {x: 18, y: -20}, 
                ],
                scale: {x: 3, y: 3},
                offset: {x: 0, y: 7},
                style: {
                    fill: 'rgba(160, 160, 160, 1)',
                    stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco1',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'toiletSeatDeco2',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/3,
                size: [
                    {x: -12, y: 7}, 
                    {x: -12, y: -7}, 
                    {x: 12, y: -7}, 
                    {x: 12, y: 7}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 77, y: 130},
                style: {
                    fill: 'rgba(175, 175, 175, 1)',
                    stroke: {colour: 'rgba(150, 150, 150, 1)', width: 5},
                },
            },
            {
                id: 'head',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 50,
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -20},
                style: {
                    fill: 'rgba(235, 197, 139, 1)',
                    stroke: {colour: 'rgba(191, 140, 84, 1)', width: 5},
                },
                cannon: {
                    keybind: 'click',
                    x: 0,
                    y: 0,
                    reload: {c: 0, t: 120},
                    spread: 0,
                    bullet: {
                        v: 0,
                        vr: 0,
                        vDrag: 1,
                        rDrag: 1,
                        parts: skibidiHead,
                        cType: 'line',
                        cSize: {
                            start: {x: 0, y: -100},
                            end: {x: 0, y: -400},
                        },
                        life: 12, 
                        dmg: 2,
                        persistent: true,
                    },
                }
            },
            {
                id: 'eye1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: -29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eye2',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 8,
                scale: {x: 1.2, y: 1},
                offset: {x: 29, y: -35},
                style: {
                    fill: 'rgba(255, 255, 255, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: -Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: -30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'pupil1',
                facing: 'body',
                type: 'circle', 
                rOffset: Math.PI/6,
                size: 4,
                scale: {x: 1.2, y: 1},
                offset: {x: 30, y: -38},
                style: {
                    fill: 'rgba(0, 0, 0, 1)',
                    stroke: {colour: 'rgba(0, 0, 0, 0.7)', width: 1},
                },
            },
            {
                id: 'eyebrow1',
                facing: 'body',
                type: 'polygon', 
                rOffset: -Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: -27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'eyebrow2',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI/6,
                size: [
                    {x: -12, y: 4}, 
                    {x: -12, y: -4}, 
                    {x: 12, y: -4}, 
                    {x: 12, y: 4}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 27, y: -28},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(150, 150, 150, 0)', width: 5},
                },
            },
            {
                id: 'toiletBowlShade',
                facing: 'body',
                type: 'polygon', 
                rOffset: Math.PI,
                size: [
                    {x: -20, y: 0}, 
                    {x: -15, y: 5}, 
                    {x: -10, y: 7}, 
                    {x: 0, y: 8}, 
                    {x: 10, y: 7}, 
                    {x: 15, y: 5}, 
                    {x: 20, y: 0}, 
                ],
                scale: {x: 1, y: 1},
                offset: {x: 0, y: -50},
                style: {
                    fill: 'rgba(0, 0, 0, 0.6)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                },
            },
        ],
        effects: [],
    },
    template: {
        player: {
            money: 0,
            upgrades: [
                {
                    display: 'Error Handling ',
                    description: 'Stops the code from breaking',
                    id: 0,
                    level: 1,
                    effect: ``,
                    locked: true,
                    cost: 0, 
                    increment: {cost: 0, mode: 'addition'}
                },
                {
                    display: 'Radio Transmitter ',
                    description: 'Restablish connection with HQ',
                    id: 1,
                    level: 1,
                    effect: `
                    var newPlayer = player;
                    let upgrade = newPlayer.upgrades[1];
                    if (upgrade.level == 1) {
                        upgrade.description = 'Request Advanced Weaponry';
                        upgrade.cost = 1000;
                        for (let i = 0; i < data.upgrades.tier1.length; i++) {
                            newPlayer.upgrades.push(data.upgrades.tier1[i]);
                        }
                    } else if (upgrade.level == 2) {
                        upgrade.description = 'Request Prototype Weapons';
                        upgrade.cost = 2500;
                        for (let i = 0; i < data.upgrades.tier2.length; i++) {
                            newPlayer.upgrades.push(data.upgrades.tier2[i]);
                        }
                    }
                    else if (upgrade.level == 3) {
                        upgrade.description = 'Request Backup from HQ';
                        upgrade.cost = 50000;
                        for (let i = 0; i < data.upgrades.tier3.length; i++) {
                            newPlayer.upgrades.push(data.upgrades.tier3[i]);
                        }
                    } else if (upgrade.level == 4) {
                        upgrade.locked = true;
                    }
                    newPlayer;
                    `,
                    locked: false,
                    cost: 250, 
                    increment: {cost: 0, mode: 'addition'}
                },
                {
                    display: 'Repair ',
                    description: 'Repair your mech to regain 1 hp',
                    id: 2,
                    level: 1,
                    effect: `
                    var newPlayer = player;
                    let upgrade = newPlayer.upgrades[2];
                    newPlayer.hp++;
                    if (newPlayer.hp > data.mech.hp) {
                        newPlayer.hp = data.mech.hp;
                        newPlayer.money += 500;
                    }
                    upgrade.level--;
                    newPlayer;
                    `,
                    locked: false,
                    cost: 500, 
                    increment: {cost: 0, mode: 'addition'}
                },
            ],
        },
        physics: {
            x: 0,     // x coordinate
            y: 0,     // y coordinate
            vx: 0,    // x component of velocity
            vy: 0,    // y component of velocity
            ax: 0,    // x component of acceleration
            ay: 0,    // y component of acceleration
            r: 0,     // rotation
            vr: 0,    // angular velocity
            ar: 0,    // angular acceleration
            vDrag: 1, // drag (multiply by velocities to slow them down)
            rDrag: 1, // angular drag (multiply by velocities to slow them down)
            maxV: 100, // terminal velocity (100pixels/tick)
            maxRV: Math.PI/15, // terminal angular velocity (720˚/second)
        },
        particle: {
            type: 'circle', // circle or polygon
            size: 10, // radius if circle, array of points if polygon
            style: {
                fill: {r: 255, g: 255, b: 255, a: 1},
                stroke: {colour: {r: 255, g: 255, b: 255, a: 1}, width: 2},
            },
            decay: {
                life: Infinity, // how many ticks the particle persists for
                fillStyle: {r: 0, g: 0, b: 0, a: 0}, // add to fill style
                strokeStyle: {r: 0, g: 0, b: 0, a: 0}, // add to stroke style
                size: 1 // multiply size by this
            }
        },
        memory: {
            team: '', // which team the unit belongs to
            id: '', // the name of the unit
            memory: '', // the stored data of the unit, should store enemies to target and where to move to
            transmission: [], // data recieved from the main combat logic, should be given targets to attack or formations to move in
            script: '', // the script to be executed by the unit every tick
            orders: [], // all the actions that the unit will execute
        },
        team: {
            id: '', // the team name
            money: 10000, // money avalaible to purchace units and resources
            script: '', // the script that purchaces new units and sends commands to existing units
            memory: '', // the main data storage of every team, should store advanced tactics and strategies
            transmission: [], // data recieved from units
            resources: {
                scripts: 3, // number of different scripts avalaible, scripts-1 = number of different types of units
                mainScriptLength: 2000, // main logic has limit of 1000 characters
                UnitScriptLength: 5000, // unit scripts have a limit of 4000 characters
            },
            scripts: { // scripts owned by the team

            },
            spawn: {x: 0, y: 0}, // where new units will be spawned
            orders: [], // orders to be executed by the team (spawn stuff)
        },
        weapons: {
            Pistol: {
                parts: [
                    {
                        id: 'Pistol',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 15},
                            spread: Math.PI/48,
                            bullet: {
                                v: 12,
                                vr: 0,
                                vDrag: 0.995,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 60, 
                                dmg: 1,
                            },
                        }
                    },
                ]
            },
            PistolMK2: {
                parts: [
                    {
                        id: 'PistolMK2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -10},
                            {x: 10, y: -10},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 12},
                            spread: Math.PI/48,
                            bullet: {
                                v: 15,
                                vr: 0,
                                vDrag: 0.995,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 75, 
                                dmg: 1,
                            },
                        }
                    },
                ]
            },
            PistolMK3: {
                parts: [
                    {
                        id: 'PistolSide',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -5, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'PistolSide',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 5, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'PistolMK3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -10},
                            {x: 10, y: -10},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 10},
                            spread: Math.PI/64,
                            bullet: {
                                v: 15,
                                vr: 0,
                                vDrag: 0.995,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 90, 
                                dmg: 1,
                            },
                        }
                    },
                ]
            },
            PistolMK4: {
                parts: [
                    {
                        id: 'PistolSide',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -20},
                            {x: 10, y: -20},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'PistolSide',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -20},
                            {x: 10, y: -20},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'PistolMK4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -10},
                            {x: 10, y: -10},
                            {x: 10, y: 50},
                            {x: -10, y: 50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 3},
                            spread: Math.PI/64,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.995,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 90, 
                                dmg: 0.5,
                            },
                        }
                    },
                ]
            },
            PistolMK5: {
                parts: [
                    {
                        id: 'PistolSide',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -20},
                            {x: 10, y: -20},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -10, y: -100},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'PistolSide',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -20},
                            {x: 10, y: -20},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 10, y: -100},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'PistolMK5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: -10},
                            {x: 10, y: -10},
                            {x: 10, y: 50},
                            {x: -10, y: 50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 3},
                            spread: Math.PI/64,
                            bullet: {
                                v: 35,
                                vr: 0,
                                vDrag: 0.995,
                                rDrag: 0,
                                parts: fusionBlast,
                                cType: 'point',
                                cSize: null,
                                life: 90, 
                                dmg: 2,
                            },
                        }
                    },
                ]
            },
            Cannon: {
                parts: [
                    {
                        id: 'Cannon',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -10},
                            {x: 30, y: -10},
                            {x: 30, y: 30},
                            {x: -30, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: Math.PI/48,
                            bullet: {
                                v: 8,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: cannonBall,
                                cType: 'point',
                                cSize: null,
                                life: 120, 
                                dmg: 4,
                            },
                        }
                    },
                ]
            },
            CannonMK2: {
                parts: [
                    {
                        id: 'CannonDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: -20},
                            {x: 22, y: -20},
                            {x: 22, y: 30},
                            {x: -22, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'CannonMK2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -10},
                            {x: 30, y: -10},
                            {x: 30, y: 30},
                            {x: -30, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: Math.PI/48,
                            bullet: {
                                v: 12,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: cannonBall,
                                cType: 'point',
                                cSize: null,
                                life: 150, 
                                dmg: 8,
                            },
                        }
                    },
                ]
            },
            CannonMK3: {
                parts: [
                    {
                        id: 'CannonDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: -20},
                            {x: 22, y: -20},
                            {x: 22, y: 30},
                            {x: -22, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'CannonEmitter1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -10},
                            {x: 30, y: -10},
                            {x: 30, y: 30},
                            {x: -30, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 10,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 300, 
                                dmg: 8,
                            },
                        }
                    },
                    {
                        id: 'CannonEmitter1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -10},
                            {x: 30, y: -10},
                            {x: 30, y: 30},
                            {x: -30, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 10,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 300, 
                                dmg: 8,
                            },
                        }
                    },
                ]
            },
            CannonMK4: {
                parts: [
                    {
                        id: 'CannonDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: -20},
                            {x: 22, y: -20},
                            {x: 22, y: 30},
                            {x: -22, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'CannonEmitter1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -10},
                            {x: 30, y: -10},
                            {x: 30, y: 30},
                            {x: -30, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 10,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 600, 
                                dmg: 2,
                                piercing: true,
                            },
                        }
                    },
                    {
                        id: 'CannonEmitter1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: -10},
                            {x: 30, y: -10},
                            {x: 30, y: 30},
                            {x: -30, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 10,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 600, 
                                dmg: 2,
                                piercing: true,
                            },
                        }
                    },
                ]
            },
            Shotgun: {
                parts: [
                    {
                        id: 'Shotgun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI/12,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 20,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Shotgun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: -Math.PI/12,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 20,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Shotgun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 20,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Shotgun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 20,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Shotgun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 20,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Shotgun',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 30},
                            {x: -10, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 20,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                ]
            },
            ShotgunMK2: {
                parts: [
                    {
                        id: 'ShotgunEmitter1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 22,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter6',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 22,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter7',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 23,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 20, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunBarrel1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: 80},
                            {x: -10, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -5, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunBarrel2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 80},
                            {x: -5, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 5, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -5},
                            {x: -8, y: -5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -80},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -5},
                            {x: -8, y: -5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -95},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -5},
                            {x: -8, y: -5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -110},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                ]
            },
            ShotgunMK3: {
                parts: [
                    {
                        id: 'ShotgunEmitter1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 22,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter6',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 22,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter7',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 23,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter7',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 27,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter9',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 27,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunEmitter10',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(100, 100, 100, 0)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 60},
                            spread: Math.PI/12,
                            bullet: {
                                v: 27,
                                vr: 0,
                                vDrag: 0.99,
                                rDrag: 0,
                                parts: bullet,
                                cType: 'point',
                                cSize: null,
                                life: 30, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'ShotgunBarrel1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -10, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: 80},
                            {x: -10, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -5, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunBarrel2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 10, y: 0},
                            {x: 10, y: 80},
                            {x: -5, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 5, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -5},
                            {x: -8, y: -5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -80},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -5},
                            {x: -8, y: -5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -95},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                    {
                        id: 'ShotgunDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -5},
                            {x: -8, y: -5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -110},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(100, 100, 100, 1)', width: 5},
                        },
                    },
                ]
            },
            LaserCannon: {
                parts: [
                    {
                        id: 'laserCannonBarrelSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: -10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelMain',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 30}, 
                            {x: 3, y: 30}, 
                            {x: 3, y: 80}, 
                            {x: -3, y: 80}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -230},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 12},
                            spread: Math.PI/48,
                            bullet: {
                                v: 25,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: laser,
                                cType: 'point',
                                cSize: null,
                                life: 360, 
                                dmg: 2,
                            },
                        }
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 52, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 66, y: -70},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 14}, 
                            {x: 9, y: 16}, 
                            {x: -9, y: 16}, 
                            {x: -11, y: 14}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 5},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -117},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -138},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 1}, 
                            {x: -9, y: 0}, 
                            {x: 9, y: 0}, 
                            {x: 10, y: 1}, 
                            {x: 10, y: 8}, 
                            {x: 9, y: 9}, 
                            {x: -9, y: 9}, 
                            {x: -10, y: 8}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -168},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                ]
            },
            LaserCannonMK2: {
                parts: [
                    {
                        id: 'laserCannonBarrelSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: -10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelMain',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 30}, 
                            {x: 3, y: 30}, 
                            {x: 3, y: 80}, 
                            {x: -3, y: 80}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -230},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 8},
                            spread: Math.PI/48,
                            bullet: {
                                v: 30,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: laser,
                                cType: 'point',
                                cSize: null,
                                life: 360, 
                                dmg: 2,
                            },
                        }
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 52, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 66, y: -70},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 14}, 
                            {x: 9, y: 16}, 
                            {x: -9, y: 16}, 
                            {x: -11, y: 14}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 5},
                        },
                    },
                    {
                        id: 'laserCannonBodyDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 3}, 
                            {x: -11, y: 3}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -90},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBodyDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 3}, 
                            {x: -11, y: 3}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -80},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -117},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -138},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 1}, 
                            {x: -9, y: 0}, 
                            {x: 9, y: 0}, 
                            {x: 10, y: 1}, 
                            {x: 10, y: 8}, 
                            {x: 9, y: 9}, 
                            {x: -9, y: 9}, 
                            {x: -10, y: 8}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -168},
                        style: {
                            fill: 'rgba(230, 73, 38, 1)',
                            stroke: {colour: 'rgba(201, 63, 33, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 9}, 
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 9}, 

                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -168},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 9}, 
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 9}, 

                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -8, y: -168},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3.3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 9}, 
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 9}, 

                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -16, y: -168},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3.4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 9}, 
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 9}, 

                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 8, y: -168},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3.5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 9}, 
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 9}, 

                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 16, y: -168},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                ]
            },
            LaserCannonMK3: {
                parts: [
                    {
                        id: 'laserCannonBarrelSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: -10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelMain',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 30}, 
                            {x: 3, y: 30}, 
                            {x: 3, y: 80}, 
                            {x: -3, y: 80}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -230},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: Math.PI/48,
                            bullet: {
                                v: 50,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: laser2,
                                cType: 'point',
                                cSize: null,
                                life: 360, 
                                dmg: 3,
                            },
                        }
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 52, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(201, 77, 169, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 66, y: -70},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(201, 77, 169, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 14}, 
                            {x: 9, y: 16}, 
                            {x: -9, y: 16}, 
                            {x: -11, y: 14}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(201, 77, 169, 1)', width: 5},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -117},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(201, 77, 169, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -138},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(201, 77, 169, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 1}, 
                            {x: -9, y: 0}, 
                            {x: 9, y: 0}, 
                            {x: 10, y: 1}, 
                            {x: 10, y: 8}, 
                            {x: 9, y: 9}, 
                            {x: -9, y: 9}, 
                            {x: -10, y: 8}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -168},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(201, 77, 169, 1)', width: 2},
                        },
                    },
                ]
            },
            LaserCannonMK4: {
                parts: [
                    {
                        id: 'laserCannonBarrelSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: -50}, 
                            {x: -3, y: -50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: -10, y: -70},
                        style: {
                            fill: 'rgba(190, 190, 190, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelMain',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: 50}, 
                            {x: -3, y: 50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -185},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 3,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'laserCannonBarrelMain',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -3, y: 0}, 
                            {x: 3, y: 0}, 
                            {x: 3, y: 50}, 
                            {x: -3, y: 50}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -185},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 3,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 11, y: 4}, 
                            {x: 14, y: 4}, 
                            {x: 14, y: 11}, 
                            {x: 11, y: 11}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 52, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -2, y: -70},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(216, 170, 0, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 14, y: 2.5}, 
                            {x: 14.5, y: 2}, 
                            {x: 17.5, y: 2}, 
                            {x: 18, y: 2.5}, 
                            {x: 18, y: 12.5}, 
                            {x: 17.5, y: 13}, 
                            {x: 14.5, y: 13}, 
                            {x: 14, y: 12.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 66, y: -70},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(216, 170, 0, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 14}, 
                            {x: 9, y: 16}, 
                            {x: -9, y: 16}, 
                            {x: -11, y: 14}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(216, 170, 0, 1)', width: 5},
                        },
                    },
                    {
                        id: 'laserCannonBodyDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 3}, 
                            {x: -11, y: 3}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -90},
                        style: {
                            fill: 'rgba(255, 255, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBodyDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -11, y: 0}, 
                            {x: 11, y: 0}, 
                            {x: 11, y: 3}, 
                            {x: -11, y: 3}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -80},
                        style: {
                            fill: 'rgba(255, 255, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -117},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(216, 170, 0, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 0.5}, 
                            {x: -9.5, y: 0}, 
                            {x: 9.5, y: 0}, 
                            {x: 10, y: 0.5}, 
                            {x: 10, y: 4.5}, 
                            {x: 9.5, y: 5}, 
                            {x: -9.5, y: 5}, 
                            {x: -10, y: 4.5}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -138},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(216, 170, 0, 1)', width: 2},
                        },
                    },
                    {
                        id: 'laserCannonBarrelDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -10, y: 1}, 
                            {x: -9, y: 0}, 
                            {x: 9, y: 0}, 
                            {x: 10, y: 1}, 
                            {x: 10, y: 8}, 
                            {x: 9, y: 9}, 
                            {x: -9, y: 9}, 
                            {x: -10, y: 8}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -168},
                        style: {
                            fill: 'rgba(255, 200, 0, 1)',
                            stroke: {colour: 'rgba(216, 170, 0, 1)', width: 2},
                        },
                    },
                ]
            },
            Rifle: {
                parts: [
                    {
                        id: 'Rifle Barrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: 200},
                            {x: -8, y: 200},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -270},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 20},
                            spread: 0,
                            bullet: {
                                v: 50,
                                vr: 0,
                                vDrag: 0.995,
                                rDrag: 0,
                                parts: sniperShot,
                                cType: 'point',
                                cSize: null,
                                life: 45, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'laser1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -100},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -100},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                    },
                    {
                        id: 'laser2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -200},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -200},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                    },
                    {
                        id: 'laser3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 2, y: -300},
                            {x: 2, y: 0},
                            {x: 0, y: 0},
                            {x: 0, y: -300},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 25, y: -180},
                        style: {
                            fill: 'rgba(0, 0, 0, 0)',
                            stroke: {colour: 'rgba(255, 0, 0, 0.2)', width: 5},
                        },
                    },
                    {
                        id: 'Scope holder',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 20},
                            {x: 25, y: 20},
                            {x: 25, y: 0},
                            {x: 8, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(125, 125, 125, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Muzzle',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -13, y: -230},
                            {x: 13, y: -230},
                            {x: 13, y: -200},
                            {x: -13, y: -200},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                    },
                    {
                        id: 'Body',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 0},
                            {x: 12, y: 0},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                    },
                    {
                        id: 'Scope',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: -40},
                            {x: -5, y: -40},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 25, y: -140},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                    },
                    {
                        id: 'ammo',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 0, y: 35},
                            {x: -25, y: 35},
                            {x: -20, y: 0},
                            {x: 0, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -12, y: -220},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 5},
                        },
                    }
                ],
            },
            RifleMK2: {
                parts: [
                    {
                        id: 'SniperLaserHolder',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 40}, 
                            {x: -1, y: 40}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'SniperLaserCap',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -2, y: 40}, 
                            {x: 2, y: 40}, 
                            {x: 2, y: 45}, 
                            {x: -2, y: 45}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'SniperLaser1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 45}, 
                            {x: 1, y: 45}, 
                            {x: 1, y: 300}, 
                            {x: -1, y: 300}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(255, 0, 0, 0.2)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperLaser2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 45}, 
                            {x: 1, y: 45}, 
                            {x: 1, y: 200}, 
                            {x: -1, y: 200}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(255, 0, 0, 0.2)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperLaser3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 45}, 
                            {x: 1, y: 45}, 
                            {x: 1, y: 100}, 
                            {x: -1, y: 100}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(255, 0, 0, 0.2)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -7, y: 110-65}, 
                            {x: 7, y: 110-65}, 
                            {x: 7, y: 110-80}, 
                            {x: 4, y: 110-110}, 
                            {x: -4, y: 110-110}, 
                            {x: -7, y: 110-80}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -220-70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 4},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 45},
                            spread: 0,
                            bullet: {
                                v: 75,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: sniperShot,
                                cType: 'point',
                                cSize: null,
                                life: 60, 
                                dmg: 5,
                            },
                        }
                    },
                    {
                        id: 'SniperBarrelDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -3, y: 60}, 
                            {x: 3, y: 60}, 
                            {x: 3, y: 80}, 
                            {x: 2, y: 100}, 
                            {x: -2, y: 100}, 
                            {x: -3, y: 80}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperSideDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -8, y: 21}, 
                            {x: -15, y: 19}, 
                            {x: -15, y: 45}, 
                            {x: -8, y: 47}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSideDeco1.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -8, y: 21}, 
                            {x: -15, y: 19}, 
                            {x: -15, y: 18}, 
                            {x: -8, y: 16}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSideDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 8, y: 21}, 
                            {x: 15, y: 19}, 
                            {x: 15, y: 45}, 
                            {x: 8, y: 47}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSideDeco2.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 8, y: 21}, 
                            {x: 15, y: 19}, 
                            {x: 15, y: 18}, 
                            {x: 8, y: 16}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -8, y: 0}, 
                            {x: 8, y: 0}, 
                            {x: 8, y: 65}, 
                            {x: -8, y: 65}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 4},
                        },
                    },
                    {
                        id: 'SniperBodyDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -4, y: 7}, 
                            {x: -2, y: -5}, 
                            {x: 2, y: -5}, 
                            {x: 4, y: 7}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(125, 125, 125, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperShell1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 0, y: 5}, 
                            {x: -6, y: 8}, 
                            {x: -6, y: 68}, 
                            {x: 0, y: 65}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 3},
                        },
                    },
                    {
                        id: 'SniperShell2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 0, y: 5}, 
                            {x: 6, y: 8}, 
                            {x: 6, y: 68}, 
                            {x: 0, y: 65}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 3},
                        },
                    },
                    {
                        id: 'SniperScope1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -20-2, y: 15}, 
                            {x: -19-2, y: 14}, 
                            {x: -14-2, y: 14}, 
                            {x: -13-2, y: 15}, 
                            {x: -13-2, y: 55}, 
                            {x: -20-2, y: 55}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'SniperScope2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -20-2, y: 55}, 
                            {x: -13-2, y: 55}, 
                            {x: -10-2, y: 60}, 
                            {x: -10-2, y: 70}, 
                            {x: -23-2, y: 70}, 
                            {x: -23-2, y: 60}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                ]
            },
            RifleMK3: {
                parts: [
                    {
                        id: 'SniperLaserHolder',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 0}, 
                            {x: 1, y: 0}, 
                            {x: 1, y: 40}, 
                            {x: -1, y: 40}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'SniperLaserCap',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -2, y: 40}, 
                            {x: 2, y: 40}, 
                            {x: 2, y: 45}, 
                            {x: -2, y: 45}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'SniperLaser1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 45}, 
                            {x: 1, y: 45}, 
                            {x: 1, y: 300}, 
                            {x: -1, y: 300}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(255, 0, 0, 0.2)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperLaser2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 45}, 
                            {x: 1, y: 45}, 
                            {x: 1, y: 200}, 
                            {x: -1, y: 200}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(255, 0, 0, 0.2)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperLaser3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -1, y: 45}, 
                            {x: 1, y: 45}, 
                            {x: 1, y: 100}, 
                            {x: -1, y: 100}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: -24, y: -150},
                        style: {
                            fill: 'rgba(255, 0, 0, 0.2)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperBarrel',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -7, y: 110-65}, 
                            {x: 7, y: 110-65}, 
                            {x: 7, y: 110-80}, 
                            {x: 4, y: 110-110}, 
                            {x: -4, y: 110-110}, 
                            {x: -7, y: 110-80}, 
                            ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -220-70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 4},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 40},
                            spread: 0,
                            bullet: {
                                v: 90,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: sniperShot,
                                cType: 'point',
                                cSize: null,
                                life: 75, 
                                dmg: 8,
                            },
                        }
                    },
                    {
                        id: 'SniperBarrelDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -3, y: 60}, 
                            {x: 3, y: 60}, 
                            {x: 3, y: 80}, 
                            {x: 2, y: 100}, 
                            {x: -2, y: 100}, 
                            {x: -3, y: 80}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperSideDeco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -8, y: 21}, 
                            {x: -15, y: 19}, 
                            {x: -15, y: 45}, 
                            {x: -8, y: 47}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSideDeco1.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -8, y: 21}, 
                            {x: -15, y: 19}, 
                            {x: -15, y: 18}, 
                            {x: -8, y: 16}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSideDeco2.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 8, y: 21}, 
                            {x: 15, y: 19}, 
                            {x: 15, y: 45}, 
                            {x: 8, y: 47}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSideDeco2.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 8, y: 21}, 
                            {x: 15, y: 19}, 
                            {x: 15, y: 18}, 
                            {x: 8, y: 16}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperBody',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -8, y: 0}, 
                            {x: 8, y: 0}, 
                            {x: 8, y: 65}, 
                            {x: -8, y: 65}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 4},
                        },
                    },
                    {
                        id: 'SniperBodyDeco',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -4, y: 7}, 
                            {x: -2, y: -5}, 
                            {x: 2, y: -5}, 
                            {x: 4, y: 7}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(125, 125, 125, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'SniperShell1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 0, y: 5}, 
                            {x: -6, y: 8}, 
                            {x: -6, y: 68}, 
                            {x: 0, y: 65}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 3},
                        },
                    },
                    {
                        id: 'SniperShell2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 0, y: 5}, 
                            {x: 6, y: 8}, 
                            {x: 6, y: 68}, 
                            {x: 0, y: 65}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 3},
                        },
                    },
                    {
                        id: 'SniperScope1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -20-2, y: 15}, 
                            {x: -19-2, y: 14}, 
                            {x: -14-2, y: 14}, 
                            {x: -13-2, y: 15}, 
                            {x: -13-2, y: 55}, 
                            {x: -20-2, y: 55}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'SniperScope2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -20-2, y: 55}, 
                            {x: -13-2, y: 55}, 
                            {x: -10-2, y: 60}, 
                            {x: -10-2, y: 70}, 
                            {x: -23-2, y: 70}, 
                            {x: -23-2, y: 60}, 
                        ],
                        scale: {x: 2, y: 2},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                ]
            },
            Sniper: {
                parts: [
                    {
                        id: 'SniperDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -110},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco6',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco7',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco8',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -180},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco9',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco10',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -200},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: -20, y: 0},
                            {x: -8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 0},
                            {x: 20, y: 0},
                            {x: 8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperBase1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -16, y: 30},
                            {x: -16, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 80},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: redBeam,
                                cType: 'point',
                                cSize: null,
                                life: 5, 
                                dmg: 0, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'SniperBase1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -16, y: 30},
                            {x: -16, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 80},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2, 
                                dmg: 3, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'SniperBase2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 30, y: 15},
                            {x: 8, y: 0},
                            {x: 8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'SniperBase3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: 15},
                            {x: -8, y: 0},
                            {x: -8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                ]
            },
            SniperMK2: {
                parts: [
                    {
                        id: 'SniperDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -110},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco6',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco7',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco8',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -180},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco9',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco10',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -200},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: -20, y: 0},
                            {x: -8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(125, 125, 125, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 0},
                            {x: 20, y: 0},
                            {x: 8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(125, 125, 125, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperBase1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -16, y: 30},
                            {x: -16, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 75},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: redBeam,
                                cType: 'point',
                                cSize: null,
                                life: 5, 
                                dmg: 0, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'SniperBase1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -16, y: 30},
                            {x: -16, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 75},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2, 
                                dmg: 5, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'SniperBase2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 30, y: 15},
                            {x: 8, y: 0},
                            {x: 8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'SniperBase3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: 15},
                            {x: -8, y: 0},
                            {x: -8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                ]
            },
            SniperMK3: {
                parts: [
                    {
                        id: 'SniperDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -110},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco6',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco7',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco8',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -180},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco9',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco10',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -200},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: -20, y: 0},
                            {x: -8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 0},
                            {x: 20, y: 0},
                            {x: 8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperBase1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -16, y: 30},
                            {x: -16, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 75},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: redBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 6, 
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'SniperBase2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 30, y: 15},
                            {x: 8, y: 0},
                            {x: 8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'SniperBase3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: 15},
                            {x: -8, y: 0},
                            {x: -8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                ]
            },
            SniperMK4: {
                parts: [
                    {
                        id: 'SniperDeco1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -110},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco6',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco7',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco8',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -180},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco9',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperDeco10',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 8, y: -3},
                            {x: -8, y: -3},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -200},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 0},
                        },
                    },
                    {
                        id: 'SniperSide1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: -20, y: 0},
                            {x: -8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperSide2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: 0},
                            {x: 20, y: 0},
                            {x: 8, y: -150},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'SniperBase1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -16, y: 30},
                            {x: -16, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: redBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 3, 
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'SniperBase2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 30, y: 15},
                            {x: 8, y: 0},
                            {x: 8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'SniperBase3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -30, y: 15},
                            {x: -8, y: 0},
                            {x: -8, y: -50},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                ]
            },
            PlasmaCannon: {
                parts: [
                    {
                        id: 'Plasma Cannon Emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: 80},
                            {x: -5, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/36,
                            bullet: {
                                v: 30,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 45, 
                                dmg: 0.5,
                            },
                        }
                    },
                    {
                        id: 'Plasma Cannon Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: 0},
                            {x: 22, y: 0},
                            {x: 25, y: 30},
                            {x: -25, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -18, y: 0},
                            {x: -15, y: 0},
                            {x: -12, y: 90},
                            {x: -28, y: 125},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 18, y: 0},
                            {x: 15, y: 0},
                            {x: 12, y: 90},
                            {x: 28, y: 125},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 9,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 35,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 25,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 15,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                ]
            },
            PlasmaCannonMK2: {
                parts: [
                    {
                        id: 'Plasma Cannon Emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: 80},
                            {x: -5, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/36,
                            bullet: {
                                v: 30,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 60, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Plasma Cannon Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: 0},
                            {x: 22, y: 0},
                            {x: 25, y: 30},
                            {x: -25, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -20, y: 0},
                            {x: -35, y: -75},
                            {x: -20, y: -45},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 20, y: 0},
                            {x: 35, y: -75},
                            {x: 20, y: -45},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -20, y: 0},
                            {x: -45, y: -40},
                            {x: -20, y: -25},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 20, y: 0},
                            {x: 45, y: -40},
                            {x: 20, y: -25},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -18, y: 0},
                            {x: -15, y: 0},
                            {x: -12, y: 90},
                            {x: -28, y: 125},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 18, y: 0},
                            {x: 15, y: 0},
                            {x: 12, y: 90},
                            {x: 28, y: 125},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 9,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 35,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 25,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 15,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                ]
            },
            PlasmaCannonMK3: {
                parts: [
                    {
                        id: 'Plasma Cannon Emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: 80},
                            {x: -5, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/36,
                            bullet: {
                                v: 30,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 60, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Plasma Cannon Emitter2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -5, y: 0},
                            {x: 5, y: 0},
                            {x: 5, y: 80},
                            {x: -5, y: 80},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -150},
                        style: {
                            fill: 'rgba(175, 175, 175, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 5},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/36,
                            bullet: {
                                v: 30,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: plasmaBlast,
                                cType: 'point',
                                cSize: null,
                                life: 60, 
                                dmg: 1,
                            },
                        }
                    },
                    {
                        id: 'Plasma Cannon Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -22, y: 0},
                            {x: 22, y: 0},
                            {x: 25, y: 30},
                            {x: -25, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -20, y: 0},
                            {x: -35, y: -75},
                            {x: -20, y: -45},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 20, y: 0},
                            {x: 35, y: -75},
                            {x: 20, y: -45},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -20, y: 0},
                            {x: -45, y: -40},
                            {x: -20, y: -25},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side Deco 4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 20, y: 0},
                            {x: 45, y: -40},
                            {x: 20, y: -25},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -18, y: 0},
                            {x: -15, y: 0},
                            {x: -12, y: 90},
                            {x: -28, y: 125},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Side 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 18, y: 0},
                            {x: 15, y: 0},
                            {x: 12, y: 90},
                            {x: 28, y: 125},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -170},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Plasma Cannon Lights1.1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 3.5,
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -75},
                        style: {
                            fill: 'rgba(255, 0, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Lights1.2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 3.5,
                        scale: {x: 1, y: 1},
                        offset: {x: -19, y: -85},
                        style: {
                            fill: 'rgba(0, 255, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Lights2.1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 3.5,
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -75},
                        style: {
                            fill: 'rgba(0, 255, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Lights2.2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 3.5,
                        scale: {x: 1, y: 1},
                        offset: {x: 19, y: -85},
                        style: {
                            fill: 'rgba(255, 0, 0, 1)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -140},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco1.3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -8, y: 0},
                            {x: 8, y: 0},
                            {x: 5, y: 5},
                            {x: -5, y: 5},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -120},
                        style: {
                            fill: 'rgba(236, 90, 199, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Deco2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 9,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(200, 200, 200, 1)',
                            stroke: {colour: 'rgba(125, 125, 125, 1)', width: 1},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 35,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 25,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                    {
                        id: 'Plasma Cannon Glow3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 15,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(236, 90, 199, 0.1)',
                            stroke: {colour: 'rgba(125, 125, 125, 0)', width: 0},
                        },
                    },
                ]
            },
            Railgun: {
                parts: [
                    {
                        id: 'glow 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'glow 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 0',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 35, y: -20},
                            {x: -35, y: -20},
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 20},
                            {x: 12, y: 20},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2, 
                                dmg: 2, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 15, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2, 
                                dmg: 2, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -15, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2, 
                                dmg: 2, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: railBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5, 
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -25, y: 0},
                            {x: -16, y: 0},
                            {x: -16, y: -180},
                            {x: -25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 25, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: -180},
                            {x: 25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -220},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                ]
            },
            RailgunMK2: {
                parts: [
                    {
                        id: 'glow 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'glow 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 0',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 35, y: -20},
                            {x: -35, y: -20},
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 20},
                            {x: 12, y: 20},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 3, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 3, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 3, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 3, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter6',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 3, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter7',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 90},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: railBeamWide,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5, 
                                dmg: 3, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -25, y: 0},
                            {x: -16, y: 0},
                            {x: -16, y: -180},
                            {x: -25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 25, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: -180},
                            {x: 25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -220},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                ]
            },
            RailgunMK3: {
                parts: [
                    {
                        id: 'glow 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'glow 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 0',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 35, y: -20},
                            {x: -35, y: -20},
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 20},
                            {x: 12, y: 20},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 1, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 1, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 1, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 1, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter6',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 1, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'emitter7',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 6},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: railBeamWide,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5, 
                                dmg: 4, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -25, y: 0},
                            {x: -16, y: 0},
                            {x: -16, y: -180},
                            {x: -25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 25, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: -180},
                            {x: 25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -220},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                ]
            },
            RailgunMK4: {
                parts: [
                    {
                        id: 'glow 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'glow 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -23+10, y: 0},
                            {x: -18+10, y: 0},
                            {x: -18+10, y: -160},
                            {x: -23+10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'bottom guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23-10, y: 0},
                            {x: 18-10, y: 0},
                            {x: 18-10, y: -160},
                            {x: 23-10, y: -160},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -75},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 0',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 35, y: -20},
                            {x: -35, y: -20},
                            {x: -30, y: 0},
                            {x: 30, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'emitter',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -12, y: 20},
                            {x: 12, y: 20},
                            {x: 12, y: 30},
                            {x: -12, y: 30},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'fusionBlastEmitter1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/72,
                            bullet: {
                                v: 90,
                                maxV: 90,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: fusionBlast,
                                cType: 'point',
                                cSize: null,
                                life: 45,
                                dmg: 6, 
                            },
                        },
                    },
                    {
                        id: 'fusionBlastEmitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/72,
                            bullet: {
                                v: 100,
                                maxV: 100,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: fusionBlast,
                                cType: 'point',
                                cSize: null,
                                life: 45,
                                dmg: 6, 
                            },
                        },
                    },
                    {
                        id: 'fusionRayEmitter1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 2},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'fusionRayEmitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 2},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'fusionRayEmitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 2},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'fusionRayEmitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 2},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'fusionRayEmitter5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 2},
                            spread: Math.PI/48,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: orangeBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 5,
                                dmg: 2, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'smallGravitonEmitter1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/96,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: greenBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 3,
                                dmg: 5, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'smallGravitonEmitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: Math.PI/96,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: greenBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 3,
                                dmg: 5, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'GravitonEmitter1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 4, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'GravitonEmitter2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -10, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 4, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'GravitonEmitter3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 4, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'GravitonEmitter4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: [],
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 2,
                                dmg: 4, 
                                piercing: true,
                            },
                        },
                    },
                    {
                        id: 'GravitonEmitterMain',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 0,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(150, 150, 150, 0)',
                            stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 1},
                            spread: 0,
                            bullet: {
                                v: 0,
                                maxV: 0,
                                vr: 0,
                                vDrag: 1,
                                rDrag: 0,
                                parts: gravitonBeam,
                                cType: 'line',
                                cSize: {start: {x: 0, y: 0}, end: {x: 0, y: -2500}},
                                life: 4, 
                                dmg: 10, 
                                piercing: true,
                                persistent: true,
                            },
                        },
                    },
                    {
                        id: 'guide rail 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: -25, y: 0},
                            {x: -16, y: 0},
                            {x: -16, y: -180},
                            {x: -25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'guide rail 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 25, y: 0},
                            {x: 16, y: 0},
                            {x: 16, y: -180},
                            {x: 25, y: -180},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -100},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -130},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support3',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -160},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support4',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -190},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'support5',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 23, y: 10},
                            {x: -23, y: 10},
                            {x: -23, y: 0},
                            {x: 23, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -220},
                        style: {
                            fill: 'rgba(180, 180, 180, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'deco 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 4, y: 0},
                            {x: -4, y: 0},
                            {x: -4, y: -120},
                            {x: 4, y: -120},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 30, y: -90},
                        style: {
                            fill: 'rgba(120, 120, 120, 1)',
                            stroke: {colour: '#696969', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                    {
                        id: 'arm brace 2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: 0,
                        size: [
                            {x: 8, y: -15},
                            {x: -8, y: -15},
                            {x: -5, y: 15},
                            {x: 5, y: 15},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: -20, y: -55},
                        style: {
                            fill: 'rgba(80, 80, 80, 1)',
                            stroke: {colour: 'rgba(40, 40, 40, 1)', width: 1},
                        },
                    },
                ]
            },
            SingularityLauncher: {
                parts: [
                    {
                        id: 'Arm1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -15, y: 10}, 
                            {x: -25, y: 10}, 
                            {x: -35, y: 30}, 
                            {x: -15, y: 70}, 
                            {x: -25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Arm2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 15, y: 10}, 
                            {x: 25, y: 10}, 
                            {x: 35, y: 30}, 
                            {x: 15, y: 70}, 
                            {x: 25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(75, 75, 75, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -25, y: 10},
                            {x: 25, y: 10},
                            {x: 25, y: 0},
                            {x: -25, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Spike',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -5, y: 10},
                            {x: 5, y: 10},
                            {x: 0, y: 75},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Cannon',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 300},
                            spread: Math.PI/48,
                            bullet: {
                                v: 40,
                                vr: Math.PI/24,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 900, 
                                dmg: 10,
                                piercing: true,
                            },
                        }
                    },
                ]
            },
            SingularityLauncherMK2: {
                parts: [
                    {
                        id: 'Arm1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -15, y: 10}, 
                            {x: -25, y: 10}, 
                            {x: -35, y: 30}, 
                            {x: -15, y: 70}, 
                            {x: -25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Arm2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 15, y: 10}, 
                            {x: 25, y: 10}, 
                            {x: 35, y: 30}, 
                            {x: 15, y: 70}, 
                            {x: 25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -25, y: 10},
                            {x: 25, y: 10},
                            {x: 25, y: 0},
                            {x: -25, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Spike',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -5, y: 10},
                            {x: 5, y: 10},
                            {x: 0, y: 75},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Cannon',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 300},
                            spread: Math.PI/48,
                            bullet: {
                                v: 40,
                                vr: Math.PI/24,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 900, 
                                dmg: 75,
                                piercing: true,
                            },
                        }
                    },
                ]
            },
            SingularityLauncherMK3: {
                parts: [
                    {
                        id: 'Arm1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -15, y: 10}, 
                            {x: -25, y: 10}, 
                            {x: -35, y: 30}, 
                            {x: -15, y: 70}, 
                            {x: -25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Arm2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 15, y: 10}, 
                            {x: 25, y: 10}, 
                            {x: 35, y: 30}, 
                            {x: 15, y: 70}, 
                            {x: 25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -25, y: 10},
                            {x: 25, y: 10},
                            {x: 25, y: 0},
                            {x: -25, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Spike',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -5, y: 10},
                            {x: 5, y: 10},
                            {x: 0, y: 75},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Cannon',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 300},
                            spread: Math.PI/48,
                            bullet: {
                                v: 40,
                                vr: Math.PI/24,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 4500, 
                                dmg: 500,
                                piercing: true,
                            },
                        }
                    },
                ]
            },
            SingularityLauncherMK4: {
                parts: [
                    {
                        id: 'Arm1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -15, y: 10}, 
                            {x: -25, y: 10}, 
                            {x: -35, y: 30}, 
                            {x: -15, y: 70}, 
                            {x: -25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Arm2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 15, y: 10}, 
                            {x: 25, y: 10}, 
                            {x: 35, y: 30}, 
                            {x: 15, y: 70}, 
                            {x: 25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -25, y: 10},
                            {x: 25, y: 10},
                            {x: 25, y: 0},
                            {x: -25, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Spike',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -5, y: 10},
                            {x: 5, y: 10},
                            {x: 0, y: 75},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Cannon',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 300},
                            spread: Math.PI/48,
                            bullet: {
                                v: 40,
                                vr: Math.PI/24,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 60000, 
                                dmg: 2500,
                                piercing: true,
                            },
                        }
                    },
                ]
            },
            SingularityLauncherMK5: {
                parts: [
                    {
                        id: 'Arm1',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -15, y: 10}, 
                            {x: -25, y: 10}, 
                            {x: -35, y: 30}, 
                            {x: -15, y: 70}, 
                            {x: -25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Arm2',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: 15, y: 10}, 
                            {x: 25, y: 10}, 
                            {x: 35, y: 30}, 
                            {x: 15, y: 70}, 
                            {x: 25, y: 30}, 
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Base',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -25, y: 10},
                            {x: 25, y: 10},
                            {x: 25, y: 0},
                            {x: -25, y: 0},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 5},
                        },
                    },
                    {
                        id: 'Spike',
                        facing: 'turret',
                        type: 'polygon', 
                        rOffset: Math.PI,
                        size: [
                            {x: -5, y: 10},
                            {x: 5, y: 10},
                            {x: 0, y: 75},
                        ],
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -70},
                        style: {
                            fill: 'rgba(100, 100, 100, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                    },
                    {
                        id: 'Cannon1',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 30},
                            spread: Math.PI/12,
                            bullet: {
                                v: 35,
                                vr: Math.PI/12,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 216000, 
                                dmg: 7500,
                                piercing: true,
                            },
                        }
                    },
                    {
                        id: 'Cannon2',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 30},
                            spread: Math.PI/12,
                            bullet: {
                                v: 38,
                                vr: Math.PI/12,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 216000, 
                                dmg: 7500,
                                piercing: true,
                            },
                        }
                    },
                    {
                        id: 'Cannon3',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 30},
                            spread: Math.PI/12,
                            bullet: {
                                v: 40,
                                vr: Math.PI/12,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 216000, 
                                dmg: 7500,
                                piercing: true,
                            },
                        }
                    },
                    {
                        id: 'Cannon4',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 30},
                            spread: Math.PI/12,
                            bullet: {
                                v: 42,
                                vr: Math.PI/12,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 216000, 
                                dmg: 7500,
                                piercing: true,
                            },
                        }
                    },
                    {
                        id: 'Cannon5',
                        facing: 'turret',
                        type: 'circle', 
                        rOffset: 0,
                        size: 10,
                        scale: {x: 1, y: 1},
                        offset: {x: 0, y: -145},
                        style: {
                            fill: 'rgba(50, 50, 50, 1)',
                            stroke: {colour: 'rgba(25, 25, 25, 1)', width: 2},
                        },
                        cannon: {
                            keybind: 'click',
                            x: 0,
                            y: 0,
                            reload: {c: 0, t: 30},
                            spread: Math.PI/48,
                            bullet: {
                                v: 45,
                                vr: Math.PI/12,
                                vDrag: 0.9,
                                rDrag: 1,
                                parts: singularity,
                                cType: 'point',
                                cSize: null,
                                life: 216000, 
                                dmg: 7500,
                                piercing: true,
                            },
                        }
                    },
                ]
            },
        },
        obstacles: {
            basicWall: {
                type: 'polygon',
                cType: 'tall',
                size: [
                    {x: -100, y: -100},
                    {x: 100, y: -100},
                    {x: 100, y: 100},
                    {x: -100, y: 100},
                ],
                style: {
                    fill: 'rgba(128, 128, 128, 1)',
                    stroke: {colour: 'rgba(115, 115, 115, 1)', width: 10},
                },
                collisionEdges: [0,1,2,3],
            },
        },
        parts: {
            empty: {
                id: 'placeholder',
                type: 'circle', 
                facing: 'body',
                rOffset: 0,
                size: 0,
                offset: {x: 0, y: 0},
                style: {
                    fill: 'rgba(0, 0, 0, 0)',
                    stroke: {colour: 'rgba(0, 0, 0, 0)', width: 1},
                },
                collision: false,
                hp: 1,
                maxHp: 1,
                isHit: 0,
                connected: [],
            },
        },
    },
    upgrades: {
        tier1: [
            {
                display: `Right Pistol `,
                description: `Improve the cameraman's pistol`,
                id: 3,
                level: 2,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[3];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
                    upgrade.description = "Improve the cameraman's pistol";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'PistolMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'PistolMK3', 'mech', 'rightArmMain');
                    upgrade.cost += 850;
                    upgrade.description = "Upgrade to a plasma pistol";
                } else if (upgrade.level == 4) {
                    upgrade.cost += 1850;
                    player = addWeapon(player, 'PistolMK4', 'mech', 'rightArmMain');
                    upgrade.description = "Upgrade to a fusion pistol";
                } else if (upgrade.level == 5) {
                    player = addWeapon(player, 'PistolMK5', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 350, 
                increment: {cost: 150, mode: `addition`}
            },
            {
                display: `Left Pistol `,
                description: `Adds a basic pistol to the cameraman\'s left arm`,
                id: 4,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[4];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Pistol', 'mech', 'leftArmMain');
                    upgrade.description = "Improve the cameraman's pistol";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'PistolMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'PistolMK3', 'mech', 'leftArmMain');
                    upgrade.cost += 850;
                    upgrade.description = "Upgrade to a plasma pistol";
                } else if (upgrade.level == 4) {
                    upgrade.cost += 1850;
                    player = addWeapon(player, 'PistolMK4', 'mech', 'leftArmMain');
                    upgrade.description = "Upgrade to a fusion pistol";
                } else if (upgrade.level == 5) {
                    player = addWeapon(player, 'PistolMK5', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 200, 
                increment: {cost: 150, mode: `addition`}
            },
            {
                display: `Right Cannon `,
                description: `Adds a slow firing but strong cannon to the cameraman\'s right arm`,
                id: 5,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[5];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Cannon', 'mech', 'rightArmMain');
                    upgrade.description = "Improve the cameraman's cannon";
                } else if (upgrade.level == 2) {
                    upgrade.cost += 350;
                    upgrade.description = "Switch to powerful plasma balls for greatly improved damage";
                    player = addWeapon(player, 'CannonMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    upgrade.cost += 1500;
                    upgrade.description = "Plasma balls last much longer, do more damage and can hit multiple enemies";
                    player = addWeapon(player, 'CannonMK3', 'mech', 'rightArmMain');
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'CannonMK4', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 500, 
                increment: {cost: 150, mode: `addition`}
            },
            {
                display: `Left Cannon `,
                description: `Adds a slow firing but strong cannon to the cameraman\'s left arm`,
                id: 6,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[6];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Cannon', 'mech', 'leftArmMain');
                    upgrade.description = "Improve the cameraman's cannon";
                } else if (upgrade.level == 2) {
                    upgrade.cost += 350;
                    upgrade.description = "Switch to powerful plasma balls for greatly improved damage";
                    player = addWeapon(player, 'CannonMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    upgrade.cost += 1500;
                    upgrade.description = "Plasma balls last much longer, do more damage and can hit multiple enemies";
                    player = addWeapon(player, 'CannonMK3', 'mech', 'leftArmMain');
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'CannonMK4', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 500, 
                increment: {cost: 150, mode: `addition`}
            },
            {
                display: `Right Shotgun `,
                description: `Adds a shotgun to the cameraman\'s right arm`,
                id: 7,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[7];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Shotgun', 'mech', 'rightArmMain');
                    upgrade.description = "Improve shotgun range and damage";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'ShotgunMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'ShotgunMK3', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 600, 
                increment: {cost: 500, mode: `addition`}
            },
            {
                display: `Left Shotgun `,
                description: `Adds a shotgun to the cameraman\'s left arm`,
                id: 8,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[8];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Shotgun', 'mech', 'leftArmMain');
                    upgrade.description = "Improve shotgun range and damage";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'ShotgunMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'ShotgunMK3', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 600, 
                increment: {cost: 500, mode: `addition`}
            },         
        ],
        tier2: [
            {
                display: `Right Semi-Auto Sniper `,
                description: `Adds a fast firing sniper rifle to the cameraman\'s right arm`,
                id: 9,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[9];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Rifle', 'mech', 'rightArmMain');
                    upgrade.description = "Greatly increase the cameraman's rifle damage at the expense of fire rate";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'RifleMK2', 'mech', 'rightArmMain');
                    upgrade.cost-=1500;
                    upgrade.description = "Improve all of the rifle's stats";
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'RifleMK3', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 1500, 
                increment: {cost: 1000, mode: `addition`}
            },
            {
                display: `Left Semi-Auto Sniper `,
                description: `Adds a fast firing sniper rifle to the cameraman\'s left arm`,
                id: 10,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[10];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Rifle', 'mech', 'leftArmMain');
                    upgrade.description = "Greatly increase the cameraman's rifle damage at the expense of fire rate";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'RifleMK2', 'mech', 'leftArmMain');
                    upgrade.cost-=1500;
                    upgrade.description = "Improve all of the rifle's stats";
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'RifleMK3', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 1500, 
                increment: {cost: 1000, mode: `addition`}
            },
            {
                display: `Right Laser Cannon `,
                description: `Adds a powerful laser cannon to the cameraman\'s right arm`,
                id: 11,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[11];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'LaserCannon', 'mech', 'rightArmMain');
                    upgrade.description = "Improve the cameraman's laser cannon";
                } else if (upgrade.level == 2) {
                    upgrade.cost += 2500;
                    player = addWeapon(player, 'LaserCannonMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'LaserCannonMK3', 'mech', 'rightArmMain');
                    upgrade.cost += 5000;
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'LaserCannonMK4', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 2500, 
                increment: {cost: -1000, mode: `addition`}
            },
            {
                display: `Left Laser Cannon `,
                description: `Adds a powerful laser cannon to the cameraman\'s left arm`,
                id: 12,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[12];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'LaserCannon', 'mech', 'leftArmMain');
                    upgrade.description = "Improve the cameraman's laser cannon";
                } else if (upgrade.level == 2) {
                    upgrade.cost += 2500;
                    player = addWeapon(player, 'LaserCannonMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'LaserCannonMK3', 'mech', 'leftArmMain');
                    upgrade.cost += 5000;
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'LaserCannonMK4', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 2500, 
                increment: {cost: -1000, mode: `addition`}
            },
            {
                display: `Right Heavy Sniper `,
                description: `Adds a slow firing, piercing, laser sniper to the cameraman's right arm`,
                id: 13,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[13];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Sniper', 'mech', 'rightArmMain');
                    upgrade.description = "Improve the cameraman's sniper";
                    upgrade.cost -= 500;
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'SniperMK2', 'mech', 'rightArmMain');
                    upgrade.cost += 3000;
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'SniperMK3', 'mech', 'rightArmMain');
                    upgrade.cost += 9000;
                    upgrade.description = "Convert the pulse laser rifle to a continuous beam of destruction";
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'SniperMK4', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 3000, 
                increment: {cost: 0, mode: `addition`}
            },
            {
                display: `Left Heavy Sniper `,
                description: `Adds a slow firing, piercing, laser sniper to the cameraman's left arm`,
                id: 14,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[14];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'Sniper', 'mech', 'leftArmMain');
                    upgrade.description = "Improve the cameraman's sniper";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'SniperMK2', 'mech', 'leftArmMain');
                    upgrade.cost += 3000;
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'SniperMK3', 'mech', 'leftArmMain');
                    upgrade.cost += 9000;
                    upgrade.description = "Convert the pulse laser rifle to a continuous beam of destruction";
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'SniperMK4', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 3000, 
                increment: {cost: 0, mode: `addition`}
            },
        ],
        tier3: [
            {
                display: `Right Plasma Cannon `,
                description: `Adds a powerful plasma accelerator to the cameraman\'s right arm`,
                id: 15,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[15];
                if (upgrade.level == 1) {
                    upgrade.description = "Improve the cameraman's plasma cannon";
                    player = addWeapon(player, 'PlasmaCannon', 'mech', 'rightArmMain');
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'PlasmaCannonMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'PlasmaCannonMK3', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 5000, 
                increment: {cost: 2500, mode: `addition`}
            },
            {
                display: `Left Plasma Cannon `,
                description: `Adds a powerful plasma accelerator to the cameraman\'s left arm`,
                id: 16,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[16];
                if (upgrade.level == 1) {
                    player = addWeapon(player, 'PlasmaCannon', 'mech', 'leftArmMain');
                    upgrade.description = "Improve the cameraman's plasma cannon";
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'PlasmaCannonMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'PlasmaCannonMK3', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 5000, 
                increment: {cost: 2500, mode: `addition`}
            },
            {
                display: `Right Railgun `,
                description: `Adds a devastating railgun to the cameraman\'s right arm`,
                id: 17,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[17];
                if (upgrade.level == 1) {
                    upgrade.description = "Improve the cameraman's railgun";
                    player = addWeapon(player, 'Railgun', 'mech', 'rightArmMain');
                } else if (upgrade.level == 2) {
                    upgrade.description = "Upgrade the railgun to a high energy particle accelerator";
                    player = addWeapon(player, 'RailgunMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    upgrade.description = "Upgrade to a graviton fusion beam";
                    player = addWeapon(player, 'RailgunMK3', 'mech', 'rightArmMain');
                    upgrade.cost += 12500;
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'RailgunMK4', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 7500, 
                increment: {cost: 5000, mode: `addition`}
            },
            {
                display: `Left Railgun `,
                description: `Adds a devastating railgun to the cameraman\'s left arm`,
                id: 18,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[18];
                if (upgrade.level == 1) {
                    upgrade.description = "Improve the cameraman's railgun";
                    player = addWeapon(player, 'Railgun', 'mech', 'leftArmMain');
                } else if (upgrade.level == 2) {
                    upgrade.description = "Upgrade the railgun to a high energy particle accelerator";
                    player = addWeapon(player, 'RailgunMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    upgrade.description = "Upgrade to a graviton fusion beam";
                    player = addWeapon(player, 'RailgunMK3', 'mech', 'leftArmMain');
                    upgrade.cost += 12500;
                } else if (upgrade.level == 4) {
                    player = addWeapon(player, 'RailgunMK4', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 7500, 
                increment: {cost: 5000, mode: `addition`}
            },
            {
                display: `Right Singularity Launcher `,
                description: `Adds a miniture black hole launcher to the cameraman's right arm.`,
                id: 19,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[19];
                if (upgrade.level == 1) {
                    upgrade.description = "Improve the cameraman's singularity launcher";
                    player = addWeapon(player, 'SingularityLauncher', 'mech', 'rightArmMain');
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'SingularityLauncherMK2', 'mech', 'rightArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'SingularityLauncherMK3', 'mech', 'rightArmMain');
                } else if (upgrade.level == 4) {
                    upgrade.cost += 25000;
                    player = addWeapon(player, 'SingularityLauncherMK4', 'mech', 'rightArmMain');
                } else if (upgrade.level == 5) {
                    player = addWeapon(player, 'SingularityLauncherMK5', 'mech', 'rightArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 12500, 
                increment: {cost: 7500, mode: `addition`}
            },
            {
                display: `Left Singularity Launcher `,
                description: `Adds a miniture black hole launcher to the cameraman's left arm.`,
                id: 20,
                level: 1,
                effect: `
                var newPlayer = player;
                let upgrade = newPlayer.upgrades[20];
                if (upgrade.level == 1) {
                    upgrade.description = "Improve the cameraman's singularity launcher";
                    player = addWeapon(player, 'SingularityLauncher', 'mech', 'leftArmMain');
                } else if (upgrade.level == 2) {
                    player = addWeapon(player, 'SingularityLauncherMK2', 'mech', 'leftArmMain');
                } else if (upgrade.level == 3) {
                    player = addWeapon(player, 'SingularityLauncherMK3', 'mech', 'leftArmMain');
                } else if (upgrade.level == 4) {
                    upgrade.cost += 25000;
                    player = addWeapon(player, 'SingularityLauncherMK4', 'mech', 'leftArmMain');
                } else if (upgrade.level == 5) {
                    player = addWeapon(player, 'SingularityLauncherMK5', 'mech', 'leftArmMain');
                    upgrade.locked = true;
                }
                newPlayer;
                `,
                locked: false,
                cost: 12500, 
                increment: {cost: 7500, mode: `addition`}
            },
        ],
    },
    scripts: {
        noAI: `(function() {${noAI}})()`,
        shootAI: `(function() {${basicShootingAI}})()`,
        ramAI: `(function() {${ramAI}})()`,
    },
    checkpoint: {
        x: 0,
        y: 0,
        collisionR: 100,
        type: 'checkpoint',
        triggered: false,
        parts: [
            {
                id: 'Checkpoint',
                facing: 'body',
                type: 'circle', 
                rOffset: 0,
                size: 100,
                offset: {x: 10, y: 10},
                style: {
                    fill: 'rgba(100, 255, 100, 1)',
                    stroke: {colour: 'rgba(50, 200, 50, 1)', width: 10},
                },
                style2: {
                    fill: 'rgba(80, 204, 80, 1)',
                    stroke: {colour: 'rgba(40, 160, 40, 1)', width: 10},
                },
                connected: [],
            },
        ],
    },
    red: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(255, 0, 0, 1)',
        stroke: {colour: 'rgba(255, 0, 0, 1)', width: 5, opacity: 1},
    },
    green: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 255, 0, 1)',
        stroke: {colour: 'rgba(0, 255, 0, 1)', width: 5, opacity: 1},
    },
    blue: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 0, 255, 1)',
        stroke: {colour: 'rgba(0, 0, 255, 1)', width: 5, opacity: 1},
    },
    black: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 0, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 1)', width: 5, opacity: 1},
    },
    white: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 0, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 1)', width: 5, opacity: 1},
    },
    hpBarBg: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(200, 200, 200, 1)',
        stroke: {colour: 'rgba(125, 125, 125, 1)', width: 3, opacity: 1},
    },
    hpBarFill: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(0, 255, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0, opacity: 1},
    },
    hpBarFill2: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(255, 255, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0, opacity: 1},
    },
    hpBarFill3: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(255, 165, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0, opacity: 1},
    },
    hpBarFill4: { // SHOULD be compatible with any rendering thing I made (in theory)
        fill: 'rgba(255, 0, 0, 1)',
        stroke: {colour: 'rgba(0, 0, 0, 0)', width: 0, opacity: 1},
    },
};

var teams = [];
var projectiles = [];
var particles = [];
var entities = [];
var obstacles = [];
var explosions = [];
var shields = [];
var checkpoint = JSON.parse(JSON.stringify(data.checkpoint));

// Loading savegames TODO: add saving entire game not just player
var player = {};
//localStorage.removeItem('player');
var savedPlayer = localStorage.getItem('player');
if (savedPlayer !== null) {
    console.log('loading previous save');
    player = JSON.parse(savedPlayer);
    console.log(savedPlayer);
} else {
    // No saved data found
    console.log('no save found, creating new player');
    player = JSON.parse(JSON.stringify(data.mech));
    entities.push(player);
};

// Steal Data (get inputs)
var mousepos = {x:0,y:0};
var display = {x:window.innerWidth, y:window.innerHeight};
//console.log(display);
//console.log(entities);
window.onkeyup = function(e) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].directControl) {
            entities[i].keyboard[e.key.toLowerCase()] = false; 
        }
    }
};
window.onkeydown = function(e) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].directControl) {
            entities[i].keyboard[e.key.toLowerCase()] = true; 
            if (!paused) {
                e.preventDefault();
            }
        }
    }
};
document.addEventListener('mousedown', function(event) {
    if (event.button === 0) { // Check if left mouse button was clicked
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].directControl) {
                entities[i].keyboard.click = true;
            }
        }
    }
});
document.addEventListener('mouseup', function(event) {
    if (event.button === 0) { // Check if left mouse button was released
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].directControl) {
                entities[i].keyboard.click = false;
            }
        }
    }
});
window.addEventListener("resize", function () {
    if (t > 0) {
        display = {x:window.innerWidth,y:window.innerHeight};
        replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    }
});
function tellPos(p){
    mousepos = {x: p.pageX, y:p.pageY};
};
window.addEventListener('mousemove', tellPos, false);
var buttons = document.getElementsByClassName('button');

// debug visualisation
function drawSimplePolygon(point) {
    let points = JSON.parse(JSON.stringify(point));
    //console.log(points);
    if (points.length < 3) {
        throw "Error: Your polygon needs to have at least 3 points dumbass";
    }
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    ctx.moveTo((points[0].x-player.x)*data.constants.zoom+display.x/2, (points[0].y-player.y)*data.constants.zoom+display.y/2);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo((points[i].x-player.x)*data.constants.zoom+display.x/2, (points[i].y-player.y)*data.constants.zoom+display.y/2);
    }
    ctx.closePath();
    ctx.fillStyle = data.red.fill;
    ctx.fill();
    ctx.lineWidth = data.red.stroke.width*data.constants.zoom;
    ctx.strokeStyle = data.red.stroke.colour;
    ctx.stroke();
};

// Game related stuff
function load() {
    console.log('Startin the game...');
    replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    game();
};

function loadLevel(level) {
    console.log('Startin the game...');
    replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    eval(`level${level}();`);
    t = 0;
    game();
};

function loadScript(force, n) {
    for (let i=0; i < teams.length; i++) {
        if (teams[i].id == force) {
            if (n == 0) {
                teams[i].script = `(function() {${document.getElementById(`script${n}`).value}})()`; //.replaceAll('\n', '').replaceAll('\t', '')
                console.log(teams[i].script);
            } else {
                teams[i].scripts[`script${n}`] = `(function() {${document.getElementById(`script${n}`).value}})()`; //.replaceAll('\n', '').replaceAll('\t', '')
                console.log(teams[i].scripts);
            }
        }
    }
};

function placeObstacle(objId, r, coords) {
    let obj = JSON.parse(JSON.stringify(data.template.obstacles[objId]));
    obj.size = offsetPoints(rotatePolygon(obj.size, r), coords);
    for (let i = 0; i < obj.size.length; i++) {
        obj.size[i].x = Math.round(obj.size[i].x/10)*10;
        obj.size[i].y = Math.round(obj.size[i].y/10)*10;
    }

    obstacles.push(obj);
    return 0
};

function levelSTDV1() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 10000000;

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.ramAI = data.scripts.ramAI;
    enemyForce.scripts.shootAI = data.scripts.shootAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.mech)), JSON.parse(JSON.stringify(data.template.memory)), JSON.parse(JSON.stringify(data.template.player)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
    player.x = 0;
    player.y = 0;
    entities.push(player);

    // create enemy
    let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    basicEnemy.team = 'Enemy';
    basicEnemy.script = 'ramAI';

    for (let i = 0; i < 2; i++) {
        basicEnemy.x = randint(2000, 3500);
        basicEnemy.y = randint(2000, 3500);
        if (randchoice([0,1])) {
            basicEnemy.x *= -1;
        }
        if (randchoice([0,1])) {
            basicEnemy.y *= -1;
        }
        entities.push(JSON.parse(JSON.stringify(basicEnemy)));
    }
    
    console.log('Loaded skibidi toilet tower defense V1');
};

function levelSTDStrong() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 1000000;

    // buff enemies
    data.skibidiToilet.hp+=15;
    data.laserSkibidiToilet.hp+=7;
    data.mgSkibidiToilet.hp+=7;
    data.jetSkibidiToilet.hp+=17;
    data.reinforcedSkibidiToilet.hp+=35;

    data.skibidiToilet.value*=2.5;
    data.laserSkibidiToilet.value*=2.5;
    data.mgSkibidiToilet.value*=2.5;
    data.jetSkibidiToilet.value*=2.5;
    data.reinforcedSkibidiToilet.value*=2.5;

    // place obstacles
    placeObstacle(basicWall, 0, {x: 500, y: 500});
    placeObstacle(basicWall, 0, {x: -500, y: 500});
    placeObstacle(basicWall, 0, {x: 500, y: -500});
    placeObstacle(basicWall, 0, {x: -500, y: -500});

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.ramAI = data.scripts.ramAI;
    enemyForce.scripts.shootAI = data.scripts.shootAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.mech)), JSON.parse(JSON.stringify(data.template.memory)), JSON.parse(JSON.stringify(data.template.player)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
    player.x = 0;
    player.y = 0;
    entities.push(player);

    // create enemy
    let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    basicEnemy.team = 'Enemy';
    basicEnemy.script = 'ramAI';

    for (let i = 0; i < 2; i++) {
        basicEnemy.x = randint(2000, 3500);
        basicEnemy.y = randint(2000, 3500);
        if (randchoice([0,1])) {
            basicEnemy.x *= -1;
        }
        if (randchoice([0,1])) {
            basicEnemy.y *= -1;
        }
        entities.push(JSON.parse(JSON.stringify(basicEnemy)));
    }
    
    console.log('Loaded skibidi toilet tower defense V1');
};

function levelSTDFast() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 1000000;

    // buff enemies
    data.skibidiToilet.hp-=2;
    data.laserSkibidiToilet.hp-=2;
    data.mgSkibidiToilet.hp-=2;
    data.jetSkibidiToilet.hp-=3;
    data.reinforcedSkibidiToilet.hp-=5;

    data.skibidiToilet.v*=1.75;
    data.laserSkibidiToilet.v*=1.75;
    data.mgSkibidiToilet.v*=1.75;
    data.jetSkibidiToilet.v*=2;
    data.reinforcedSkibidiToilet.v*=1.75;

    data.skibidiToilet.value*=2.5;
    data.laserSkibidiToilet.value*=2.5;
    data.mgSkibidiToilet.value*=2.5;
    data.jetSkibidiToilet.value*=2.5;
    data.reinforcedSkibidiToilet.value*=2.5;

    // place obstacles
    placeObstacle(basicWall, 2*Math.PI/6, {x: 750*Math.cos(2*Math.PI/6), y: 750*Math.sin(2*Math.PI/6)});
    placeObstacle(basicWall, 2*Math.PI/3, {x: 750*Math.cos(2*Math.PI/3), y: 750*Math.sin(2*Math.PI/3)});
    placeObstacle(basicWall, 2*Math.PI/2, {x: 750*Math.cos(2*Math.PI/2), y: 750*Math.sin(2*Math.PI/2)});
    placeObstacle(basicWall, -2*Math.PI/6, {x: 750*Math.cos(-2*Math.PI/6), y: 750*Math.sin(-2*Math.PI/6)});
    placeObstacle(basicWall, -2*Math.PI/3, {x: 750*Math.cos(-2*Math.PI/3), y: 750*Math.sin(-2*Math.PI/3)});
    placeObstacle(basicWall, 0, {x: 750*Math.cos(0), y: 750*Math.sin(0)});

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.ramAI = data.scripts.ramAI;
    enemyForce.scripts.shootAI = data.scripts.shootAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.mech)), JSON.parse(JSON.stringify(data.template.memory)), JSON.parse(JSON.stringify(data.template.player)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
    player.x = 0;
    player.y = 0;
    entities.push(player);

    // create enemy
    let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    basicEnemy.team = 'Enemy';
    basicEnemy.script = 'ramAI';

    for (let i = 0; i < 2; i++) {
        basicEnemy.x = randint(2000, 3500);
        basicEnemy.y = randint(2000, 3500);
        if (randchoice([0,1])) {
            basicEnemy.x *= -1;
        }
        if (randchoice([0,1])) {
            basicEnemy.y *= -1;
        }
        entities.push(JSON.parse(JSON.stringify(basicEnemy)));
    }
    
    console.log('Loaded skibidi toilet tower defense V1');
};

function levelSTDCash() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 1000000;

    // buff enemies
    data.skibidiToilet.value*=2;
    data.laserSkibidiToilet.value*=2;
    data.mgSkibidiToilet.value*=2;
    data.jetSkibidiToilet.value*=2;
    data.reinforcedSkibidiToilet.value*=2;

    // place obstacles
    placeObstacle(basicWall, 2*Math.PI/3, {x: 750*Math.cos(2*Math.PI/3), y: 750*Math.sin(2*Math.PI/3)});
    placeObstacle(basicWall, 0, {x: 750*Math.cos(0), y: 750*Math.sin(0)});
    placeObstacle(basicWall, -2*Math.PI/3, {x: 750*Math.cos(-2*Math.PI/3), y: 750*Math.sin(-2*Math.PI/3)});

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.ramAI = data.scripts.ramAI;
    enemyForce.scripts.shootAI = data.scripts.shootAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.mech)), JSON.parse(JSON.stringify(data.template.memory)), JSON.parse(JSON.stringify(data.template.player)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
    player.x = 0;
    player.y = 0;
    entities.push(player);

    // create enemy
    let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    basicEnemy.team = 'Enemy';
    basicEnemy.script = 'ramAI';

    for (let i = 0; i < 2; i++) {
        basicEnemy.x = randint(2000, 3500);
        basicEnemy.y = randint(2000, 3500);
        if (randchoice([0,1])) {
            basicEnemy.x *= -1;
        }
        if (randchoice([0,1])) {
            basicEnemy.y *= -1;
        }
        entities.push(JSON.parse(JSON.stringify(basicEnemy)));
    }
    
    console.log('Loaded skibidi toilet tower defense V1');
};

function levelSTDHard() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 1000000;

    // buff enemies
    data.skibidiToilet.hp+=5;
    data.laserSkibidiToilet.hp+=2;
    data.mgSkibidiToilet.hp+=2;
    data.jetSkibidiToilet.hp+=4;
    data.reinforcedSkibidiToilet.hp+=35;

    data.skibidiToilet.v*=1.5;
    data.laserSkibidiToilet.v*=1.5;
    data.mgSkibidiToilet.v*=1.5;
    data.jetSkibidiToilet.v*=1.5;
    data.reinforcedSkibidiToilet.v*=1.5;

    data.skibidiToilet.value*=5;
    data.laserSkibidiToilet.value*=5;
    data.mgSkibidiToilet.value*=5;
    data.jetSkibidiToilet.value*=5;
    data.reinforcedSkibidiToilet.value*=5;

    // place obstacles
    placeObstacle(basicWall, 10*Math.PI/5, {x: 750*Math.cos(2*Math.PI/5), y: 750*Math.sin(2*Math.PI/5)});
    placeObstacle(basicWall, 2*Math.PI/5, {x: 750*Math.cos(4*Math.PI/5), y: 750*Math.sin(4*Math.PI/5)});
    placeObstacle(basicWall, 4*Math.PI/5, {x: 750*Math.cos(6*Math.PI/5), y: 750*Math.sin(6*Math.PI/5)});
    placeObstacle(basicWall, -6*Math.PI/5, {x: 750*Math.cos(-8*Math.PI/5), y: 750*Math.sin(-8*Math.PI/5)});
    placeObstacle(basicWall, -8*Math.PI/5, {x: 750*Math.cos(-10*Math.PI/5), y: 750*Math.sin(-10*Math.PI/5)});

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.ramAI = data.scripts.ramAI;
    enemyForce.scripts.shootAI = data.scripts.shootAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.mech)), JSON.parse(JSON.stringify(data.template.memory)), JSON.parse(JSON.stringify(data.template.player)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
    player.x = 0;
    player.y = 0;
    entities.push(player);

    // create enemy
    let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    basicEnemy.team = 'Enemy';
    basicEnemy.script = 'ramAI';

    for (let i = 0; i < 2; i++) {
        basicEnemy.x = randint(2000, 3500);
        basicEnemy.y = randint(2000, 3500);
        if (randchoice([0,1])) {
            basicEnemy.x *= -1;
        }
        if (randchoice([0,1])) {
            basicEnemy.y *= -1;
        }
        entities.push(JSON.parse(JSON.stringify(basicEnemy)));
    }
    
    console.log('Loaded skibidi toilet tower defense V1');
};

function levelSTDLag() {
    overlay.style.display = 'none';
    const basicWall = 'basicWall';

    // clear arrays and move checkpoint
    obstacles = [];
    projectiles = [];
    explosions = [];
    particles = [];
    entities = [];
    shields = [];
    teams = [];    
    checkpoint = JSON.parse(JSON.stringify(data.checkpoint));
    checkpoint.x = 0;
    checkpoint.y = 1000000;

    // buff enemies
    data.constants.extraEnemies = 5;

    // place obstacles

    // Create teams
    let playerForce = JSON.parse(JSON.stringify(data.template.team));
    playerForce.id = 'Player';
    teams.push(playerForce);

    let enemyForce = JSON.parse(JSON.stringify(data.template.team));
    enemyForce.id = 'Enemy';
    enemyForce.scripts.ramAI = data.scripts.ramAI;
    enemyForce.scripts.shootAI = data.scripts.shootAI;
    teams.push(enemyForce);

    // Create player
    player = Object.assign({}, JSON.parse(JSON.stringify(data.mech)), JSON.parse(JSON.stringify(data.template.memory)), JSON.parse(JSON.stringify(data.template.player)));
    player.directControl = true;
    player.team = 'Player';
    player.script = 'script1';
    player = addWeapon(player, 'Pistol', 'mech', 'rightArmMain');
    player.x = 0;
    player.y = 0;
    entities.push(player);

    // create enemy
    let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
    basicEnemy.team = 'Enemy';
    basicEnemy.script = 'ramAI';

    for (let i = 0; i < 2; i++) {
        basicEnemy.x = randint(2000, 3500);
        basicEnemy.y = randint(2000, 3500);
        if (randchoice([0,1])) {
            basicEnemy.x *= -1;
        }
        if (randchoice([0,1])) {
            basicEnemy.y *= -1;
        }
        entities.push(JSON.parse(JSON.stringify(basicEnemy)));
    }
    
    console.log('Loaded skibidi toilet tower defense V1');
};

function spawnUnit(team, unitType, unitName, script) {
    let unit = Object.assign({}, JSON.parse(JSON.stringify(data[unitType])), JSON.parse(JSON.stringify(data.memory)));
    unit.team = team.id;
    unit.id = unitName;
    unit.x = team.spawn.x;
    unit.y = team.spawn.y;
    unit.script = script;
};

function recursiveAddParts(unit, parts, weapon) {
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].id == weapon.id) {
            parts[i] = weapon;
        }
        parts[i].connected = recursiveAddParts(unit, parts[i].connected, weapon);
    }
    return parts;
};

function recursiveOffset(parts, offset) {
    for (let i = 0; i < parts.length; i++) {
        parts[i].offset = vMath(parts[i].offset, offset, '+');
        parts[i].connected = recursiveOffset(parts[i].connected, offset);
    }
    return parts;
};

function recursiveInvert(parts) {
    for (let i = 0; i < parts.length; i++) {
        parts[i].offset.x *= -1
        parts[i].rOffset *= -1;
        if (parts[i].type == 'polygon') {
            for (let j = 0; j < parts[i].size.length; j++) {
                parts[i].size[j].x *= -1;
            }
        }
        parts[i].connected = recursiveInvert(parts[i].connected);
    }
    return parts;
};

function recursiveModify(parts, facing=undefined, keybind=undefined) {
    for (let i = 0; i < parts.length; i++) {
        if (facing) {
            parts[i].facing = facing;
        }
        if (keybind) {
            if (parts[i].cannon) {
                parts[i].cannon.keybind = keybind;
            }
        }
        parts[i].connected = recursiveModify(parts[i].connected);
    }
    return parts;
};

function addWeapon(unit, weaponID, unitType, slot, keybind='click') {
    let weapon = JSON.parse(JSON.stringify(data.template.weapons[weaponID]));
    let offset = {x: 0, y: 0};
    let invert = false;
    let facing = 'turret';
    let nParts = []
    for (let i = 0; i < unit.parts.length; i++) {
        if (!unit.parts[i].id.includes(slot)) {
            nParts.push(unit.parts[i]);
        }
    }
    unit.parts = nParts;
    let nOffset = undefined;
    switch (unitType) {
        case 'mech':
            switch (slot) {
                case 'rightArmMain':
                    invert = true;
                case 'leftArmMain':
                    nOffset = {x: -100, y: 0};
                    break;
                case 'rightArmSide':
                    invert = true;
                case 'leftArmSide':
                    //console.log(weaponID+'SideMounted');
                    //console.log(data.template.weapons[weaponID+'SideMounted']);
                    weapon = JSON.parse(JSON.stringify(data.template.weapons[weaponID+'SideMounted']));
                    nOffset = {x: -150, y: 0};
                    break;
                case 'headTurret':
                    break;
                case 'back':
                    nOffset = {x: 0, y: 20};
                    break;
                default:
                    throw `tf is this slot type! ${slot}`;
            }
            break;
        case 'tank':
            break;
        default:
            throw `ERROR: Unsupported unit type for weapon assignment: ${unitType}!`;
    }
    weapon.facing = facing;
    weapon.keybind = keybind;
    console.log(weapon);
    for (let i = 0; i < weapon.parts.length; i++) {
        weapon.parts[i].facing = facing;
        weapon.parts[i].offset = vMath(weapon.parts[i].offset, offset, '+');
        weapon.parts[i].offset = vMath(weapon.parts[i].offset, nOffset, '+');
        weapon.parts[i].id = `${slot} ${i}`;
        if (invert) {
            if (weapon.parts[i].type == 'polygon') {
                for (let j = 0; j < weapon.parts[i].size.length; j++) {
                    weapon.parts[i].size[j].x *= -1;
                }
            }
            weapon.parts[i].rOffset *= -1;
            weapon.parts[i].offset.x *= -1;
        }
        weapon.parts[i].offset.x /= weapon.parts[i].scale.x;
        weapon.parts[i].offset.y /= weapon.parts[i].scale.y;
        unit.parts.push(weapon.parts[i]);
    }
    console.log(unit);
    return unit;
};

function handlePlayerMotion(unit, obstacles) {
    //console.log(unit.keyboard);
    if (unit.directControl) {
        unit.aimPos = vMath(vMath(mousepos, unit, '+'), vMath(display, 0.5, '*'), '-');
    }
    if (unit.keyboard.aimPos) {
        unit.aimPos = unit.keyboard.aimPos;
        unit.keyboard.aimPos = undefined;
    }
    unit.mouseR = rotateAngle(unit.mouseR, aim(unit, unit.aimPos), unit.tr);
    unit.lastMoved += 1;
    unit.r = correctAngle(unit.r);
    unit.mouseR = correctAngle(unit.mouseR);
    switch (unit.type) {
        case 'mech':
            unit.vx = 0;
            unit.vy = 0;
            let mechSpeed = unit.v;
            if (unit.keyboard.capslock) {
                mechSpeed *= 1.25;
            }
            if (unit.keyboard.shift) {
                mechSpeed *= 1.25;
            }
            let mechIsMoving = false;
            let mechVector = {x: 0, y: 0}; // special maths
            if (unit.keyboard.w || unit.keyboard.arrowup) { 
                mechVector.y -= 1
                mechIsMoving = true;
            }
            if (unit.keyboard.s || unit.keyboard.arrowdown) {
                mechVector.y += 1
                mechIsMoving = true;
            }
            if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                mechVector.x -= 1
                mechIsMoving = true;
            }
            if (unit.keyboard.d || unit.keyboard.arrowright) { 
                mechVector.x += 1
                mechIsMoving = true;
            }
            //console.log('before', unit.r);
            if (mechIsMoving) {
                if (unit.lastMoved >= 10) {
                    unit.r = aim({x:0, y: 0}, mechVector);
                } else {
                    unit.r = rotateAngle(unit.r, aim({x:0, y: 0}, mechVector), unit.vr);
                }
                unit.r = correctAngle(unit.r);
                let mechVelocity = toComponent(mechSpeed, unit.r);
                unit.x += mechVelocity.x;
                unit.y += mechVelocity.y;
                unit.vx = mechVelocity.x;
                unit.vy = mechVelocity.y;
                unit.lastMoved = -1;
                /* // Old unrealistic collision (use if new version doesn't work)
                if (handleGroundCollisions(unit, obstacles)) {
                    unit.x -= mechVelocity.x;
                    unit.y -= mechVelocity.y;
                    unit.vx = 0;
                    unit.vy = 0;
                }*/
                let res = handleGroundCollisions(unit, obstacles, true, mechVelocity);
                if (res) {
                    unit.x -= mechVelocity.x;
                    unit.y -= mechVelocity.y;
                    if (res != 'well, shit') {
                        let mechWallVector = {x: res.end.x - res.start.x, y: res.end.y - res.start.y};
                        let mechSlideVector = vMath(vMath(mechVelocity, mechWallVector, 'projection'), 0.75, 'multiply');
                        unit.x += mechSlideVector.x;
                        unit.y += mechSlideVector.y;
                        unit.vx = mechSlideVector.x;
                        unit.vy = mechSlideVector.y;
                    }
                }
            }
            //console.log('after', unit.r);
            return unit;
        case 'tank':
            let tankTopSpeed = unit.v;
            unit.r = correctAngle(unit.r);
            if (unit.keyboard.capslock) {
                tankTopSpeed *= 2;
            }
            if (unit.keyboard.shift) {
                tankTopSpeed *= 1.5;
            }
            let tankSpeed = Math.sqrt(unit.vx**2+unit.vy**2);
            if (unit.reverse) {
                tankSpeed = -Math.abs(tankSpeed);
            }
            if (unit.keyboard.w || unit.keyboard.arrowup) { 
                tankSpeed += tankTopSpeed/10;
            }
            if (unit.keyboard.s || unit.keyboard.arrowdown) {
                tankSpeed -= tankTopSpeed/10;
            }
            if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                unit.r = rotateAngle(unit.r, unit.r-unit.vr, unit.vr);
            }
            if (unit.keyboard.d || unit.keyboard.arrowright) { 
                unit.r = rotateAngle(unit.r, unit.r+unit.vr, unit.vr);
            }
            if (tankSpeed < 0) {
                unit.reverse = true;
            } else {
                unit.reverse = false;
            }
            tankSpeed = Math.abs(tankSpeed);
            if (tankSpeed > tankTopSpeed) {
                tankSpeed = Math.max(tankTopSpeed, tankSpeed-0.25*tankTopSpeed);
            }
            if (tankSpeed < -tankTopSpeed*0.75) {
                tankSpeed = Math.min(-tankTopSpeed*0.75, tankSpeed+0.25*tankTopSpeed);
            }
            let tankR = unit.r;
            if (unit.reverse) {
                tankR = correctAngle(unit.r+Math.PI);
            }
            let tankVelocity = toComponent(Math.abs(tankSpeed), tankR);
            unit.x += tankVelocity.x;
            unit.y += tankVelocity.y;
            unit.vx = tankVelocity.x;
            unit.vy = tankVelocity.y;
            let res = handleGroundCollisions(unit, obstacles, true, tankVelocity);
            if (res) {
                unit.x -= tankVelocity.x;
                unit.y -= tankVelocity.y;
                if (res != 'well, shit') {
                    let tankWallVector = {x: res.end.x - res.start.x, y: res.end.y - res.start.y};
                    let tankSlideVector = vMath(vMath(tankVelocity, tankWallVector, 'projection'), 0.9, 'multiply');
                    unit.x += tankSlideVector.x;
                    unit.y += tankSlideVector.y;
                    unit.vx = tankSlideVector.x;
                    unit.vy = tankSlideVector.y;
                }
            }
            if (getDist(unit, player) > 7500) {
                unit.x = randint(2000, 5000) + player.x;
                unit.y = randint(2000, 5000) + player.y;
            }
            return unit;
        case 'drone':
            let droneTopSpeed = unit.v;
            if (unit.keyboard.capslock) {
                droneTopSpeed *= 2;
            }
            if (unit.keyboard.shift) {
                droneTopSpeed *= 1.5;
            }
            unit.isMoving = false;
            if (unit.directControl) {
                let droneVector = {x: 0, y: 0}; // special maths
                if (unit.keyboard.w || unit.keyboard.arrowup) { 
                    droneVector.y -= 1
                    unit.isMoving = true;
                }
                if (unit.keyboard.s || unit.keyboard.arrowdown) {
                    droneVector.y += 1
                    unit.isMoving = true;
                }
                if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                    droneVector.x -= 1
                    unit.isMoving = true;
                }
                if (unit.keyboard.d || unit.keyboard.arrowright) { 
                    droneVector.x += 1
                    unit.isMoving = true;
                }
                if (unit.isMoving) {
                    unit.r = aim({x:0, y: 0}, droneVector);
                }
            }
            if (unit.isMoving) {
                let droneAcceleration = toComponent(droneTopSpeed/60, unit.r);
                unit.vx += droneAcceleration.x;
                unit.vy += droneAcceleration.y;
                let droneVelocity = Math.sqrt(unit.vx**2+unit.vy**2);
                if (droneVelocity > unit.v) {
                    let reduction = unit.v / droneVelocity;
                    unit.vx *= reduction;
                    unit.vy *= reduction;
                }
            }
            unit.x += unit.vx;
            unit.y += unit.vy;
            if (handleGroundCollisions(unit, obstacles)) {
                unit.x -= unit.vx;
                unit.y -= unit.vy;
                unit.vx = 0;
                unit.vy = 0;
            }
            unit.vx *= 0.995;
            unit.vy *= 0.995;
            return unit;
        case 'staticTurret':
            if (unit.keyboard.w || unit.keyboard.arrowup) { 
                unit.y -= unit.v;
                unit.vy = -unit.v;
            }
            if (unit.keyboard.s || unit.keyboard.arrowdown) {
                unit.y += unit.v;
                unit.vy = unit.v;
            }
            if (unit.keyboard.a || unit.keyboard.arrowleft) { 
                unit.x -= unit.v;
                unit.vx = -unit.v;
            }
            if (unit.keyboard.d || unit.keyboard.arrowright) { 
                unit.x += unit.v;
                unit.vx = unit.v;
            }
            return unit;
        default:
            throw 'ERROR: are you f**king retarded? Tf is that unit type?';

    };
};

function polygonCollision(polygon1, polygon2) {
    for (let i = 0; i < polygon1.length; i++) {
        if (pointInPolygon(polygon1[i], polygon2)) {
            return true;
        }
    }
    for (let i = 0; i < polygon2.length; i++) {
        if (pointInPolygon(polygon2[i], polygon1)) {
            return true;
        }
    }
    return false;
};

function polygonCircleIntersect(polygon, circle, round=false, collisionEdges) {
    for (let i = 0; i < polygon.length; i++) {
        if (collisionEdges) {
            if (isin(i, collisionEdges) == false) {
                continue;
            }
        }
        let l1 = {start: polygon[i], end: i == polygon.length-1 ? polygon[0] : polygon[i+1]};
        if (round) {
            l1.start.x = Math.round(l1.start.x);
            l1.start.y = Math.round(l1.start.y);
            l1.end.x = Math.round(l1.end.x);
            l1.end.y = Math.round(l1.end.y);
            circle.x = Math.round(circle.x);
            circle.y = Math.round(circle.y);
        }
        if (lineCircleIntersectV2(l1, circle)) {
            return l1;
        }
    }
    return false;
};

function lineCircleIntersectV2(line, circle) { // HAIL OUR AI OVERLORDS
    //console.log(line, circle);
    // Calculate the direction vector of the line
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;

    // Calculate the vector from the circle's center to the line's start point
    const cx = circle.x - line.start.x;
    const cy = circle.y - line.start.y;

    // Calculate the dot product of the line direction vector and the circle-to-start vector
    const dotProduct = cx * dx + cy * dy;

    // Calculate the squared length of the line
    const lineLengthSq = dx * dx + dy * dy;

    // Calculate the closest point on the line to the circle's center
    let closestX, closestY;

    if (lineLengthSq === 0) {
        // If the line is just a point, set the closest point to be the line's start point
        closestX = line.start.x;
        closestY = line.start.y;
    } else {
        const t = Math.max(0, Math.min(1, dotProduct / lineLengthSq));
        closestX = line.start.x + t * dx;
        closestY = line.start.y + t * dy;
    }

    // Calculate the distance between the closest point and the circle's center
    const distance = Math.sqrt((closestX - circle.x) ** 2 + (closestY - circle.y) ** 2);

    // Check if the distance is less than or equal to the circle's radius
    return distance <= circle.r;
};

function simulatePhysics(objects) {
    let newObjs = [];
    for (let i = 0; i < objects.length; i++) {
        let newObj = JSON.parse(JSON.stringify(objects[i]));
        newObj.vx += newObj.ax;
        newObj.vy += newObj.ay;
        newObj.vr += newObj.ar;
        newObj.vx *= newObj.vDrag;
        newObj.vy *= newObj.vDrag;
        newObj.vr *= newObj.rDrag;
        let velocity = Math.sqrt(Math.abs(newObj.vx**2) + Math.abs(newObj.vy**2));
        if (velocity > newObj.maxV) {
            let reduction = newObj.maxV / velocity;
            newObj.vx *= reduction;
            newObj.vy *= reduction;
        }
        newObj.vr = Math.min(newObj.vr, newObj.maxRV);
        newObj.x += newObj.vx;
        newObj.y += newObj.vy;
        newObj.r += newObj.vr;
        newObjs.push(newObj);
    }
    return newObjs;
};

function renderParticles(particles) {
    for (let i = 0; i < particles.length; i++) {
        let obj = particles[i];
        if (obj.type == 'circle') {
            drawCircle(obj.x, obj.y, obj.size, toColour(obj.style.fill), toColour(obj.style.stroke.colour), obj.style.stroke.width, 1, false);
        } else if (obj.type == 'polygon') {
            drawPolygon(obj.size, {x: obj.x, y: obj.y}, obj.r, toColour(obj.style.fill), {colour: toColour(obj.style.stroke.colour), width: obj.style.stroke.width}, false);
        } else {
            throw 'ERROR: unsupported particle type';
        }
    }
};

function recursiveParts(unit, parts, f) {
    for (let i = 0; i < parts.length; i++) {
        parts[i] = f(unit, parts[i]);
        //parts[i].connected = recursiveParts(unit, parts[i].connected, f);
    }
    return parts;
};

function renderPart(unit, part) {
    //console.log(part);
    if (part.type == 'polygon') {
        let np = offsetPoints(rotatePolygon(JSON.parse(JSON.stringify(part.size)), part.rOffset), part.offset);
        for (let i = 0; i < np.length; i++) {
            np[i].x *= part.scale.x;
            np[i].y *= part.scale.y;
        }
        let facing = unit.r;
        if (part.facing == 'turret') {
            facing = unit.mouseR;
        }
        drawPolygon(np, {x: unit.x, y: unit.y}, facing, part.style.fill, part.style.stroke, false);
    } else {
        if (part.scale.x != 0 || part.scale.y != 0) {
            let np = circleToPolygon({x: 0, y: 0}, part.size, 25);
            //console.log(np);
            for (let i = 0; i < np.length; i++) {
                np[i].x *= part.scale.x;
                np[i].y *= part.scale.y;
            }
            np = offsetPoints(rotatePolygon(np, part.rOffset), part.offset);
            let facing = unit.r;
            if (part.facing == 'turret') {
                facing = unit.mouseR;
            }
            drawPolygon(np, {x: unit.x, y: unit.y}, facing, part.style.fill, part.style.stroke, false);
        } else {
            let facing = unit.r;
            if (part.facing == 'turret') {
                facing = unit.mouseR;
            }
            let offset = rotatePolygon([part.offset], facing)[0];
            drawCircle(unit.x + offset.x, unit.y + offset.y, part.size, part.style.fill, part.style.stroke.colour, part.style.stroke.width, 1, false);
        }
    }
    return part;
};

function renderUnit(unit) {
    recursiveParts(unit, unit.parts, renderPart);
    if (unit.collisionR > 0 && false) {
        drawCircle(unit.x, unit.y, unit.collisionR, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 5, 1, false);
    }
    if (unit.groundCollisionR > 0 && false) {
        drawCircle(unit.x, unit.y, unit.groundCollisionR, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 5, 1, false);
    }
    if (unit.tallCollisionR > 0 && false) {
        drawCircle(unit.x, unit.y, unit.tallCollisionR, 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 5, 1, false);
    }
    //drawLine(unit, aim(unit, unit.aimPos)-Math.PI/2, 1500, data.red.stroke, false);
};

function shoot(unit, part) {
    if (part.cannon) {
        if (part.cannon.reload.c > 0) {
            part.cannon.reload.c -= 1;
        } else {
            if (!part.cannon.delay || part.cannon.delay.c <= 0) {
                if (unit.keyboard[part.cannon.keybind]) {
                    part.cannon.reload.c = part.cannon.reload.t;
                    let facing = unit.r;
                    if (part.facing == 'turret') {
                        facing = unit.mouseR;
                    }
                    let bullet = Object.assign({}, JSON.parse(JSON.stringify(data.template.physics)), JSON.parse(JSON.stringify(part.cannon.bullet)));
                    bullet.x = unit.x + ((part.offset.x*part.scale.x) * Math.cos(facing) - (part.offset.y*part.scale.y) * Math.sin(facing));
                    bullet.y = unit.y + ((part.offset.x*part.scale.x) * Math.sin(facing) + (part.offset.y*part.scale.y) * Math.cos(facing));
                    bullet.x += (part.cannon.x * Math.cos(facing + part.rOffset) - part.cannon.y * Math.sin(facing + part.rOffset));
                    bullet.y += (part.cannon.x * Math.sin(facing + part.rOffset) + part.cannon.y * Math.cos(facing + part.rOffset));
                    facing += normalDistribution(0, part.cannon.spread);
                    let res = toComponent(bullet.v, facing + part.rOffset);
                    bullet.vx = res.x + unit.vx;
                    bullet.vy = res.y + unit.vy;
                    if (bullet.accel) {
                        bullet.vx -= unit.vx;
                        bullet.vy -= unit.vy;
                    }
                    bullet.r = facing + part.rOffset;
                    bullet.team = unit.team;
                    /*
                    bullet.vr = part.cannon.bullet.vr;
                    bullet.rDrag = part.cannon.bullet.rDrag;*/
                    //console.log(bullet);
                    projectiles.push(bullet);
                }
            }
            if (part.cannon.delay) {
                if (unit.keyboard[part.cannon.keybind]) {
                    part.cannon.delay.c -= 1;
                } else {
                    part.cannon.delay.c = part.cannon.delay.t;
                }
            }
        }
    }
    return part;
};

function handleShooting(unit) {
    unit.parts = recursiveParts(unit, unit.parts, shoot);
    return unit;
};

function handleDecay(objs) {
    let newObjs = []
    for (let i = 0; i < objs.length; i++) {
        let obj = objs[i];
        //console.log(obj);
        obj.life -= 1;
        if (obj.life > 0) newObjs.push(objs[i]);
    }
    return newObjs;
};

function recursiveCollision(unit, parts, object) {
    let pts = JSON.parse(JSON.stringify(parts));
    let obj = JSON.parse(JSON.stringify(object));
    //console.log(`collision parts`);
    //console.log(pts);
    for (let i = 0; i < pts.length; i++) {
        let collide = false;
        if (pts[i].type == 'polygon') {
            let cType = '';
            if (obj.cType) {
                cType = obj.cType;
            } else {
                cType = obj.type;
            }
            let facing = unit.r;
            if (pts[i].facing == 'turret') {
                facing = unit.mouseR;
            }
            let points = rotatePolygon(JSON.parse(JSON.stringify(pts[i].size)), pts[i].rOffset);
            //console.log(points);
            for (let j = 0; j < points.length; j++) {
                points[j].x *= parts[i].scale.x;
                points[j].y *= parts[i].scale.y;
            }
            points = offsetPoints(rotatePolygon(offsetPoints(points, pts[i].offset), facing), unit);
            //console.log(points);
            //drawSimplePolygon(points); // ¡ debug hitboxes
            switch (cType) {
                case 'point':
                    //drawCircle(display.x/2 - player.x + obj.x, display.y/2 - player.y + obj.y, 5, 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 2, 1);
                    if (pointInPolygon(obj, points)) {
                        collide = true;
                    }
                    break;
                case 'circle':
                    let r = 0;
                    if (obj.size) {
                        r = obj.size;
                    } else if (obj.r) {
                        r = obj.r;
                    } else {
                        console.warn('WARNING: can\'t find radius!');
                    }
                    let notCircle = circleToPolygon(obj, r, 8); // an octagon is close enough to a circle
                    for (let j = 0; j < notCircle.length; j++) {
                        notCircle[j].x *= parts[i].scale.x;
                        notCircle[j].y *= parts[i].scale.y;
                    }
                    if (polygonCollision(notCircle, points)) {
                        collide = true;
                    }
                    break;
                case 'polygon': // unreliable
                    if (polygonCollision(offsetPoints(rotatePolygon(JSON.parse(JSON.stringify(obj.size)), obj.r), obj), points)) {
                        collide = true;
                    }
                    break;
                case 'line': // TODO: make it actual line collision (currently many point collisions)
                    let s = offsetPoints(rotatePolygon([JSON.parse(JSON.stringify(obj.cSize.start)), JSON.parse(JSON.stringify(obj.cSize.end))], obj.r), obj);
                    let segment = {start: s[0], end: s[1]};
                    let diff = vMath(segment.end, segment.start, '-');
                    let step = 1 / (vMath(diff, null, '||') / 5);
                    //console.log(step);
                    for (let i = 0; i < 1; i += step) {
                        let point = vMath(JSON.parse(JSON.stringify(segment.start)), vMath(JSON.parse(JSON.stringify(diff)), i, '*'), '+');
                        //drawCircle(display.x/2 - player.x + point.x, display.y/2 - player.y + point.y, 5, 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 2, 1);
                        //drawPolygon(points, {x: 0, y: 0}, 0, 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', false, true);
                        if (pointInPolygon(point, points)) {
                            collide = true;
                            break;
                        } 
                    }
                    break;
                default:
                    console.log(obj);
                    throw `ERROR: wtf is this object type! ${cType}`;
            }
        } else {
            //console.log(getDist(offsetPoints(JSON.parse(JSON.stringify([pts[i].offset])), unit)[0], obj));
            let cType = '';
            if (obj.cType) {
                cType = obj.cType;
            } else {
                cType = obj.type;
            }
            switch (cType) {
                case 'point':
                    if (getDist(vMath(JSON.parse(JSON.stringify(pts[i].offset)), unit, 'add'), obj) <= pts[i].size) {
                        collide = true;
                    }
                    break;
                case 'circle':
                    let r = obj.size;
                    if (getDist(vMath(JSON.parse(JSON.stringify(pts[i].offset)), unit, 'add'), obj) <= pts[i].size + r) {
                        collide = true;
                    }
                    break;
                case 'polygon':
                    let notCircle = circleToPolygon(pts[i], pts[i].size, 10); // a decagon is close enough to a circle

                    if (polygonCollision(notCircle, obj.size)) {
                        collide = true;
                    }
                    break;
                case 'line':
                    let s = offsetPoints(rotatePolygon([JSON.parse(JSON.stringify(obj.cSize.start)), JSON.parse(JSON.stringify(obj.cSize.end))], obj.r), obj);
                    let segment = {start: s[0], end: s[1]};
                    if (lineCircleIntersectV2(segment, {x: unit.x, y: unit.y, r: unit.size})) {
                        collide = true;
                    }
                    break;
                default:
                    throw `ERROR: wtf is this object type2! ${cType}`;
            }
        }
        if (collide) {
            if (obj.explosion) {
                obj.explosion.x = obj.x;
                obj.explosion.y = obj.y;
                obj.explosion.transparancy = 1;
                obj.explosion.active = true;
                obj.explosion.type = 'circle';
                obj.explosion.isExplosion = true;
                explosions.push(obj.explosion);
            }
            if (obj.spawnChildren) {
                console.warn('WARNING: function not finished');
            }
            //console.log('collided');
            return true;
        }
        //console.log('no collision');
    }
    return false;
};

function handleCollisions(units, projectiles, accurate) {
    let newProj = [];
    if (projectiles.length && units.length) {
        for (let i = 0; i < projectiles.length; i++) {
            //console.log(projectiles);
            if (accurate) {
                let calcs = Math.abs(projectiles[i].v)/20;

                for (let k=0; k <= calcs; k++) {
                    for (let j = 0; j < units.length; j++) {
                        //console.log(units[j]);
                        if (units[j].noClip || units[j].team == projectiles[i].team) {
                            continue;
                        }
                        let ncoords = vMath(projectiles[i], vMath({x: projectiles[i].vx, y: projectiles[i].vy}, k, '*'), '+');
                        let np = JSON.parse(JSON.stringify(projectiles[i]));
                        np.x = ncoords.x;
                        np.y = ncoords.y;
                        //console.log(ncoords);
                        //console.log(units[j], projectiles[i]);
                        if (getDist(ncoords, units[j]) <= units[j].collisionR) {
                            if (recursiveCollision(units[j], units[j].hitbox, np)) {
                                units[j].hp -= projectiles[i].dmg;
                                if (!projectiles[i].piercing) {
                                    projectiles[i].dmg = 0;
                                }
                            }
                        }
                    }
                }
            } else {
                for (let j = 0; j < units.length; j++) {
                    if (units[j].noClip) {
                        continue;
                    }
                    if (getDist(projectiles[i], units[j]) <= units[j].collisionR) {
                        //console.log(units[j]);
                        if (recursiveCollision(units[j], units[j].hitbox, projectiles[i])) {
                            units[j].hp -= projectiles[i].dmg;
                            if (!projectiles[i].piercing) {
                                projectiles[i].dmg = 0;
                            }
                        }
                    }
                }
            } 
            if (projectiles[i].dmg != 0 || projectiles[i].persistent) {
                newProj.push(projectiles[i]);
            }
        }
        return [units, newProj];
    }
    return [units, projectiles];
};

function handleBulletWallCollisions(obstacles, projectiles) {
    let newProj = [];
    if (projectiles.length && obstacles.length) {
        for (let i = 0; i < projectiles.length; i++) {
            let noHit = true;
            for (let j = 0; j < obstacles.length; j++) {
                if (obstacles[j].cType == 'tall') {
                    if (pointInPolygon(projectiles[i], obstacles[j].size)) {
                        noHit = false;
                        break;
                    }
                }
            }
            if (noHit) {
                newProj.push(projectiles[i]);
            }
        }
        return newProj;
    }
    return projectiles;
};

function obstacleCollision(unit, obstacle) {
    let collisionR = 0;
    if (obstacle.cType == 'ground') {
        if (unit.groundCollisionR <= 0) {
            return false;
        }
        collisionR = unit.groundCollisionR;
    } else {
        collisionR = unit.tallCollisionR;
    }
    //let notCircle = circleToPolygon(unit, collisionR, 12); // a dodecagon is close enough to a circle
    //return polygonCollision(notCircle, obstacle.size);
    //return polyCollisionAdv(notCircle, obstacle.size);
    return polygonCircleIntersect(obstacle.size, {x: unit.x, y: unit.y, r: collisionR}, true, obstacle.collisionEdges);
};

function handleGroundCollisions(u, obstacles, smort=false, prevMotion=null) {
    let unit = JSON.parse(JSON.stringify(u));
    let hasCollided = false;
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        let res = obstacleCollision(unit, obstacle);
        if (res) {
            hasCollided = true;
            let thisVectorWorks = true;
            if (smort) { // f*ck optimisation, if it works it works
                unit.x -= prevMotion.x;
                unit.y -= prevMotion.y;
                let mechWallVector = {x: res.end.x - res.start.x, y: res.end.y - res.start.y};
                let mechSlideVector = vMath(vMath(prevMotion, mechWallVector, 'projection'), 0.75, 'multiply');
                unit.x += mechSlideVector.x;
                unit.y += mechSlideVector.y;
                unit.vx = mechSlideVector.x;
                unit.vy = mechSlideVector.y;
                for (let j = 0; j < obstacles.length; j++) {
                    if (obstacleCollision(unit, obstacles[j])) {
                        thisVectorWorks = false;
                        break;
                    }
                }
            }
            if (thisVectorWorks) {
                return res;
            }
        }
    }
    if (hasCollided) {
        return 'well, shit'; // this just means a suitable vector was not found and the unit is rooted in place as a last resort
    }
    return false; 
};

function checkDeadParts(unit, parts) {
    //console.log(unit, parts);
    /*
    if (parts) {
        let newParts = [];
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].hp > 0) {
                parts[i].connected = checkDeadParts(unit, parts[i].connected);
                newParts.push(parts[i]);
            } else {
                if (parts[i].core) {
                    unit.alive = false;
                }
            }
        }
        //console.log(newParts);
        return newParts;
    }*/
    return parts;
};

function detectShieldCollision(shield, obj) { 
    let cType = '';
    if (obj.cType) {
        cType = obj.cType;
    } else {
        cType = obj.type;
    }
    switch (cType) {
        case 'point':
            if (getDist(shield, obj) <= shield.r) {
                return true;
            }
            break;
        case 'circle':
            let r = obj.size;
            if (getDist(shield, obj) <= shield.r + obj.size) {
                return true;
            }
            break;
        case 'polygon':
            let notCircle = circleToPolygon(shield, shield.r, 10); // a decagon is close enough to a circle
            if (polygonCollision(notCircle, obj.size)) {
                return true;
            }
            break;
        case 'line':
            let s = offsetPoints(rotatePolygon([JSON.parse(JSON.stringify(obj.cSize.start)), JSON.parse(JSON.stringify(obj.cSize.end))], obj.r), obj);
            let segment = {start: s[0], end: s[1]};
            if (lineCircleIntersectV2(segment, shield)) {
                return true;
            }
            break;
        default:
            throw `ERROR: wtf is this object type! ${cType}`;
    }
    return false;
};

function handleShields(unit, parts) {
    //console.log(unit, parts);
    if (parts) {
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].shield) {
                if (unit.keyboard[parts[i].shield.keybind]) {
                    unit.keyboard[parts[i].shield.keybind] = false;
                    if (parts[i].shield.active) {
                        parts[i].shield.active = false;
                    } else {
                        if (parts[i].shield.hp >= parts[i].shield.minHp) {
                            parts[i].shield.active = true;
                        }
                    }
                }
                if (parts[i].shield.active) {
                    let shield = parts[i].shield;
                    // center the shield around the unit
                    shield.x = unit.x;
                    shield.y = unit.y;
                    if (shield.hp < 0) {
                        shield.active = false;
                    }
                    shields.push(shield);
                    /*
                    for (let j = 0; j < projectiles.length; j++) {
                        if (detectCollision(unit, parts[i], projectiles[j])) {
                            parts[i].shield.hp -= projectiles[j].dmg;
                            if (parts[i].shield.hp <= 0) {
                                parts[i].shield.hp = 0;
                                parts[i].shield.active = false;
                            }
                            projectiles[j].dmg = 0;
                        }
                    }
                    for (let j = 0; j < explosions.length; j++) {
                        if (detectCollision(unit, parts[i], explosions[j])) {
                            parts[i].shield.hp -= explosions[j].dmg;
                            if (parts[i].shield.hp <= 0) {
                                parts[i].shield.hp = 0;
                                parts[i].shield.active = false;
                            }
                        }
                    }*/

                }
                console.log(parts[i].shield.hp);
                parts[i].shield.hp += parts[i].shield.regen;
                if (parts[i].shield.hp > parts[i].shield.cap) {
                    parts[i].shield.hp = parts[i].shield.cap;
                } 
                if (parts[i].shield.hp < 0) {
                    parts[i].shield.hp = 0;
                }
                unit.noClip = parts[i].shield.active;
            } 
            parts[i].connected = handleShields(unit, parts[i].connected);
        }
        return parts;
    }
    return [];
};

function renderShield(shield) {
    //console.log(shield);
    //console.log(shield.hp/shield.cap*0.2, (1-(shield.hp/shield.cap))*0.2);
    //drawCircle(shield.x, shield.y, shield.r, `rgba(50, 200, 255, ${shield.hp/shield.cap*0.4})`, `rgba(40, 180, 230, ${shield.hp/shield.cap*0.4})`, 10, 1, false);
    //drawCircle(shield.x, shield.y, shield.r, `rgba(255, 0, 0, ${(1-(shield.hp/shield.cap))*0.2})`, `rgba(255, 0, 0, ${(1-(shield.hp/shield.cap))*0.2})`, 10, 1, false);
    drawCircle(shield.x, shield.y, shield.r, `rgba(${Math.round((1-(shield.hp/shield.cap))*255)}, 150, ${Math.round((shield.hp/shield.cap)*255)}, ${(shield.hp/shield.cap)*0.2+0.2})`, `rgba(${Math.round((1-(shield.hp/shield.cap))*220)}, 150, ${Math.round((shield.hp/shield.cap)*220)}, ${(shield.hp/shield.cap)*0.2+0.2})`, 10, 1, false);
};

function shieldCollisions(shields, projectiles) {
    for (let i = 0; i < shields.length; i++) {
        for (let j = 0; j < projectiles.length; j++) {
            if (detectShieldCollision(shields[i], projectiles[j])) {
                shields[i].hp -= projectiles[j].dmg;
                if (shields[i].hp <= 0) {
                    shields[i].hp = 0;
                    shields[i].active = false;
                }
                projectiles[j].dmg = 0;
            }
        }
    }
    return [shields, projectiles];
};

function runScript(checkpoint, unit, teams, obstacles, projectiles, explosions, particles, entities) { // return orders
    //unit = JSON.parse(JSON.stringify(unit));
    //teams = JSON.parse(JSON.stringify(teams));
    let player = undefined;
    let t = undefined;
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == unit.team) {
            let script = teams[i].scripts[unit.script];
            if (script) {
                //console.log(script);
                //console.log(eval(script));
                return eval(script);
            } else {
                //console.warn('WARNING: no script found!');
                return [];
            }
        }
    }
    console.warn('WARNING: no team found!');
    return [];
    // throw 'ERROR: No script found';
};

function handleOrdersKeyPressMode(unit) {
    //console.log(unit);
    for (let i = 0; i < unit.orders.length; i++) {
        if (unit.orders[i].id == 'aim') {
            unit.keyboard.aimPos = unit.orders[i].value; // cordinate (absolute)
        }
        unit.keyboard[unit.orders[i].id] = unit.orders[i].value;
        //console.log(unit.keyboard);
    }
    return unit;
};

function handleScript(unit) {
    if (unit.script) {
        unit.orders = runScript(JSON.parse(JSON.stringify(checkpoint)), JSON.parse(JSON.stringify(unit)), JSON.parse(JSON.stringify(teams)), JSON.parse(JSON.stringify(obstacles)), JSON.parse(JSON.stringify(projectiles)), JSON.parse(JSON.stringify(explosions)), JSON.parse(JSON.stringify(particles)), JSON.parse(JSON.stringify(entities)));
        unit = handleOrdersKeyPressMode(unit);
    }
    return unit;
};

function renderCheckpoint() {
    if (entities.length <= 1) {
        drawCircle(checkpoint.x + checkpoint.parts[0].offset.x, checkpoint.y + checkpoint.parts[0].offset.y, checkpoint.parts[0].size, checkpoint.parts[0].style.fill, checkpoint.parts[0].style.stroke.colour, checkpoint.parts[0].style.stroke.width, 1, false);
    } else {
        drawCircle(checkpoint.x + checkpoint.parts[0].offset.x, checkpoint.y + checkpoint.parts[0].offset.y, checkpoint.parts[0].size, checkpoint.parts[0].style2.fill, checkpoint.parts[0].style2.stroke.colour, checkpoint.parts[0].style2.stroke.width, 1, false);
    }
};

function handleCheckpoint() {
    /*
    if (getDist(player, checkpoint) < player.tallCollisionR + checkpoint.collisionR && entities.length == 1) {
        if (winTime < 0) {
            winTime = t;
        }
        var overlay = document.getElementById('overlay');
        if (overlay.style.display != 'block') {
            console.log(`game over in ${winTime} ticks (lower is better)`);
            overlay.innerHTML = `
            <h1>Level Complete</h1>
            <button onclick="loadLevel('MovementI')"><h3>Movement I</h3></button><button onclick="loadLevel('MovementII')"><h3>Movement II</h3></button><button onclick="loadLevel('MovementIII')"><h3>Movement III</h3></button><button onclick="loadLevel('MovementIV')"><h3>Movement IV</h3></button><br>
            <button onclick="loadLevel('AimingI')"><h3>Aiming I</h3></button><button onclick="loadLevel('AimingII')"><h3>Aiming II</h3></button><button onclick="loadLevel('AimingIII')"><h3>Aiming III</h3></button><button onclick="loadLevel('AimingIV')"><h3>Aiming IV</h3></button><button onclick="loadLevel('AimingV')"><h3>Aiming V</h3></button><br>
            <button onclick="loadLevel('TacticsI')"><h3>Tactics I</h3></button><button onclick="loadLevel('TacticsII')"><h3>Tactics II</h3></button><button onclick="loadLevel('TacticsIII')"><h3>Tactics III</h3></button><button onclick="loadLevel('TacticsIV')"><h3>Tactics IV</h3></button><br>
            <button onclick="loadLevel('CombatI')"><h3>Combat I</h3></button><button onclick="loadLevel('CombatII')"><h3>Combat II</h3></button><button onclick="loadLevel('CombatIII')"><h3>Combat III</h3></button><button onclick="loadLevel('CombatIV')"><h3>Combat IV</h3></button><button onclick="loadLevel('CombatV')"><h3>Combat V</h3></button><button onclick="loadLevel('CombatVI')"><h3>Combat VI</h3></button><button onclick="loadLevel('CombatVII')"><h3>Combat VII</h3></button><br>
            <button onclick="loadLevel('MeleeI')"><h3>Melee I</h3></button><button onclick="loadLevel('MeleeII')"><h3>Melee II</h3></button><button onclick="loadLevel('MeleeIII')"><h3>Melee III</h3></button><br>`;
            overlay.style.display = 'block';
            return true;
        }
    }*/
    return false;
};

function addCosts(cost, increment) {
    if (increment.mode == 'addition') {
        cost += increment.cost;
    } else if (increment.mode == 'multiply') {
        cost *= increment.cost;
    } else {
        console.log(`ERROR: can't calculate costs`);
    }
    return cost;
};

function updateButtons() {
    // Clear existing buttons and add new ones in
    var overlay = document.getElementById('upgradesOverlay');
    overlay.innerHTML = `<div id="leftText">Upgrades</div><div id="rightText"><p>Money: $${player.money}<p></div>`;
    var buttonGrid = document.getElementById('buttonGrid');
    buttonGrid.innerHTML = '';
    player.upgrades.forEach(function(button) {
        var buttonElement = document.createElement('button');
        buttonElement.className = 'button';
        buttonElement.id = `${button.id}`;
        buttonElement.innerHTML = `<p><strong>${button.display} ${roman(button.level)}</strong>\n${player.upgrades[button.id].description}\n<strong>${button.locked ? 'Max Level Reached': '$'+player.upgrades[button.id].cost}</strong></p>`;
        buttonElement.addEventListener('click', function(event) {
            var buttonId = event.target.id;
            console.log(event);
            console.log(event.target);
            console.log(event.target.id);
            console.log('Button pressed: ' + buttonId);
            buttonId = Number(buttonId);
            console.log(typeof(buttonId));
            console.log(player);
            console.log(player.upgrades);
            console.log(player.upgrades[buttonId]);
            if (!player.upgrades[buttonId].locked && player.money >= player.upgrades[buttonId].cost) {
                if (buttonId != 0){
                    player.money -= player.upgrades[buttonId].cost
                    player = eval(player.upgrades[buttonId].effect);
                    player.upgrades[buttonId].cost = addCosts(player.upgrades[buttonId].cost, player.upgrades[buttonId].increment);
                    player.upgrades[buttonId].level += 1;
                    updateButtons();
                }
            }
        });
        buttonGrid.appendChild(buttonElement);
    });
};

function generatePos(entity) {
    let dist = randint(2000, 2500);
    let r = randint(0, 360);
    r = r / 180 * Math.PI;
    let x = dist*Math.cos(r);
    let y = dist*Math.sin(r);
    entity.x = x + player.x;
    entity.y = y + player.y;
    return entity;
}

function spawnEnemies(entities) {
    let minEnemy = Math.min(1+Math.floor(round/5)+data.constants.extraEnemies, 4+data.constants.extraEnemies);
    let maxEnemy = Math.min(3+Math.floor(round/3)+data.constants.extraEnemies, 12+data.constants.extraEnemies);
    if (entities.length -1 < minEnemy) {
        if (round > 5 && round % 5 == 0) {
            data.skibidiToilet.hp++;
            data.laserSkibidiToilet.hp++;
            data.mgSkibidiToilet.hp++;
            data.jetSkibidiToilet.hp++;
            data.reinforcedSkibidiToilet.hp+=2;
        }
        if (round > 30 && round % 5 == 0) {
            data.skibidiToilet.hp++;
            data.laserSkibidiToilet.hp++;
            data.mgSkibidiToilet.hp++;
            data.jetSkibidiToilet.hp++;
            data.reinforcedSkibidiToilet.hp+=2;
        }
        if (round > 50 && round % 5 == 0) {
            data.skibidiToilet.hp+=5;
            data.laserSkibidiToilet.hp+=5;
            data.mgSkibidiToilet.hp+=5;
            data.jetSkibidiToilet.hp+=5;
            data.reinforcedSkibidiToilet.hp+=10;
        }
        if (round > 100 && round % 5 == 0) {
            data.skibidiToilet.hp+=25;
            data.laserSkibidiToilet.hp+=25;
            data.mgSkibidiToilet.hp+=25;
            data.jetSkibidiToilet.hp+=25;
            data.reinforcedSkibidiToilet.hp+=100;
        }
        if (round > 10 && round % 10 == 0 && data.skibidiToilet.v < 15) {
            data.skibidiToilet.v+=1;
            data.laserSkibidiToilet.v+=1;
            data.mgSkibidiToilet.v+=1;
            data.jetSkibidiToilet.v+=1.5;
            data.reinforcedSkibidiToilet.v+=1;
        }
        while (entities.length -1 < maxEnemy) {   
            if (round > 20 && randint(0,100) < 20) {
                let fastEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.jetSkibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
                fastEnemy.team = 'Enemy';
                fastEnemy.script = 'ramAI';
                for (let i = 0; i < 1; i++) {
                    fastEnemy = generatePos(fastEnemy);
                    if (randchoice([0,1])) {
                        fastEnemy.x *= -1;
                    }
                    if (randchoice([0,1])) {
                        fastEnemy.y *= -1;
                    }
                    entities.push(JSON.parse(JSON.stringify(fastEnemy)));
                }
            }
            if (round > 15 && randint(0,100) < 20) {
                let gunEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.mgSkibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
                gunEnemy.team = 'Enemy';
                gunEnemy.script = 'shootAI';
                for (let i = 0; i < 1; i++) {
                    gunEnemy = generatePos(gunEnemy);
                    if (randchoice([0,1])) {
                        gunEnemy.x *= -1;
                    }
                    if (randchoice([0,1])) {
                        gunEnemy.y *= -1;
                    }
                    entities.push(JSON.parse(JSON.stringify(gunEnemy)));
                }
            }
            if (round > 12 && randint(0,100) < 40) {
                let strongEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.reinforcedSkibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
                strongEnemy.team = 'Enemy';
                strongEnemy.script = 'ramAI';
                for (let i = 0; i < 1; i++) {
                    strongEnemy = generatePos(strongEnemy);
                    if (randchoice([0,1])) {
                        strongEnemy.x *= -1;
                    }
                    if (randchoice([0,1])) {
                        strongEnemy.y *= -1;
                    }
                    entities.push(JSON.parse(JSON.stringify(strongEnemy)));
                }
            } 
            if (round > 5 && randint(0,100) < 30) {
                let shootingEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.laserSkibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
                shootingEnemy.team = 'Enemy';
                shootingEnemy.script = 'shootAI';
                for (let i = 0; i < 1; i++) {
                    shootingEnemy = generatePos(shootingEnemy);
                    if (randchoice([0,1])) {
                        shootingEnemy.x *= -1;
                    }
                    if (randchoice([0,1])) {
                        shootingEnemy.y *= -1;
                    }
                    entities.push(JSON.parse(JSON.stringify(shootingEnemy)));
                }
            } 
            if (true) {
                let basicEnemy = Object.assign({}, JSON.parse(JSON.stringify(data.skibidiToilet)), JSON.parse(JSON.stringify(data.template.memory)));
                basicEnemy.team = 'Enemy';
                basicEnemy.script = 'ramAI';
                for (let i = 0; i < 1; i++) {
                    basicEnemy = generatePos(basicEnemy);
                    if (randchoice([0,1])) {
                        basicEnemy.x *= -1;
                    }
                    if (randchoice([0,1])) {
                        basicEnemy.y *= -1;
                    }
                    entities.push(JSON.parse(JSON.stringify(basicEnemy)));
                }
            } 
        }
        round++;
    }
    return entities;
};

function physics() {
    shields = [];
    let newEntities = [];
    for (let i = 0; i < entities.length; i++) {
        //console.log(entities[i]);
        if (entities[i].hp <= 0) {
            entities[i].alive = false;
            player.money += entities[i].value;
        }
        entities[i] = handleScript(entities[i]);
        entities[i] = handlePlayerMotion(entities[i], obstacles);
        entities[i] = handleShooting(entities[i]);
        entities[i].parts = handleShields(entities[i], entities[i].parts);
        if (entities[i].alive) {
            newEntities.push(entities[i]);
        } else {
            player.money += entities[i].value;
        }
    }
    entities = newEntities;

    projectiles = simulatePhysics(projectiles);
    projectiles = handleDecay(projectiles);

    let newExpl = [];
    for (let i = 0; i < explosions.length; i++) {
        let res = handleExplosion(explosions[i]);
        if (res) {
            newExpl.push(res);
        }
    }
    explosions = newExpl;

    let res = shieldCollisions(shields, projectiles, true);
    shields = res[0];
    projectiles = res[1];

    res = shieldCollisions(shields, explosions, true);
    shields = res[0];
    res = handleCollisions(entities, projectiles, true);
    entities = res[0];
    projectiles = res[1];

    res = handleCollisions(entities, explosions, false);
    entities = res[0];
    projectiles = handleBulletWallCollisions(obstacles, projectiles);

    entities = spawnEnemies(entities);

    let gameState = handleCheckpoint();
    return gameState;
};

function graphics(step) {
    player.x -= player.vx*(1-step/FPT);
    player.y -= player.vy*(1-step/FPT);
    clearCanvas('main');
    clearCanvas('canvasOverlay');
    grid(400, player);
    renderCheckpoint();
    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].cType == 'ground') {
            //console.log(obstacles[i]);
            drawPolygon(obstacles[i].size, {x: 0, y: 0}, 0, obstacles[i].style.fill, obstacles[i].style.stroke, false);
        }
    }
    for (let i = 0; i < entities.length; i++) {
        let newEntity = JSON.parse(JSON.stringify(entities[i]));
        if (i != 0) {
            newEntity.x -= newEntity.vx*(1-step/FPT);
            newEntity.y -= newEntity.vy*(1-step/FPT);
        }
        renderUnit(newEntity);
        //console.log(newEntity.hp, data[newEntity.unitType].hp);
        if (newEntity.hp != data[newEntity.unitType].hp) {
            if (data[newEntity.unitType].hp <= 10) {
                renderBar(newEntity, {x: 0, y: 150}, {x: 150, y: 10}, newEntity.hp, data[newEntity.unitType].hp, 5, 3, data.hpBarBg, data.hpBarFill);
            } else if (data[newEntity.unitType].hp <= 20) {
                renderBar(newEntity, {x: 0, y: 150}, {x: 250, y: 10}, newEntity.hp, data[newEntity.unitType].hp, 5, 3, data.hpBarBg, data.hpBarFill);
            } else if (data[newEntity.unitType].hp <= 50) {
                renderBar(newEntity, {x: 0, y: 150}, {x: 250, y: 10}, newEntity.hp/2, data[newEntity.unitType].hp/2, 5, 3, data.hpBarBg, data.hpBarFill2);
            } else if (data[newEntity.unitType].hp <= 100) {
                renderBar(newEntity, {x: 0, y: 150}, {x: 250, y: 10}, newEntity.hp/4, data[newEntity.unitType].hp/4, 5, 3, data.hpBarBg, data.hpBarFill3);
            } else {
                let step = Math.floor(data[newEntity.unitType].hp / 100);
                renderBar(newEntity, {x: 0, y: 150}, {x: 250, y: 10}, newEntity.hp/step, data[newEntity.unitType].hp/step, 5, 0, data.hpBarBg, data.hpBarFill4);
            }
        }
    }

    let newProj = JSON.parse(JSON.stringify(projectiles));
    for (let i = 0; i < newProj.length; i++) {
        newProj[i].x -= newProj[i].vx*(1-step/FPT);
        newProj[i].y -= newProj[i].vy*(1-step/FPT);
        renderUnit(newProj[i]);
    }

    for (let i = 0; i < obstacles.length; i++) {
        if (obstacles[i].cType == 'tall') {
            //console.log(obstacles[i]);
            drawPolygon(obstacles[i].size, {x: 0, y: 0}, 0, obstacles[i].style.fill, obstacles[i].style.stroke, false);
        }
    }

    for (let i = 0; i < shields.length; i++) {
        renderShield(shields[i]);
    }
    for (let i = 0; i < explosions.length; i++) {
        renderExplosion(explosions[i]);
    }
    player.x += player.vx*(1-step/FPT);
    player.y += player.vy*(1-step/FPT);
};

function main() {
    let gameState = undefined;
    const start = performance.now();
    graphics(t%FPT);
    if (t%FPT == 0) {
        const start2 = performance.now();
        gameState = physics();
        const end2 = performance.now();
        //console.log(`Physics Processing Time: ${end2-start2}ms`);
    }
    t++;
    const end = performance.now();
    //console.log(`Processing Time: ${end-start}ms, max: ${1000/FPS}ms for ${FPS}fps. Max Possible FPS: ${1000/(end-start)}`);
    return gameState;
};

var t=0
var winTime = -1;
var paused = false;
var round = 0;
const TPS = data.constants.TPS;
const FPS = data.constants.FPS;
const FPT = FPS/TPS;
async function game() {
    while (1) {
        if (paused == false) {
            if (main()) {
                break;
            }
            await sleep(1000/FPS);
        } else {
            await sleep(1000/30);
        }
        if (player.keyboard['`']) {
            console.log('toggle pause');
            player.keyboard['`'] = false;
            paused = !paused;
            if (paused) {
                var overlay = document.getElementById('overlay');
                overlay.style.display = 'block';
                updateButtons();
            } else {
                overlay.style.display = 'none';
            }
        }
    }
};
