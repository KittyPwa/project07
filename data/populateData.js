function populateDatabase() {
	populateTerrains()
    populateTargeting()
    populateSkills()
	populateUnits()
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
            let log = database.getUnitByName(language.unit.support.stackable.log[0])            
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
            let log = database.getUnitByName(language.unit.support.stackable.log[0])[0]            
            if(log.stackSize > 1) {            
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

function populateUnits() {
    /*new Unit().updateUnit({
        name: 'Dam',
        allegiance: allegianceVars.ally,
        position: database.getSpotByIJ(0,2, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
        additionalPositions: [
            database.getSpotByIJ(0,0, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
            database.getSpotByIJ(0,1, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
            database.getSpotByIJ(0,3, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
            database.getSpotByIJ(0,4, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
        ],
        health: 6,
        spriteInfos: {
            spriteName:null,
            spriteSheet: 'tilesets',
            spriteNumber:1028
        },
        skills: [],
        unitType: unitTypeVars.general
    })
    new Unit().updateUnit({
        name: language.unit.support.stackable.log[0],
        allegiance: allegianceVars.ally,
        //position: database.getSpotByIJ(1,0, database.getTerrainByAllegiance(allegianceVars.ally).id).id,        
        stackSize: 0,
        spriteInfos: {
            spriteName:null,
            spriteSheet: 'tilesets',
            spriteNumber:750
        },
        skills: [],
        unitType: unitTypeVars.support
    })
    new Unit().updateUnit({
        name: 'Roots',
        allegiance: allegianceVars.foe,
        position: database.getSpotByIJ(3,2, database.getTerrainByAllegiance(allegianceVars.foe).id).id,
        additionalPositions: [
            database.getSpotByIJ(3,0, database.getTerrainByAllegiance(allegianceVars.foe).id).id,
            database.getSpotByIJ(3,1, database.getTerrainByAllegiance(allegianceVars.foe).id).id,
            database.getSpotByIJ(3,3, database.getTerrainByAllegiance(allegianceVars.foe).id).id,
            database.getSpotByIJ(3,4, database.getTerrainByAllegiance(allegianceVars.foe).id).id,
        ],
        health: 3,
        spriteInfos: {
            spriteName:null,
            spriteSheet: 'tilesets',
            spriteNumber:951
        },
        skills: [],
        unitType: unitTypeVars.general
    })
    /*new Unit().updateUnit({
    	name: language.unit.mamal.beaver.militia[0],
    	allegiance: allegianceVars.ally,
    	position: database.getSpotByIJ(1,1, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
    	health: 3,
    	speed: 1,
    	damageMultiplier: 1,
    	spriteInfos: {
			spriteName:null,
			spriteSheet: 'tilesets',
			spriteNumber:129
		},
        skills: [database.getSkillByName(skillVar.strike).id],
    	unitType: unitTypeVars.full
    })

    new Unit().updateUnit({
        name: language.unit.mamal.beaver.warrior[0],
        allegiance: allegianceVars.ally,
        position: database.getSpotByIJ(1,1, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
        health: 3,
        speed: 2,
        damageMultiplier: 2,
        spriteInfos: {
            spriteName:null,
            spriteSheet: 'tilesets',
            spriteNumber:129
        },
        skills: [database.getSkillByName(skillVar.chop).id],
        unitType: unitTypeVars.full
    })

    new Unit().updateUnit({
    	name: 'Gryphon',
    	allegiance: allegianceVars.ally,
    	position: database.getSpotByIJ(1,2, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
    	health: 4,
    	speed: 1,
    	attack: 2,
    	spriteInfos: {
			spriteName:null,
			spriteSheet: 'tilesets',
			spriteNumber:130
		},
        skills: [database.getSkillByName(skillVar.logLug).id],
    	unitType: unitTypeVars.full

    })

    new Unit().updateUnit({
    	name: 'Goblin',
    	allegiance: allegianceVars.foe,
    	position: database.getSpotByIJ(0,1, database.getTerrainByAllegiance(allegianceVars.foe).id).id,
    	health: 4,
    	speed: 5,
    	attack: 1,
    	spriteInfos: {
    		spriteName: null,
    		spriteSheet: 'tilesets',
    		spriteNumber: 131
    	},
        skills: [database.getSkillByName(skillVar.strike).id],
    	unitType: unitTypeVars.full
    })*/
}

function populateLogger() {
    new Logger()

}

function populateTargeting() {
    new Targeting()    
}

populateDatabase()