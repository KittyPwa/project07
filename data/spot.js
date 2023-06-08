function Spot() {
	this.i = null;

	this.j = null;

	this.id = uuidv4()

	this.identifier = null

	this.unitInSpot = null;

	this.terrain = null;

	this.spotType = null	

	this.isAdditionSpot = function() {
		let unit = database.getUnit(this.unitInSpot)
		if(unit && unit.additionalPositions != null) {
			return unit.additionalPositions.some((id) => id == this.id)
		}
		return false;		
	}

	this.isAvailable = function(type) {	
		let isAccessible = (this.unitInSpot == null)
		if(this.spotType != null) {
			isAccessible = isAccessible && this.spotType == type
		}
		return isAccessible

	}

	this.setUnit = function(unit) {
		this.updateSpot({
			unitInSpot: unit.id
		})
	}

	this.removeUnit = function() {
		this.updateSpot({
			unitInSpot: null
		})
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

	this.getRandomAvailableSpot = function(terrainId, type) {
		let spots = shuffleArray(Object.values(database.getSpots()))
		for(let spot of spots) {
			if(spot.terrain == terrainId && spot.isAvailable(type)) {
				return spot
			}
		}
	}

	this.databaseFunctions = {
		'getSpotByIJ' : this.getSpotByIJ,
		'getSpotsInRow' : this.getSpotsInRow,
		'getRandomAvailableSpot': this.getRandomAvailableSpot,
	}

	this.updateSpot = function(data) {
		this.i = data.i !== undefined ? data.i : this.i
		this.j = data.j !== undefined ? data.j : this.j
		this.terrain = data.terrain !== undefined ? data.terrain : this.terrain
		this.identifier = data.i !== undefined && data.j != undefined ? data.i + '_' + data.j : this.identifier
		this.unitInSpot = data.unitInSpot !== undefined ? data.unitInSpot : this.unitInSpot;
		this.spotType = data.spotType !== undefined ? data.spotType : this.spotType;
		database.setSpotToDatabase(this)
	}

	this.type = 'Spot'

	database.setSpotToDatabase(this)
}

database.addTypeToDatabase(Spot, 'Spot')
