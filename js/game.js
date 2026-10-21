/**
 * @author Victor Zegarra (Retromantis)
 * @date 18/11/2025
 */

game_scene = new MiScene();

game_scene.preload = function () {
    this.loadImage('bg', 'assets/images/game/bg.png');
    this.loadImage('player', 'assets/images/game/player.png');
    this.loadImage('shot', 'assets/images/game/shot.png');
    this.loadImage('bullet', 'assets/images/game/bullet.png');
    this.loadImage('head', 'assets/images/game/head.png');
    this.loadImage('get_ready', 'assets/images/game/get_ready.png');
    this.loadImage('try_again', 'assets/images/game/try_again.png');
}

game_scene.create = function () {
    this.screen = 0;
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);

    this.PLAYER_WDT = 40;
    this.PLAYER_HGT = 40;
    this.PLAYER_SPEED = 4;

    this.player = new MiSprite(this.getImage('player'), this.PLAYER_WDT, this.PLAYER_HGT);
    this.player.setCollider(10, 10, 22, 22);
    this.player.update = this.player_update;
    // this.player.bounds = { x1: 0, x2: GAME_WIDTH - this.player.width, y1: 0, y2: GAME_HEIGHT + this.player.height };
    this.player.bounds = { x1: 0, x2: GAME_WIDTH - this.player.width, y1: 40, y2: GAME_HEIGHT - this.player.height };
    this.player.setAnimation({ frames: [0, 1], delay: 1, loop: true });

    // this.player1.anims = {};
    // this.player1.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    // this.player1.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };
    // this.player1.anims[STATE_JUMPING | DIR_LEFT] = { frames: [4], delay: 0, loop: false };
    // this.player1.anims[STATE_JUMPING | DIR_RIGHT] = { frames: [6], delay: 0, loop: false }

    this.player.setAnim = function (id) {
        // this.setAnimation(this.anims[id]);
    }
    this.player.update = this.player_update;


    // this.player1.anims = {};
    // this.player1.anims[STATE_IDLE | DIR_LEFT] = { frames: [0, 1], delay: 8, loop: true };
    // this.player1.anims[STATE_IDLE | DIR_RIGHT] = { frames: [2, 3], delay: 8, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_LEFT] = { frames: [4, 5], delay: 1, loop: true };
    // this.player1.anims[STATE_RUNNING | DIR_RIGHT] = { frames: [6, 7], delay: 1, loop: true };
    // this.player1.anims[STATE_JUMPING | DIR_LEFT] = { frames: [4], delay: 0, loop: false };
    // this.player1.anims[STATE_JUMPING | DIR_RIGHT] = { frames: [6], delay: 0, loop: false };

    this.SHOT_WDT = 12;
    this.SHOT_HGT = 18;
    this.SHOT_SPEED = 8;

    this.BULLET_WDT = 14;
    this.BULLET_HGT = 14;
    this.BULLET_SPEED = 4;

    this.HEAD_WDT = 42;
    this.HEAD_HGT = 34;
    this.HEAD_SPEED = 4;

    this.add(this.player);

    this.enemies = [
        {
            delay: 50,
            type: 'head',
            x: 100,
            y: -40,
            vx: 0,
            vy: 0,
        },
        {
            delay: 150,
            type: 'head',
            x: 100,
            y: -40,
            vx: 0,
            vy: 0,
        },
        {
            delay: 40,
            type: 'head',
            x: 100,
            y: -40,
            vx: 0,
            vy: 0,
        },
        {
            delay: 80,
            type: 'head',
            x: 100,
            y: -40,
            vx: 0,
            vy: 0,
        },
        {
            delay: 50,
            type: 'head',
            x: 100,
            y: -40,
            vx: 0,
            vy: 0,
        },

    ];

    this.img_get_ready = new MiSprite(this.getImage('get_ready'), 200, 44);
    this.img_get_ready.position((GAME_WIDTH >> 1) - (this.img_get_ready.width >> 1), (GAME_HEIGHT >> 1) - (this.img_get_ready.height >> 1));
    this.img_get_ready.setAnimation({ frames: [0, -1, 0, -1, 0], delay: 2, loop: false });
    this.img_get_ready.update = function () {
        this.animate();
    }
    this.img_get_ready.onAnimationEnd = function () {
        console.log("get_ready animation ended");
        game_scene.state = GAME_PLAYING;
        this.isVisible = false;
    }
    this.add(this.img_get_ready);

    this.img_try_again = new MiImage(this.getImage('try_again'));
    this.img_try_again.position((GAME_WIDTH >> 1) - (this.img_try_again.width >> 1), (GAME_HEIGHT >> 1) - (this.img_try_again.height >> 1));
    this.add(this.img_try_again);
}

