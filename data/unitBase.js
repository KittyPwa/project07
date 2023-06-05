let unitBase = {
	mamal: {
		beaver: {
			militia: {
		    	name: language.unit.mamal.beaver.militia[0],
		    	unitName: unitNameVars.mamal.beaver.militia,
		    	allegiance: allegianceVars.ally,
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
		    },
		    warrior: {
		    	name: language.unit.mamal.beaver.warrior[0],
		    	unitName: unitNameVars.mamal.beaver.warrior,
		        allegiance: allegianceVars.ally,
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
		    },
		    builder: {
		    	name: language.unit.mamal.beaver.builder[0],
		    	unitName: unitNameVars.mamal.beaver.builder,
		    	allegiance: allegianceVars.ally,
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
		    }
		}
	},
	general: {
		dam: {
	        name: language.unit.general.dam[0],
	        unitName: unitNameVars.general.dam,
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
	    },
	    roots: {
	        name: language.unit.general.roots[0],
	        unitName: unitNameVars.general.roots,
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
	    }
	},
	treant: {
		greenForest: {
			grunt: {
			    	name: language.unit.treant.grunt[0],
			    	unitName: unitNameVars.treant.grunt,
			    	allegiance: allegianceVars.foe,
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
			    }
		}				
	},
	support: {
		wood: {
			log: {
		        name: language.unit.support.stackable.log[0],
		        unitName: unitNameVars.support.log,
		        allegiance: allegianceVars.ally,
		        stackSize: 0,
		        spriteInfos: {
		            spriteName:null,
		            spriteSheet: 'tilesets',
		            spriteNumber:750
		        },
		        skills: [],
		        unitType: unitTypeVars.support
		    }
		}
		
	}
}

function getNUnitBases(n, allegiance) {
	let alleged = []
	let races = unitAllegianceVars[allegiance]
	for(let race of races) {		
		for(let family in unitBase[race]) {
			for(let uName in unitBase[race][family]) {								
				alleged.push(unitBase[race][family][uName])
			}
		}
	}
	return alleged.slice(0,n)
}