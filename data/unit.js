function Unit() {
	this.id = uuidv4();

	this.name = null;

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

	this.getDamagingSkill = function() {
		for(let skillId of this.skills) {
			let skill = database.getSkill(skillId);
			if(skill.skillType == skillType.damage) {
				return skillId;
			}
		}
		return false;
	}

	this.updateFromSkill = function() {
		let dmgSkill = database.getSkill(this.getDamagingSkill())
		if(dmgSkill != undefined)
			this.attack = dmgSkill.data.damage * (this.damageMultiplier != null ? this.damageMultiplier : 1);
	}

	this.inflictDamage = function() {
		let dmgSkill = database.getSkill(this.getDamagingSkill())	
		let effect = null
		if(dmgSkill)
			effect = dmgSkill.launchEffect() * (this.damageMultiplier != null ? this.damageMultiplier : 1);
		return effect
	}

	this.takeDamage = function(damage) {
		this.health -= damage
		if(this.health <= 0) {
			this.health = 0		
			this.die()
		}
	}

	this.getDescription = function() {
		let description = this.name + '\n'
		description += language.unit.description.health[0] + this.health +'\n'
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
		if(!this.isAlive()) {
			let spot = database.getSpot(this.position)
			spot.removeUnit()		
		}
	}

	this.isAlive = function() {
		return this.health > 0
	}

	this.updateUnit = function(data) {
		this.name = data.name != undefined ? data.name : this.name;
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
		database.setUnitToDatabase(this)
	}

	this.getGenerals = function() {
		let units = Object.values(database.getUnits())
		let generals = units.filter((a) => a.unitType == unitTypeVars.general)
		return generals
	}

	this.databaseFunctions = {
		'getGenerals' : this.getGenerals,
	}

	database.setUnitToDatabase(this)

}

database.addTypeToDatabase(Unit, 'Unit')
