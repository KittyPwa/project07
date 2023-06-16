function populateDatabase() {
	populateTerrains()
    populateTargeting()
    populateSkills()
	populateLogger()
    populateGameState()
}

function populateSkills() {
    let strike = new Skill()
    strike.updateSkill({
        name: language.skill.strike.name[0],
        skillId: skillVar.strike,
        skillType: skillType.active,
        skillEffectType: skillEffectType.damage,
        targeting: function(data) {
            return database.getTargeting().classicTargeting(data.unit)
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
        skillType: skillType.active,
        skillEffectType: skillEffectType.damage,        
        targeting: function(data) {
            return database.getTargeting().classicTargeting(data.unit)
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
            let effectMultiplier = this.data.effectMultiplier !== undefined ? this.data.effectMultiplier : 1
            log.updateUnit({
                position: log.position == null ? database.getSpotByIJ(1,0, database.getTerrainByAllegiance(allegianceVars.ally).id).id : log.position,        
                stackSize: log.stackSize + 1 * effectMultiplier,
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
        skillType: skillType.active,
        skillEffectType: skillEffectType.damage,        
        targeting: function(data) {
            return database.getTargeting().classicTargeting(data.unit)
        },
        effect: function() {
            let logs = database.getUnitByName(unitNameVars.support.wood.log)           
            let log = logs[0]
            let effectMultiplier = this.data.effectMultiplier !== undefined ? this.data.effectMultiplier : 1
            if(log && log.stackSize > 1) {            
                log.updateUnit({
                    stackSize: log.stackSize - (2 * effectMultiplier),
                })           
                return (this.data.damage)
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
        skillType: skillType.active,
        skillEffectType: skillEffectType.damage,
        targeting: function(data) {
            return database.getTargeting().pierceTargeting(data.unit)
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

    let cullVermin = new Skill()
    cullVermin.updateSkill({
        name: language.skill.cullVermin.name[0],
        skillId: skillVar.cullVermin,
        skillType: skillType.active,
        skillEffectType: skillEffectType.damage,
        targeting: function(data) {
            return database.getTargeting().deathliestTargeting(data.unit)
        },
        effect: function() {            
            return this.data.damage
        },        
        effectDescription: function() {
            return language.skill.cullVermin.description[0] + this.data.damage + language.skill.cullVermin.description[1]  
        },
        data: {
            damage: 1
        }
    })

    let challengeTheStrong = new Skill()
    challengeTheStrong.updateSkill({
        name: language.skill.challengeTheStrong.name[0],
        skillId: skillVar.challengeTheStrong,
        skillType: skillType.active,
        skillEffectType: skillEffectType.damage,
        targeting: function(data) {
            return database.getTargeting().healthiestTargeting(data.unit)
        },
        effect: function() {            
            return this.data.damage
        },        
        effectDescription: function() {
            return language.skill.challengeTheStrong.description[0] + this.data.damage + language.skill.challengeTheStrong.description[1]  
        },
        data: {
            damage: 2
        }
    })

    let damRepairs = new Skill()
    damRepairs.updateSkill({
        name: language.skill.damRepairs.name[0],
        skillId: skillVar.damRepairs,
        skillType: skillType.active,
        skillEffectType: skillEffectType.heal,
        targeting: function(data) {
            let generals = database.getGenerals()
            generals = generals.filter((a) => a.allegiance == allegianceVars.ally)
            return generals
        },
        effect: function() {            
            let logs = database.getUnitByName(unitNameVars.support.wood.log)            
            let log = logs[0]
            let effectMultiplier = this.data.effectMultiplier !== undefined ? this.data.effectMultiplier : 1            
            if(log && log.stackSize > 1) {            
                log.updateUnit({
                    stackSize: log.stackSize - (2 * effectMultiplier),
                })           
                return this.data.heal
            }
            return null
        },        
        effectDescription: function() {
            return language.skill.damRepairs.description[0] + this.data.heal + language.skill.damRepairs.description[1]  
        },
        data: {
            heal: 1
        }
    })

    let logSnap = new Skill()
    logSnap.updateSkill({
        name: language.skill.logSnap.name[0],
        skillId: skillVar.logSnap,
        skillType: skillType.passive,
        passiveIsActivated: function(event) { 
            let isActivated = true            
            let originUnit = database.getUnit(event.origin)      
            if(event.eventType != skillCondition.damageGiven) 
                isActivated = false
            if(originUnit.getFamily() != familyNameVars.beaver)
                isActivated = false
            return isActivated
        },
        targeting: function(data) {
            return [data.target]
        },
        orderType: orderingType.after,
        effect: function() {            
            let logs = database.getUnitByName(unitNameVars.support.wood.log)            
            let log = logs[0]
            let effectMultiplier = this.data.effectMultiplier !== undefined ? this.data.effectMultiplier : 1      
            if(log && log.stackSize > 0) {            
                log.updateUnit({
                    stackSize: log.stackSize - (1 * effectMultiplier),
                })          
                console.log(log.isAlive()) 
                return this.data.damage
            }
            return null
        },        
        effectDescription: function() {
            return language.skill.logSnap.description[0] + this.data.damage + language.skill.logSnap.description[1]  
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

function populateGameState() {
    new GameState()
}

populateDatabase()