class CombatScreen extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;
        this.backgroundRect
        this.selected
        this.spotsIlluminated = []
        this.spotsObj = {}
        this.terrainObj = {}
        this.characterObj = {}
        this.terrainScreen
        this.backgrounds = []
        this.tileWidthOffset = 1
        this.tileHeightOffset = 1
    }
    
    create() {

	    let that = this

	    let terrains = []
	    let allyTerrain = new Terrain()
	    allyTerrain.updateTerrain({
	    	allegiance: allegianceVars.ally,
	    	width: terrainVars.rowAmount,
	    	height: terrainVars.collumnAmount
	    })
	    allyTerrain.updateSpots()
	    terrains.push(allyTerrain)

	    let foeTerrain = new Terrain()
	    foeTerrain.updateTerrain({
	    	allegiance: allegianceVars.foe,
	    	width: terrainVars.rowAmount,
	    	height: terrainVars.collumnAmount
	    })	    
	    foeTerrain.updateSpots()	    
	    terrains.push(foeTerrain)

	    let characters = []
	    let unit = new Unit()
	    unit.updateUnit({
	    	name: 'Unit1',
	    	allegiance: allegianceVars.ally,
	    	position: database.getSpotByIJ(0,0, allyTerrain.id).id,
	    	health: 3,
	    	spriteInfos: {
				spriteName:null,
				spriteSheet: 'tilesets',
				spriteNumber:129
			},
	    	unitType: unitTypeVars.full
	    })
	    characters.push(unit)

	    let unit2 = new Unit()
	    unit2.updateUnit({
	    	name: 'Unit2',
	    	allegiance: allegianceVars.ally,
	    	position: database.getSpotByIJ(0,1, allyTerrain.id).id,
	    	health: 4,
	    	spriteInfos: {
				spriteName:null,
				spriteSheet: 'tilesets',
				spriteNumber:130
			},
	    	unitType: unitTypeVars.full

	    })
	    characters.push(unit2)

	    let unit3 = new Unit()
	    unit3.updateUnit({
	    	name: 'Unit3',
	    	allegiance: allegianceVars.foe,
	    	position: database.getSpotByIJ(0,0, foeTerrain.id).id,
	    	health: 4,
	    	spriteInfos: {
	    		spriteName: null,
	    		spriteSheet: 'tilesets',
	    		spriteNumber: 131
	    	},
	    	unitType: unitTypeVars.full
	    })
	    characters.push(unit3)

	    let tileOffset = {
	    	tileWidthOffset: 0,
	    	tileHeightOffset: 0
	    }
	    let spriteContainer = []	   

	    let width = 0
	    let height = 0	   

	    for(let terrain of terrains) {	 
	    	width += terrain.width;
	    	if(height < terrain.height)
	    		height = terrain.height
 	    } 	    
 	    

 	    let background = {
 	    	width: width,
 	    	height:height
 	    } 	     	

 	    let backgroundRect = that.add.rectangle(0,0 ,background.width*2*terrainVars.tileSize, background.height*2*terrainVars.tileSize)
	    that.backgroundRect = backgroundRect
	    backgroundRect.setStrokeStyle(visualVars.rectLineThickness, visualVars.rectLineColor)	   


	     for(let terrain of terrains) {	    	
	    	spriteContainer = [...spriteContainer, ...that.initializeTerrain(terrain, backgroundRect, tileOffset, that)]
	    	tileOffset.tileWidthOffset = terrain.width	    	
	    }

	    spriteContainer.push(backgroundRect)	    

	    let characterContainer = this.intializeCharacters(characters, height, this)

 	    this.terrainScreen = that.add.container(0,0, [...spriteContainer, ...characterContainer]);

	    this.terrainScreen.setSize(backgroundRect.width, backgroundRect.height)	

	    this.cameras.main.setViewport(this.parent.x, this.parent.y+visualVars.windowGrabOffset, this.terrainScreen.width, this.terrainScreen.height);
	}

	initializeTerrain(terrain, background, tileOffset, that) {	
	    let spriteContainer = []
	    that.terrainObj[terrain.id] = {
	    	terrain: terrain,
	    	tileOffset: JSON.parse(JSON.stringify(tileOffset))
	    }
	    for(let i = 0; i < terrain.width; i++) {
	    	for(let j = 0; j < terrain.height; j++) {
	    		let spot = database.getSpotByIJ(i,j, terrain.id);
				let widthPlacement = terrainVars.tileSize * (i + tileOffset.tileWidthOffset + 1/2)
				let heightPlacement = terrainVars.tileSize * (j + tileOffset.tileHeightOffset + 1/2)
				let tile = terrainVars.tile	    		
	    		var text = i + ','+j;
			    var style = { font: "10px Arial", fill: "#000000", align: "center" };

			    var t = that.add.text(widthPlacement, heightPlacement, text, style);
	    		let sprite = that.add.sprite(widthPlacement, heightPlacement, 'tilesets', tile);
	    		spriteContainer.push(sprite)
	    		spriteContainer.push(t)
	    		that.spotsObj[spot.id] = {
	    			spot: spot,
	    			obj: sprite,
	    			tileOffset: JSON.parse(JSON.stringify(tileOffset))
	    		}
	    	}
	    }

	    let spots = terrain.terrain
	    for(let spotIs of spots) {
	    	for(let spotId of spotIs) {
		    	let spot = database.getSpot(spotId)
		    	let sprite = that.spotsObj[spot.id].obj;
		    	sprite.setInteractive()

		    	sprite.on('pointerdown', function() {
		    		let character = database.getUnit(that.selected)  
		    		if(character && character.allegiance == terrain.allegiance && spot.isAvailable()) {		    			
		    			that.moveSelectedToSpot(spot, that.spotsObj[spot.id].tileOffset, that)	    			
		    		}
		    	})
	    	}
	    	
	    }
	    return spriteContainer
	}

	intializeCharacters(characters, background, that) {
		let characterContainer = []

	    for(let character of characters) {
	    	let spot = database.getSpot(character.position);
	    	let tileOffset = that.terrainObj[spot.terrain]['tileOffset']
	    	let widthPlacement =  terrainVars.tileSize * (spot.i + tileOffset.tileWidthOffset + 1/2)
			let heightPlacement =  terrainVars.tileSize * (spot.j + tileOffset.tileHeightOffset + 1/2)
	    	let sprite = that.add.sprite(widthPlacement, heightPlacement, character.spriteInfos.spriteSheet, character.spriteInfos.spriteNumber);
	    	characterContainer.push(sprite)
    		that.characterObj[character.id] = {
    			character: character,
    			obj: sprite,
    		}
	    }	    
	        

	    for(let character of Object.values(that.characterObj)) {
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
	    return characterContainer
	}

	moveSelectedToSpot(spot, tileOffset, that) {
		let character = database.getUnit(that.selected)
		character.updateUnit({position: spot.id})		
		let sprite = that.characterObj[character.id].obj;
		that.updateSpritePosition(sprite, spot, tileOffset, that);
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
		that.showSpotsAvailable(character, that)
	}

	unselectCharacter(that, sprite) {
		that.selected = undefined
		sprite.clearTint()
		that.hideIlluminatedSpots(that)
	}

	showSpotsAvailable(character, that) {
		let spot = database.getSpot(character.position)
		let terrain = database.getTerrain(spot.terrain)
		let spotsAvailable = terrain.getAvailableSpots()
		that.hideIlluminatedSpots(that)
		that.spotsIlluminated = spotsAvailable;
		for(let spotAvailable of spotsAvailable) {
			let sprite = that.spotsObj[spotAvailable.id].obj;
			sprite.tint = visualVars.validColor
		}
	}

	updateSpritePosition(sprite, newSpot, tileOffset, that) {
	    let widthPlacement = terrainVars.tileSize * (newSpot.i + tileOffset.tileWidthOffset + 1/2)
		let heightPlacement = terrainVars.tileSize * (newSpot.j + tileOffset.tileHeightOffset + 1/2)
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