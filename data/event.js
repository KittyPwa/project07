function Event() {

	this.id = uuidv4()

	this.type = 'Event'

	this.origin = null

	this.target = null

	this.eventType = null		

	this.updateEvent = function(data) {
		this.id = data.id !== undefined ? data.id : this.id;		
		this.origin = data.origin !== undefined ? data.origin : this.origin;
		this.target = data.target !== undefined ? data.target : this.target;
		this.eventType = data.eventType !== undefined ? data.eventType : this.eventType;
	}

	database.setEventToDatabase(this)	
}
database.addTypeToDatabase(Event, 'event')
