/**
 * @author Victor Zegarra (Retromantis)
 * @date 18/11/2025
 */

game_scene = new MiScene();

game_scene.preload = function () {
    this.loadImage('bg', 'assets/images/game/bg.png');
    this.loadImage('player1', 'assets/images/game/player1.png');
    this.loadImage('player2', 'assets/images/game/player2.png');
    this.loadImage('shot', 'assets/images/game/shot.png');
    this.loadImage('bullet', 'assets/images/game/bullet.png');
    this.loadImage('head', 'assets/images/game/head.png');
}

game_scene.create = function () {
    this.screen = 0;
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);

    this.PLAYER_WDT = 40;
    this.PLAYER_HGT = 40;
    this.PLAYER_SPEED = 4;

    this.player1 = new MiSprite(this.getImage('player1'), this.PLAYER_WDT, this.PLAYER_HGT);
    // this.player1.setCollider(6, 2, 12, 22);
    this.player1.update = this.player_update;
    // this.player1.bounds = { x1: 0, x2: GAME_WIDTH - this.player1.width, y1: 0, y2: GAME_HEIGHT + this.player1.height };
    this.player1.bounds = { x1: 0, x2: GAME_WIDTH - this.player1.width, y1: 40, y2: GAME_HEIGHT - this.player1.height };

    // this.player1.anims = {};
    // this.player1.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    // this.player1.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };
    // this.player1.anims[STATE_JUMPING | DIR_LEFT] = { frames: [4], delay: 0, loop: false };
    // this.player1.anims[STATE_JUMPING | DIR_RIGHT] = { frames: [6], delay: 0, loop: false }

    this.player1.setAnim = function (id) {
        // this.setAnimation(this.anims[id]);
    }
    this.player1.update = this.player_update;


    this.player2 = new MiSprite(this.getImage('player2'), this.PLAYER_WDT, this.PLAYER_HGT);
    // this.player2.setCollider(6, 2, 12, 22);
    this.player2.update = this.player_update;
    // this.player2.bounds = { x1: 0, x2: GAME_WIDTH - this.player2.width, y1: 0, y2: GAME_HEIGHT + this.player2.height };
    this.player2.bounds = { x1: 0, x2: GAME_WIDTH - this.player2.width, y1: 40, y2: GAME_HEIGHT - this.player2.height };

    // this.player1.anims = {};
    // this.player1.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    // this.player1.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };
    // this.player1.anims[STATE_JUMPING | DIR_LEFT] = { frames: [4], delay: 0, loop: false };
    // this.player1.anims[STATE_JUMPING | DIR_RIGHT] = { frames: [6], delay: 0, loop: false };

    this.player2.setAnim = function (id) {
        // this.setAnimation(this.anims[id]);
    }
    this.player2.update = this.player_update;

    this.SHOT_WDT = 12;
    this.SHOT_HGT = 18;
    this.SHOT_SPEED = -8;

    this.BULLET_WDT = 14;
    this.BULLET_HGT = 14;
    this.BULLET_SPEED = 4;

    this.HEAD_WDT = 42;
    this.HEAD_HGT = 34;
    this.HEAD_SPEED = 4;

    this.add(this.player1);
    this.add(this.player2);
}

game_scene.start = function () {
    this.state = GAME_READY;

    this.player_init();

    this.bg_offset = -GAME_HEIGHT;
    this.img_bg.y = this.bg_offset;
}

game_scene.player_init = function () {
    this.player1.position(this.player1.width, GAME_HEIGHT - (this.player1.height * 2));
    this.player2.position(GAME_WIDTH - (this.player2.width * 2), GAME_HEIGHT - (this.player2.height * 2));

    this.img_bg.y = -GAME_HEIGHT;
}

game_scene.update = function () {
    this.super_update();

    if (this.img_bg.y < 0) {
        this.img_bg.y += 1;
    } else {
        this.img_bg.y = -GAME_HEIGHT;
    }
}

game_scene.player_update = function () {
    let vx = 0;
    let vy = 0;
    if (this.key_left && this.x > this.bounds.x1) {
        vx = -game_scene.PLAYER_SPEED;
    }
    if (this.key_right && this.x < this.bounds.x2) {
        vx = game_scene.PLAYER_SPEED;
    }
    if (this.key_up && this.y > this.bounds.y1) {
        vy = -game_scene.PLAYER_SPEED;
    }
    if (this.key_down && this.y < this.bounds.y2) {
        vy = game_scene.PLAYER_SPEED;
    }
    this.move(vx, vy);
}

game_scene.spawn_shot = function (x, y) {
    let shot = new MiSprite(this.getImage('shot'), game_scene.SHOT_WDT, game_scene.SHOT_HGT);

    shot.position(x, y);
    shot.bounds = { x1: 0, x2: GAME_WIDTH, y1: 0, y2: GAME_HEIGHT };
    shot.update = game_scene.update_shot;
    shot.vx = 0;
    shot.vy = this.SHOT_SPEED;
    shot.setAnimation({ frames: [0, 1, 2], delay: 0, loop: true });


    shot.setCollider(0, 0, game_scene.SHOT_WDT, game_scene.SHOT_HGT);
    return shot;
}

