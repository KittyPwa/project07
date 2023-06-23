function populateDatabase() {
	populateTerrains()
    populateTargeting()
    populateSkills()
	populateLogger()
    populateGameState()
}

function populateSkills() {
    let inflictDamage = new Skill()
    inflictDamage.updateSkill({
        skillId: skillVar.inflictDamage,
        effects: [{
            skillEffectType: skillEffectType.damage,
            order: 1,
            effect: function(data) {
                return data.damage
            },
        }],
    })

    let giveHeal = new Skill()
    giveHeal.updateSkill({
        skillId: skillVar.giveHeal,
        effects: [{
            skillEffectType: skillEffectType.heal,
            order: 1,
            effect: function(data) {
                return data.heal
            }
        }]
    })

    let updateLog = new Skill()
    updateLog.updateSkill({
        skillId: skillVar.updateLog,
        effects: [{
            skillEffectType: skillEffectType.summon,
            order: 1,
            effect: function(data) {
                let effectMultiplier = 1
                if(data.origin.effectMultiplier) {
                    if(data.origin.effectMultiplier.skillId == data.skillId && data.origin.effectMultiplier.skillEffectType == skillEffectType.summon) {
                        effectMultiplier = data.origin.effectMultiplier.effectMultiplier
                    }
                }
                let ret = true
                if(data.logAmount  < 0) {
                    if(data.target.stackSize + data.logAmount >= 0) {
                        data.target.removeStackSize(data.logAmount * effectMultiplier)
                    } else {
                        ret = false
                    }
                } else {
                    data.target.takeStackSize(data.logAmount * effectMultiplier)
                }        
                return ret
            }, 
        }]
    })

    let strike = new Skill()
    strike.updateSkill({
        name: language.skill.strike.name[0],
        skillId: skillVar.strike,
        skillType: skillType.active,
        effects: [{
            skillEffectType: skillEffectType.damage,
            targeting: function(data) {
                return database.getTargeting().classicTargeting(data.unit)
            },
            order:1,
            effect: function(data) {
                return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
            },
            data: {
                damage: 1
            }
        }],        
        effectDescription: function() {
            return language.skill.strike.description[0] + this.data.damage + language.skill.strike.description[1]  
        },
    })


    let chop = new Skill()
    chop.updateSkill({
        name: language.skill.chop.name[0],
        skillId: skillVar.chop,
        skillType: skillType.active,
        effects: [
            {
                skillEffectType: skillEffectType.damage,        
                targeting: function(data) {
                    return database.getTargeting().classicTargeting(data.unit)
                },
                order:2,
                effect: function(data) {
                    return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                },
                data: {
                    damage: 1
                }
            },
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                },
                data: {
                    logAmount: 2,
                    skillId: chop.id
                }
            }

        ],
        effectDescription: function() {
            return language.skill.chop.description[0] + this.data.damage + language.skill.chop.description[1] + this.data.stackSize + language.skill.chop.description[2]  
        },
    })

    let logLug = new Skill()
    logLug.updateSkill({
        name: language.skill.logLug.name[0],
        skillId: skillVar.logLug,
        skillType: skillType.active,
        targeting: function(data) {
            return database.getTargeting().classicTargeting(data.unit)
        },
        effects: [
            {
                skillEffectType: skillEffectType.damage,        
                targeting: function(data) {
                    return database.getTargeting().classicTargeting(data.unit)
                },
                order: 2,
                effect: function(data) {
                    return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                },
                data: {
                    damage: 3
                }
            },
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                },
                data: {
                    logAmount: -2,
                    skillId: logLug.id
                }
            }
        ],      
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
        effects: [
            {
                skillEffectType: skillEffectType.damage,        
                targeting: function(data) {
                    return database.getTargeting().pierceTargeting(data.unit)
                },
                order: 1,
                effect: function(data) {
                    return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                },
                data: {
                    damage: 1
                }
            },
        ],        
        effectDescription: function() {
            return language.skill.pierce.description[0] + this.data.damage + language.skill.pierce.description[1]  
        },
    })

    let cullVermin = new Skill()
    cullVermin.updateSkill({
        name: language.skill.cullVermin.name[0],
        skillId: skillVar.cullVermin,
        skillType: skillType.active,
        effects: [
            {
                skillEffectType: skillEffectType.damage,        
                targeting: function(data) {
                    return database.getTargeting().deathliestTargeting(data.unit)
                },
                order: 1,
                effect: function(data) {
                    return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                },
                data: {
                    damage: 1
                }
            },
        ],
        effectDescription: function() {
            return language.skill.cullVermin.description[0] + this.data.damage + language.skill.cullVermin.description[1]  
        },
    })

    let challengeTheStrong = new Skill()
    challengeTheStrong.updateSkill({
        name: language.skill.challengeTheStrong.name[0],
        skillId: skillVar.challengeTheStrong,
        skillType: skillType.active,
        effects: [
            {
                skillEffectType: skillEffectType.damage,        
                targeting: function(data) {
                    return database.getTargeting().healthiestTargeting(data.unit)
                },
                order:1,
                effect: function(data) {
                    return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                },
                data: {
                    damage: 2
                }
            },
        ],       
        effectDescription: function() {
            return language.skill.challengeTheStrong.description[0] + this.data.damage + language.skill.challengeTheStrong.description[1]  
        },
    })

    let damRepairs = new Skill()
    damRepairs.updateSkill({
        name: language.skill.damRepairs.name[0],
        skillId: skillVar.damRepairs,
        skillType: skillType.active,
        skillEffectType: skillEffectType.heal,
        effects: [
            {
                skillEffectType: skillEffectType.heal,        
                targeting: function(data) {
                    return database.getTargeting().alliedGeneralTargeting()
                },
                order: 2,
                effect: function(data) {
                    return database.getSkillByName(skillVar.giveHeal).effects[skillEffectType.heal].effect(this.data)
                },
                data: {
                    heal: 1
                }
            },
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                },
                data: {
                    logAmount: -2,
                    skillId: damRepairs.id
                }
            }
        ],      
        effectDescription: function() {
            return language.skill.damRepairs.description[0] + this.data.heal + language.skill.damRepairs.description[1]  
        },
    })

    let logSnap = new Skill()
    logSnap.updateSkill({
        name: language.skill.logSnap.name[0],
        skillId: skillVar.logSnap,
        skillType: skillType.passive,
        skillEffectType: skillEffectType.damage,
        passiveIsActivated: function(event) { 
            let isActivated = true            
            let originUnit = database.getUnit(event.origin)      
            if(event.eventType != skillCondition.damageGiven) 
                isActivated = false
            if(originUnit.getFamily() != familyNameVars.beaver)
                isActivated = false
            return isActivated
        },
        orderType: orderingType.after,
        effects: [
            {
                skillEffectType: skillEffectType.damage,        
                targeting: function(data) {
                    return [data.target]
                },
                order: 2,
                effect: function(data) {
                    let dmg = null
                    if(this.data.authorized)
                        dmg = database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                    return dmg
                },
                data: {
                    damage: 1
                }
            },
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    let success = database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                    database.getSkillByName(skillVar.logSnap).effects[skillEffectType.damage].data.authorized = success
                },
                data: {
                    logAmount: -1,
                    skillId: logSnap.id,
                }
            }
        ],        
        effectDescription: function() {
            return language.skill.logSnap.description[0] + this.data.damage + language.skill.logSnap.description[1]  
        },
    })

    let logCollect = new Skill()
    logCollect.updateSkill({
        name: language.skill.logCollect.name[0],
        skillId: skillVar.logCollect,
        skillType: skillType.passive,
        skillEffectType: skillEffectType.summon,
        passiveIsActivated: function(event) { 
            let isActivated = true            
            let originUnit = database.getUnit(event.origin) 
            if(originUnit.getRace() != raceNameVars.treant)
                isActivated = false     
            if(event.eventType != skillCondition.unitDeath) 
                isActivated = false
            if(originUnit.allegiance != allegianceVars.foe)
                isActivated = false
            if(isActivated)
                console.log(event)
            return isActivated
        },
        effects: [
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                },
                data: {
                    logAmount: 1,
                    skillId: logCollect.id,
                }
            }
        ],     
        effectDescription: function() {
            return language.skill.logSnap.description[0] + this.data.damage + language.skill.logSnap.description[1]  
        },
        data: {
            damage: 1
        }
    })
    updateSkillEffects()
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

function updateSkillEffects() {
    for(let skill of Object.values(database.getSkills())) {
        let effects = {}
        for(let effect of skill.effects) {
            effects[effect.skillEffectType] = effect
        }
        skill.updateSkill({
            effects: effects
        })
    }
}

populateDatabase()