game_scene.start = function () {
    this.img_get_ready.isVisible = true;
    this.img_try_again.isVisible = false;
    bg_music.play();

    this.state = GAME_READY;

    this.player_init();

    this.bg_offset = -GAME_HEIGHT;
    this.img_bg.y = this.bg_offset;

    this.enemy_index = 0;

    this.next_enemy = this.get_next_enemy();
    //    /*   */this.add(this.spawn_head(this.next_enem/*  */y.x, this.next_enemy.y));
    this.enemies_spawned = [];
}

game_scene.player_init = function () {
    this.player.position(this.player.width, GAME_HEIGHT - (this.player.height * 2));

    this.img_bg.y = -GAME_HEIGHT;

    this.player.life = 3;
    this.player.isVisible = true;
}

game_scene.update = function () {
    this.super_update();

    if (this.state !== GAME_PLAYING) {
        return;
    }

    if (this.img_bg.y < 0) {
        this.img_bg.y += 1;
    } else {
        this.img_bg.y = -GAME_HEIGHT;
    }
    this.enemy_delay_counter--;
    // console.log("enemy_delay_counter: " + this.enemy_delay_counter);
    if (this.enemy_delay_counter <= 0) {
        // console.log("spawn_head: " + this.next_enemy.x + ", " + this.next_enemy.y);
        let px = random(GAME_WIDTH - this.HEAD_WDT);
        this.next_enemy.x = px;

        let enemy = this.spawn_head(this.next_enemy.x, this.next_enemy.y);
        this.enemies_spawned.push(enemy);
        this.add(enemy);
        this.next_enemy = this.get_next_enemy();
    }
}

game_scene.player_update = function () {
    this.animate();

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
    shot.vy = -this.SHOT_SPEED;
    shot.setAnimation({ frames: [0, 1, 2], delay: 0, loop: true });


    shot.setCollider(0, 0, game_scene.SHOT_WDT, game_scene.SHOT_HGT);
    return shot;
}

game_scene.update_shot = function () {
    if (game_scene.state !== GAME_PLAYING) {
        return;
    }

    this.move(this.vx, this.vy);
    this.animate();

    let enemies_count = game_scene.enemies_spawned.length;
    for (let i = 0; i < enemies_count; i++) {
        let enemy = game_scene.enemies_spawned[i];
        if (this.collidesWith(enemy)) {
            game_scene.remove(this);
            game_scene.remove(enemy);
            game_scene.enemies_spawned.splice(i, 1);
            break;
        }
    }

    if (this.y < this.bounds.y1) {
        game_scene.remove(this);
    }
}

game_scene.spawn_bullet = function (enemy) {
    let bullet = new MiSprite(this.getImage('bullet'), game_scene.BULLET_WDT, game_scene.BULLET_HGT);

    bullet.position(enemy.x + 20, enemy.y + 20);
    bullet.bounds = { x1: 0, x2: GAME_WIDTH, y1: 0, y2: GAME_HEIGHT };
    bullet.update = game_scene.update_bullet;
    bullet.setAnimation({ frames: [0, 1, 2], delay: 0, loop: true });
    bullet.setCollider(0, 0, game_scene.BULLET_WDT, game_scene.BULLET_HGT);

    let speed = get_bullet_speed(enemy, game_scene.player, this.BULLET_SPEED);
    bullet.vx = speed.vx;
    bullet.vy = speed.vy;

    return bullet;
}

