function Unit() {
	this.id = uuidv4();

	this.name = null;

	this.allegiance = null;

	this.position = null;

	this.health = null;

	this.spriteInfos = null;

	this.type = 'Unit';

	this.updateUnit = function(data) {
		this.name = data.name;
		this.allegiance = data.allegiance;
		this.position = data.position;
		this.health = data.health;
		this.spriteInfos = data.spriteInfos;
		this.id = data.id != undefined ? data.id : this.id;
	}

}

database.addTypeToDatabase(Unit, 'Unit')
