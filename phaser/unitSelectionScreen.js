class UnitSelectionScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'unitSelectionScreen' });
  }

  create() {
    console.log('here')
    // Create and position the three text windows
    const leftTextWindow = this.add.text(100, 200, 'Left Text Window', {
      color: '#ffffff',
      fontSize: '24px',
    });

    const middleTextWindow = this.add.text(400, 200, 'Middle Text Window', {
      color: '#ffffff',
      fontSize: '24px',
    });

    const rightTextWindow = this.add.text(700, 200, 'Right Text Window', {
      color: '#ffffff',
      fontSize: '24px',
    });

    // Make the text windows clickable
    leftTextWindow.setInteractive();
    middleTextWindow.setInteractive();
    rightTextWindow.setInteractive();

    leftTextWindow.on('pointerdown', () => {
      console.log('Left Text Window Clicked');
    });

    middleTextWindow.on('pointerdown', () => {
      console.log('Middle Text Window Clicked');
    });

    rightTextWindow.on('pointerdown', () => {
      console.log('Right Text Window Clicked');
    });
  }
}