class CombatScreen extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'combatScreen' });

        this.parent = parent;
        this.backgroundRect
        this.selected
        this.spotsIlluminated = []
        this.spotsObj = {}
        this.terrainObj = {}
        this.characterObj = {}
        this.terrainScreen
        this.backgroundRect
        this.tileWidthOffset = 1
        this.tileHeightOffset = 1
        this.keyT = null
        this.keyS = null
        this.textObject
        this.infoBox
        this.characterContainer
    }
    
    create() {
    	this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    	this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    	this.combatManager = new CombatManager()
    	this.combatManager.updateCombatManager({
    		turn: 1
    	})

    	//this.createWindow(UnitSelectionScreen, 'unitSelectionScreen')
    	// Create a container for the text box
		const textBox = this.add.container(300, 0);

		// Create a graphics object to draw the box
		const box = this.add.graphics();
		const boxWidth = 200;
		const boxHeight = 500;
		const boxColor = 0xCCCCCC;
		const boxAlpha = 0.8;
		box.fillStyle(boxColor, boxAlpha);
		box.fillRect(0, 0, boxWidth, boxHeight);

		// Add the box to the container
		textBox.add(box);

		// Create the text object and position it within the box
		this.textObject = this.add.text(0, 0, language.temp.pressT, {
		  fontFamily: "Arial",
		  fontSize: 10,
		  color: "#000000"
		});

		// Center the text within the box
		this.textObject.setPosition(0, 0);

		// Add the text to the container
		textBox.add(this.textObject);


	    let that = this

	    let terrains = Object.values(database.getTerrains())	    

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

 	    this.backgroundRect = that.add.rectangle(0,0 ,background.width*2*terrainVars.tileSize, background.height*2*terrainVars.tileSize)      

	     for(let terrain of terrains) {	    	
	    	spriteContainer = [...spriteContainer, ...that.initializeTerrain(terrain, this.backgroundRect, tileOffset, that)]
	    	tileOffset.tileWidthOffset = terrain.width	    	
	    }


 	    this.terrainScreen = that.add.container(terrainVars.widthOffset,terrainVars.heightOffset, [...spriteContainer]); 	    

	    this.terrainScreen.setSize(this.backgroundRect.width, this.backgroundRect.height)

	    this.add.existing(this.terrainScreen)

	    let roots = new Unit()
	    roots.updateUnit(unitBase.general.roots)

	    let dam = new Unit()
	    dam.updateUnit(unitBase.general.dam)
	    this.selectFoes(3)
	    this.selectNewCharacters(1,3)

	    this.characterContainer = this.intializeCharacters([roots, dam], this)		    	    

	    this.terrainScreen.add(this.characterContainer)   
	}

	selectFoes(amount) {
		let units = []
		for(let i = 0; i < amount; i++) {
    		let randomUnitBases = getNUnitBases(1, allegianceVars.foe);
    		let unit = new Unit()
			unit.updateUnit(randomUnitBases[0]);
      		units.push(unit);
		}

		this.updateCharacters();		
	}

	selectNewCharacter() {
		this.selectNewCharacters(1,1)
	}

	selectNewCharacters(i, total) {	
		this.scene.launch('unitSelectionScreen');
	  	this.scene.bringToTop('unitSelectionScreen');

	  	this.scene.get('unitSelectionScreen').events.once('shutdown', () => {
			this.updateCharacters();
			if(i < total) {
				i++
				this.selectNewCharacters(i, total)
			}
		});
	}

	updateCharacters() {
	    let terrains = Object.values(database.getTerrains())	    

		let characters = Object.values(database.getUnits())	
		characters = characters.filter((a) => {
			return a.position == null
		})
		for(let character of characters) {
			character.updateUnit({
				position: database.getRandomAvailableSpot(database.getTerrainByAllegiance(character.allegiance).id, character.unitType).id  
			})
		}							    

	    let newContainer = this.intializeCharacters(characters, this)

	    this.terrainScreen.add(newContainer)	    
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
				let tile
				switch (spot.spotType) {
					case tileTypeVars.support:
						tile = terrainVars.supportTile
						break;
					case tileTypeVars.roots:
						tile = terrainVars.rootTile
						break;
					case tileTypeVars.dam:
						tile = terrainVars.damTile;
						break;
					default:
						tile = terrainVars.fullTile
				}		
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
		    	sprite.setDepth(2)

		    	sprite.on('pointerdown', function() {
		    		let character = database.getUnit(that.selected)  
		    		if(character && character.allegiance == terrain.allegiance) {
		    			if(spot.isAvailable(character.unitType)) {
		    				that.moveSelectedToSpot(spot, that.spotsObj[spot.id].tileOffset, that)
		    				that.unselectCharacter(that, that.characterObj[that.selected].obj)
		    			}
		    		}
		    	})
	    	}
	    	
	    }
	    return spriteContainer
	}

	intializeCharacters(characters, that) {
		let characterContainer = []

	    for(let character of characters) {
	    	if(character.position) {
		    	let spots = [database.getSpot(character.position)]	    	
		    	if(character.additionalPositions != null) {
		    		for(let additionalPosition of character.additionalPositions) {
		    			spots.push(database.getSpot(additionalPosition))
		    		}
		    	}
		    	for(let spot of spots) {
			    	let tileOffset = that.terrainObj[spot.terrain]['tileOffset']
			    	let widthPlacement =  terrainVars.tileSize * (spot.i + tileOffset.tileWidthOffset + 1/2)
					let heightPlacement =  terrainVars.tileSize * (spot.j + tileOffset.tileHeightOffset + 1/2)
			    	let sprite = that.add.sprite(widthPlacement, heightPlacement, character.spriteInfos.spriteSheet, character.spriteInfos.spriteNumber);
			    	let healthBar = null
			    	if(!spot.isAdditionSpot() && spot.spotType != terrainVars.support) {
			    		let heightOffset = terrainVars.tileSize * ((character.additionalPositions != null ? (character.additionalPositions.length / 2) +1: 1))

				    	healthBar = new HealthBar(
					        that,
					        widthPlacement - terrainVars.tileSize*0.5,
					        heightPlacement - heightOffset,
					        terrainVars.tileSize - 3,
					        5,
					        character.health
					      );			    	
				     	 characterContainer.push(sprite, healthBar);
			     	} else {
			     		characterContainer.push(sprite)
			     	}

			    	if(that.characterObj[character.id] != undefined){
		    			that.characterObj[character.id]['obj'].push(sprite) 
			    	}
		    		else {
		    			that.characterObj[character.id] = {
		    				character: character,
		    				obj: [sprite],
		    			}
		    			if(healthBar != null) {
		    				that.characterObj[character.id]['healthBar'] = healthBar
		    			}
		    		}
		    	}
		    }
	    }	    
	        
	    for(let charac of characters) {
	    	let character = that.characterObj[charac.id]
	    	let sprites = character.obj	    	
	    	character = character.character
	    	for(let sprite of sprites){
		    	sprite.setInteractive()
		    	if(character.allegiance == allegianceVars.ally && character.unitType != unitTypeVars.general) {
		    		sprite.on('pointerdown', function() {	
			    		if(!that.selected) {
			    			that.selectCharacter(character, sprite, that)
			    		} else {
			    			if(that.selected != character.id) {
			    				that.unselectCharacter(that, that.characterObj[that.selected].obj)
			    				that.selectCharacter(character, sprite, that)
			    			} else {
			    				that.unselectCharacter(that, [sprite])
			    			}
			    		}
			    	})		    	
		    	}
		    	sprite.setDepth(3)
		    	sprite.on('pointerover', function(pointer, pointerX, pointerY) {
		    		sprite.on('pointermove', function(pointer, pointerX, pointerY){
				            let placement = {
				                x: pointer.x,
				                y: pointer.y,
				                pointerX: pointerX,
				                pointerY: pointerY
				            }
				            if(that.infoBox){
				            	that.infoBox.destroy()
				            }
				            that.infoBox = that.createInfoBox(character.id, placement, that)
				        })
			        })

		        sprite.on('pointerout', function () {
		        	if(that.infoBox)
		            	that.infoBox.destroy()
		        });
		    }
		}
	    return characterContainer
	}

	moveSelectedToSpot(spot, tileOffset, that) {
		let character = database.getUnit(that.selected)
		character.updateUnit({position: spot.id})		
		let sprite = that.characterObj[character.id].obj[0];
		let healthBar = that.characterObj[character.id]['healthBar']
		that.updateSpritePosition(sprite, healthBar, spot, tileOffset, that);
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

	unselectCharacter(that, sprites) {
		that.selected = undefined
		for(let sprite of sprites) {
			sprite.clearTint()
		}
		that.hideIlluminatedSpots(that)
	}

	showSpotsAvailable(character, that) {		
		let spot = database.getSpot(character.position)
		let terrain = database.getTerrain(spot.terrain)
		let spotsAvailable = terrain.getAvailableSpots(character.id)
		that.hideIlluminatedSpots(that)
		that.spotsIlluminated = spotsAvailable;
		for(let spotAvailable of spotsAvailable) {
			let sprite = that.spotsObj[spotAvailable.id].obj;
			sprite.tint = visualVars.validColor
		}
	}

	updateSpritePosition(sprite, healthBar, newSpot, tileOffset, that) {
	    let widthPlacement = terrainVars.tileSize * (newSpot.i + tileOffset.tileWidthOffset + 1/2)
		let heightPlacement = terrainVars.tileSize * (newSpot.j + tileOffset.tileHeightOffset + 1/2)
		healthBar.updatePosition(widthPlacement - terrainVars.tileSize*0.5, heightPlacement - terrainVars.tileSize)
		sprite.x = widthPlacement
		sprite.y = heightPlacement
	}

	destroySprite(sprite) {
		sprite.destroy()
	}

	createInfoBox(unitId, placement, that) {				
        let x = placement.x 
        let y = placement.y
        let unit = database.getUnit(unitId)
        let text = unit.getDescription();                
        var style = { font: "12px Arial", fill: "#FFFFFF", align: "center", color: "white" };
        var t = that.add.text(x,y, text, style);
        t.x = x - this.parent.x - terrainVars.widthOffset
        t.y = y - (this.parent.y + visualVars.windowGrabOffset + terrainVars.tileSize*2 + terrainVars.heightOffset/3)
        t.x = 125
        t.y = 350
        t.setDepth(4)
        return t
    }

	update() {
		let units = database.getUnits()
		let terrains = database.getTerrains()
		let combatManagerData = {
	    	units: Object.keys(units),
	    	terrains: Object.keys(terrains),
	    }
	    this.combatManager.updateCombatManager(combatManagerData)
		if (Phaser.Input.Keyboard.JustDown(this.keyT)) {
			if(this.selected) {
				this.unselectCharacter(this, this.characterObj[this.selected].obj)
			}	
			let generals = database.getGenerals()			
			generals = generals.filter((a) => {
				return a.isAlive()
			})
			if(generals.length == 2){
				this.combatManager.executeTurn()
				this.textObject.setText(database.getLogger().getLogs())
			} else {
				let toKill = database.getUnitsByAllegiance(oppositeAllegianceVars[generals[0].allegiance])
				for(let unit of toKill) {
					unit.die()
				}
			}
		this.updateVisuals()
		}
	}

	updateVisuals() {
		let keys = JSON.parse(JSON.stringify(Object.keys(this.characterObj)))
		for(let key of keys) {		
			let unit = this.characterObj[key]
			unit.character = database.getUnit(key)
			if(unit.healthBar)
				unit.healthBar.setHealth(unit.character.health)
			if(!unit.character.isAlive()) {
				for(let sprite of unit.obj){
					this.destroySprite(sprite)
				}
				if(unit.healthBar)
					this.destroySprite(unit.healthBar)
				delete this.characterObj[unit.character.id]
				unit.character.purge()
			}
		}
		let newUnits = database.getNewUnits()
		if(newUnits.length > 0) {
			let characterContainer = this.intializeCharacters(database.getNewUnits(), this)
			this.terrainScreen = this.add.container(terrainVars.widthOffset,terrainVars.heightOffset, [...characterContainer]);
		}
	}

	refresh() {

        this.cameras.main.setPosition(this.parent.x, this.parent.y+visualVars.windowGrabOffset);

        this.scene.bringToTop()
    }

}