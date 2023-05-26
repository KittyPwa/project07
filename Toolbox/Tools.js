//----------------------------------------------------

//Database

var database
function Database() {
    this.data = {}

    this.types = {}

    this.addTypeToDatabase = function(type, typeName) { 
        let capitalized = capitalizeFirstLetter(typeName)       
        this.types[capitalized] = type
        this.establishAdditionalFunctions(type)
    }

    this.setDatabaseToLocalStorage = function() {
        localStorage.setItem('database', JSON.stringify(this.data))
    };

    this.createBaseData = function(dataName) {
        let plural = dataName + 's'
        this.data[plural] = {}
    }

    this.createTargetedGetter = function(dataName) {
        let capitalized = capitalizeFirstLetter(dataName)
        let functionized = 'get' + capitalized
        let plural = dataName + 's'
        this[functionized] = function(id) {
            return this.data[plural][id]
        }    
    }

    this.createGeneralGetter = function(dataName) {
        let capitalized = capitalizeFirstLetter(dataName)
        let functionized = 'get' + capitalized + 's'
        let plural = dataName + 's'
        this[functionized] = function() {
            return this.data[plural]
        }
    }

    this.createSetter = function(dataName) {
        let capitalized = capitalizeFirstLetter(dataName)
        let functionized = 'add' + capitalized + 'ToDatabase'
        let plural = dataName + 's'
        this[functionized] = function(toAdd) {
            this.data[plural][toAdd.id] = toAdd
        }
    }

    this.createDeleter = function(dataName) {
        let capitalized = capitalizeFirstLetter(dataName)
        let functionized = 'delete' + capitalized
        let plural = dataName + 's'
        this[functionized] = function(toDelete) {
            delete this.data[plural][toDelete.id]
        }
    }

    this.addEntryToDatabase = function(dataName) {
        this.createBaseData(dataName)
        this.createTargetedGetter(dataName)
        this.createGeneralGetter(dataName)
        this.createSetter(dataName)
        this.createDeleter(dataName)
    }

    this.addEntriesToDatabase = function(entries) {
        for(let entry of entries) {
            this.addEntryToDatabase(entry, this)
        }
    }

    this.getDatabaseFromLocalStorage = function() {
        let json = JSON.parse(localStorage.getItem('database'))
        this.addEntriesToDatabase(dataTypes)
        for(let key in json) {
            let elem = json[key]
            elem = Object.values(elem)
            if(elem.length) {
                for(let part of elem) {
                    if(part['type'] != undefined) {                                            
                        let data = new this.types[part['type']]()
                        let capitalized = capitalizeFirstLetter(part['type'])
                        data['update'+capitalized](part)
                        this['add'+capitalized+'ToDatabase'](data, this)
                    }
                }
            } 
        }
    }

    this.establishAdditionalFunctions = function(type) {
        let temp = new type()
        if(temp.databaseFunctions != undefined) {
            for(let dFunction of Object.keys(temp.databaseFunctions)) {
                this[dFunction] = temp.databaseFunctions[dFunction]
            }
        }
        let capitalized = capitalizeFirstLetter(temp.type)
        this['delete'+capitalized](temp)
    }

}



database = new Database()

database.addEntriesToDatabase(dataTypes)

//-------------------------------------------------------


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function orderTwoInts(ints) {
    let res = []
    if(ints[0] > ints[1])
        return ints.reverse()
    return ints
}

function getRandomInt(min, max) {
  max++;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

(function () {
    function decimalAdjust(type, value, exp) {
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

var direction = {
    left: {
        id: 0,
        name: 'left',
        opposite: 2
    },
    up: {
        name: 'up',
        id:1,
        opposite: 3
    },
    right: {
        name: 'right',
        id: 2,
        opposite: 0
    },
    down: {
        name: 'down',
        id: 3,
        opposite: 1
    }
}

