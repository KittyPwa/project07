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
    allyTerrain.updateSpotsType(0, 3, 0, 0, tileTypeVars.summon)
    allyTerrain.updateSpotsType(0, 3, 4, 4, tileTypeVars.summon)

    let foeTerrain = new Terrain()
    foeTerrain.updateTerrain({
    	allegiance: allegianceVars.foe,
    	width: terrainVars.rowAmount,
    	height: terrainVars.collumnAmount
    })	    
    foeTerrain.updateSpots()
    foeTerrain.updateSpotsType(0, 3, 0, 0, tileTypeVars.summon)
    foeTerrain.updateSpotsType(0, 3, 4, 4, tileTypeVars.summon)
}

function populateUnits() {
    new Unit().updateUnit({
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
    new Unit().updateUnit({
    	name: 'Barbarian',
    	allegiance: allegianceVars.ally,
    	position: database.getSpotByIJ(1,1, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
    	health: 3,
    	speed: 1,
    	damageMultiplier: 2,
    	spriteInfos: {
			spriteName:null,
			spriteSheet: 'tilesets',
			spriteNumber:129
		},
        skills: [database.getSkillByName(skillVar.strike).id],
    	unitType: unitTypeVars.full
    })

    new Unit().updateUnit({
    	name: 'Gryphon',
    	allegiance: allegianceVars.ally,
    	position: database.getSpotByIJ(1,2, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
    	health: 4,
    	speed: 3,
    	attack: 2,
    	spriteInfos: {
			spriteName:null,
			spriteSheet: 'tilesets',
			spriteNumber:130
		},
        skills: [database.getSkillByName(skillVar.pierce).id],
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
    })
}

function populateLogger() {
    new Logger()

}

function populateTargeting() {
    new Targeting()    
}

populateDatabase()