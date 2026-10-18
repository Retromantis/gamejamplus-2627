/**
 * @author Victor Zegarra
 * @date 18/11/2025
 */

game_scene = new MiScene();

game_scene.preload = function () {
    this.loadImage('bg', 'assets/images/game/bg.png');
    this.loadImage('player', 'assets/images/game/player.png');
    this.loadImage('platform', 'assets/images/game/platform.png');
    this.loadImage('wall', 'assets/images/game/wall.png');
    this.loadImage('carrier', 'assets/images/game/carrier.png');
    this.loadImage('snail', 'assets/images/game/snail.png');
    this.loadImage('spikes', 'assets/images/game/spikes.png');
    this.loadImage('fruit1', 'assets/images/game/fruit1.png');
    this.loadImage('burst', 'assets/images/game/burst.png');
    this.loadImage('zone_cleared', 'assets/images/game/zone_cleared.png');
}

game_scene.create = function () {
    this.screen = 0;
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);

    this.player = new MiSprite(this.getImage('player'), 24, 24);
    this.player.GRAVITY = 2;
    this.player.JUMP_FORCE = -16;
    this.player.DOUBLE_JUMP_FORCE = -12;
    this.player.SPEED_X = 2.5;
    this.player.setCollider(6, 2, 12, 22);
    this.player.update = this.player_update;
    // this.player.bounds = { x1: 0, x2: GAME_WIDTH - this.player.width, y1: 0, y2: GAME_HEIGHT + this.player.height };
    this.player.bounds = { x1: -this.player.width, x2: GAME_WIDTH, y1: 0, y2: GAME_HEIGHT };

    this.player.anims = {};
    this.player.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    this.player.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    this.player.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    this.player.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };
    this.player.anims[STATE_JUMPING | DIR_LEFT] = { frames: [4], delay: 0, loop: false };
    this.player.anims[STATE_JUMPING | DIR_RIGHT] = { frames: [6], delay: 0, loop: false };

    this.player.setAnim = function (id) {
        this.setAnimation(this.anims[id]);
    }

    this.SNAIL_WDT = 34;
    this.SNAIL_HGT = 22;
    this.SNAIL_SPEED_X = 1;
    this.SNAIL_ANIM_LEFT = { frames: [0, 1], delay: 2, loop: true };
    this.SNAIL_ANIM_RIGHT = { frames: [2, 3], delay: 2, loop: true };

    this.SPIKES_WDT = 32;
    this.SPIKES_HGT = 10;
    this.SPIKES_ANIM = { frames: [0, 1], delay: 8, loop: true };
    this.spikes = new MiSprite(this.getImage('spikes'), this.SPIKES_WDT, this.SPIKES_HGT);
    this.spikes.setAnimation(this.SPIKES_ANIM);
    this.spikes.update = function () {
        this.animate();
    }
    // this.add(this.spikes);
    this.spikes.position(100, GAME_HEIGHT - this.SPIKES_HGT - 12);

    this.FRUIT1_WDT = 18;
    this.FRUIT1_HGT = 20;
    this.FRUIT1_ANIM = { frames: [0, 1], delay: 0, loop: true };

    this.BURST_WDT = 64;
    this.BURST_HGT = 64;
    this.BURST_ANIM_RESPAWN = { frames: [3, 2, 1, 0], delay: 0, loop: false };
    this.BURST_ANIM_DESPAWN = { frames: [0, 1, 2, 3], delay: 0, loop: false };

    this.burst = new MiSprite(this.getImage('burst'), this.BURST_WDT, this.BURST_HGT);
    this.burst.update = function () {
        this.animate();
    }
    this.burst.onEndAnimation = function (anim) {
        if (anim === game_scene.BURST_ANIM_DESPAWN) {
            this.isVisible = false;
            game_scene.start();
        } else if (anim === game_scene.BURST_ANIM_RESPAWN) {
            this.isVisible = false;
            game_scene.state = GAME_PLAYING;
            game_scene.player.isVisible = true;
            game_scene.turn_right();
        }
    }

    this.enemies = [];
    this.items = [];
    this.platforms = [];

    this.current_level = 0;

    this.levels = [
        {
            platforms: [
                { x: 24, y: 32, width: 48, height: 20 },
                { x: 80, y: 140, width: 64, height: 20 },
                { x: 0, y: 156, width: 48, height: 20 },
                { x: -16, y: 204, width: 160, height: 20 },
                { x: 176, y: 204, width: 160, height: 20 }
            ],
            floors: [
                { x: -16, y: 128, width: 16, height: 20 },
                { x: GAME_WIDTH - 16, y: 128, width: 16, height: 20 }
            ],
            walls: [    
                { x: 0, y: 0, width: 16, height: 224 },
                { x: GAME_WIDTH - 16, y: 0, width: 16, height: 224}
            ],
            carriers: [
                { x: 80, y: 64, width: 64, height: 20, speed_x: 1, speed_y: 0, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 210 },
                { x: 176, y: 100, width: 48, height: 20, speed_x: 0, speed_y: 1, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 190 }
            ],
            enemies: [
                // { x: 200, y: 167, dir: DIR_LEFT, x1: 0, x2: GAME_WIDTH - this.SNAIL_WDT },
                // { x: 128, y: 189, dir: DIR_RIGHT, x1: 80, x2: GAME_WIDTH - this.SNAIL_WDT }
            ],
            items: [
                { x: 200, y: 124 },
                { x: 150, y: 172 },
                { x: 180, y: 172 }
            ],
            player: { x: 24, y: 180 }
        },
        {
            platforms: [
                { x: 24, y: 32, width: 48, height: 20 },
                { x: 80, y: 140, width: 64, height: 20 },
                { x: 0, y: 156, width: 48, height: 20 },
                { x: -16, y: 204, width: 160, height: 20 },
                { x: 176, y: 204, width: 160, height: 20 }
            ],
            floors: [
                { x: -16, y: 128, width: 16, height: 20 },
                { x: GAME_WIDTH - 16, y: 128, width: 16, height: 20 }
            ],
            walls: [    
                { x: 0, y: 0, width: 16, height: 80 },
                { x: GAME_WIDTH - 16, y: 0, width: 16, height: 80 },
                { x: 0, y: 128, width: 16, height: 96 },
                { x: GAME_WIDTH - 16, y: 128, width: 16, height: 96 }
            ],
            carriers: [
                { x: 80, y: 64, width: 64, height: 20, speed_x: 1, speed_y: 0, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 210 },
                { x: 176, y: 100, width: 48, height: 20, speed_x: 0, speed_y: 1, x1: 0, x2: GAME_WIDTH - 64, y1: 100, y2: 190 }
            ],
            enemies: [
                { x: 200, y: 167, dir: DIR_LEFT, x1: 0, x2: GAME_WIDTH - this.SNAIL_WDT },
                { x: 128, y: 189, dir: DIR_RIGHT, x1: 80, x2: GAME_WIDTH - this.SNAIL_WDT }
            ],
            items: [
                { x: 200, y: 124 },
                { x: 150, y: 172 },
                { x: 180, y: 172 }
            ],
            player: { x: 24, y: 180 }
        }
    ];

    for (let p of this.levels[this.current_level].platforms) {
        let platform = new MiSprite(this.getImage('platform'), p.width, p.height);
        platform.setCollider(0, 4, p.width, 10);
        platform.position(p.x, p.y);
        platform.type = "static";
        this.add(platform);
        this.platforms.push(platform);
    }

    for (let f of this.levels[this.current_level].floors) {
        let floor = new MiImage(null, f.width, f.height);
        floor.setCollider(0, 0, f.width, 10);
        floor.position(f.x, f.y);
        floor.type = "static";
        this.add(floor);
        this.platforms.push(floor);
    }

    for (let w of this.levels[this.current_level].walls) {
        let wall = new MiSprite(this.getImage('wall'), w.width, w.height);
        wall.setCollider(0, 0, w.width, w.height);
        wall.position(w.x, w.y);
        wall.update = function () {
            if (game_scene.state === GAME_PLAYING) {
                if (this.collidesWith(game_scene.player)) {
                    if (game_scene.player.dir === DIR_LEFT ) {
                        game_scene.turn_right();
                        game_scene.player.position(this.x + this.width, game_scene.player.y);
                    } else if (game_scene.player.dir === DIR_RIGHT) {
                        game_scene.turn_left();
                        game_scene.player.position(this.x - game_scene.player.width, game_scene.player.y);
                    }
                    // game_scene.player.move(game_scene.player.vx, 0);
                }
            }
            this.animate();
        }

        this.add(wall);
        // this.platforms.push(wall);
    }

    for (let c of this.levels[this.current_level].carriers) {
        let carrier = this.spawn_moving_platform(c.x, c.y, c.width, c.height, c.speed_x, c.speed_y, c.x1, c.x2, c.y1, c.y2);
        this.add(carrier);
        this.platforms.push(carrier);
    }

    this.ZONE_CLEARED_WDT = 128;
    this.ZONE_CLEARED_HGT = 32;
    this.ZONE_CLEARED_ANIM = { frames: [0, 1, 0, 1, 0, 1], delay: 8, loop: false };
    this.zone_cleared = new MiSprite(this.getImage('zone_cleared'), this.ZONE_CLEARED_WDT, this.ZONE_CLEARED_HGT);
    this.zone_cleared.position((GAME_WIDTH - this.ZONE_CLEARED_WDT) >> 1, 150);
    this.zone_cleared.update = function () {
        this.animate();
    }
    this.zone_cleared.onEndAnimation = function (anim) {
        game_scene.start();
    }
}

