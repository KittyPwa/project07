function GameState() {

	this.id = uuidv4()

	this.foelevel = 1
	this.allylevel = 1

	this.distinctionsAmountForNextLevel = getRandomInt(3,7)

	this.battleAmount = 0

	this.deadAllies = []

	this.getDeadAllies = function() {
		return this.deadAllies
	}

	this.getFoeLevel = function() {
		return this.foelevel
	}

	this.getAllyLevel = function() {
		return this.allylevel
	}		

	this.updateGameState = function(data) {
		this.id = data.id != undefined ? data.id : this.id;
		this.foelevel = data.foelevel != undefined ? data.foelevel : this.foelevel;
		this.allylevel = data.allylevel != undefined ? data.allylevel : this.allylevel;
		this.battleAmount = data.battleAmount != undefined ? data.battleAmount : this.battleAmount
		this.distinctionsAmountForNextLevel = data.distinctionsAmountForNextLevel != undefined ? data.distinctionsAmountForNextLevel : this.distinctionsAmountForNextLevel
		this.deadAllies = data.deadAllies != undefined ? data.deadAllies : this.deadAllies
		database.setGameStateToDatabase(this)
	}

	this.getGameState = function() {
		return Object.values(this.data.gameStates)[0]
	}

	this.databaseFunctions = {
		'getGameState' : this.getGameState
	}

	this.type = 'GameState'

	database.setGameStateToDatabase(this)

}

database.addTypeToDatabase(GameState, 'GameState')
