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
                if(data.origin.effectMultiplier !== null) {
                    for(let multiplier of data.origin.effectMultiplier) {
                        if(multiplier.skillId == data.skillId && multiplier.skillEffectType == skillEffectType.summon) {
                            effectMultiplier = multiplier.effectMultiplier
                        }
                    }
                }
                let ret = {
                    updated: true,
                    amount: data.logAmount * effectMultiplier
                }

                if(data.logAmount  < 0) {
                    if(data.target.stackSize + data.logAmount < 0) {
                        ret = {
                            updated: false,
                            amount: null
                        }
                    }
                }     
                console.log(ret)  
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
            effectDescription: function(damage) {
                return {
                    1: 'origin',
                    2: 0,
                    3: 'target',
                    4: 1,
                    5: 'amount',
                    6: 2,
                }
            },
            data: {
                damage: 1
            }
        }],        
        
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
                order:1,
                effect: function(data) {
                    return database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                },
                effectDescription: function(damage) {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
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
                order: 2,
                effect: function(data) {
                    database.getSkillByName(skillVar.chop).updateSkill({data:{amount:null}})
                    let ret = database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                    return ret
                },
                effectDescription: function(stackSize) {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'amount',
                        4: 1
                    }
                },
                data: {
                    logAmount: 2,
                    skillId: chop.id
                }
            }

        ],
        
        data: {
            amount: null
        }
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
                    let dmg = null
                    if(this.data.authorized) {
                        dmg = database.getSkillByName(skillVar.inflictDamage).effects[skillEffectType.damage].effect(this.data)
                    }
                    return dmg
                },
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
                },

                data: {
                    damage: 3,
                    authorized: false,
                }
            },
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    let logLug = database.getSkillByName(skillVar.logLug)
                    logLug.effects[skillEffectType.damage].data.authorized = false
                    let ret = database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                    if(ret['updated']) {
                        logLug.effects[skillEffectType.damage].data.authorized = true
                    }
                    return ret
                },
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'amount',
                        4: 1
                    }
                },
                data: {
                    logAmount: -2,
                    skillId: logLug.id
                }
            }
        ],      
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
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
                },
                data: {
                    damage: 1
                }
            },
        ],        
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
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
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
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
                },
                data: {
                    damage: 2
                }
            },
        ],       
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
                    let heal = null
                    if(this.data.authorized){
                        heal = database.getSkillByName(skillVar.giveHeal).effects[skillEffectType.heal].effect(this.data)
                    }
                    return heal
                },
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
                },
                data: {
                    heal: 1,
                    authorized: false,
                }
            },
            {
                skillEffectType: skillEffectType.summon,        
                targeting: function(data) {
                    return database.getTargeting().logTargeting(this.data)
                },
                order: 1,
                effect: function(data) {
                    let damRepairs = database.getSkillByName(skillVar.damRepairs)
                    damRepairs.effects[skillEffectType.heal].data.authorized = false
                    let ret = database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                    if(ret['updated']) {
                        damRepairs.effects[skillEffectType.heal].data.authorized = true
                    }
                    return ret
                },
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'amount',
                        4: 1,
                    }
                },
                data: {
                    logAmount: -2,
                    skillId: damRepairs.id
                }
            }
        ],      
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
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'target',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
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
                    let logSnap = database.getSkillByName(skillVar.logSnap)
                    logSnap.effects[skillEffectType.damage].data.authorized = false
                    let ret = database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                    if(ret['updated']) {
                        logSnap.effects[skillEffectType.damage].data.authorized = true
                    }
                    return ret
                },
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'amount',
                        4: 1,
                    }
                },
                data: {
                    logAmount: -1,
                    skillId: logSnap.id,
                }
            }
        ],        
    })

    let logCollect = new Skill()
    logCollect.updateSkill({
        name: language.skill.logCollect.name[0],
        skillId: skillVar.logCollect,
        skillType: skillType.passive,
        skillEffectType: skillEffectType.summon,
        passiveIsActivated: function(event) { 
            let isActivated = true            
            let targetUnit = database.getUnit(event.target) 
            if(targetUnit.getRace() != raceNameVars.treant)
                isActivated = false     
            if(event.eventType != skillCondition.unitDeath) 
                isActivated = false
            if(targetUnit.allegiance != allegianceVars.foe)
                isActivated = false
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
                    let ret = database.getSkillByName(skillVar.updateLog).effects[skillEffectType.summon].effect(Object.assign({},this.data,data))
                    return ret
                },
                effectDescription: function() {
                    return {
                        1: 'origin',
                        2: 0,
                        3: 'originalTarget',
                        4: 1,
                        5: 'amount',
                        6: 2,
                    }
                },
                data: {
                    logAmount: 1,
                    skillId: logCollect.id,
                }
            }
        ],     
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