game_scene.spawn_moving_platform = function (x, y, width, height, speed_x, speed_y, x1, x2, y1, y2) {
    let platform = new MiSprite(this.getImage('carrier'), width, height);
    platform.setCollider(0, 4, width, 10);
    platform.position(x, y);
    platform.type = "kinematic";
    platform.vx = speed_x;
    platform.vy = speed_y;
    platform.bounds = { x1: x1, x2: x2, y1: y1, y2: y2 };
    platform.update = function () {
        this.move(this.vx, this.vy);
        if (this.y < (this.bounds.y1 + game_scene.y) || this.y > (this.bounds.y2 + game_scene.y)) {
            this.vy = -this.vy;
        }
        if (this.x < this.bounds.x1 || this.x > this.bounds.x2) {
            this.vx = -this.vx;
        }
    }
    return platform;
}

game_scene.start = function () {
    game_scene.state = GAME_READY;

    this.remove(this.player);
    this.remove(this.burst);
    this.remove(this.zone_cleared);

    for (let enemy of this.enemies) {
        this.remove(enemy);
    }
    this.enemies.length = 0;

    for (let item of this.items) {
        this.remove(item);
    }
    this.items.length = 0;

    this.player_init();

    for (let enemy of this.levels[this.current_level].enemies) {
        let snail = this.spawn_snail(enemy.x, enemy.y, enemy.dir, enemy.x1, enemy.x2);
        this.add(snail);
        this.enemies.push(snail);
    }

    for (let item of this.levels[this.current_level].items) {
        let fruit = this.spawn_fruit(item.x, item.y);
        this.add(fruit);
        this.items.push(fruit);
    }

    this.add(this.player);
    this.add(this.burst);

    this.burst.position(this.player.x - 16, this.player.y - 16);
    this.burst.setAnimation(this.BURST_ANIM_RESPAWN);
    this.burst.isVisible = true;

    this.add(this.zone_cleared);
    this.zone_cleared.isVisible = false;
}

