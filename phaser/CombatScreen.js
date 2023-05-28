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
	    
	    let backgroundRect = this.add.rectangle(0,0 ,this.terrain.height*terrainVars.tileSize, this.terrain.width*terrainVars.tileSize)
	    this.backgroundRect = backgroundRect
	    backgroundRect.setStrokeStyle(visualVars.rectLineThickness, visualVars.rectLineColor)
	    let spriteContainer = []
	    spriteContainer.push(backgroundRect)
	    for(let i = 0; i < this.terrain.height; i++) {
	    	for(let j = 0; j < this.terrain.width; j++) {
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

	    let characters = []
	    let unit = new Unit()
	    unit.updateUnit({
	    	name: 'Unit1',
	    	allegiance: allegianceVars.ally,
	    	position: database.getSpotByIJ(0,0).id,
	    	health: 3,
	    	spriteInfos: {
				spriteName:null,
				spriteSheet: 'tilesets',
				spriteNumber:129
			},
	    	unit: unit.id
	    })
	    characters.push(unit)
	    let unit2 = new Unit()
	    unit2.updateUnit({
	    	name: 'Unit2',
	    	allegiance: allegianceVars.ally,
	    	position: database.getSpotByIJ(0,1).id,
	    	health: 4,
	    	spriteInfos: {
				spriteName:null,
				spriteSheet: 'tilesets',
				spriteNumber:130
			},
	    	unit: unit.id
	    })
	    characters.push(unit2)

	    let characterContainer = []

	    for(let character of characters) {
	    	let spot = database.getSpot(character.position);
	    	let widthPlacement = terrainVars.tileSize * spot.i + terrainVars.tileSize/2 - backgroundRect.width/2
			let heightPlacement = terrainVars.tileSize * spot.j + terrainVars.tileSize/2 - backgroundRect.height/2
	    	let sprite = this.add.sprite(widthPlacement, heightPlacement, character.spriteInfos.spriteSheet, character.spriteInfos.spriteNumber);
	    	characterContainer.push(sprite)
    		this.characterObj[character.id] = {
    			character: character,
    			obj: sprite,
    		}
	    }
	    

	    let terrainScreen = this.add.container(backgroundRect.width/2, backgroundRect.height/2, [...spriteContainer, ...characterContainer]);
	    terrainScreen.setSize(backgroundRect.width, backgroundRect.height)	    

	    for(let character of Object.values(this.characterObj)) {
	    	let sprite = character.obj	    	
	    	character = character.character
	    	sprite.setInteractive()
	    	if(character.allegiance == allegianceVars.ally) {
	    		sprite.on('pointerdown', function() {
		    		if(!that.selected) {
		    			that.selectCharacter(character, sprite, that)
		    		} else {
		    			if(that.selected != character.id) {
		    				that.unselectCharacter(that, that.characterObj[that.selected].obj)
		    				that.selectCharacter(character, sprite, that)
		    			} else {
		    				that.unselectCharacter(that, sprite)
		    			}
		    		}
		    	})
	    	}
	    }

	    for(let spot of Object.values(this.spotsObj)) {
	    	let sprite = spot.obj;
	    	spot = spot.spot
	    	sprite.setInteractive()

	    	sprite.on('pointerdown', function() {
	    		let character = database.getUnit(that.selected)    		
	    		if(spot.isAvailable()) {
	    			that.moveSelectedToSpot(spot, that)	    			
	    		}
	    	})
	    }

	    this.cameras.main.setViewport(this.parent.x, this.parent.y+visualVars.windowGrabOffset, terrainScreen.width, terrainScreen.height);
	}

	moveSelectedToSpot(spot, that) {
		let character = database.getUnit(that.selected)
		character.updateUnit({position: spot.id})		
		let sprite = that.characterObj[character.id].obj;
		that.updateSpritePosition(sprite, spot, that);
		that.showSpotsAvailable(character, that)
	}

	hideIlluminatedSpots(that) {
		for(let spotIlluminated of that.spotsIlluminated) {
			let sprite = that.spotsObj[spotIlluminated.id].obj;
			sprite.clearTint()
		}
		that.spotIlluminated = []
	} 

	selectCharacter(character, sprite, that) {
		that.selected = character.id;
		sprite.tint = visualVars.selectedColor
		this.showSpotsAvailable(character, that)
	}

	unselectCharacter(that, sprite) {
		that.selected = undefined
		sprite.clearTint()
		that.hideIlluminatedSpots(that)
	}

	showSpotsAvailable(character, that) {
		let spot = database.getSpotByIJ(character.position)
		let spotsAvailable = that.terrain.getAvailableSpots()
		that.hideIlluminatedSpots(that)
		that.spotsIlluminated = spotsAvailable;
		for(let spotAvailable of spotsAvailable) {
			let sprite = that.spotsObj[spotAvailable.id].obj;
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