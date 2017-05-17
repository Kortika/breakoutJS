class Breakout {
    constructor(infoObj) {
        this.canvas = document.getElementById(infoObj["selector"]);
        this.ctx = this.canvas.getContext("2d");
        this.newGame();
        setInterval(() => this.draw(), 10);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        collideBallObj(this.ball, this.canvas.height, this.canvas.width);
        paddleBallCollision(this.ball, this.paddle);
        this.paddle.draw();
        this.ball.draw();
        this.gameOverCheck();
    }


    start() {
        $(document).keydown((e) => this.paddle.keyHandler(e, true));
        $(document).keyup((e) => this.paddle.keyHandler(e, false));
        $(document).keydown((e) => this.paddle.speedHandler(e, 14));
        $(document).keyup((e) => this.paddle.speedHandler(e, 7));
    }

    newGame() {
        this.isOver = false;
        this.ball = new Ball(this.canvas, this.ctx);
        this.paddle = new Paddle(this.canvas, this.ctx, 10, 75);
        this.start();
    }

    /**
     * Throws an alert box if the ball fell through the paddle and hit bottom.
     */
    gameOverCheck() {
        let ball = this.ball;
        if (ball.y + ball.dY > this.canvas.height - ball.radius) {
            alert("GAME OVER");
            this.newGame();
        }
    }

}


class Shape {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    /**
     * Draw the shape with the given shape function and color
     * @param drawFunc the draw function used to draw the shape with the given ...param
     * @param color
     * @param param custom required parameters for the specified shape draw function
     */
    draw(drawFunc, color, ...param) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx[drawFunc](...param);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }


}


class Rectangle extends Shape {
    constructor(canvas, ctx, height, width, x, y) {
        super(canvas, ctx);
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
    }

    draw(color = "#0095DD") {
        super.draw("rect", color, this.x, this.y, this.width, this.height);
    }
}

class Paddle extends Rectangle {
    constructor(canvas, ctx, height, width) {
        super(canvas, ctx, height, width, (canvas.width - width) / 2, (canvas.height - height));
        this.rightPressed = false;
        this.leftPressed = false;
        this.dx = 3;
        this.velocity = 0;

    }

    draw() {
        super.draw();
        if (this.rightPressed && this.x < this.canvas.width - this.width) {
            this.x += this.dx;
        }
        else if (this.leftPressed && this.x > 0) {
            this.x -= this.dx;
        }

    }

    /**
     * Press shift to speed up the paddle
     */
    speedHandler(e, value) {
        if (e.keyCode === 16) {
            this.dx = value;
        }
    }

    /**
     * Left and right arrow keyhandler to control the
     * paddle
     */
    keyHandler(e, bool) {

        if (e.keyCode === 39) {
            this.changeSpeed(bool);
            this.rightPressed = bool;
        }
        else if (e.keyCode === 37) {
            this.changeSpeed(bool);
            this.leftPressed = bool;
        }
    }

    /**
     * Change instantaneous velocity if arrow keys are pressed
     */
    changeSpeed(bool) {
        if (bool) {
            this.velocity = this.dx;
        } else {
            this.velocity = 0;
        }
    }
}
class Ball extends Shape {
    /**
     * The ball that will be used to break the bricks and score points.
     * @param canvas Canvas where the ball will be drawn
     * @param ctx canvas context used to draw this ball
     */
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this._speedMultiplier = 2;
        this.angle = Math.PI / 4;
        this._dx = Math.cos(this.angle);
        this._dy = -Math.sin(this.angle);
    }

    flipdX() {
        this._dx = -this._dx;
    }

    flipdY() {
        this._dy = -this._dy;
    }

    draw() {
        super.draw("arc", "blue", this.x, this.y, this.radius, 0, Math.PI * 2);
        this.x += this.dX * this._speedMultiplier;
        this.y += this.dY * this._speedMultiplier;
    }

    get dX() {
        return this._dx;
    }

    get dY() {
        return this._dy;
    }

    set dX(val) {
        this._dx = val;
    }

    set dY(val) {
        this._dy = val;
    }

}

function collideBallObj(ball, objY, objX, x = 0, y = 0) {
    if (ball.x + ball.dX > objX - ball.radius || ball.x + ball.dX < ball.radius) {
        ball.flipdX();
    }
    if (ball.y + ball.dY > objY - ball.radius || ball.y + ball.dY < ball.radius) {
        ball.flipdY();
    }
}

function paddleBallCollision(ball, paddle) {
    if (ball.y + ball.dY + ball.radius > paddle.y) {
        if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {

            let relativeDist = (ball.x - paddle.x) / paddle.width;
            ball.angle = (1 - relativeDist) * Math.PI;
            ball.dY = -Math.sin(ball.angle);
            ball.dX = Math.cos(ball.angle);

            if (ball._speedMultiplier <= 4) {
                ball._speedMultiplier += 0.1;
            }
        }
    }
}

function paddleReflect(ball, paddle) {
    let y2 = ball.dY + ball.y;
    let x2 = ball.dX + ball.x;
    let intersectX = (x2 - ball.x)(paddle.y - ball.y) / (y2 - ball.y) + ball.x;
    let middle = (paddle.x + paddle.width) / 2;
    let dx = (intersectX - middle) / middle

}


function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