game_scene.player_init = function () {
    this.player.dir = DIR_RIGHT;
    this.player.state = STATE_IDLE;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.jumping = false;
    this.player.doubleJump = false;
    // this.player.position(24, this.platforms[this.level.platforms.length - 1].cy - this.player.height);
    this.player.position(this.levels[this.current_level].player.x, this.levels[this.current_level].player.y);
    this.player.setAnim(STATE_IDLE | DIR_RIGHT);
    this.player.isVisible = false;
    this.player.onPlatform = null;
}

game_scene.player_update = function () {
    this.animate();
    if (this.onPlatform !== null) {
        this.move(this.onPlatform.vx, this.onPlatform.vy);
    }

    if (this.jumping) {
        this.vy += this.GRAVITY;
        if (this.vy > 9) this.vy = 9;
    }
    this.move(this.vx, this.vy);

    let onPlatform = false;

    for (let p of game_scene.platforms) {

        // ¿Está el personaje sobre esta plataforma?
        let isAbovePlatform =
            this.cx + this.cwidth > p.x &&
            this.cx < p.x + p.width &&
            this.cy + this.cheight < p.cy + p.cheight &&
            this.cy + this.cheight + this.vy >= p.cy;

        if (isAbovePlatform) {
            if (p.type !== "static") {
                this.onPlatform = p;
                // Si es la plataforma elevadora, moverse con ella
                this.position(this.x, p.cy - this.height);
                // console.log("On elevator");
            }
            // Detener la caída
            this.jumping = false;
            this.doubleJump = false;
            onPlatform = true;
            this.vy = 0;
            this.position(this.x, p.cy - this.height);
            if (this.state === STATE_JUMPING) {
                this.state = STATE_RUNNING;
                this.setAnim(this.state | this.dir);
            }
            break;
        }
    }

    // Si no está sobre ninguna plataforma, sigue cayendo
    if (!onPlatform) {
        if (this.state !== STATE_IDLE) {
            this.onPlatform = null;
            this.jumping = true;
            if (this.state !== STATE_JUMPING) {
                // console.log("Falling");
                this.state = STATE_JUMPING;
                // this.setAnim(this.state | this.dir);
            }
        }
    }


    if (this.y > this.bounds.y2) {
        this.position(this.x, -this.height);
    }
    if (this.x < this.bounds.x1) {
        this.position(this.bounds.x2, this.y);
    } else if (this.x > this.bounds.x2) {
        this.position(this.bounds.x1, this.y);
    }
    // if (this.x < this.bounds.x1) {
    //     this.position(this.bounds.x1, this.y);
    //     game_scene.turn_right();
    // } else if (this.x > this.bounds.x2) {
    //     this.position(this.bounds.x2, this.y);
    //     game_scene.turn_left();
    // }
}

