function Terrain() {
	
	this.id = uuidv4();
	
	this.type = 'Terrain'

	this.width = null;

	this.height = null;

	this.terrain = []

	this.allegiance = null

	this.updateTerrain = function(data) {
		this.terrain = data.terrain != undefined ? data.terrain : this.terrain
		this.id = data.id != undefined ? data.id : this.id
		this.allegiance = data.allegiance != undefined ? data.allegiance : this.allegiance
		this.height = data.height != undefined ? data.height : this.height;
		this.width = data.width != undefined ? data.width : this.width;
		this.spots = data.spots != undefined ? data.spots : this.spots
		database.setTerrainToDatabase(this)
	}

	this.updateSpots = function() {
		for(let i = 0; i < this.width; i++) {
			this.terrain[i] = []
			for(let j = 0; j < this.height; j++) {
				let spot = new Spot()
				spot.updateSpot({
					i: i,
					j: j,
					unitInSpot: null,	
					terrain: this.id,		
				})
				this.terrain[i][j] = spot.id
			}
		}
		database.setTerrainToDatabase(this)
	}

	this.getDistanceBetweenSpots = function(spotA, spotB) {
	return Math.sqrt((spotA.i - spotB.i)**2 + (spotA.j - spotB.j)**2)
}

	this.getSpotsInRange = function(spotOrigin, range) {
		let newI
		let newJ
		let spots = []
		let spot
		for(let i = -1 * range; i <= range; i++) {
			newI = i + spotOrigin.i
			for(let j = -1 * range; j <= range; j++) {
				newJ = j + spotOrigin.j
				if(i != 0 || j != 0) {
					spot = database.getSpotByIJ(newI, newJ, this.id)
					if(spot) {
						if(this.getDistanceBetweenSpots(spotOrigin, spot) <= range)
							spots.push(spot)						
					}
				}
			}
		}
		return spots
	}

	this.getAvailableSpots = function() {
		let spot
		let availableSpots = []
		for(let i = 0; i < this.width; i++) {
			for(let j = 0; j < this.height; j++) {
				spot = database.getSpotByIJ(i,j, this.id);				
				if(spot) {
					if(spot.isAvailable()) {
						availableSpots.push(spot)
					}
				}
			}
		}
		return availableSpots
	}

	this.databaseFunctions = {
		'getTerrainByAllegiance' : this.getTerrainByAllegiance,
	}

	this.getTerrainByAllegiance = function(allegiance) {
		for(let terrain of this.data.terrains) {
			if(terrain.allegiance == allegiance)
				return terrain
		}
	}
	database.setTerrainToDatabase(this)	
}
database.addTypeToDatabase(Terrain, 'Terrain')
