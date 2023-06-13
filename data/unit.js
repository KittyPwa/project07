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

	this.getDistinctions = function() {
		return this.distinctions
	}

	this.getDamagingSkill = function() {
		return this.getTypeSkills(skillType.damage)[0]
	}	

	this.getTypeSkills = function(type) {
		let skills = []
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId);
			if(skill.skillType == type) {
				skills.push(skillId)
			}
		}
		return skills;
	}

	this.getSupportSkill = function() {
		return this.getTypeSkills(skillType.support)[0]
	}

	this.getPassiveSkill = function() {
		return this.getTypeSkills(skillType.passive)[0]
	}

	this.updateFromSkill = function() {
		let dmgSkill = database.getSkill(this.getDamagingSkill())
		if(dmgSkill !== undefined)			
			this.attack = dmgSkill.data.damage * (this.damageMultiplier !== null ? this.damageMultiplier : 1)
			
	}

	this.healDamage = function() {
		let supportSkill = database.getSkill(this.getSupportSkill())
		let effect = null
		if(supportSkill) {
			let healEffect = supportSkill.launchEffect()
			if(healEffect !== null)
				effect = healEffect * (this.healMultiplier !== null ? this.healMultiplier : 1);			
		}
		return effect
	}

	this.inflictDamage = function() {
		let dmgSkill = database.getSkill(this.getDamagingSkill())	
		let effect = null		
		if(dmgSkill){
			let dmgEffect = dmgSkill.launchEffect()
			if(dmgEffect !== null)
				effect = dmgEffect * (this.damageMultiplier !== null ? this.damageMultiplier : 1);
		}
		return effect
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
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId)
			description += language.unit.description.skill[0] + skill.name + '\n'
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
		this.effectMultiplier = data.effectMultiplier !== undefined ? data.effectMultiplier : this.effectMultiplier;
		this.healEffect = data.healEffect !== undefined ? data.healEffect : this.healEffect;
		this.skills = data.skills !== undefined ? data.skills : this.skills;
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
		database.setUnitToDatabase(this)
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

	this.databaseFunctions = {
		'getGenerals' : this.getGenerals,
		'getUnitByName': this.getUnitByName,
		'getNewTypedUnits': this.getNewTypedUnits,
		'getUnitsByAllegiance': this.getUnitsByAllegiance,
		'getUnitsByAllegianceAndTypes': this.getUnitsByAllegianceAndTypes,
	}

	database.setUnitToDatabase(this)

}

database.addTypeToDatabase(Unit, 'Unit')