game_scene.update_shot = function () {
    this.move(this.vx, this.vy);
    this.animate();

    if (this.y < this.bounds.y1) {
        game_scene.remove(this);
    }
}

game_scene.spawn_bullet = function (x, y) {
    let bullet = new MiSprite(this.getImage('bullet'), game_scene.BULLET_WDT, game_scene.BULLET_HGT);

    bullet.position(x, y);
    bullet.bounds = { x1: 0, x2: GAME_WIDTH, y1: 0, y2: GAME_HEIGHT };
    bullet.update = game_scene.update_bullet;
    bullet.vx = 0;
    bullet.vy = this.BULLET_SPEED;
    bullet.setAnimation({ frames: [0, 1, 2], delay: 0, loop: true });


    bullet.setCollider(0, 0, game_scene.BULLET_WDT, game_scene.BULLET_HGT);
    return bullet;
}

game_scene.update_bullet = function () {
    this.move(this.vx, this.vy);
    this.animate();

    if (this.y > this.bounds.y2) {
        game_scene.remove(this);
    }
}

game_scene.spawn_head = function (x, y) {
    let head = new MiSprite(this.getImage('bullet'), game_scene.BULLET_WDT, game_scene.BULLET_HGT);

    head.position(x, y);
    head.bounds = { x1: 0, x2: GAME_WIDTH, y1: 0, y2: GAME_HEIGHT };
    head.update = game_scene.update_head;
    head.vx = 0;
    head.vy = this.BULLET_SPEED;
    head.setAnimation({ frames: [0, 1, 2], delay: 0, loop: true });


    head.setCollider(0, 0, game_scene.BULLET_WDT, game_scene.BULLET_HGT);
    return head;
}

game_scene.update_head = function () {
    this.move(this.vx, this.vy);
    this.animate();

    if (this.y > this.bounds.y2) {
        game_scene.remove(this);
    }
}

game_scene.keyDown = function (event) {
    // console.log(event.key + " " + event.code);
    switch (event.code) {
        case "KeyA":
            this.player1.key_left = true;
            break;
        case "ArrowLeft":
            this.player2.key_left = true;
            break;
        case "KeyD":
            this.player1.key_right = true;
            break;
        case "ArrowRight":
            this.player2.key_right = true;
            break;
        case "KeyW":
            this.player1.key_up = true;
            break;
        case "ArrowUp":
            this.player2.key_up = true;
            break;
        case "KeyS":
            this.player1.key_down = true;
            break;
        case "ArrowDown":
            this.player2.key_down = true;
            break;
        case "KeyB":
        case "KeyI":
        case "Space":
            this.add(this.spawn_shot(this.player1.x + (this.player1.width >> 1) - (this.SHOT_WDT >> 1), this.player1.y));
            break
        case "Numpad0":
        case "Numpad8":
        case "NumpadEnter":
            this.add(this.spawn_shot(this.player2.x + (this.player2.width >> 1) - (this.SHOT_WDT >> 1), this.player2.y));
            break
        case "Escape":
            this.start();
            break
    }
}

game_scene.keyUp = function (event) {
    switch (event.code) {
        case "KeyA":
            this.player1.key_left = false;
            break;
        case "ArrowLeft":
            this.player2.key_left = false;
            break;
        case "KeyD":
            this.player1.key_right = false;
            break;
        case "ArrowRight":
            this.player2.key_right = false;
            break;
        case "KeyW":
            this.player1.key_up = false;
            break;
        case "ArrowUp":
            this.player2.key_up = false;
            break;
        case "KeyS":
            this.player1.key_down = false;
            break;
        case "ArrowDown":
            this.player2.key_down = false;
            break;
        case "KeyS":
            this.player1.key_down = false;
            break;
        case "ArrowDown":
            this.player2.key_down = false;
            break;
    }
}

game_scene.touchStart = function (x, y) {
    this.startX = x;
    this.startY = y;
}

game_scene.touchEnd = function (x, y) {
    const SWIPE_THRESHOLD = 10; // píxeles mínimos para considerar swipe
    const dx = x - this.startX;
    const dy = y - this.startY;

    if (x === this.startX && y === this.startY) {
        this.jump();
    } else if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
            this.turn_left();
        } else {
            this.turn_right();
        }
    } else {
        if (dy < 0) {
            this.jump();
        } else {
            this.idle();
        }
    }
}

game_scene.turn_left = function () {
}

game_scene.turn_right = function () {
}

game_scene.jump = function () {
}

game_scene.idle = function () {
}

game_scene.set_state_game_over = function () {
}