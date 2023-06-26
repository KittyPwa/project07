function AnimationManager() {

	this.id = uuidv4()

	this.type = 'AnimationManager'

	this.anims = {}

	this.combatScreen = null

	this.actionEvents = []

	this.animationSpeedUp = 1000

	this.addActionEvent = function(event) {
		let actionEvents = this.actionEvents
		actionEvents.push(event)
		this.updateAnimationManager({
			actionsEvents : actionEvents
		})
	}

	this.resetActionEvents = function() {
		this.updateAnimationManager.updateAnimationManager({
			actionEvents: []
		})
	}

	this.getActionEvents = function() {
		return this.actionEvents
	}

	this.shakeSprite = function(sprites, key, duration, x, y, repeatAmount, delay = 0, isArray = false) {
		let initialY = 0
		let initialX = 0
		for(let sprite of sprites) {
			initialX += sprite.x
			initialY += sprite.y
		}
		initialY = initialY / sprites.length
		initialX = initialX / sprites.length
		let data = {
		  targets: sprites,
		  delay: delay,
		  paused: true
		}
		if(y != 0) {
		  data['y'] = { value: initialY - y, yoyo: true, duration: duration/this.animationSpeedUp, repeat: repeatAmount }
		}
		if(x != 0) {
		  data['x']= { value: initialX - x, yoyo: true, duration: duration/this.animationSpeedUp, repeat: repeatAmount }
		}
		let tween = this.combatScreen.tweens.add(data);
		let anims = {}
		if(isArray) {
			if(anims[key] === undefined) {
				anims[key] = []
			}
			anims[key].push(tween)
		} else {
			anims[key] = tween
		}
		this.updateAnimationManager({
			anims: anims
		})
		return tween
	}

	this.shakeSelectedSprite = function(unitId, sprite) {
		return this.shakeSprite(sprite, 'selectedSprite', 150, 0, 5, -1)
	}

	this.act = function(unitId, sprite, delay) {
		let unit = database.getUnit(unitId)
		let alleFactor = -1
		if(unit.allegiance == allegianceVars.foe) {
			alleFactor = 1
		}
		return this.shakeSprite(sprite, 'act', 200, 10 * alleFactor, 0, 1, delay)
	}

	this.recieve = function(unitId, sprite, delay) {
		let unit = database.getUnit(unitId)
		return this.shakeSprite(sprite, 'recieve', 50, 5, 0, 4, delay)
	}

	this.stopShake = function(key) {
		if(Array.isArray(this.anims[key])) {
			for(let tween of this.anims[key]) {
				tween.stop()
			}
		} else{
			this.anims[key].stop()
		}
	}

	this.updateAnimationManager = function(data) {
		this.id = data.id != undefined ? data.id : this.id;
		this.anims = data.anims != undefined ? data.anims : this.anims
		this.combatScreen = data.combatScreen !== undefined ? data.combatScreen : this.combatScreen
	}

	this.getAnimationManager = function() {
		return Object.values(this.data.animationManagers)[0]
	}

	this.databaseFunctions = {
		'getAnimationManager' : this.getAnimationManager
	}

	database.setAnimationManagerToDatabase(this)	
}
database.addTypeToDatabase(AnimationManager, 'AnimationManager')
