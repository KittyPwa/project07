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
		let animationManager = database.getAnimationManager()
		let origin = database.getUnit(event.origin)
		let originalTarget = database.getUnit(event.target)
		for(let skillId of skillObj.passives) {
			let skill = database.getSkill(skillId)
			let effects = Object.values(skill.effects).sort((a,b) => a.order - b.order)
			for(let effect of effects) {
				let skillUser = database.getUnit(skillObj.unitId)
				if(skillUser.isAlive()) {
					let allies = database.getUnitsByAllegiance(allegianceVars.ally)
					let foes = database.getUnitsByAllegiance(allegianceVars.foe)
					let targets = effect.targeting({
						target: originalTarget,
						origin: origin,
						allies: allies,
						foes: foes,
						unit: skillUser
					})
					for(let target of targets) {
						if(target) {
							switch (effect.skillEffectType) {
								case skillEffectType.heal: 
									if(target.isAlive()) {
										let heal = skillUser.healDamage(skill)
										if(heal != null) {								
											target.takeHeal(heal)
											let log = database.getSkill(skill.id).getSkillEffectLog(effect.skillEffectType, damage, skillUser.id, target.id)
											animationManager.addActionEvent({
												origin: skillUser.id,
												target: target.id,
												skillEffectType: skillEffectType.heal,
												amount: heal,
												skill: skill,
												targetHealth: target.health,
												targetIsAlive: target.isAlive(),
												log: log,
											})
										}
									}
									break;
								case skillEffectType.summon: 
									let ret = effect.effect({target:target, origin: skillUser})
									
									if(ret.updated) {
										target.updateStacks(ret['amount'])
										let log = database.getSkill(skill.id).getSkillEffectLog(effect.skillEffectType, ret['amount'], skillUser.id, target.id)
										animationManager.addActionEvent({
												origin: skillUser.id,
												target: target.id,
												skillEffectType: skillEffectType.summon,
												amount: ret['amount'],
												skill: skill,
												log: log,
											})
									}
									break;
								default: 
									if(target.isAlive()) {
										let damage = skillUser.inflictDamage(skill.id)
										if(damage != null) {								
											target.takeDamage(damage)
											let log = database.getSkill(skill.id).getSkillEffectLog(effect.skillEffectType, damage, skillUser.id, target.id)
											animationManager.addActionEvent({
												origin: skillUser.id,
												target: target.id,
												skillEffectType: skillEffectType.damage,
												amount: damage,
												skill: skill,
												targetHealth: target.health,
												targetIsAlive: target.isAlive(),
												log: log,
											})
											if(!target.isAlive()) {
												event.updateEvent({
													eventType: skillCondition.unitDeath
												})
												let passivesAfterDeath = database.getPassivesByEvent(event)
												for(let passives of passivesAfterDeath) {															
													if(passives.passives.length > 0)
														this.passive(passives, event)
												}
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
		}
	}

	this.active = function(originId) {
		let animationManager = database.getAnimationManager()
		let origin = database.getUnit(originId)
		let activeSkills = origin.getActiveSkills()		
		let originPassiveSkills = origin.getPassiveSkills()
		for(let skill of activeSkills) {
			let originSkill = database.getSkill(skill)
			if(originSkill) {
				let effects = Object.values(originSkill.effects).sort((a,b) => a.order - b.order)
				for(let effect of effects) {
					let allies = database.getUnitsByAllegiance(allegianceVars.ally)
					let foes = database.getUnitsByAllegiance(allegianceVars.foe)
					let targets = effect.targeting({
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
							switch (effect.skillEffectType) {
								case skillEffectType.heal: 
									let heal = origin.healDamage(skill)
									if(heal != null) {
										event.updateEvent({
											eventType: skillCondition.healGiven
										})
										let passivesBefore = database.getPassivesByEvent(event)		
										for(let passives of passivesBefore) {															
											if(passives.passives.length > 0)
												this.passive(passives, event)
										}
										target.takeHeal(heal)
										let log = database.getSkill(skill).getSkillEffectLog(effect.skillEffectType, heal, originId, target.id)
										animationManager.addActionEvent({
											origin: originId,
											target: target.id,
											skillEffectType: skillEffectType.heal,
											amount: heal,
											skill: skill,
											targetHealth: target.health,
											targetIsAlive: target.isAlive(),
											log: log,
										})
										event.updateEvent({
											eventType: skillCondition.healTaken
										})
										let passivesAfter = database.getPassivesByEvent(event)
										for(let passives of passivesAfter) {															
											if(passives.passives.length > 0)
												this.passive(passives, event)
										}
									}
									break;
								case skillEffectType.summon: 
									let ret = effect.effect({target:target, origin: origin})
									
									if(ret.updated) {
										target.updateStacks(ret['amount'])
										let log = database.getSkill(skill).getSkillEffectLog(effect.skillEffectType, ret['amount'], originId, target.id)
										animationManager.addActionEvent({
												origin: originId,
												target: target.id,
												skillEffectType: skillEffectType.summon,
												amount: ret['amount'],
												skill: skill,
												log: log,
											})
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
										if(target.isAlive()) {
											target.takeDamage(damage)
											let log = database.getSkill(skill).getSkillEffectLog(effect.skillEffectType, damage, originId, target.id)
											animationManager.addActionEvent({
												origin: originId,
												target: target.id,
												skillEffectType: skillEffectType.damage,
												amount: damage,
												skill: skill,
												targetHealth: target.health,
												targetIsAlive: target.isAlive(),
												log: log,
											})
											event.updateEvent({
												eventType: skillCondition.damageTaken
											})
											let passivesAfter = database.getPassivesByEvent(event)
											for(let passives of passivesAfter) {															
												if(passives.passives.length > 0)
													this.passive(passives, event)
											}									
											if(!target.isAlive()) {
												event.updateEvent({
													eventType: skillCondition.unitDeath
												})
												let passivesAfterDeath = database.getPassivesByEvent(event)
												for(let passives of passivesAfterDeath) {															
													if(passives.passives.length > 0)
														this.passive(passives, event)
												}
												this.units = this.units.filter((a) => {
													return a != target.id
												})
											}
										} else {
											this.active(originId)
										}

									}
							}

						}
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
