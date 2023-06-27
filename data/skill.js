function Skill() {

	this.id = uuidv4()

	this.name = null

	this.skillId = null

	this.version = skillVersionVar.original

	this.skillType = null

	this.skillEffectType = null

	this.passiveIsActivated = null

	this.orderingType = null

	this.skillCondition = null

	this.effects = []

	this.type = 'Skill'		

	this.data = null

	this.effectDescription = null

	this.targeting = null

	this.updateSkill = function(data) {
		this.id = data.id !== undefined ? data.id : this.id;		
		this.name = data.name !== undefined ? data.name : this.name;
		this.skillId = data.skillId !== undefined ? data.skillId : this.skillId;
		this.skillType = data.skillType !== undefined ? data.skillType : this.skillType;
		this.skillEffectType = data.skillEffectType !== undefined ? data.skillEffectType : this.skillEffectType;
		this.effects = data.effects !== undefined ? data.effects : this.effects;
		this.effectDescription = data.effectDescription !== undefined ? data.effectDescription : this.effectDescription;
		this.targeting = data.targeting !== undefined ? data.targeting : this.targeting;
		this.data = data.data !== undefined ? data.data : this.data;
		this.orderingType = data.orderingType !== undefined ? data.orderingType : this.orderingType
		this.skillCondition = data.skillCondition !== undefined ? data.skillCondition : this.skillCondition
		this.passiveIsActivated = data.passiveIsActivated !== undefined ? data.passiveIsActivated : this.passiveIsActivated
		this.version = data.version !== undefined ? data.version : this.version
	}

	this.getSkillEffectLog = function(effectType, amount, originId, targetId) {
		let descriptionArray = this.effects[effectType].effectDescription(amount)
		let origin = database.getUnit(originId)
		let target = database.getUnit(targetId)
		let object = {
			'amount': amount,
			'origin': origin.name,
			'target': target.name,
		}
		let i = 0
		
		let name = camelCase(this.name)
		
		
		for(let desc of language.skill[name][effectType].description) {
			object[i] = desc
			i++
		}
		let log = ''
		for(let descriptionElement of Object.values(descriptionArray)) {
			log += object[descriptionElement]
		}
		return log
	}

	this.getSkillByName = function(skillId) {
		for(let skill of Object.values(this.data.skills)) {
			if(skill.skillId == skillId && skill.version == skillVersionVar.original) {
				return skill
			}
		}
	}

	this.cloneSkill = function(name) {
		let clone = new Skill()
		let original = database.getSkillByName(name)
		let skillBase = JSON.parse(JSON.stringify(original))
		delete skillBase['id']
		skillBase['version'] = skillVersionVar.clone
		clone.updateSkill(skillBase)
		clone.updateSkill({
			effects : original.effects
		})
		return clone
	}

	this.getPassivesByEvent = function(event) {
		let units = Object.values(database.getUnits())
		let skills = []
		for(let unit of units) {
			let passiveIds = unit.getPassiveSkills()
			passives = passiveIds.filter((a) => {
				let passive = database.getSkill(a)
				return passive.passiveIsActivated !== undefined && passive.passiveIsActivated(event)
			})
			skills.push({
				unitId: unit.id,
				passives: passives
			})
		}
		
		return skills
	}

	this.cleanUpDanglingSkills = function() {
		let skills = Object.values(database.getSkills())
		skills = skills.filter((a) => a.version == skillVersionVar.clone)
		let units = Object.values(database.getUnits())
		for(let unit of units) {
			for(let unitSkill of unit.skills) {
				skills = skills.filter((a) => a.skillId != unitSkill.skillId)
			}
		}
		for(let skill of skills) {
			delete database.data.skills[skills.id]
		}
	}

	this.databaseFunctions = {
		'cloneSkill'  : this.cloneSkill,
		'getSkillByName' : this.getSkillByName,
		'getPassivesByEvent': this.getPassivesByEvent,
		'cleanUpDanglingSkills': this.cleanUpDanglingSkills,
	}

	database.setSkillToDatabase(this)	
}
database.addTypeToDatabase(Skill, 'skill')
