class CombatScreen extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;
        this.terrain
        this.backgroundRect
        this.selected
        this.spotsIlluminated = []
        this.spotsObj = {}
        this.characterObj = {}
    }
    
    create() {

	    let that = this
	    this.terrain = new Terrain()
	    
	    let backgroundRect = this.add.rectangle(0,0 ,this.terrain.width*terrainVars.tileSize, this.terrain.length*terrainVars.tileSize)
	    this.backgroundRect = backgroundRect
	    backgroundRect.setStrokeStyle(visualVars.rectLineThickness, visualVars.rectLineColor)
	    let spriteContainer = []
	    spriteContainer.push(backgroundRect)
	    for(let i = 0; i < this.terrain.width; i++) {
	    	for(let j = 0; j < this.terrain.length; j++) {
	    		let spot = database.getSpotByIJ(i,j);
				let widthPlacement = terrainVars.tileSize * i + terrainVars.tileSize/2 - backgroundRect.width/2
				let heightPlacement = terrainVars.tileSize * j + terrainVars.tileSize/2 - backgroundRect.height/2
				let tile = terrainVars.tile
	    		if(!spot.accessible) {
	    			tile = terrainVars.wall
	    		}
	    		var text = i + ','+j;
			    var style = { font: "10px Arial", fill: "#000000", align: "center" };

			    var t = this.add.text(widthPlacement, heightPlacement, text, style);
	    		let sprite = this.add.sprite(widthPlacement, heightPlacement, 'tilesets', tile);
	    		spriteContainer.push(sprite)
	    		spriteContainer.push(t)
	    		this.spotsObj[spot.id] = {
	    			spot: spot,
	    			obj: sprite,
	    		}
	    	}
	    }
	    

	    let terrainScreen = this.add.container(backgroundRect.width/2, backgroundRect.height/2, [...spriteContainer]);
	    terrainScreen.setSize(backgroundRect.width, backgroundRect.height)

	    this.cameras.main.setViewport(this.parent.x, this.parent.y+visualVars.windowGrabOffset, terrainScreen.width, terrainScreen.height);
	}

	moveSelectedToSpot(spot, that) {
		let character = database.getCharacter(that.selected)
		character.position = spot.id;
		let sprite = that.characterObj[character.id].obj;
		that.updateSpritePosition(sprite, spot, that);
	}

	hideSpotsInRange(that) {
		for(let spotIlluminated of that.spotsIlluminated) {
			let sprite = that.spotsObj[spotIlluminated.id].obj;
			sprite.clearTint()
		}
		that.spotIlluminated = []
	} 

	selectCharacter(character, sprite, that) {
		that.selected = character.id;
		sprite.tint = visualVars.selectedColor
		this.showSpotsInRange(character, that)
	}

	unselectCharacter(that) {
		that.selected = undefined
		that.hideSpotsInRange(that)
	}

	showSpotsInRange(character, that) {
		let spot = database.getSpotById(character.position)
		let spotsInRange = that.terrain.getSpotsInRange(spot, character.movementSpeed)
		that.hideSpotsInRange(that)
		that.spotsIlluminated = spotsInRange;
		for(let spotInRange of spotsInRange) {
			let sprite = that.spotsObj[spotInRange.id].obj;
			sprite.tint = visualVars.validColor
		}
	}

	updateSpritePosition(sprite, newSpot, that) {
	    let widthPlacement = terrainVars.tileSize * newSpot.i + terrainVars.tileSize/2 - that.backgroundRect.width/2
		let heightPlacement = terrainVars.tileSize * newSpot.j + terrainVars.tileSize/2 - that.backgroundRect.height/2
		sprite.x = widthPlacement
		sprite.y = heightPlacement
	}

	showHands() {
		
	}

	refresh() {

        this.cameras.main.setPosition(this.parent.x, this.parent.y+visualVars.windowGrabOffset);

        this.scene.bringToTop()
    }

}