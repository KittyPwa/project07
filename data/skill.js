function Skill() {

	this.id = uuidv4()

	this.name = null

	this.skillId = null

	this.skillType = null

	this.effect = null

	this.type = 'Skill'		

	this.launchEffect = function(data) {		
		return this.effect(data)
	}

	this.data = null

	this.effectDescription = null

	this.updateSkill = function(data) {
		this.id = data.id != undefined ? data.id : this.id;		
		this.name = data.name != undefined ? data.name : this.name;
		this.skillId = data.skillId != undefined ? data.skillId : this.skillId;
		this.skillType = data.skillType != undefined ? data.skillType : this.skillType;
		this.effect = data.effect != undefined ? data.effect : this.effect;
		this.effectDescription = data.effectDescription != undefined ? data.effectDescription : this.effectDescription;
		this.data = data.data != undefined ? data.data : this.data;

	}

	this.getSkillByName = function(skillId) {
		for(let skill of Object.values(this.data.skills)) {
			if(skill.skillId == skillId) {
				return skill
			}
		}
	}

	this.databaseFunctions = {
		'getSkillByName' : this.getSkillByName,
	}

	database.setSkillToDatabase(this)	
}
database.addTypeToDatabase(Skill, 'skill')
