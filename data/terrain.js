function Terrain() {
	this.id = uuidv4();
	
	this.type = 'Terrain'

	this.width = terrainVars.collumnAmount;

	this.height = terrainVars.rowAmount;

	this.terrain = []

	this.updateTerrain = function(data) {
		this.terrain = data.terrain
		this.id = data.id
	}

	database.addTerrainToDatabase(this)


	for(let i = 0; i < this.height; i++) {
		this.terrain[i] = []
		for(let j = 0; j < this.width; j++) {
			let spot = new Spot()
			spot.updateSpot({
				i: i,
				j: j,
				unitInSpot: null,			
			})
			this.terrain[i][j] = spot.id
		}
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
					spot = database.getSpotByIJ(newI, newJ)
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
		for(let i = 0; i < this.height; i++) {
			for(let j = 0; j < this.width; j++) {
				spot = database.getSpotByIJ(i,j);				
				if(spot) {
					if(spot.isAvailable()) {
						availableSpots.push(spot)
					}
				}
			}
		}
		return availableSpots
	}
}
database.addTypeToDatabase(Terrain, 'Terrain')
$
