
let unitBase = {
	mamal: {
		beaver: {
			militia: {
		    	name: language.unit.mamal.beaver.militia[0],
		    	level : 1,
		    	distinctions: 0,
		    	unitName: unitNameVars.mamal.beaver.militia,
		    	allegiance: allegianceVars.ally,
		    	health: 3,
		    	maxHealth: 3,
		    	speed: 1,
		    	damageMultiplier: 1,
		    	spriteInfos: {
					spriteName:null,
					spriteSheet: 'tilesets',
					spriteNumber:128
				},
		        skills: [database.getSkillByName(skillVar.logSnap).id],
		    	unitType: unitTypeVars.full,
		    	levelUp: {
		    		2: [{
		    			unitName: unitNameVars.mamal.beaver.militia,
		    			health: 5,
		    			maxHealth: 5,
		    			speed: 4,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logSnap).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 2
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logSnap).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.logSnap).id]		    			
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.warrior
		    		}],
		    		3: [{
		    			unitName: unitNameVars.mamal.beaver.militia,
		    			health: 12,
		    			maxHealth: 12,
		    			speed: 4,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logSnap).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 2
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logSnap).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.logSnap).id, database.getSkillByName(skillVar.strike).id]
		    		}
		    		]
		    	}
		    },
		    warrior: {
		    	name: language.unit.mamal.beaver.warrior[0],
		    	level : 1,
		    	distinctions: 0,
		    	unitName: unitNameVars.mamal.beaver.warrior,
		        allegiance: allegianceVars.ally,
		        health: 3,
		        maxHealth: 3,
		        speed: 2,
		        damageMultiplier: {
    				skillId: database.getSkillByName(skillVar.chop).id,
    				skillEffectType: skillEffectType.damage,
    				damageMultiplier: 2
    			},
		        spriteInfos: {
		            spriteName:null,
		            spriteSheet: 'tilesets',
		            spriteNumber:129
		        },
		        skills: [database.getSkillByName(skillVar.chop).id],
		        unitType: unitTypeVars.full,
		        levelUp: {
		    		2: [{
		    			unitName: unitNameVars.mamal.beaver.warrior,
		    			health: 5,
		    			maxHealth: 5,
		    			speed: 4,
		    			damageMultiplier: 3,
		    			effectMultiplier: 2,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.chop).id]		    			
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.alpha
		    		}],
		    		3: [{
		    			unitName: unitNameVars.mamal.beaver.warrior,
		    			health: 9,
		    			maxHealth: 9,
		    			speed: 6,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 3
		    			},
		    			skills: [database.getSkillByName(skillVar.chop).id]
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.warrior,
		    			health: 6,
		    			maxHealth: 6,
		    			speed: 5,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 4
		    			},
		    			skills: [database.getSkillByName(skillVar.chop).id]
		    		}
		    		]
		    	}
		    },
		    trailBlazer: {
		    	name: language.unit.mamal.beaver.trailBlazer[0],
		    	level : 1,
		    	distinctions: 0,
		    	unitName: unitNameVars.mamal.beaver.trailBlazer,
		        allegiance: allegianceVars.ally,
		        health: 2,
		        maxHealth: 2,
		        speed: 5,
		        spriteInfos: {
		            spriteName:null,
		            spriteSheet: 'tilesets',
		            spriteNumber:132,
		        },
		        skills: [database.getSkillByName(skillVar.logCollect).id, database.getSkillByName(skillVar.strike).id],
		        unitType: unitTypeVars.full,
		        levelUp: {
		    		2: [{
		    			unitName: unitNameVars.mamal.beaver.warrior,
		    			health: 5,
		    			maxHealth: 5,
		    			speed: 4,
		    			damageMultiplier: 3,
		    			effectMultiplier: 2,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.chop).id]		    			
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.alpha
		    		}],
		    		3: [{
		    			unitName: unitNameVars.mamal.beaver.warrior,
		    			health: 9,
		    			maxHealth: 9,
		    			speed: 6,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 3
		    			},
		    			skills: [database.getSkillByName(skillVar.chop).id]
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.warrior,
		    			health: 6,
		    			maxHealth: 6,
		    			speed: 5,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.chop).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 4
		    			},
		    			skills: [database.getSkillByName(skillVar.chop).id]
		    		}
		    		]
		    	}
		    },
		    builder: {
		    	name: language.unit.mamal.beaver.builder[0],
		    	level : 2,
		    	distinctions: 0,
		    	unitName: unitNameVars.mamal.beaver.builder,
		    	allegiance: allegianceVars.ally,
		    	health: 4,
		    	maxHealth: 4,
		    	speed: 1,
		    	attack: 2,
		    	spriteInfos: {
					spriteName:null,
					spriteSheet: 'tilesets',
					spriteNumber:130
				},
		        skills: [database.getSkillByName(skillVar.damRepairs).id],
		    	unitType: unitTypeVars.full,
		    	levelUp: {
		    		2: [{
		    			unitName: unitNameVars.mamal.beaver.builder,
		    			health: 5,
		    			maxHealth: 5,
		    			speed: 1,		    			
		    			healMultiplier: {
		    				skillId: database.getSkillByName(skillVar.damRepairs).id,
		    				skillEffectType: skillEffectType.damage,
		    				healMultiplier: 2
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.damRepairs).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.damRepairs).id]		    			
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.alpha
		    		}],
		    		3: [{
		    			unitName: unitNameVars.mamal.beaver.builder,
		    			health: 7,
		    			maxHealth: 7,
		    			speed: 2,
		    			healMultiplier: {
		    				skillId: database.getSkillByName(skillVar.damRepairs).id,
		    				skillEffectType: skillEffectType.heal,
		    				healMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.damRepairs).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 3
		    			},
		    			skills: [database.getSkillByName(skillVar.damRepairs).id]
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.builder,
		    			health: 5,
		    			maxHealth: 5,
		    			speed: 2,
		    			healMultiplier: {
		    				skillId: database.getSkillByName(skillVar.damRepairs).id,
		    				skillEffectType: skillEffectType.heal,
		    				healMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.damRepairs).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.damRepairs).id]
		    		}
		    		]
		    	}
		    },
		    alpha: {
		    	name: language.unit.mamal.beaver.alpha[0],
		    	level: 2,
		    	distinctions: 0,
		    	unitName: unitNameVars.mamal.beaver.alpha,
		    	allegiance: allegianceVars.ally,
		    	health: 6,
		    	maxHealth: 6,
		    	speed: 1,
		    	attack: 2,
		   		effectMultiplier: 2,
		    	spriteInfos: {
					spriteName:null,
					spriteSheet: 'tilesets',
					spriteNumber:130
				},
		        skills: [database.getSkillByName(skillVar.logLug).id],
		    	unitType: unitTypeVars.full,
		    	levelUp: {
		    		2: [{
		    			unitName: unitNameVars.mamal.beaver.alpha,
		    			health: 9,
		    			maxHealth: 9,
		    			speed: 3,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logLug).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 2
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logLug).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.logLug).id]		    			
		    		}],		    		
		    		3: [{
		    			unitName: unitNameVars.mamal.beaver.alpha,
		    			health: 11,
		    			maxHealth: 11,
		    			speed: 3,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logLug).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 2
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logLug).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.logLug).id]
		    		},
		    		{
		    			unitName: unitNameVars.mamal.beaver.alpha,
		    			health: 9,
		    			maxHealth: 9,
		    			speed: 4,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logLug).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 3
		    			},
		    			effectMultiplier: {
		    				skillId: database.getSkillByName(skillVar.logLug).id,
		    				skillEffectType: skillEffectType.summon,
		    				effectMultiplier: 2
		    			},
		    			skills: [database.getSkillByName(skillVar.logLug).id]
		    		}
		    		]
		    	}
		    }
		},
		wolf: {

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
	        health: 10,
	        maxHealth: 10,
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
	        health: 10,
	        maxHealth: 10,
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
		    	name: language.unit.treant.greenForest.grunt[0],
		    	level: 1,
		    	unitName: unitNameVars.treant.greenForest.grunt,
		    	allegiance: allegianceVars.foe,
		    	health: 4,
		    	maxHealth: 4,
		    	speed: 5,
		    	attack: 1,
		    	spriteInfos: {
		    		spriteName: null,
		    		spriteSheet: 'tilesets',
		    		spriteNumber: 131
		    	},
		        skills: [database.getSkillByName(skillVar.strike).id],
		    	unitType: unitTypeVars.full,
		    	levelUp: {
		    		2: [{
		    			unitName: unitNameVars.treant.greenForest.grunt,
		    			health: 6,
		    			maxHealth: 6,
		    			speed: 5,
		    			skills: [database.getSkillByName(skillVar.strike).id]		    			
		    		},
		    		{
		    			unitName: unitNameVars.treant.greenForest.barkBiter,
		    		},
		    		{
		    			unitName: unitNameVars.treant.greenForest.ogre,
		    		}],
		    		3: [
		    		{
		    			unitName: unitNameVars.treant.greenForest.grunt,
		    			health: 8,
		    			maxHealth: 8,
		    			speed: 6,
		    			damageMultiplier: {
		    				skillId: database.getSkillByName(skillVar.strike).id,
		    				skillEffectType: skillEffectType.damage,
		    				damageMultiplier: 2
		    			},
		    		}
		    		],		    		
		    	}
		    },
			barkBiter: {
				name: language.unit.treant.greenForest.barkBiter[0],
				level: 2,
		    	unitName: unitNameVars.treant.greenForest.barkBiter,
		    	allegiance: allegianceVars.foe,
		    	health: 2,
		    	maxHealth: 2,
		    	speed: 6,
		    	attack: 1,
		    	spriteInfos: {
		    		spriteName: null,
		    		spriteSheet: 'tilesets',
		    		spriteNumber: 121
		    	},
		        skills: [database.getSkillByName(skillVar.cullVermin).id],
		    	unitType: unitTypeVars.full
			},
			ogre: {
				name: language.unit.treant.greenForest.ogre[0],
				level: 2,
		    	unitName: unitNameVars.treant.greenForest.ogre,
		    	allegiance: allegianceVars.foe,
		    	health: 6,
		    	maxHealth: 6,
		    	speed: 2,
		    	attack: 1,
		    	spriteInfos: {
		    		spriteName: null,
		    		spriteSheet: 'tilesets',
		    		spriteNumber: 163
		    	},
		        skills: [database.getSkillByName(skillVar.challengeTheStrong).id],
		    	unitType: unitTypeVars.full
			}
		}				
	},
	support: {
		wood: {
			log: {
		        name: language.unit.support.stackable.log[0],
		        unitName: unitNameVars.support.wood.log,
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

function getNUnitBases(n, allegiance, level) {
	let alleged = []
	let races = unitAllegianceVars[allegiance]
	for(let race of races) {		
		for(let family in unitBase[race]) {
			for(let uName in unitBase[race][family]) {								
				alleged.push(unitBase[race][family][uName])
			}
		}
	}
	if(level) {
		alleged = alleged.filter((a) => a.level <= level)
	}
	shuffleArray(alleged)
	return alleged.slice(0,n)
}

function getUnitBaseFromUnitName(name) {
	for(let race in unitBase) {
		for(let family in unitBase[race]) {
			for(let uName in unitBase[race][family]) {
				if(unitBase[race][family][uName].unitName == name) {
					return unitBase[race][family][uName]
				}
			}
		}
	}
	return null;
}