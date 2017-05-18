class Breakout {
    constructor(infoObj) {
        this.canvas = document.getElementById(infoObj["selector"]);
        this.ctx = this.canvas.getContext("2d");
        this.bricksRowCount = infoObj["brickRowCount"];
        this.bricksColumnCount = infoObj["brickColumnCount"];
        this.newGame();
        this.bindKeyHandlers();
        this.animationID = setInterval(() => this.draw(), 10);

    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ballWallCollision(this.ball, this.canvas.height, this.canvas.width);
        paddleBallCollision(this.ball, this.paddle);
        this.bricks.forEach((row, index) => row.forEach((brick, index1) => brick.draw()));
        this.paddle.draw();
        this.ball.draw();
        this.gameOverCheck();
    }


    bindKeyHandlers() {
        $(document).keydown((e) => this.paddle.keyHandler(e, true));
        $(document).keyup((e) => this.paddle.keyHandler(e, false));
        $(document).keydown((e) => this.paddle.speedHandler(e, 14));
        $(document).keyup((e) => this.paddle.speedHandler(e, this.paddle.defaultDx));
    }

    newGame() {
        this.isOver = false;
        this.ball = new Ball(this.canvas, this.ctx);
        this.paddle = new Paddle(this.canvas, this.ctx, 10, 75);
        this.constructBricks(this.bricksRowCount, this.bricksColumnCount, 20, 75, 10, 30, 30);
    }

    /**
     * Create all the bricks at the top of the window for breaking.
     * The x,y coordinates are calculated as follows:
     * c and r are column and row index respectively.
     * brickX = (c * (width + padding)) + offsetLeft
     * brickY = (r * (height + padding)) + offsetTop
     *
     * @param row the number of rows for the bricks
     * @param col the number of columns for the bricks
     * @param height the height of the brick
     * @param width  the width of the brick
     * @param padding the padding between each brick
     * @param offsetTop distance of the brick group from the top edge of the canvas
     * @param offsetLeft distance of the brick group from the left edge of the canvas
     */
    constructBricks(row, col, height, width, padding, offsetTop, offsetLeft) {
        this.bricks = [];

        for (let r = 0; r < row; r++) {
            this.bricks[r] = [];
            for (let c = 0; c < col; c++) {
                let brickX = (c * (width + padding)) + offsetLeft;
                let brickY = (r * (height + padding)) + offsetTop;
                this.bricks[r][c] = new Rectangle(this.canvas, this.ctx, height, width, brickX, brickY);
            }
        }
    }

    /**
     * Throws a game over box if the ball hit the bottom screen.
     *
     */
    gameOverCheck() {
        let ball = this.ball;
        if (ball.y + ball.dY > this.canvas.height - ball.radius) {
            let $newGameBtn = dialog("#dialoogvenster", "danger", "Starting new game.", "Failed!").find('.btn');
            console.log("old" + this.animationID);
            clearInterval(this.animationID);
            $newGameBtn.unbind().click(() => {
                this.animationID = setInterval(() => this.draw(), 10);
                console.log("new " + this.animationID);
                this.newGame();
            });
        }
    }

}


class Shape {

    /**
     * An arbitrary shape which could be constructed in this breakout game.
     * @param canvas the html5 canvas where the shape will be drawn (Might need it ?)
     * @param ctx the context in which the shape will be drawn in (2d)
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    /**
     * Draw the shape with the given shape function and color
     * @param drawFunc the draw function used to draw the shape with the given ...param
     * @param color the color the shape will be filled with.
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
        this.defaultDx = 3;
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

function hitBlock(ball, block) {
    if (ball.x + ball.radius > block.x && ball.x - ball.radius < block.x + block.width) {
        if (ball.y + ball.radius > block.y && ball.y + ball.radius < block.y + block.height) {
            return true;
        }
    }

    return false;
}

function ballWallCollision(ball, objY, objX, x = 0, y = 0) {
    if (ball.x + ball.dX > objX - ball.radius || ball.x + ball.dX < x - ball.radius) {
        ball.flipdX();
    }
    if (ball.y + ball.dY > objY - ball.radius || ball.y + ball.dY < y - ball.radius) {
        ball.flipdY();
    }
}

function paddleBallCollision(ball, paddle) {
    if (ball.y + ball.dY + ball.radius > paddle.y) {
        if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {

            let relativeDist = (ball.x - paddle.x) / paddle.width;
            ball.angle = (1 - relativeDist) * (2 * Math.PI) / 3 + Math.PI / 6;
            ball.dY = -Math.sin(ball.angle);
            ball.dX = Math.cos(ball.angle);

            if (ball._speedMultiplier <= 4) {
                ball._speedMultiplier += 0.1;
            }
        }
    }
}


/**
 * Plucked from responsive design github page.
 * A method to call a dialog window with the given selector id.
 */
function dialog(selector, type, boodschap, titel) {

    // dictionary die verschillende types van dialoogvensters bepaalt,
    // die elk type van een standaard titel voorziet
    let titels = {
        "primary": "Informatie",
        "success": "Succes",
        "info": "Informatie",
        "warning": "Waarschuwing",
        "danger": "Gevaar",
    };

    // selecteer het element dat het dialoogvenster voorstelt
    let $dialog = $(selector),
        $dialog_header = $dialog.find('.modal-header');
    $dialog_body = $dialog.find('.modal-body');
    $dialog_btn = $dialog.find('.btn');

    // verwijder alle voorgaande kleuren
    Object.keys(titels).forEach(function (type) {
        $dialog_header.removeClass('bg-' + type);
        $dialog_body.removeClass('text-' + type);
        $dialog_btn.removeClass('btn-' + type);
    });

    // stel nieuwe kleur in
    if (titels.hasOwnProperty(type)) {
        $dialog_header.addClass('bg-' + type);
        $dialog_body.addClass('text-' + type);
        $dialog_btn.addClass('btn-' + type);
    }

    // boodschap instellen
    $dialog_body.find('p').html(boodschap);

    // titel instellen
    titel = titel || titels[type] || "";
    $dialog_header.find('h4').html(titel);

    // dialoogvenster weergeven
    $dialog.modal();

    return $dialog;
}


/**
 * Generates a random hexadecimal string for color
 * @returns {string} hexadecimal string representation of colors
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



