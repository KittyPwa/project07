class UnitSelectionScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'UnitSelectionScreen' });
  }

  create() {
    // Create a container to hold the text windows
    const container = this.add.container(0, 0);

    // Create the left text window
    const leftText = this.createTextWindow("Left Window", "left");
    container.add(leftText);

    // Create the middle text window
    const middleText = this.createTextWindow("Middle Window", "center");
    container.add(middleText);

    // Create the right text window
    const rightText = this.createTextWindow("Right Window", "right");
    container.add(rightText);

    // Set the positions of the text windows
    const padding = 50;
    const windowWidth = leftText.width;
    const windowHeight = leftText.height;
    const totalWidth = windowWidth * 3 + padding * 2;
    const startX = (this.game.config.width - totalWidth) / 2;
    const startY = (this.game.config.height - windowHeight) / 2;
    leftText.setPosition(startX, startY);
    middleText.setPosition(startX + windowWidth + padding, startY);
    rightText.setPosition(startX + windowWidth * 2 + padding * 2, startY);

    // Make the text windows clickable
    leftText.setInteractive();
    middleText.setInteractive();
    rightText.setInteractive();

    // Set up event listeners for click events
    leftText.on("pointerdown", () => {
      console.log("Left Window clicked!");
    });

    middleText.on("pointerdown", () => {
      console.log("Middle Window clicked!");
    });

    rightText.on("pointerdown", () => {
      console.log("Right Window clicked!");
    });
  }

  createTextWindow(text, align) {
    const windowWidth = 200;
    const windowHeight = 100;
    const windowColor = 0xCCCCCC;
    const windowAlpha = 0.8;

    const graphics = this.add.graphics();
    graphics.fillStyle(windowColor, windowAlpha);
    graphics.fillRect(0, 0, windowWidth, windowHeight);

    const textObject = this.add.text(0, 0, text, {
      fontFamily: "Arial",
      fontSize: 16,
      color: "#000000"
    });
    textObject.setOrigin(0.5);
    textObject.setPosition(windowWidth / 2, windowHeight / 2);

    if (align === "left") {
      textObject.setOrigin(0, 0.5);
    } else if (align === "center") {
      textObject.setOrigin(0.5);
    } else if (align === "right") {
      textObject.setOrigin(1, 0.5);
    }

    const container = this.add.container(0, 0);
    container.add(graphics);
    container.add(textObject);

    return container;
  }
}
