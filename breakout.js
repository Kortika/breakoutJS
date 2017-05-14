class Breakout {
    constructor(infoObj) {
        this.document = infoObj["document"];
        this.canvas = document.getElementById(infoObj["canvas"]);
        this.ctx = this.canvas.getContext("2d");
        this.newGame();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paddle.draw();
        this.ball.draw();
    }


    start() {
        $(document).keydown((e) => this.paddle.keyDownHandler(e));
        $(document).keyup((e) => this.paddle.keyUpHandler(e));
        $(document).keydown((e) => this.paddle.speedHandler(e));
        $(document).keyup((e) => this.paddle.speedDecHandler(e));
        setInterval(() => this.draw(), 10);
    }

    newGame() {
        this.ball = new Ball(this.canvas, this.ctx);
        this.paddle = new Paddle(this.canvas, this.ctx, 10, 75)
    }


    gameOver() {

    }
}


class Shape {

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    draw(drawFunc, color, ...param) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx[drawFunc](...param);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }

    static checkIfHitBoundary(componentCoord, delta, boundary, radius) {
        return (componentCoord + delta > boundary - radius || componentCoord + delta < radius  )
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
        super(canvas, ctx, height, width, (canvas.width - width) / 2, (canvas.height - height - 10));
        this.rightPressed = false;
        this.leftPressed = false;
        this.speed = 7;
    }

    draw() {
        super.draw();

        if (this.rightPressed && this.x < this.canvas.width - this.width) {
            this.x += this.speed;
        }
        else if (this.leftPressed && this.x > 0) {
            this.x -= this.speed;
        }

    }

    speedDecHandler(e) {
        if (e.keyCode === 16) {
            this.speed = 7;
        }
    }

    speedHandler(e) {
        if (e.keyCode === 16) {
            this.speed = 14;
        }
    }

    keyDownHandler(e) {
        if (e.keyCode === 39) {
            this.rightPressed = true;
        }
        else if (e.keyCode === 37) {
            this.leftPressed = true;
        }
    }

    keyUpHandler(e) {
        if (e.keyCode === 39) {
            this.rightPressed = false;
        }
        else if (e.keyCode === 37) {
            this.leftPressed = false;
        }
    }
}
class Ball extends Shape {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.radius = 10;
        this.x = canvas.width / 2;
        this.y = canvas.height - 30;
        this.dx = 2;
        this.dy = -2;
    }

    draw() {
        super.draw("arc", "blue", this.x, this.y, this.radius, 0, Math.PI * 2);
        this.tryBounce();
        this.x += this.dx;
        this.y += this.dy;
    }


    tryBounce() {
        let x = this.x;
        let y = this.y;
        let dx = this.dx;
        let dy = this.dy;
        let canvas = this.canvas;
        if (Shape.checkIfHitBoundary(x, dx, canvas.width, this.radius)) {
            this.dx = -dx;
        }
        if (Shape.checkIfHitBoundary(y, dy, canvas.height, this.radius)) {
            this.dy = -dy;
        }
    }
}



