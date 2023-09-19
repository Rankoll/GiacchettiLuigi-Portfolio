// Thanks to Mai Thành Duy An for the base of the script

// Getting canvas' attributes
var canvas = document.getElementById('dot-connect'),
canW = parseInt(canvas.getAttribute('width')),
canH = parseInt(canvas.getAttribute('height')),
ctx = canvas.getContext('2d');

// Settings to make the balls' speed change based also on the screen size
const ballSpeed = 1.8; // Lower values mean more probability to get faster balls
const availScreenWidth  = window.screen.availWidth;
const availScreenHeight = window.screen.availHeight;
const availScreenRatio = (availScreenWidth / availScreenHeight) / ballSpeed;

// Setting to make the balls count change based on the canvas size
const ballsDensity = 19200; // Higher values mean less balls
var ballCount;

var ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    phase: 0
},
ballColor = {
    r: 9,
    g: 9,
    b: 9
},
R = 4,
balls = [],

// Line
linkLineWidth = 1,
disLimit = 390;

// Random speed
function getRandomSpeed(pos) {
    var min = -0.3 * availScreenRatio,
        max = 0.3 * availScreenRatio;
    switch (pos) {
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
        default:
            return;
    }
}

// Random position
function randomPos() {
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    return pos;
}

// Random item from Array
function randomArrayItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Random number from interval
function randomNumFrom(min, max) {
    return Math.random() * (max - min) + min;
}

// Random Ball
function getRandomBall() {
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch (pos) {
        case 'top':
            return {
                x: randomSidePos(canW),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
        case 'right':
            return {
                x: canW + R,
                y: randomSidePos(canH),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
        case 'bottom':
            return {
                x: randomSidePos(canW),
                y: canH + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
        case 'left':
            return {
                x: -R,
                y: randomSidePos(canH),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
    }
}


// Random numeric position from integer
function randomSidePos(length) {
    return Math.ceil(Math.random() * length);
}

// Draw Balls
function renderBalls() {
    Array.prototype.forEach.call(balls, function (b) {
        if (!b.hasOwnProperty('type')) {
            ctx.fillStyle = 'rgb(' + ballColor.r + ',' + ballColor.g + ',' + ballColor.b + ')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Update balls
function updateBalls() {
    var newBalls = [];
    Array.prototype.forEach.call(balls, function (b) {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x > -(ballCount) && b.x < (canW + ballCount) && b.y > -(ballCount) && b.y < (canW + ballCount)) {
            newBalls.push(b);
        }
    });

    balls = newBalls.slice(0);
}

// Draw lines
function renderLines() {
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {

            fraction = getDisOf(balls[i], balls[j]) / disLimit;

            if (fraction < 1) {
                alpha = (1 - fraction).toString();

                ctx.strokeStyle = 'rgba(9,9,9,' + alpha + ')';
                ctx.lineWidth = linkLineWidth;

                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Calculate distance between two points
function getDisOf(b1, b2) {
    var deltaX = Math.abs(b1.x - b2.x),
        deltaY = Math.abs(b1.y - b2.y);

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

// Add balls if there are little balls
function addBallIfy() {
    if (balls.length < ballCount) {
        balls.push(getRandomBall());
    }
}

// Render
function render() {
    ctx.clearRect(0, 0, canW, canH);

    renderBalls();

    renderLines();

    updateBalls();

    addBallIfy();

    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num) {
    for (var i = 1; i <= num; i++) {
        balls.push({
            x: randomSidePos(canW),
            y: randomSidePos(canH),
            vx: getRandomSpeed(randomPos())[0],
            vy: getRandomSpeed(randomPos())[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}

// Init Canvas
function initCanvas() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    canW = parseInt(canvas.getAttribute('width'));
    canH = parseInt(canvas.getAttribute('height'));

    ballCount = parseInt((canW * canH) / ballsDensity);
}

// Resize window listener
window.addEventListener('resize', function (e) {
    initCanvas();
});

// Starting function
function goMovie() {
    initCanvas();
    initBalls(ballCount);
    window.requestAnimationFrame(render);
}

goMovie();