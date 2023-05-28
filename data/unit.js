function Unit() {
	this.id = uuidv4();

	this.name = null;

	this.allegiance = null;

	this.position = null;

	this.health = null;

	this.spriteInfos = null;

	this.type = 'Unit';

	this.updateUnit = function(data) {
		this.name = data.name != undefined ? data.name : this.name;
		this.allegiance = data.allegiance ? data.allegiance : this.allegiance;
		let oldPosition = this.position
		this.position = data.position != undefined ? data.position : this.position;
		let oldSpot = database.getSpot(oldPosition)
		let spot = database.getSpot(this.position)
		if(oldSpot)
			oldSpot.removeUnit()
		spot.setUnit(this)
		this.health = data.health;
		this.spriteInfos = data.spriteInfos;
		this.id = data.id != undefined ? data.id : this.id;
	}

	database.addUnitToDatabase(this)

}

database.addTypeToDatabase(Unit, 'Unit')
