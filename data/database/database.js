function Database() {
	this.data = {};
}

let database = new Database();
addEntriesToDatabase(['terrain', 'spot', 'ally', 'enemy'], database)
console.log(database)
