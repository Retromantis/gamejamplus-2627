/**
 * @author Victor Zegarra (Retromantis)
 * @date 18/11/2025
 */

menu_scene = new MiScene();

menu_scene.preload = function () {
    this.loadImage('bg', 'assets/images/menu/bg.png');
}

menu_scene.create = function () {
    this.img_bg = new MiImage(this.getImage('bg'));
    this.add(this.img_bg);
}

menu_scene.keyDown = function (event) {
    this.start_scene();
}

menu_scene.touchStart = function (x, y) {
    this.start_scene();
}

menu_scene.start_scene = function () {
    bg_music.pause();
    bg_music.currentTime = 0;
    game.startScene('game');
}