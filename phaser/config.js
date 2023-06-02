var width =  visualVars.rectSize*(visualVars.columnAmount + 2) +visualVars.backgroundWidthOffset
var height =  visualVars.rectSize*(visualVars.lineAmount + 2) + visualVars.backgroundHeightOffset

class Controller extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'controller' });

        this.inventoryOpen = false;
        this.pathfindOpen = false;
        this.combatOpen = false;

        this.keyI = null;
    }

    preload () {
        this.load.image('sky', 'phaser/assets/sky.png');
        this.load.image('ground', 'phaser/assets/platform.png');
        this.load.image('star', 'phaser/assets/star.png');
        this.load.image('bomb', 'phaser/assets/bomb.png');
        this.load.spritesheet('tilesets', 'phaser/assets/tilesets.png', { frameWidth: 32, frameHeight:32});
        this.load.spritesheet('tileset3', 'phaser/assets/tileset3.jpg', { frameWidth: 25, frameHeight: 25 });
    }

    create() {
        var sky = this.add.image(0, 0, 'sky');
        sky.setScale(2)
        this.scene.launch('combatScreen');
    }

    update() {        
    }

    createWindow (func, handle) {
        var x = 250
        var y = 100
        var win = this.add.zone(x, y, width, height+32).setInteractive().setOrigin(0);

        var screen = new func(handle, win);

        this.scene.add(handle, screen, true);
    }
}

var config = {
  type: Phaser.AUTO,
  width: visualVars.screenWidth,
  height: visualVars.screenHeight,
  backgroundColor: '#010101',
  parent: 'phaser-example',
  scene: [Controller, CombatScreen, UnitSelectionScreen],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
};

var game = new Phaser.Game(config);
