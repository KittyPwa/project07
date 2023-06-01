function CombatManager() {
	
	this.id = uuidv4()

	this.units = []

	this.turn = null

	this.terrains = []

	this.type = 'CombatManager'

	this.updateCombatManager = function(data) {
		this.id = data.id != undefined ? data.id : this.id;
		this.units = data.units != undefined ? data.units : this.units;		
		this.turn = data.turn != undefined ? data.turn : this.turn
		this.terrains = data.terrains != undefined ? data.terrains : this.terrains;		
	}

	this.orderUnitsBySpeed = function() {
		let unitArray = []
		for(let unitId of this.units) {
			unitArray.push(database.getUnit(unitId))
		}
		unitArray.sort((a,b) => b.speed - a.speed)
		this.units = unitArray.map((a) => a.id)		
	}	


	this.attack = function(attackerId, victimId) {
		let attacker = database.getUnit(attackerId)
		if(attacker.getDamagingSkill()) {
			let victim = database.getUnit(victimId)
			let damage = attacker.inflictDamage()
			victim.takeDamage(damage)
			let logger = database.getLogger()
			let attackLog = attacker.name + language.combat.attacks[0] + victim.name + language.combat.attacks[1] + damage + language.combat.attacks[2]
			logger.addLog(attackLog)		
			healthLog = victim.name + language.status.health[0] + victim.health + language.status.health[1]
			logger.addLog(healthLog)
			if(!victim.isAlive()) {
				this.units = this.units.filter((a) => {
					return a != victimId
				})
			}
		}
	}

	this.getFirstFoeAlive = function(foes) {
		for(let foe of foes) {
			if(foe.isAlive()) {
				return foe
			}
		}
		return null
	}

	this.executeTurn = function() {
		let logger = database.getLogger()
		let log = language.turn.turn[0] + this.turn
		logger.addLog(log)
		this.orderUnitsBySpeed()		
		for(let unitId of this.units) {					
			let unit = database.getUnit(unitId)
			if(unit.isAlive()) {
				let spot = database.getSpot(unit.position)
				let terrain = database.getTerrain(spot.terrain)
				let foes = terrain.getRowOfFoes(spot.id)
				if(foes.length > 0) {
					foes.sort((a,b) => database.getSpot(b.position).i - database.getSpot(a.position).i)
					if(unit.allegiance == allegianceVars.ally)
						foes.sort((a,b) => database.getSpot(a.position).i - database.getSpot(b.position).i)					
					let foeToAttack = this.getFirstFoeAlive(foes)
					if(foeToAttack != null)
						this.attack(unitId, foeToAttack.id)
				}
			}
		}		

		this.turn++
	}
	database.setCombatManagerToDatabase(this)
}
database.addTypeToDatabase(CombatManager, 'CombatManager')
