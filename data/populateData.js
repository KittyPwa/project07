function populateDatabase() {
	populateTerrains()
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
}

function populateTerrains() {
	let allyTerrain = new Terrain()
    allyTerrain.updateTerrain({
    	allegiance: allegianceVars.ally,
    	width: terrainVars.rowAmount,
    	height: terrainVars.collumnAmount
    })
    allyTerrain.updateSpots()
    allyTerrain.updateSpotsType(1, 3, 0, 0, tileTypeVars.summon)
    allyTerrain.updateSpotsType(1, 3, 4, 4, tileTypeVars.summon)
    allyTerrain.updateSpotsType(0, 0, 0, 4, tileTypeVars.dam)

    let foeTerrain = new Terrain()
    foeTerrain.updateTerrain({
    	allegiance: allegianceVars.foe,
    	width: terrainVars.rowAmount,
    	height: terrainVars.collumnAmount
    })	    
    foeTerrain.updateSpots()
    foeTerrain.updateSpotsType(0, 3, 0, 0, tileTypeVars.summon)
    foeTerrain.updateSpotsType(0, 3, 4, 4, tileTypeVars.summon)
    foeTerrain.updateSpotsType(3, 3, 0, 4, tileTypeVars.roots)
}

function populateUnits() {
    new Unit().updateUnit({
    	name: 'Unit1',
    	allegiance: allegianceVars.ally,
    	position: database.getSpotByIJ(1,1, database.getTerrainByAllegiance(allegianceVars.ally).id).id,
    	health: 3,
    	speed: 4,
    	attack: 1,
    	spriteInfos: {
			spriteName:null,
			spriteSheet: 'tilesets',
			spriteNumber:129
		},
        skills: [database.getSkillByName(skillVar.strike).id],
    	unitType: unitTypeVars.full
    })

    new Unit().updateUnit({
    	name: 'Unit2',
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
        skills: [database.getSkillByName(skillVar.strike).id],
    	unitType: unitTypeVars.full

    })

    new Unit().updateUnit({
    	name: 'Unit3',
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

populateDatabase()