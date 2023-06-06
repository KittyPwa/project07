function populateDatabase() {
	populateTerrains()
    populateTargeting()
    populateSkills()
	populateLogger()
}

function populateSkills() {
    let strike = new Skill()
    strike.updateSkill({
        name: language.skill.strike.name[0],
        skillId: skillVar.strike,
        skillType: skillType.damage,
        targeting: function(unit) {
            return database.getTargeting().classicTargeting(unit)
        },
        effect: function() {            
            return this.data.damage
        },        
        effectDescription: function() {
            return language.skill.strike.description[0] + this.data.damage + language.skill.strike.description[1]  
        },
        data: {
            damage: 1
        }
    })
    let chop = new Skill()
    chop.updateSkill({
        name: language.skill.chop.name[0],
        skillId: skillVar.chop,
        skillType: skillType.damage,        
        targeting: function(unit) {
            return database.getTargeting().classicTargeting(unit)
        },
        effect: function() {
            let logs = database.getUnitByName(unitNameVars.support.wood.log)
            if(logs.length == 0) {
                log = new Unit()
                log.updateUnit(unitBase.support.wood.log)
                let position = database.getRandomAvailableSpot(database.getTerrainByAllegiance(log.allegiance).id, log.unitType).id
                log.updateUnit({
                    position: position
                })
            }   
            if(log.stackSize == 0) {
                log.newUnit = true;
            }
            log.updateUnit({
                position: log.position == null ? database.getSpotByIJ(1,0, database.getTerrainByAllegiance(allegianceVars.ally).id).id : log.position,        
                stackSize: log.stackSize + 1,
            })            
            return this.data.damage
        },        
        effectDescription: function() {
            return language.skill.chop.description[0] + this.data.damage + language.skill.chop.description[1] + this.data.stackSize + language.skill.chop.description[2]  
        },
        data: {
            damage: 1
        }
    })

    let logLug = new Skill()
    logLug.updateSkill({
        name: language.skill.logLug.name[0],
        skillId: skillVar.logLug,
        skillType: skillType.damage,        
        targeting: function(unit) {
            return database.getTargeting().classicTargeting(unit)
        },
        effect: function() {
            let logs = database.getUnitByName(language.unit.support.stackable.log[0])            
            let log = logs[0]
            if(log && log.stackSize > 1) {            
                log.updateUnit({
                    stackSize: log.stackSize - 2,
                })           
                return this.data.damage 
            }
            return null
        },        
        effectDescription: function() {
            return language.skill.logLug.description[0] + this.data.damage + language.skill.logLug.description[1] + this.data.stackSize + language.skill.logLug.description[2]  
        },
        data: {
            damage: 3
        }
    })

    let pierce = new Skill()
    pierce.updateSkill({
        name: language.skill.pierce.name[0],
        skillId: skillVar.pierce,
        skillType: skillType.damage,
        targeting: function(unit) {
            return database.getTargeting().pierceTargeting(unit)
        },
        effect: function() {            
            return this.data.damage
        },        
        effectDescription: function() {
            return language.skill.pierce.description[0] + this.data.damage + language.skill.pierce.description[1]  
        },
        data: {
            damage: 1
        }
    })
}

function populateTerrains() {
	let allyTerrain = new Terrain()
    allyTerrain.updateTerrain({
    	allegiance: allegianceVars.ally,
    	width: terrainVars.rowAmount,
    	height: terrainVars.collumnAmount
    })
    allyTerrain.updateSpots()
    allyTerrain.updateSpotsType(0, 3, 0, 0, tileTypeVars.support)
    allyTerrain.updateSpotsType(0, 3, 4, 4, tileTypeVars.support)

    let foeTerrain = new Terrain()
    foeTerrain.updateTerrain({
    	allegiance: allegianceVars.foe,
    	width: terrainVars.rowAmount,
    	height: terrainVars.collumnAmount
    })	    
    foeTerrain.updateSpots()
    foeTerrain.updateSpotsType(0, 3, 0, 0, tileTypeVars.support)
    foeTerrain.updateSpotsType(0, 3, 4, 4, tileTypeVars.support)
}

function populateLogger() {
    new Logger()

}

function populateTargeting() {
    new Targeting()    
}

populateDatabase()