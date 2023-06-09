function GameState() {

	this.id = uuidv4()

	this.globalLevel = 1

	this.distinctionsAmountForNextLevel = 1

	//this.battleAmountForNextLevel = getRandomInt(3,7)
	this.battleAmountForNextLevel = 1

	this.battleAmount = 0

	this.deadAllies = []

	this.getDeadAllies = function() {
		return this.deadAllies
	}

	this.clearDeadAllies = function() {
		this.updateGameState({
			deadAllies: []
		})
	}

	this.getGlobalLevel = function() {
		return this.globalLevel
	}

	this.getAllyLevel = function() {
		return this.allylevel
	}		

	this.increaseBattleAmount = function() {
		this.updateGameState({
			battleAmount : this.battleAmount + 1
		})
		if (this.battleAmount >= this.battleAmountForNextLevel) {
			this.updateGameState({
				battleAmount : 0,
				globalLevel: this.globalLevel + 1
			})
		}
	}

	this.updateGameState = function(data) {
		this.id = data.id !== undefined ? data.id : this.id;
		this.globalLevel = data.globalLevel !== undefined ? data.globalLevel : this.globalLevel;
		this.battleAmount = data.battleAmount !== undefined ? data.battleAmount : this.battleAmount
		this.distinctionsAmountForNextLevel = data.distinctionsAmountForNextLevel !== undefined ? data.distinctionsAmountForNextLevel : this.distinctionsAmountForNextLevel
		this.battleAmountForNextLevel = data.battleAmountForNextLevel !== undefined ? data.battleAmountForNextLevel : this.battleAmountForNextLevel;
		this.deadAllies = data.deadAllies !== undefined ? data.deadAllies : this.deadAllies
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
