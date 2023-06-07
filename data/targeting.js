function Targeting() {

	this.id = uuidv4()

	this.type = 'Targeting'

	this.getNFoeAlive = function(foes,n) {
		let counter = 0
		let foesAlive = []
		for(let foe of foes) {
			if(foe && foe.isAlive() && counter < n) {
				foesAlive.push(foe)
				counter++
			}
		}
		return foesAlive
	}

	this.classicTargeting = function(unit) {
		let foesToAttack = []
		let spot = database.getSpot(unit.position)
		let terrain = database.getTerrain(spot.terrain)
		let foes = terrain.getRowOfFoes(spot.id)
		let foeToAttack = []
		if(foes.length > 0) {
			foes.sort((a,b) => database.getSpot(b.position).i - database.getSpot(a.position).i)
			if(unit.allegiance == allegianceVars.ally)
				foes.sort((a,b) => database.getSpot(a.position).i - database.getSpot(b.position).i)					
			foeToAttack = this.getNFoeAlive(foes,1)
			for(let foe of foeToAttack) {
				if(foe != undefined){
					foesToAttack.push(foe)
				}
			}
		}
		return foesToAttack
	}

	this.orderFoesByAttribute = function(unit, attribute) {
		let foesToAttack = []
		let spot = database.getSpot(unit.position)
		let foes = database.getUnitsByAllegianceAndTypes([unit.unitType,unitTypeVars.general], oppositeAllegianceVars[unit.allegiance])
		foes.sort((a,b) => {
			return a[attribute] - b[attribute]
		})
		let foeToAttack = []
		if(foes.length > 0){
			foeToAttack = this.getNFoeAlive(foes,foes.length)
			for(let foe of foeToAttack) {
				if(foe != undefined){
					foesToAttack.push(foe)
				}
			}
		}
		return foeToAttack
	}

	this.deathliestTargeting = function(unit) {		
		return [this.orderFoesByAttribute(unit, 'health')[0]]
	}

	this.healthiestTargeting = function(unit) {
		let foes = this.orderFoesByAttribute(unit, 'health')
		return [foes[foes.length - 1]]
	}

	this.strongestTargeting = function(unit) {
		let foes = this.orderFoesByAttribute(unit, 'attack')
		return [foes[foes.length - 1]]
	}

	this.weakestTargeting = function(unit) {
		return [this.orderFoesByAttribute(unit, 'attack')[0]]
	}

	this.pierceTargeting = function(unit) {
		let foesToAttack = []
		let spot = database.getSpot(unit.position)
		let terrain = database.getTerrain(spot.terrain)
		let foes = terrain.getRowOfFoes(spot.id)
		let foeToAttack = []
		if(foes.length > 0) {
			foes.sort((a,b) => database.getSpot(b.position).i - database.getSpot(a.position).i)
			if(unit.allegiance == allegianceVars.ally)
				foes.sort((a,b) => database.getSpot(a.position).i - database.getSpot(b.position).i)					
			foeToAttack = this.getNFoeAlive(foes,2)
			for(let foe of foeToAttack) {
				if(foe != undefined){
					foesToAttack.push(foe)
				}
			}
			
		}
		return foesToAttack
	}

	this.getTargeting = function() {
		return Object.values(this.data.targetings)[0]
	}

	this.databaseFunctions = {
		'getTargeting' : this.getTargeting
	}

	this.updateTargeting = function(data) {

	}

	database.setTargetingToDatabase(this)

}
database.addTypeToDatabase(Targeting, 'Targeting')