game_scene.update_bullet = function () {
    if (game_scene.state !== GAME_PLAYING) {
        return;
    }

    this.move(this.vx, this.vy);
    this.animate();

    if (this.collidesWith(game_scene.player)) {
        game_scene.remove(this);
        game_scene.player.life--;
        if (game_scene.player.life <= 0) {
            game_scene.set_state_game_over();
        }
    }

    if (this.y > this.bounds.y2) {
        game_scene.remove(this);
    }
}

game_scene.spawn_head = function (x, y) {
    let head = new MiSprite(this.getImage('head'), game_scene.HEAD_WDT, game_scene.HEAD_HGT);

    head.position(x, y);
    head.bounds = { x1: 0, x2: GAME_WIDTH, y1: 0, y2: GAME_HEIGHT };
    head.update = game_scene.update_head;
    head.vx = 0;
    head.vy = this.HEAD_SPEED;
    head.setAnimation({ frames: [0, 1], delay: 4, loop: true });
    head.setCollider(0, 0, game_scene.HEAD_WDT, game_scene.HEAD_HGT);

    head.delay_bullet_counter = 20;

    return head;
}

game_scene.update_head = function () {
    if (game_scene.state !== GAME_PLAYING) {
        return;
    }

    this.move(this.vx, this.vy);
    this.animate();

    this.delay_bullet_counter--;
    if (this.delay_bullet_counter <= 0) {
        let px = this.x + (this.width >> 1) - (game_scene.BULLET_WDT >> 1);
        let py = this.y + this.height;
        game_scene.add(game_scene.spawn_bullet(this));
        this.delay_bullet_counter = 20;
    }

    if (this.y > this.bounds.y2) {
        game_scene.remove(this);
    }
}

game_scene.get_next_enemy = function () {
    let next_enemy = this.enemies[this.enemy_index];
    this.enemy_delay_counter = next_enemy.delay;
    this.enemy_index++;
    if (this.enemy_index >= this.enemies.length) {
        this.enemy_index = 0;
    }
    return next_enemy;
}

function get_bullet_speed(enemy, player, bulletSpeed) {
    // 1. Calcular la diferencia (vector dirección)
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;

    // 2. Calcular la distancia total usando el teorema de Pitágoras
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Evitar división por cero si están exactamente en la misma posición
    if (distance === 0) {
        return { vx: 0, vy: 0 };
    }

    // 3. Normalizar el vector (dividir por la distancia) y multiplicarlo por la velocidad
    const vx = (dx / distance) * bulletSpeed;
    const vy = (dy / distance) * bulletSpeed;

    return { vx, vy };
}

game_scene.set_state_game_over = function () {
    bg_music.pause();
    bg_music.currentTime = 0;


    this.state = GAME_OVER;
    // this.player.setAnimation({ frames: [0], delay: 0, loop: false });
    this.player.isVisible = false;
    this.img_try_again.isVisible = true;
}

