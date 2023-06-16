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

	this.passive = function(skillObj, event) {
		let origin = database.getUnit(event.origin)
		let originalTarget = database.getUnit(event.target)
		for(let skillId of skillObj.passives) {
			
			let skill = database.getSkill(skillId)
			let skillUser = database.getUnit(skillObj.unitId)
			let allies = database.getUnitsByAllegiance(allegianceVars.ally)
			let foes = database.getUnitsByAllegiance(allegianceVars.foe)
			let targets = skill.targeting({
				target: originalTarget,
				origin: origin,
				allies: allies,
				foes: foes,
				unit: skillUser
			})
			for(let target of targets) {
				if(target) {
					switch (skill.effectType) {
						case skillEffectType.heal: 
							let heal = skillUser.healDamage(skill)
							if(heal != null) {								
								target.takeHeal(heal)
								let logger = database.getLogger()
								let healLog = skillUser.name + language.combat.heals[0] + target.name + language.combat.heals[1] + heal + language.combat.heals[2]
								logger.addLog(healLog)		
								healthLog = target.name + language.status.health[0] + target.health + language.status.health[1]
								logger.addLog(healthLog)
							}
							break;
						default: 
							let damage = skillUser.inflictDamage(skill.id)
							if(damage != null) {								
								target.takeDamage(damage)
								let logger = database.getLogger()
								let attackLog = skillUser.name + ', passive : ' + language.combat.attacks[0] + target.name + language.combat.attacks[1] + damage + language.combat.attacks[2]
								logger.addLog(attackLog)		
								healthLog = target.name + language.status.health[0] + target.health + language.status.health[1]
								logger.addLog(healthLog)
								if(!target.isAlive()) {
									this.units = this.units.filter((a) => {
										return a != target.id
									})
								}	
							}
						}
				}
			}
		}
	}

	this.active = function(originId) {
		let origin = database.getUnit(originId)
		let activeSkills = origin.getActiveSkills()		
		let originPassiveSkills = origin.getPassiveSkills()			
		for(let skill of activeSkills) {
			let originSkill = database.getSkill(skill)
			if(originSkill) {
				let allies = database.getUnitsByAllegiance(allegianceVars.ally)
				let foes = database.getUnitsByAllegiance(allegianceVars.foe)
				let targets = originSkill.targeting({
					allies: allies,
					foes: foes,
					unit: origin
				})				
				for(let target of targets){			
					if(target){
						let event = new Event()
						event.updateEvent({
							origin: originId,
							target: target.id,
						})
						switch (originSkill.effectType) {
							case skillEffectType.heal: 
								let heal = origin.healDamage(skill)
								if(heal != null) {
									event.updateEvent({
										eventType: skillCondition.healGiven
									})
									let passives = database.getPassivesByEvent(event)
									event.updateEvent({
										eventType: skillCondition.healTaken
									})
									passives = [...passives, database.getPassivesByEvent(event)]
									let passivesBefore = passives.filter((a) => a.passive.orderType == orderingType.before)
									let passivesAfter = passives.filter((a) => a.passive.orderType == orderingType.after)
									this.passive(passivesBefore, event)
									target.takeHeal(heal)
									let logger = database.getLogger()
									let healLog = origin.name + language.combat.heals[0] + target.name + language.combat.heals[1] + heal + language.combat.heals[2]
									logger.addLog(healLog)		
									healthLog = target.name + language.status.health[0] + target.health + language.status.health[1]
									logger.addLog(healthLog)
									this.passive(passivesAfter, event)									
								}
								break;
							default: 
								let damage = origin.inflictDamage(skill)
								if(damage != null) {
									event.updateEvent({
										eventType: skillCondition.damageGiven
									})
									let passivesBefore = database.getPassivesByEvent(event)		
									
									for(let passives of passivesBefore) {															
										if(passives.passives.length > 0)
											this.passive(passives, event)
									}
									target.takeDamage(damage)
									let logger = database.getLogger()
									let attackLog = origin.name + language.combat.attacks[0] + target.name + language.combat.attacks[1] + damage + language.combat.attacks[2]
									logger.addLog(attackLog)		
									healthLog = target.name + language.status.health[0] + target.health + language.status.health[1]
									logger.addLog(healthLog)

									event.updateEvent({
										eventType: skillCondition.damageTaken
									})
									let passivesAfter = database.getPassivesByEvent(event)
									for(let passives of passivesAfter) {															
										if(passives.passives.length > 0)
											this.passive(passives, event)
									}									
									if(!target.isAlive()) {
										this.units = this.units.filter((a) => {
											return a != target.id
										})
									}	
								}
						}
					}
				}
				
			}
		}
	}	

	this.executeTurn = function() {		
		let newUnits = database.getNewTypedUnits([unitTypeVars.summon, unitTypeVars.support])
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
					this.active(unitId)
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
