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
    game.startScene('game');
}

menu_scene.touchStart = function (x, y) {
    game.startScene('game');
}