game_scene.keyDown = function (event) {
    switch (this.state) {
        case GAME_PLAYING:
            this.handle_game_playing_keydown(event);
            break;
        case GAME_OVER:
            this.start();
            break;
    }
    // console.log(event.key + " " + event.code);
    // switch (event.code) {
    //     case "KeyA":
    //         this.player.key_left = true;
    //         break;
    //     case "ArrowLeft":
    //         this.player.key_left = true;
    //         break;
    //     case "KeyD":
    //         this.player.key_right = true;
    //         break;
    //     case "ArrowRight":
    //         this.player.key_right = true;
    //         break;
    //     case "KeyW":
    //         this.player.key_up = true;
    //         break;
    //     case "ArrowUp":
    //         this.player.key_up = true;
    //         break;
    //     case "KeyS":
    //         this.player.key_down = true;
    //         break;
    //     case "ArrowDown":
    //         this.player.key_down = true;
    //         break;
    //     case "KeyB":
    //     case "KeyI":
    //     case "Space":
    //         this.add(this.spawn_shot(this.player.x + (this.player.width >> 1) - (this.SHOT_WDT >> 1), this.player.y));
    //         break
    //     case "Numpad0":
    //     case "Numpad8":
    //     case "NumpadEnter":
    //         this.add(this.spawn_shot(this.player.x + (this.player.width >> 1) - (this.SHOT_WDT >> 1), this.player.y));
    //         break
    //     case "Escape":
    //         this.start();
    //         break
    // // }
}

game_scene.handle_game_playing_keydown = function (event) {
    switch (event.code) {
        case "KeyA":
            this.player.key_left = true;
            break;
        case "ArrowLeft":
            this.player.key_left = true;
            break;
        case "KeyD":
            this.player.key_right = true;
            break;
        case "ArrowRight":
            this.player.key_right = true;
            break;
        case "KeyW":
            this.player.key_up = true;
            break;
        case "ArrowUp":
            this.player.key_up = true;
            break;
        case "KeyS":
            this.player.key_down = true;
            break;
        case "ArrowDown":
            this.player.key_down = true;
            break;
        case "KeyB":
        case "KeyI":
        case "Space":
            this.add(this.spawn_shot(this.player.x + (this.player.width >> 1) - (this.SHOT_WDT >> 1), this.player.y));
            break
        case "Numpad0":
        case "Numpad8":
        case "NumpadEnter":
            this.add(this.spawn_shot(this.player.x + (this.player.width >> 1) - (this.SHOT_WDT >> 1), this.player.y));
            break
        case "Escape":
            this.start();
            break
    }
}

game_scene.keyUp = function (event) {
    switch (event.code) {
        case "KeyA":
            this.player.key_left = false;
            break;
        case "ArrowLeft":
            this.player.key_left = false;
            break;
        case "KeyD":
            this.player.key_right = false;
            break;
        case "ArrowRight":
            this.player.key_right = false;
            break;
        case "KeyW":
            this.player.key_up = false;
            break;
        case "ArrowUp":
            this.player.key_up = false;
            break;
        case "KeyS":
            this.player.key_down = false;
            break;
        case "ArrowDown":
            this.player.key_down = false;
            break;
        case "KeyS":
            this.player.key_down = false;
            break;
        case "ArrowDown":
            this.player.key_down = false;
            break;
    }
}

game_scene.touchStart = function (x, y) {
    switch (this.state) {
        case GAME_PLAYING:
            this.add(this.spawn_shot(this.player.x + (this.player.width >> 1) - (this.SHOT_WDT >> 1), this.player.y));
            break;
        case GAME_OVER:
            this.start();
            break;
    }
    // this.startX = x;
    // this.startY = y;
}

game_scene.touchEnd = function (x, y) {
    // const SWIPE_THRESHOLD = 10; // píxeles mínimos para considerar swipe
    // const dx = x - this.startX;
    // const dy = y - this.startY;

    // if (x === this.startX && y === this.startY) {
    //     this.jump();
    // } else if (Math.abs(dx) > Math.abs(dy)) {
    //     if (dx < 0) {
    //         this.turn_left();
    //     } else {
    //         this.turn_right();
    //     }
    // } else {
    //     if (dy < 0) {
    //         this.jump();
    //     } else {
    //         this.idle();
    //     }
    // }
}

game_scene.turn_left = function () {
}

game_scene.turn_right = function () {
}

game_scene.jump = function () {
}

game_scene.idle = function () {
}