function Skill() {

	this.id = uuidv4()

	this.name = null

	this.skillId = null

	this.skillType = null

	this.skillEffectType = null

	this.passiveIsActivated = null

	this.orderingType = null

	this.skillCondition = null

	this.effect = null

	this.type = 'Skill'		

	this.launchEffect = function(data) {		
		return this.effect(data)
	}

	this.data = null

	this.effectDescription = null

	this.targeting = null

	this.updateSkill = function(data) {
		this.id = data.id !== undefined ? data.id : this.id;		
		this.name = data.name !== undefined ? data.name : this.name;
		this.skillId = data.skillId !== undefined ? data.skillId : this.skillId;
		this.skillType = data.skillType !== undefined ? data.skillType : this.skillType;
		this.skillEffectType = data.skillEffectType !== undefined ? data.skillEffectType : this.skillEffectType;
		this.effect = data.effect !== undefined ? data.effect : this.effect;
		this.effectDescription = data.effectDescription !== undefined ? data.effectDescription : this.effectDescription;
		this.targeting = data.targeting !== undefined ? data.targeting : this.targeting;
		this.data = data.data !== undefined ? data.data : this.data;
		this.orderingType = data.orderingType !== undefined ? data.orderingType : this.orderingType
		this.skillCondition = data.skillCondition !== undefined ? data.skillCondition : this.skillCondition
		this.passiveIsActivated = data.passiveIsActivated !== undefined ? data.passiveIsActivated : this.passiveIsActivated
	}

	this.getSkillByName = function(skillId) {
		for(let skill of Object.values(this.data.skills)) {
			if(skill.skillId == skillId) {
				return skill
			}
		}
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

	this.databaseFunctions = {
		'getSkillByName' : this.getSkillByName,
		'getPassivesByEvent': this.getPassivesByEvent,
	}

	database.setSkillToDatabase(this)	
}
database.addTypeToDatabase(Skill, 'skill')
