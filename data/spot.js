function Spot() {
	this.i = null;

	this.j = null;

	this.id = uuidv4()

	this.identifier = null

	this.getSpotByIJ = function(i,j) {
		for(let spot of Object.values(this.data.spots)) {
			if(spot.identifier == i + '_' + j) {
				return spot
			}
		}
		return null
	}

	this.databaseFunctions = {
		'getSpotByIJ' : this.getSpotByIJ,
	}

	this.updateSpot = function(data) {
		this.i = data.i
		this.j = data.j
		this.identifier = data.i + '_' + data.j
		this.id = data.id
	}

	this.setSpot = function(i,j) {
		this.i = i
		this.j = j
		this.identifier = i + '_' + j
	}

	this.type = 'Spot'

	this.accessible = true

	database.addSpotToDatabase(this)
}

database.addTypeToDatabase(Spot, 'Spot')
