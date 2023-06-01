class HealthBar extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, health) {
    super(scene, x, y);

    this.width = width;
    this.height = height;

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x880000) // Dark red background color
      .setOrigin(0);

    this.bar = scene.add
      .rectangle(0, 0, width, height, 0xff0000) // Red bar color
      .setOrigin(0);

    this.setDepth(4)

    // Set the transparency of the bar
    this.bar.alpha = 0.5;

    this.add([this.background, this.bar]);

    this.maxHealth = health
    // Set the initial health value
    this.setHealth(health);


    scene.add.existing(this);
  }

  setHealth(health) {
    // Update the width of the bar based on the health value
    this.bar.width = this.width * (health/this.maxHealth);

    // Position the bar relative to the background
    this.bar.x = this.background.x;
    this.bar.y = this.background.y;
  }

  updatePosition(x,y) {
    this.x = x
    this.y = y
  }
}