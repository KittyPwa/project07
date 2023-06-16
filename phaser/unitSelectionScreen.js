class UnitSelectionScreen extends Phaser.Scene {
  constructor() {
    super({ key: 'unitSelectionScreen' });
  }

  create(units) {
    // Create and position the three text windows    
    let style = { font: "10px Arial", fill: "#000000", align: "center" };

    // Create rectangles for each text window
    let startX = 150
    let y = 200
    let rectWidth = 125
    let rectHeight = 100
    let xJump = 150
    let that = this
    for(let unit of units) {
      let rect = this.add.rectangle(startX, y - 5, rectWidth, rectHeight, 0xCCCCCC)
      let wind = this.add.text(startX, y, unit.getDescription(), style)
      startX += xJump
      wind.disableInteractive()
      wind.setOrigin(0.5);
      rect.setInteractive()
      rect.on('pointerdown', () => {
        that.createNewUnit(unit)
      })
    }    
    
    for(let unit of units) {
        unit.purge()       
      }    
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
