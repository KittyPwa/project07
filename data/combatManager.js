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
			let foesToAttack = damageSkill.targeting(attacker)				
			for(let foeToAttack of foesToAttack){			
				if(foeToAttack){
					let damage = attacker.inflictDamage()
					if(damage != null) {
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
			
		}
	}	

	this.support = function(supporterId) {
		let supporter = database.getUnit(supporterId)
		let supportSkill = database.getSkill(supporter.getSupportSkill())
		if(supportSkill) {
			let alliesToSupport = supportSkill.targeting(supporter)
			for(let ally of alliesToSupport) {
				if(ally) {
					let heal = supporter.healDamage()
					if(heal != null) {
						ally.takeHeal(heal)
						let logger = database.getLogger()
						let healLog = supporter.name + language.combat.heals[0] + ally.name + language.combat.heals[1] + heal + language.combat.heals[2]
						logger.addLog(healLog)		
						healthLog = ally.name + language.status.health[0] + ally.health + language.status.health[1]
						logger.addLog(healthLog)
					}
				}
			}
		}
	}

	this.executeTurn = function() {		
		let newUnits = database.getNewUnits()
		for(let newUnit of newUnits) {
			newUnit.newUnit = false;
		}
		let logger = database.getLogger()
		let targeting = database.getTargeting()
		let log = language.turn.turn[0] + this.turn
		logger.addLog(log)
		this.orderUnitsBySpeed()	
		for(let unitId of this.units) {		
			let generals = database.getGenerals()			
			generals = generals.filter((a) => {
				return a.isAlive()
			})
			let unit = database.getUnit(unitId)
			if(generals.length == 2) {
				if(unit && unit.isAlive()) {
					this.attack(unitId)	
					this.support(unitId)			
				}	
			}	else {
				let toKill = database.getUnitsByAllegiance(oppositeAllegianceVars[generals[0].allegiance])				
				for(let unit of toKill) {
					unit.die()
				}
				break;
			}		
		}		

		this.turn++
	}
	database.setCombatManagerToDatabase(this)
}
database.addTypeToDatabase(CombatManager, 'CombatManager')