game_scene.spawn_snail = function (x, y, dir, x1, x2) {
    let snail = new MiSprite(this.getImage('snail'), this.SNAIL_WDT, this.SNAIL_HGT);

    snail.position(x, y);
    snail.bounds = { x1: x1, x2: x2, y1: 0, y2: 0 };
    snail.update = game_scene.snail_update;

    if (dir === DIR_LEFT) {
        snail.vx = -this.SNAIL_SPEED_X;
        snail.setAnimation(this.SNAIL_ANIM_LEFT);
        snail.direction = DIR_LEFT;
    } else {
        snail.vx = this.SNAIL_SPEED_X;
        snail.setAnimation(this.SNAIL_ANIM_RIGHT);
        snail.direction = DIR_RIGHT;
    }
    snail.setCollider(3, 5, 28, 17);
    return snail;
}

game_scene.snail_update = function () {
    if (game_scene.state !== GAME_PLAYING) {
        return;
    }
    this.animate();
    this.move(this.vx, 0);

    if (this.collidesWith(game_scene.player)) {
        game_scene.set_state_game_over();
    }

    if (this.x < this.bounds.x1) {
        this.vx = game_scene.SNAIL_SPEED_X;
        this.direction = DIR_RIGHT;
        this.setAnimation(game_scene.SNAIL_ANIM_RIGHT);
    } else if (this.x > this.bounds.x2) {
        this.vx = -game_scene.SNAIL_SPEED_X;
        this.direction = DIR_LEFT;
        this.setAnimation(game_scene.SNAIL_ANIM_LEFT);
    }
}

