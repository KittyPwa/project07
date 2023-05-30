function Unit() {
	this.id = uuidv4();

	this.name = null;

	this.allegiance = null;

	this.position = null;

	this.health = null;

	this.speed = null

	this.attack = null

	this.spriteInfos = null;

	this.type = 'Unit';

	this.unitType = null

	this.takeDamage = function(damage) {
		this.health -= damage
		if(this.health < 0) {
			this.health = 0			
		}
	}

	this.isAlive = function() {
		return this.health > 0
	}

	this.updateUnit = function(data) {
		this.name = data.name != undefined ? data.name : this.name;
		this.allegiance = data.allegiance != undefined ? data.allegiance : this.allegiance;
		this.speed = data.speed != undefined ? data.speed : this.speed;		
		this.attack = data.attack != undefined ? data.attack : this.attack;

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

	database.setUnitToDatabase(this)

}

database.addTypeToDatabase(Unit, 'Unit')
