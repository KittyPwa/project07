function Spot() {
	this.i = null;

	this.j = null;

	this.id = uuidv4()

	this.identifier = null

	this.unitInSpot = null;

	this.terrain = null

	this.isAvailable = function() {
		return this.unitInSpot == null
	}

	this.setUnit = function(unit) {
		this.unitInSpot = unit.id;
	}

	this.removeUnit = function() {
		this.unitInSpot = null;
	}

	this.getSpotByIJ = function(i,j, terrain) {
		for(let spot of Object.values(this.data.spots)) {
			if(spot.terrain == terrain && spot.identifier == i + '_' + j) {
				return spot
			}
		}
		return null
	}

	this.getSpotsInRow = function(spotId) {
		let originSpot = this.getSpot(spotId)
		let rowSpots = []
		for(let spot of Object.values(this.data.spots)) {
			if(spot.j == originSpot.j) {
				rowSpots.push(spot)
			}
		}
		return rowSpots
	}

	this.databaseFunctions = {
		'getSpotByIJ' : this.getSpotByIJ,
		'getSpotsInRow' : this.getSpotsInRow
	}

	this.updateSpot = function(data) {
		this.i = data.i != undefined ? data.i : this.i
		this.j = data.j != undefined ? data.j : this.j
		this.terrain = data.terrain != undefined ? data.terrain : this.terrain
		this.identifier = data.i + '_' + data.j
		this.unitInSpot = data.unitInSpot
		database.setSpotToDatabase(this)
	}

	this.type = 'Spot'

	this.accessible = true

	database.setSpotToDatabase(this)
}

database.addTypeToDatabase(Spot, 'Spot')
