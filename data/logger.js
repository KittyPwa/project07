function Logger() {

	this.id = uuidv4()

	this.logs = []

	this.type = 'Logger'

	this.updateLogger = function(data) {
		this.id = data.id != undefined ? data.id : this.id;
		this.logs = data.logs != undefined ? data.logs : this.logs
	}

	this.addLog = function(log) {
		this.logs.push(log)
	}

	this.getLogs = function() {
		return this.logs
	}

	this.getLogger = function() {
		return Object.values(this.data.loggers)[0]
	}

	this.databaseFunctions = {
		'getLogger' : this.getLogger
	}

	database.setLoggerToDatabase(this)	
}
database.addTypeToDatabase(Logger, 'Logger')
