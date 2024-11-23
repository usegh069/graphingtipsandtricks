try {
    class Player {
        constructor(x, y, color) {
            this.id = Math.random().toString(16).substring(2);
            this.type = "player"
            this.pos = new Vec2(x, y);
            this.size = new Vec2(50, 50);
            this.color = color;
            this.dy = 1;
            this.grounded = false;
        }
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
        move(vec) {
            var newVec = new Vec2(this.pos.x + vec.x, this.pos.y + vec.y);
            var entities = [...currentLevel.platforms, whitePlayer, blackPlayer];

            for (var i = 0; i < entities.length; i++) {
                const e = entities[i];
                if (e.id == this.id) continue
                if (collisionBetween(newVec.x, newVec.y, this.size.x, this.size.y, e.pos.x, e.pos.y, e.size.x, e.size.y)) {
                    // Check if the player is falling and colliding with the top of the platform
                    if (vec.y > 0 && newVec.y + this.size.y >= e.pos.y && newVec.y + this.size.y <= e.pos.y + this.size.y) {
                        this.grounded = true;
                    }
                    // snap to the nearest edge of the colliding entity
                    // Horizontal collision resolution
                    if (vec.x > 0) { // Moving right
                        newVec.x = e.pos.x - this.size.x;
                    } else if (vec.x < 0) { // Moving left
                        newVec.x = e.pos.x + e.size.x;
                    }

                    // Vertical collision resolution
                    if (vec.y > 0) { // Moving down
                        newVec.y = e.pos.y - this.size.y;
                    } else if (vec.y < 0) { // Moving up
                        newVec.y = e.pos.y + e.size.y;
                    }

                    // Stop further movement
                    break;
                } else {
                    // full motion
                    this.pos.x = newVec.x;
                    this.pos.y = newVec.y;
                }
            }
        }
    }
    class Platform {
        constructor(x, y, w, h, color) {
            this.id = Math.random().toString(16).substring(2);
            this.type = "platform";
            this.color = color;
            this.pos = new Vec2(x, y);
            this.size = new Vec2(w, h)
        }
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
        collision(player, cb) {
            const thisL = this.pos.x;
            const thisR = this.pos.x + this.size.x;
            const thisT = this.pos.y;
            const thisB = this.pos.y + this.size.y;

            const otherL = player.pos.x;
            const otherR = player.pos.x + player.size.x;
            const otherT = player.pos.y;
            const otherB = player.pos.y + player.size.y;

            if (!(
                thisL > otherR ||
                thisR < otherL ||
                thisT > otherB ||
                thisB < otherT
            )) {
                cb();
            }
        }
    }
    function collisionBetween(x1, y1, w1, h1, x2, y2, w2, h2, cb) {
        return !(
            x1 > x2 + w2 ||
            x1 + w1 < x2 ||
            y1 > y2 + h2 ||
            y1 + h1 < y2
        )
    }
    class Level {
        constructor(platforms) {
            this.platforms = platforms;
        }
        draw(ctx) {
            this.platforms.forEach(p => {
                p.draw(ctx)
            })
        }
    }
    class Vec2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        add(vector) {
            this.x += vector.x;
            this.y += vector.y;
        }
    }


    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        movePlayers();
        whitePlayer.move(new Vec2(0, whitePlayer.dy));
        blackPlayer.move(new Vec2(0, blackPlayer.dy));


        if (!whitePlayer.grounded) whitePlayer.dy = Math.min(whitePlayer.dy + 0.1, 10);
        if (!blackPlayer.grounded) blackPlayer.dy = Math.min(blackPlayer.dy + 0.1, 10);

        checkCollision();
        drawPlayers();
        drawLevel();
        window.requestAnimationFrame(() => {
            update();
        });
    }
    function drawPlayers() {
        blackPlayer.draw(ctx);
        whitePlayer.draw(ctx);
    }
    function drawLevel() {
        currentLevel.draw(ctx);
    }
    function checkCollision() {
        currentLevel.platforms.forEach(plat => {
            plat.collision(whitePlayer, () => handlePlatformCollision(plat, whitePlayer));
            plat.collision(blackPlayer, () => handlePlatformCollision(plat, blackPlayer));
        })
    }
    function handlePlatformCollision(platform, player) {
        // snap player (only if previously not grounded, and closer than 5 px)
        if (!player.grounded && player.pos.y + player.size.y - platform.pos.y < 5) {
            player.pos.y = platform.pos.y - player.size.y;
            player.dy = 0;
            player.grounded = true;
        }
        // color green
        player.color = "green";
    }
    function movePlayers() {
        if (inputMap["KeyA"]) blackPlayer.move(new Vec2(-speed, 0));
        if (inputMap["KeyD"]) blackPlayer.move(new Vec2(speed, 0));

        if (inputMap["ArrowLeft"]) whitePlayer.move(new Vec2(-speed, 0));
        if (inputMap["ArrowRight"]) whitePlayer.move(new Vec2(speed, 0));
    }
    function init() {
        update();
    }
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const jumpForce = 4;
    const blackPlayer = new Player(10, 10, "black");
    const whitePlayer = new Player(60, 10, "white");
    const speed = 3;
    let currentLevel = new Level([new Platform(0, 300, 100, 50, "black")]);


    const inputMap = {};
    document.addEventListener("keydown", (e) => {
        inputMap[e.code] = true;
        if (e.code == "KeyW") {
            blackPlayer.dy -= jumpForce;
            blackPlayer.grounded = false;
        } else if (e.code == "ArrowUp") {
            whitePlayer.dy -= jumpForce;
            whitePlayer.grounded = false;
        }
    });
    document.addEventListener("keyup", (e) => {
        inputMap[e.code] = false;
    })

    init();
} catch (err) {
    log(err);
}
function log(content) {
    document.getElementById("logs").innerHTML += content;
}
function clearLogs() {
    document.getElementById("logs").innerHTML = "";
}