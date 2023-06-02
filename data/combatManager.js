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


	this.attack = function(attackerId) {
		let attacker = database.getUnit(attackerId)
		let damageSkill = database.getSkill(attacker.getDamagingSkill())
		if(damageSkill) {
			console.log(damageSkill)
			let foesToAttack = damageSkill.targeting(attacker)				
			for(let foeToAttack of foesToAttack){				
				let damage = attacker.inflictDamage()
				foeToAttack.takeDamage(damage)
				let logger = database.getLogger()
				let attackLog = attacker.name + language.combat.attacks[0] + foeToAttack.name + language.combat.attacks[1] + damage + language.combat.attacks[2]
				logger.addLog(attackLog)		
				healthLog = foeToAttack.name + language.status.health[0] + foeToAttack.health + language.status.health[1]
				logger.addLog(healthLog)
				if(!foeToAttack.isAlive()) {
					this.units = this.units.filter((a) => {
						return a != foeToAttack.id
					})
				}	
			}
			
		}
	}	

	this.executeTurn = function() {
		let logger = database.getLogger()
		let targeting = database.getTargeting()
		let log = language.turn.turn[0] + this.turn
		logger.addLog(log)
		this.orderUnitsBySpeed()		
		for(let unitId of this.units) {					
			let unit = database.getUnit(unitId)
			if(unit.isAlive()) {
				this.attack(unitId)				
			}
		}		

		this.turn++
	}
	database.setCombatManagerToDatabase(this)
}
database.addTypeToDatabase(CombatManager, 'CombatManager')
