function Unit() {
	this.id = uuidv4();

	this.name = null;

	this.unitName = null

	this.allegiance = null;

	this.position = null;

	this.additionalPositions = null;

	this.health = null;

	this.maxHealth = null;

	this.speed = null

	this.attack = null

	this.spriteInfos = null;

	this.type = 'Unit';

	this.unitType = null;

	this.skills = null

	this.damageMultiplier = null

	this.effectMultiplier = null

	this.healMultiplier = null

	this.stackSize = null

	this.newUnit = true

	this.level = null

	this.distinctions = null

	this.bitter = null

	this.exhausted = false

	this.distinguishUnit = function() {
		if(this.bitter == null || !this.bitter) {
			this.distinctions = this.distinctions !== null ? this.distinctions + 1 : 1;
			let gameState = database.getGameState()
			if(this.distinctions == gameState.distinctionsAmountForNextLevel) {
				this.distinctions = 0;
				this.level++
			}
			return true;
		} else {
			return false;
		}
	}

	this.isExhausted = function() {
		return this.exhausted
	}

	this.unExhaust = function() {
		this.updateUnit({
			exhausted: false
		})
	}

	this.exhaust = function() {
		this.updateUnit({
			exhausted: true
		})
	}

	this.updateWithClonedSkill = function() {
		let newSkills = []
		let multipliers = {
			skills: [],
			damageMultiplier: [],
			healMultiplier: [],
			effectMultiplier: [],
		}
		let skillToClone = {}
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId)
			if(skill.version == 'original') {
				let clone = database.cloneSkill(skill.skillId).id
				skillToClone[skill.skillId] = clone
				newSkills.push(clone)
			}
		}
		if(this.healMultiplier != null) {
			for(let healMultiplier of this.healMultiplier) {
				let skill = database.getSkill(healMultiplier.skillId)
				if(skill.version == 'original') {
					multipliers.healMultiplier = skillToClone[skill.skillId]
				}
			}
		} else {
			delete multipliers.healMultiplier
		}
		if(this.effectMultiplier != null) {
			for(let effectMultiplier of this.effectMultiplier) {
				let skill = database.getSkill(effectMultiplier.skillId)
				if(skill.version == 'original') {
					multipliers.effectMultiplier = skillToClone[skill.skillId]
				}
			}
		} else {
			delete multipliers.effectMultiplier
		}
		if(this.damageMultiplier != null) {
			for(let dmgMultiplier of this.damageMultiplier) {
				let skill = database.getSkill(dmgMultiplier.skillId)
				if(skill.version == 'original') {
					multipliers.damageMultiplier = skillToClone[skill.skillId]
				}
			}
		} else {
			delete multipliers.damageMultiplier
		}

		if(multipliers.skills.length > 0) {
			this.updateUnit(multipliers)
		}
	    database.cleanUpDanglingSkills()
	}

	this.getDistinctions = function() {
		return this.distinctions
	}

	this.getDamagingSkill = function() {
		return this.getSkillByEffect(skillEffectType.damage)
	}	

	this.getSkillByEffect = function(comparer) {
		let skills = []
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId);
			if(skill.effects[comparer] !== undefined) {
				skills.push(skill.id)
			}
		}
		return skills
	}


	this.getSkillBySkillType = function(comparer) {
		let skills = []
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId);
			if(skill['skillType'] == comparer) {
				skills.push(skillId)
			}
		}
		return skills
	}

	this.getSupportSkills = function() {
		return this.getSkillByEffect(skillEffectType.support)		
	}

	this.getPassiveSkills = function() {
		return this.getSkillBySkillType(skillType.passive)		
		
	}

	this.getActiveSkills = function() {
		return this.getSkillBySkillType(skillType.active)		
	}

	this.updateFromSkill = function() {
		let dmgSkillIds = this.getDamagingSkill()
		if(dmgSkillIds.length > 0) {
			let dmgSkill = database.getSkill(dmgSkillIds[0])
			let multiplier = 1
			if(this.damageMultiplier) {
				for(let dmgMultiplier of this.damageMultiplier) {
					if(dmgMultiplier.skillId == dmgSkillIds[0])
						multiplier = dmgMultiplier.damageMultiplier
				}
			}
			this.attack = dmgSkill.effects[skillEffectType.damage].data.damage * (multiplier)
		}
	}

	this.activateSkillEffect = function(skillId,effectType, multiplier) {
		let skill = database.getSkill(skillId)
		let effect = null
		if(skill) {
			let skillEffect = skill.effects[effectType]
			if(skillEffect) {
				let launched = skillEffect.effect()
				if(launched !== null)
					effect = launched * (multiplier != null ? multiplier : 1)
			}
		}
		return effect
	}

	this.healDamage = function(supportSkillId) {
		let multiplier = 1
		if(this.healMultiplier !== null) {
			for(let hMulitiplier of this.healMultiplier) {
				if(hMulitiplier.skillId == supportSkillId)
					multiplier = hMulitiplier.healMultiplier	
			}
			
		}
		return this.activateSkillEffect(supportSkillId, skillEffectType.heal, multiplier)
	}

	this.inflictDamage = function(dmgSkillId) {
		let multiplier = 1
		if(this.damageMultiplier !== null) {
			for(let dmgMultiplier of this.damageMultiplier) {
				if(dmgMultiplier.skillId == dmgSkillId)
					multiplier = dmgMultiplier.damageMultiplier			
			}
			
		}

		return this.activateSkillEffect(dmgSkillId, skillEffectType.damage, multiplier)
	}

	this.takeDamage = function(damage) {
		this.health -= damage
		if(this.health <= 0) {
			this.health = 0		
			this.die()
		}
	}

	this.takeHeal = function(heal) {
		this.health += heal
		if(this.health >= this.maxHealth) {
			this.health = this.maxHealth	
		}
	}

	this.updateStacks = function(amount) {
		if(amount > 0) {
			this.takeStackSize(amount)
		} else {
			this.removeStackSize(amount)
		}
	}

	this.takeStackSize = function(stackSize) {
		this.stackSize = this.stackSize !== undefined ? this.stackSize + stackSize : stackSize
	}

	this.removeStackSize = function(stackSize) {
		this.stackSize = this.stackSize !== undefined ? this.stackSize + stackSize : 0
		if(this.stackSize <= 0) {
			this.stackSize = 0
		}
	}

	this.healFull = function() {
		this.health = this.maxHealth
	}

	this.getDescription = function() {
		let description = this.name + '\n'
		if(this.level !== null) {
			description += language.unit.description.level + this.level + '\n'
		}
		if(this.health !== null) {
			description += language.unit.description.health[0] + this.health +'\n'
		}
		if(this.stackSize !== null) {
			description += language.unit.description.stackSize[0] + this.stackSize +'\n'

		}
		if(this.speed !== null)
			description += language.unit.description.speed[0] + this.speed + '\n'
		if(this.attack !== null)
			description += language.unit.description.attack[0] + this.attack + '\n'
		if(this.distinctions !== null && this.distinctions !== 0) {
			description += language.unit.description.distinctions[0] + this.distinctions +'\n'
		}
		if(this.bitter !== null)
			description += language.unit.description.bitter[0] + '\n'	
		if(this.isExhausted())
			description += language.unit.description.exhausted[0] + '\n'	
		if(this.skills.length > 0)
			description += language.unit.description.skill[0]
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId)
			description += skill.name + '\n'
		}
		return description
	}

	this.die = function(saveDead = true) {		
		let spot = database.getSpot(this.position)		
		if(spot)
			spot.removeUnit()	
		this.updateUnit({
			health: 0,
			position: null,			
		})
		if(this.allegiance == allegianceVars.ally && this.unitType == unitTypeVars.full && saveDead) {
			let gameState = database.getGameState()
			let deadAllies = gameState.getDeadAllies()
			deadAllies.push({
				unitName: this.unitName,
				distinctions: this.distinctions,
				level: this.level,
			});
			gameState.updateGameState({
				deadAllies: deadAllies
			})
		}
	}

	this.purge = function() {
		database.deleteUnit(this.id)
	} 

	this.isAlive = function() {
		let isAlive = true
		if(this.health !== null)
			isAlive = this.health > 0
		if(this.stackSize !== null)
			isAlive = isAlive && this.stackSize > 0
		return isAlive
	}

	this.updateUnit = function(data) {
		this.name = data.name !== undefined ? data.name : this.name;
		this.unitName = data.unitName !== undefined ? data.unitName : this.unitName;		
		this.allegiance = data.allegiance !== undefined ? data.allegiance : this.allegiance;
		this.speed = data.speed !== undefined ? data.speed : this.speed;		
		this.attack = data.attack !== undefined ? data.attack : this.attack;
		this.damageMultiplier = data.damageMultiplier !== undefined ? data.damageMultiplier : this.damageMultiplier;
		this.healMultiplier = data.healMultiplier !== undefined ? data.healMultiplier : this.healMultiplier;
		this.effectMultiplier = data.effectMultiplier !== undefined ? data.effectMultiplier : this.effectMultiplier;
		this.skills = data.skills !== undefined ? data.skills : this.skills;
		this.exhausted = data.exhausted !== undefined ? data.exhausted : this.exhausted
		this.updateFromSkill()

		this.additionalPositions = data.additionalPositions !== undefined ? data.additionalPositions : this.additionalPositions
		if(this.additionalPositions !== null) {
			for(let additionalPosition of this.additionalPositions) {
				let additionalSpot = database.getSpot(additionalPosition)
				additionalSpot.setUnit(this)
			}
		}
		if(data.position !== undefined) {
			let oldPosition = this.position
			this.position = data.position 
			let oldSpot = database.getSpot(oldPosition)
			if(oldSpot)
				oldSpot.removeUnit()
			if(data.position !== null) {
				let spot = database.getSpot(this.position)			
				if(spot)
					spot.setUnit(this)
			}
		}

		this.bitter = data.bitter !== undefined ? data.bitter : this.bitter;
		this.level = data.level !== undefined ? data.level : this.level;
		this.distinctions = data.distinctions !== undefined ? data.distinctions : this.distinctions;
		this.unitType = data.unitType !== undefined ? data.unitType : this.unitType;
		this.health = data.health !== undefined ? data.health : this.health;
		this.maxHealth = data.maxHealth !== undefined ? data.maxHealth : this.maxHealth;
		this.spriteInfos = data.spriteInfos !== undefined ? data.spriteInfos : this.spriteInfos;
		this.id = data.id !== undefined ? data.id : this.id;
		this.stackSize = data.stackSize !== undefined ? data.stackSize : this.stackSize;
		this.newUnit = data.newUnit !== undefined ? data.newUnit : this.newUnit
		this.updateWithClonedSkill()
		database.setUnitToDatabase(this)
	}

	this.getRace = function() {
		return this.unitName.slice(0,1)
	}

	this.getFamily = function() {
		return this.unitName.slice(0,2)
	}

	this.getNRandomUnits = function(n, faction) {
		let units = database.getUnits()
		units = units.filter((a) => a.allegiance == faction)
		units = shuffleArray(units)
		return units.slice(0,n)
	}

	this.getGenerals = function() {
		let units = Object.values(database.getUnits())
		let generals = units.filter((a) => a.unitType == unitTypeVars.general)
		return generals
	}

	this.getUnitByName = function(name) {
		let units = Object.values(database.getUnits())
		let unitArray = units.filter((a) => a.unitName == name)
		return unitArray
	}

	this.getNewTypedUnits = function(typeArray) {
		let units = Object.values(database.getUnits())
		let unitArray = units.filter((a) => a.newUnit == true)
		let retUnits = []
		for(let type of typeArray) {
			retUnits = [...retUnits, ...unitArray.filter((a) => a.unitType == type)]
		}
		return retUnits
	}

	this.getNewUnits = function() {
		let units = Object.values(database.getUnits())
		let unitArray = units.filter((a) => a.newUnit == true)
		return unitArray
	}

	this.getUnitsByAllegiance = function(allegiance) {
		let units = Object.values(database.getUnits())
		
		let unitArray = units.filter((a) => a.allegiance == allegiance)

		return unitArray
	}

	this.getUnitsByAllegianceAndTypes = function(typeArray, allegiance) {
		let units = Object.values(database.getUnits())		
		let retUnits = []
		for(let type of typeArray) {
			retUnits = [...retUnits, ...units.filter((a) => a.allegiance == allegiance && a.unitType == type)]
		}
		return retUnits
	}	

	this.unExhaustFaction = function(allegiance) {
		for(let unit of database.getUnitsByAllegiance(allegiance)) {
			unit.unExhaust()
		}
	}

	this.databaseFunctions = {
		'getGenerals' : this.getGenerals,
		'getUnitByName': this.getUnitByName,
		'getNewTypedUnits': this.getNewTypedUnits,
		'getNewUnits' : this.getNewUnits,
		'getUnitsByAllegiance': this.getUnitsByAllegiance,
		'getUnitsByAllegianceAndTypes': this.getUnitsByAllegianceAndTypes,
		'unExhaustFaction' : this.unExhaustFaction,
	}

	database.setUnitToDatabase(this)

}

database.addTypeToDatabase(Unit, 'Unit')
