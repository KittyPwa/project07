
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
        this.gameState
        this.distinguishUnit = false
        this.canLaunchTurn = false
    }
    
    create() {
    	this.keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    	this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    	this.combatManager = new CombatManager()   
        this.animationManager = new AnimationManager() 
        this.animationManager.updateAnimationManager({
        	combatScreen: this,
        })
    	this.gameState = database.getGameState()
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
	    this.selectFirstFoes(3)
	    this.selectNewCharacters(1,3)

	    this.characterContainer = this.intializeCharacters([roots, dam], this)		    	    

	    this.terrainScreen.add(this.characterContainer)   
	}

	reinitializeGame() {
		let gameState = database.getGameState()		
		let logger = database.getLogger()
		let terrains = Object.values(database.getTerrains())
		for(let terrain of terrains) {
			terrain.clearExtraUnits()
		}
		this.updateVisuals()
		logger.clearLogger()
		this.textObject.setText(logger.getLogs())
		gameState.increaseBattleAmount()
		let units = Object.values(database.getUnitsByAllegianceAndTypes([unitTypeVars.full], allegianceVars.ally))
		for(let unit of units) {	
			unit.updateUnit({
				bitter: null
			})		
			unit.healFull()
		}
		let deadUnitInfos = gameState.getDeadAllies()
		for(let deadUnitInfo of deadUnitInfos) {
			let unit = new Unit()
			let base = JSON.parse(JSON.stringify(getUnitBaseFromUnitName(deadUnitInfo['unitName'])))
			for(let info in deadUnitInfo) {
				base[info] = deadUnitInfo[info]
			}			
			base['bitter'] = true
			unit.updateUnit(base)
		}
		
		let roots = new Unit()
	    roots.updateUnit(unitBase.general.roots)
	    this.terrainScreen.add(this.intializeCharacters([roots], this))
	    let level = gameState.getGlobalLevel()	    
	    this.upgradeFoes(gameState.getEnemyCount(), level, gameState.battleAmount + 3);
	    this.combatManager.updateCombatManager({
    		turn: 1
    	})	  
    	gameState.clearDeadAllies()
	}

	selectFirstFoes(amount) {
		this.selectFoes(amount, 1)
		this.updateCharacters();		
	}

	upgradeFoes(amount, maxLevel, amountLevel) {
		let foes = database.getUnitsByAllegiance(allegianceVars.foe)
		foes = foes.filter((a) => a.unitType != unitTypeVars.general)
		if(foes.length < amount) {
			do {
				this.selectFoes(amount, 1)
				foes = database.getUnitsByAllegiance(allegianceVars.foe)
				foes = foes.filter((a) => a.unitType != unitTypeVars.general)
			} while(foes.length < amount)		
		}
		this.updateCharacters();
		foes = database.getUnitsByAllegiance(allegianceVars.foe)
		foes = foes.filter((a) => a.unitType != unitTypeVars.general)		
		let levelCount = 0
		for(let foe of foes) {
			levelCount += foe.level
		}		
		if(levelCount < amountLevel) {
			do {				
				let selected = foes[getRandomInt(0, foes.length - 1)]
				this.levelUpFoe(selected.id)
				let tempFoes = database.getUnitsByAllegiance(allegianceVars.foe)
				tempFoes = foes.filter((a) => a.unitType != unitTypeVars.general)
				let newLevelCount = 0
				for(let foe of tempFoes) {
					newLevelCount += foe.level
				}
				if(levelCount < newLevelCount) {
					levelCount = newLevelCount
					foes = [...tempFoes]
				} else {
					foes = foes.filter((a) => a.id != selected.id)
				}
			} while(levelCount < amountLevel && foes.length > 0)
		}
	}

	selectFoes(amount, level) {
		let units = []
		for(let i = 0; i < amount; i++) {
    		let randomUnitBases = getNUnitBases(1, allegianceVars.foe, level);
    		let unit = new Unit()
			unit.updateUnit(randomUnitBases[0]);
      		units.push(unit);
		}

	}

	selectNewCharacter() {
		this.selectNewCharacters(1,1)
	}

	selectNewCharacters(i, total) {			
		let randomUnitBases = getNUnitBases(3, allegianceVars.ally, this.gameState.getGlobalLevel());
	    let units = [];
	    for (let randomUnitBase of randomUnitBases) {
	      let newUnit = new Unit();
	      newUnit.updateUnit(randomUnitBase);
	      units.push(newUnit);
	    }
	    units = shuffleArray(units)
		this.scene.launch('unitSelectionScreen', units);
	  	this.scene.bringToTop('unitSelectionScreen');


	  	this.scene.get('unitSelectionScreen').events.once('shutdown', () => {
			this.updateCharacters();

			if(i < total) {
				i++
				this.selectNewCharacters(i, total)
			} else {
				this.canLaunchTurn = true;
			}
		});
	}

	levelUpFoe(unitId) {
		let unit = database.getUnit(unitId)
		if(unit) {
			let position = JSON.parse(JSON.stringify(unit.position))
			unit.updateUnit({
				level: unit.level + 1
			})
			let levelUps = this.getLevelUps(unitId)
			if(levelUps.length > 0) {
				for(let toPurge of levelUps) {
			    	toPurge.purge()       
			    }   
				let selected = JSON.parse(JSON.stringify(levelUps[getRandomInt(0, levelUps.length - 1)]))
				delete selected.id
			    let newUnit = new Unit()     
			    newUnit.updateUnit(selected) 
			    unit.die()
			    this.updateVisuals()
				this.updateCharacters(position);	
			}
		}
	}

	getLevelUps(unitId) {
		let unit = database.getUnit(unitId)
		let position = JSON.parse(JSON.stringify(unit.position))
		let uB = getUnitBaseFromUnitName(unit.unitName)
		let units = []		
		if(uB != null) {
			let levelUps = uB.levelUp[unit.level]
			if(levelUps) {
				for(let levelUp of levelUps) {
					let newUnit = new Unit()
					let newUnitBase = getUnitBaseFromUnitName(levelUp.unitName)
					newUnit.updateUnit(newUnitBase)
					if (unit.unitName == levelUp.unitName) {
						newUnit.updateUnit(levelUp)
						newUnit.updateUnit({
							level: unit.level,
						})
					}
					units.push(newUnit)
				}
			}
		}
		return units
	}

	selectLevelUp(unitId) {		
		let unit = database.getUnit(unitId)
		let position = JSON.parse(JSON.stringify(unit.position))
		let levelUps = this.getLevelUps(unitId)
		if(levelUps.length > 0) {
			this.scene.launch('unitSelectionScreen', levelUps);
		  	this.scene.bringToTop('unitSelectionScreen');

		  	this.scene.get('unitSelectionScreen').events.once('shutdown', () => {
		  		unit.die(false)
		  		this.updateVisuals()
				this.updateCharacters(position);				
				this.checkSelectNewUnit();
			});
		}
	}

	checkSelectNewUnit() {
		this.selectNewCharacter()
	}

	updateCharacters(newPosition = undefined) {
	    let terrains = Object.values(database.getTerrains())	    

		let characters = Object.values(database.getUnits())	
		characters = characters.filter((a) => {
			return a.position == null
		})

		for(let character of characters) {
			let position = database.getRandomAvailableSpot(database.getTerrainByAllegiance(character.allegiance).id, character.unitType).id
			if(newPosition)
				position = newPosition
			character.updateUnit({
				position: position
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
			    t['isDestroyable'] = false
	    		let sprite = that.add.sprite(widthPlacement, heightPlacement, 'tilesets', tile);
	    		sprite['isDestroyable'] = false
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
			    	
			    	
			    	
			    	
			    	sprite['isDestroyable'] = true
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
					      healthBar['isDestroyable'] = true    	
				     	 characterContainer.push(sprite, healthBar);
			     	} else {
			     		characterContainer.push(sprite)
			     	}

			    	if(that.characterObj[character.id] != undefined){
		    			that.characterObj[character.id]['obj'].push(sprite) 
		    			that.characterObj[character.id]['obj'] = that.characterObj[character.id]['obj'].filter((obj, index, self) => {
						  return index === self.findIndex((el) => (
						    el.x === obj.x && el.y == obj.y
						  ));
						});
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
		    		if(sprite['_events']['pointerdown'] == undefined) {
			    		sprite.on('pointerdown', function() {	
			    			if(that.distinguishUnit && character.getDistinctions() != null) {
				    			let isDistinguished = character.distinguishUnit()				    			
				    			if(isDistinguished) {
				    				if(character.distinctions == 0) {
				    					that.selectLevelUp(character.id)
				    				} else {
				    					that.checkSelectNewUnit()				    					
				    				}
				    				that.distinguishUnit = false		
				    				that.canLaunchTurn = true	    				
				    			}
				    		} else {
				    			if(!that.selected) {
				    				//that.temp(character, sprite, that)
					    			that.selectCharacter(character, sprite, that)
					    		} else {
					    			if(that.selected != character.id) {
					    				that.unselectCharacter(that, that.characterObj[that.selected].obj)
					    				that.selectCharacter(character, sprite, that)
					    			} else {
					    				that.unselectCharacter(that, [sprite])
					    			}
					    		}	
				    		}
				    	})	
			    	}		    	
		    	}
		    	sprite.setDepth(3)
		    	if(sprite['_events']['pointerover'] == undefined) {
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
			    }
		    	if(sprite['_events']['pointerout'] == undefined) {
			        sprite.on('pointerout', function () {
			        	if(that.infoBox)
			            	that.infoBox.destroy()
			        });
			    }
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
		sprite.tint = visualVars.unitSelectedColor
		that.showSpotsAvailable(character, that)
		let tween = that.animationManager.shakeSelectedSprite(character.id, [sprite])
		tween.play()
	}

	unselectCharacter(that, sprites) {
		that.selected = undefined
		for(let sprite of sprites) {
			sprite.clearTint()
		}
		that.hideIlluminatedSpots(that)
		that.animationManager.stopShake('selectedSprite')
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
		if (Phaser.Input.Keyboard.JustDown(this.keyT) && this.canLaunchTurn) {
			if(this.selected) {
				this.unselectCharacter(this, this.characterObj[this.selected].obj)
			}	
			let generals = database.getGenerals()			
			generals = generals.filter((a) => {
				return a.isAlive()
			})
			if(generals.length == 2){
				this.combatManager.executeTurn()
			} else {
				let toKill = database.getUnitsByAllegiance(oppositeAllegianceVars[generals[0].allegiance])
				for(let unit of toKill) {
					unit.die()
				}
				if(generals[0].allegiance == allegianceVars.ally) {
					this.distinguishUnit = true
					this.reinitializeGame()
					this.canLaunchTurn = false;
				}
			}
		this.updateVisualAnimations()
		}
	}

	updateVisualAnimations() {
		let animationManager = database.getAnimationManager()
		let events = animationManager.getActionEvents()
		this.goThroughActionEvents(events)
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
		let newUnits = database.getNewTypedUnits([unitTypeVars.summon, unitTypeVars.support])
		newUnits = newUnits.filter((a) => a.isAlive())
		if(newUnits.length > 0) {
			let characterContainer = this.intializeCharacters(newUnits, this)
			this.terrainScreen = this.add.container(terrainVars.widthOffset,terrainVars.heightOffset, [...characterContainer]);
		}
	}

	goThroughActionEvents(events) {
		let animationManager = database.getAnimationManager()
			let that = this
		if(events.length > 0) {
			let event = events[0]
			let logger = database.getLogger()
			logger.addLog(event.log)
			let act = animationManager.act(event.origin, this.characterObj[event.origin].obj)
			act.on('complete', function() {
				let target = database.getUnit(event.target)
				
				
				if(target.newUnit == true) {
					let characterContainer = that.intializeCharacters([target], that)
					that.terrainScreen = that.add.container(terrainVars.widthOffset,terrainVars.heightOffset, [...characterContainer]);
					target.updateUnit({newUnit: false})
				}
				let unit = that.characterObj[event.target]
				unit.character = target
				let recieve = animationManager.recieve(event.target, that.characterObj[event.target].obj)
				recieve.on('complete', function() {
					that.textObject.setText(logger.getLogs())
					if(unit.healthBar)
						unit.healthBar.setHealth(event.targetHealth)
					if(event.targetIsAlive === false) {
						for(let sprite of unit.obj){
							that.destroySprite(sprite)
						}
						if(unit.healthBar)
							that.destroySprite(unit.healthBar)
						delete that.characterObj[unit.character.id]
						unit.character.purge()
					}
					events.shift()
					that.goThroughActionEvents(events)
				});
				recieve.play()
			})
			act.play()
			
			

			//recieve.setCallback("onComplete", () => 
		}	
	}

	temp(unit, sprite) {		
		let animationManager = database.getAnimationManager()
		let act = animationManager.act(unit.id, [sprite])
		let recieve = animationManager.recieve(unit.id, [sprite], 500)
		act.play()
		recieve.play()
	}

	refresh() {

        this.cameras.main.setPosition(this.parent.x, this.parent.y+visualVars.windowGrabOffset);

        this.scene.bringToTop()
    }

}