game_scene.spawn_fruit = function (x, y) {
    let fruit = new MiSprite(this.getImage('fruit1'), this.FRUIT1_WDT, this.FRUIT1_HGT);

    fruit.position(x, y);
    fruit.setAnimation(this.FRUIT1_ANIM);
    fruit.setCollider(1, 3, 16, 14);
    fruit.update = game_scene.fruit_update;

    return fruit;
}

game_scene.fruit_update = function () {
    this.animate();

    if (this.collidesWith(game_scene.player)) {
        // El jugador recoge la fruta
        game_scene.remove(this);
        let index = game_scene.items.indexOf(this);
        if (index > -1) {
            game_scene.items.splice(index, 1);
        }
        if (game_scene.items.length === 0) {
            // Todas las gemas recogidas, reiniciar el nivel
            // game_scene.start();
            game_scene.zone_cleared.isVisible = true;
            game_scene.state = GAME_VICTORY;
            game_scene.zone_cleared.setAnimation(game_scene.ZONE_CLEARED_ANIM);
            game_scene.current_level++;
            if (game_scene.current_level >= game_scene.levels.length) {
                game_scene.current_level = 0;
            }
        }
    }
}

game_scene.keyDown = function (event) {
    // console.log(event.key + " " + event.code);
    switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
            this.turn_left();
            break;
        case "KeyD":
        case "ArrowRight":
            this.turn_right();
            break;
        case "KeyW":
        case "ArrowUp":
        case "Space":
            this.jump();
            break;
        case "KeyS":
        case "ArrowDown":
            this.idle();
            break;
        case "Escape":
            this.start();
            break
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

    // alert(this.startX + "," + this.startY + " Tap detected " + x + "," + y);

    // if (x === this.startX && y === this.startY) {
    //     this.jump();
    // } else if (Math.abs(dx) > Math.abs(dy)) {
    //     if (dx < 0) {
    //         this.turn_left();
    //     } else {
    //         this.turn_right();
    //     }
    // }

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

    // if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
    //     alert("Tap detected " + dx + "," + dy);
    //     this.jump();
    //     return;
    // }
    // if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= SWIPE_THRESHOLD) {
    //     // Horizontal swipe
    //     if (dx < 0) {
    //         this.turn_left();
    //     } else {
    //         this.turn_right();
    //     }
    // }
}

game_scene.turn_left = function () {
    if (this.player.state === STATE_IDLE) {
        this.player.state = STATE_RUNNING;
        this.player.dir = DIR_NONE;
    }
    if (this.player.dir !== DIR_LEFT) {
        this.player.dir = DIR_LEFT;
        this.player.vx = -this.player.SPEED_X;
        this.player.setAnim(this.player.state | DIR_LEFT);
    }
}

game_scene.turn_right = function () {
    if (this.player.state === STATE_IDLE) {
        this.player.state = STATE_RUNNING;
        this.player.dir = DIR_NONE;
    }
    if (this.player.dir !== DIR_RIGHT) {
        this.player.dir = DIR_RIGHT;
        this.player.vx = this.player.SPEED_X;
        this.player.setAnim(this.player.state | DIR_RIGHT);
    }
}

game_scene.jump = function () {
    if (this.player.doubleJump) {
        return;
    }
    if (this.player.jumping) {
        this.player.vy = this.player.DOUBLE_JUMP_FORCE;
        this.player.doubleJump = true;
    } else {
        this.player.state = STATE_JUMPING;
        this.player.jumping = true;
        this.player.doubleJump = false;
        this.player.vy = this.player.JUMP_FORCE;
        this.player.vx = this.player.dir === DIR_LEFT ? -this.player.SPEED_X : this.player.SPEED_X;
        this.player.setAnim(STATE_JUMPING | this.player.dir);
    }
}

game_scene.idle = function () {
    this.player.vx = 0;
    this.player.state = STATE_IDLE;
    this.player.setAnim(STATE_IDLE | this.player.dir);
}

game_scene.set_state_game_over = function () {
    this.state = GAME_OVER;
    this.player.isVisible = false;
    this.burst.position(this.player.x - 16, this.player.y - 16);
    this.burst.setAnimation(this.BURST_ANIM_DESPAWN);
    this.burst.isVisible = true;
}