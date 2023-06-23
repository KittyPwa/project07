function AnimationManager() {

	this.id = uuidv4()

	this.type = 'AnimationManager'

	this.anims = {}

	this.combatScreen = null

	this.shakeSprite = function(sprite, key, duration, x, y, repeatAmount, delay = 0, isArray = false) {
		let initialY = sprite.y
		let initialX = sprite.x
		let tween = this.combatScreen.tweens.add({
		  targets: sprite,
		  y: { value: initialY - y, yoyo: true, duration: duration, repeat: repeatAmount },
		  x: { value: initialX - x, yoyo: true, duration: duration, repeat: repeatAmount },
		  delay: delay,
		});
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
	}

	this.shakeSelectedSprite = function(unitId, sprite) {
		this.shakeSprite(sprite, 'selectedSprite', 150, 0, 5, -1)
	}

	this.act = function(unitId, sprite) {
		let unit = database.getUnit(unitId)
		let alleFactor = -1
		if(unit.allegiance == allegianceVars.foe) {
			alleFactor = 1
		}
		this.shakeSprite(sprite, 'act', 200, 10 * alleFactor, 0, 1)
	}

	this.recieve = function(unitId, sprite) {
		let unit = database.getUnit(unitId)
		this.shakeSprite(sprite, 'recieve', 50, 5, 0, 4)
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

	database.setAnimationManagerToDatabase(this)	
}
database.addTypeToDatabase(AnimationManager, 'AnimationManager')
