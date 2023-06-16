function GameState() {

	this.id = uuidv4()

	this.globalLevel = 1

	this.distinctionsAmountForNextLevel = 1

	//this.battleAmountForNextLevel = getRandomInt(3,7)
	this.battleAmountForNextLevel = 1

	this.battleAmountForNextEnemy = 3

	this.enemyCount = 3

	this.battleAmount = 0

	this.deadAllies = []

	this.getBattleAmountForNextEnemy = function() {
		return this.battleAmountForNextEnemy
	}

	this.getEnemyCount = function() {
		return this.enemyCount
	}

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
		let globalLevel = this.globalLevel
		let enemyCount = this.enemyCount
		let update = false
		if (this.battleAmount % this.battleAmountForNextLevel == 0) {
			globalLevel = this.globalLevel + 1
			update = true
		}
		if (this.battleAmount % this.battleAmountForNextEnemy == 0) {
			enemyCount = this.enemyCount + 1
			update = true
		}

		if(update) {
			this.updateGameState({
				globalLevel: globalLevel,
				enemyCount: enemyCount
			})
		}

	}

	this.updateGameState = function(data) {
		this.id = data.id !== undefined ? data.id : this.id;
		this.globalLevel = data.globalLevel !== undefined ? data.globalLevel : this.globalLevel;
		this.battleAmountForNextEnemy = data.battleAmountForNextEnemy !== undefined ? data.battleAmountForNextEnemy : this.battleAmountForNextEnemy;
		this.enemyCount = data.enemyCount !== undefined ? data.enemyCount : this.enemyCount;
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
