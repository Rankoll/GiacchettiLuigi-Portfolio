var canvas = document.getElementById('dot-connect'),
can_w = parseInt(canvas.getAttribute('width')),
can_h = parseInt(canvas.getAttribute('height')),
ctx = canvas.getContext('2d'),
ball_per_pixel_area = 19200;

var ball_count;

var ball = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 0,
    phase: 0
},
ball_color = {
    r: 9,
    g: 9,
    b: 9
},
R = 4,
balls = [],

// Line
link_line_width = 1,
dis_limit = 390;

// Random speed
function getRandomSpeed(pos) {
    var min = -0.3,
        max = 0.3;
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
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
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
            ctx.fillStyle = 'rgb(' + ball_color.r + ',' + ball_color.g + ',' + ball_color.b + ')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Update balls
function updateBalls() {
    var new_balls = [];
    Array.prototype.forEach.call(balls, function (b) {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x > -(ball_count) && b.x < (can_w + ball_count) && b.y > -(ball_count) && b.y < (can_h + ball_count)) {
            new_balls.push(b);
        }
    });

    balls = new_balls.slice(0);
}

// Draw lines
function renderLines() {
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {

            fraction = getDisOf(balls[i], balls[j]) / dis_limit;

            if (fraction < 1) {
                alpha = (1 - fraction).toString();

                ctx.strokeStyle = 'rgba(9,9,9,' + alpha + ')';
                ctx.lineWidth = link_line_width;

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
    var delta_x = Math.abs(b1.x - b2.x),
        delta_y = Math.abs(b1.y - b2.y);

    return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
}

// Add balls if there are little balls
function addBallIfy() {
    if (balls.length < ball_count) {
        balls.push(getRandomBall());
    }
}

// Render
function render() {
    ctx.clearRect(0, 0, can_w, can_h);

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
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
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

    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));

    ball_count = parseInt((can_w * can_h) / ball_per_pixel_area);
}

// Resize window listener
window.addEventListener('resize', function (e) {
    initCanvas();
});

// Starting function
function goMovie() {
    initCanvas();
    initBalls(ball_count);
    window.requestAnimationFrame(render);
}

goMovie();