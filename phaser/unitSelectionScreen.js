class UnitSelectionScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'unitSelectionScreen' });
    this.leftTextWindow
    this.middleTextWindow
    this.rightTextWindow
  }

  create() {
    // Create and position the three text windows
    let randomUnitBases = getNUnitBases(3, allegianceVars.ally);
    let units = [];
    for (let randomUnitBase of randomUnitBases) {
      let newUnit = new Unit();
      newUnit.updateUnit(randomUnitBase);
      units.push(newUnit);
    }
    units = shuffleArray(units)
    let style = { font: "10px Arial", fill: "#000000", align: "center" };

    // Create rectangles for each text window
    const leftRect = this.add.rectangle(150, 200, 125, 100, 0xCCCCCC);
    const middleRect = this.add.rectangle(300, 200, 125, 100, 0xCCCCCC);
    const rightRect = this.add.rectangle(450, 200, 125, 100, 0xCCCCCC);

    // Create text windows inside the rectangles
    this.leftTextWindow = this.add.text(150, 200, units[0].getDescription(), style);
    this.middleTextWindow = this.add.text(300, 200, units[1].getDescription(), style);
    this.rightTextWindow = this.add.text(450, 200, units[2].getDescription(), style);

    // Disable input on text windows
    this.leftTextWindow.disableInteractive();
    this.middleTextWindow.disableInteractive();
    this.rightTextWindow.disableInteractive();

    // Make the rectangles clickable
    leftRect.setInteractive();
    middleRect.setInteractive();
    rightRect.setInteractive();
    
    for(let unit of units) {
        unit.purge()       
      }    


    // Set text windows' origin to center
    this.leftTextWindow.setOrigin(0.5);
    this.middleTextWindow.setOrigin(0.5);
    this.rightTextWindow.setOrigin(0.5);

    let that = this
    leftRect.on('pointerdown', () => {
      that.createNewUnit(units[0])      
      // Handle left text window click
    });

    middleRect.on('pointerdown', () => {
      that.createNewUnit(units[1])
    });

    rightRect.on('pointerdown', () => {
      that.createNewUnit(units[2])
    });
  }

  createNewUnit(unitBase) {
    delete unitBase.id
    let unit = new Unit()      
    unit.updateUnit(unitBase)    
    this.scene.stop('unitSelectionScreen')
  }

  goToCombat() {
    this.scene.launch('combatScreen');
  }
}
