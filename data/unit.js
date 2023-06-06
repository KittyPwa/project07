function Unit() {
	this.id = uuidv4();

	this.name = null;

	this.unitName = null

	this.allegiance = null;

	this.position = null;

	this.additionalPositions = null;

	this.health = null;

	this.speed = null

	this.attack = null

	this.spriteInfos = null;

	this.type = 'Unit';

	this.unitType = null;

	this.skills = null

	this.damageMultiplier = null

	this.stackSize = null

	this.newUnit = true

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
		if(dmgSkill != undefined)
			this.attack = dmgSkill.data.damage * (this.damageMultiplier != null ? this.damageMultiplier : 1);
	}

	this.healDamage = function() {
		let supportSkill = database.getSkill(this.getSupportSkill())
		let effect = null
		if(supportSkill) {
			let healEffect = supportSkill.launchEffect()
			if(healEffect != null)
				effect = healEffect * (this.damageMultiplier != null ? this.damageMultiplier : 1);			
		}
		return effect
	}

	this.inflictDamage = function() {
		let dmgSkill = database.getSkill(this.getDamagingSkill())	
		let effect = null		
		if(dmgSkill){
			let dmgEffect = dmgSkill.launchEffect()
			if(dmgEffect != null)
				effect = dmgEffect * (this.damageMultiplier != null ? this.damageMultiplier : 1);
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
	}

	this.getDescription = function() {
		let description = this.name + '\n'
		if(this.health != null) {
			description += language.unit.description.health[0] + this.health +'\n'
		}
		if(this.stackSize != null) {
			description += language.unit.description.stackSize[0] + this.stackSize +'\n'

		}
		if(this.speed != null)
			description += language.unit.description.speed[0] + this.speed + '\n'
		if(this.attack != null)
			description += language.unit.description.attack[0] + this.attack + '\n'
		description += language.unit.description.unitType[0] + this.unitType + '\n'
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId)
			description += language.unit.description.skill[0] + skill.name + '\n'
		}
		return description
	}

	this.die = function() {
		let spot = database.getSpot(this.position)
		spot.removeUnit()	
		this.updateUnit({
			health: 0,
			position: null,
		})
	}

	this.purge = function() {
		database.deleteUnit(this.id)
	} 

	this.isAlive = function() {
		let isAlive = true
		if(this.health != null)
			isAlive = this.health > 0
		if(this.stackSize != null)
			isAlive = isAlive && this.stackSize > 0
		return isAlive
	}

	this.updateUnit = function(data) {
		this.name = data.name != undefined ? data.name : this.name;
		this.unitName = data.unitName != undefined ? data.unitName : this.unitName;		
		this.allegiance = data.allegiance != undefined ? data.allegiance : this.allegiance;
		this.speed = data.speed != undefined ? data.speed : this.speed;		
		//this.attack = data.attack != undefined ? data.attack : this.attack;
		this.damageMultiplier = data.damageMultiplier != undefined ? data.damageMultiplier : this.damageMultiplier;
		this.skills = data.skills != undefined ? data.skills : this.skills;
		this.updateFromSkill()

		this.additionalPositions = data.additionalPositions != undefined ? data.additionalPositions : this.additionalPositions
		if(this.additionalPositions != null) {
			for(let additionalPosition of this.additionalPositions) {
				let additionalSpot = database.getSpot(additionalPosition)
				additionalSpot.setUnit(this)
			}
		}
		let oldPosition = this.position
		this.position = data.position != undefined ? data.position : this.position;
		let oldSpot = database.getSpot(oldPosition)
		let spot = database.getSpot(this.position)
		if(oldSpot)
			oldSpot.removeUnit()
		if(spot)
			spot.setUnit(this)

		this.unitType = data.unitType != undefined ? data.unitType : this.unitType;
		this.health = data.health != undefined ? data.health : this.health;
		this.spriteInfos = data.spriteInfos != undefined ? data.spriteInfos : this.spriteInfos;
		this.id = data.id != undefined ? data.id : this.id;
		this.stackSize = data.stackSize != undefined ? data.stackSize : this.stackSize;
		this.newUnit = data.newUnit != undefined ? data.newUnit : this.newUnit
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

	this.databaseFunctions = {
		'getGenerals' : this.getGenerals,
		'getUnitByName': this.getUnitByName,
		'getNewUnits': this.getNewUnits,
		'getUnitsByAllegiance': this.getUnitsByAllegiance,
	}

	database.setUnitToDatabase(this)

}

database.addTypeToDatabase(Unit, 'Unit')
