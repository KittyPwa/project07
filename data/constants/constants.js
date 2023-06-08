var visualVars= {
    windowGrabOffset: 32,    

    screenWidth: 800,
    screenHeight: 600,

    rectLineColor: 0x1a65ac, 
    rectLineThickness: 2,
    rectSpacing : 30,
    rectSize : 30,

    unitSelectedColor: 0x98FB98,
    validColor: 0x44ff44,
    invalidColor: 0xFF0000,
    selectedColor: 0xffffe0,

}

var skillVar = {
    strike: 'Strike',
    pierce: 'Pierce',
    chop: 'Chop',
    logLug: 'LogLug',
    challengeTheStrong: 'ChallengeTheStrong',
    cullVermin: 'CullVermin',
    damRepairs: 'DamRepairs'
}

var targetingVar = {
    classic: 'classic',
    pierce: 'pierce',
}

var skillType = {
    damage: 'damage',
    support: 'support',
    passive: 'passive'
}

var unitTypeVars = {
    summon: 'Summon',
    support: 'Support',
    full: 'Unit',
    general: 'General',
}

var unitNameVars = {
    mamal: {
        beaver: {
            militia: 'mbm',
            warrior: 'mbw',
            builder: 'mbb',
            alpha: 'mba'
        }
    },
    general: {
        roots: 'gr',
        dam: 'gd',
    },
    treant: {
        greenForest: {
            grunt: 'tgg',
            barkBiter: 'tgbb',
            ogre: 'tgo',
        },
    },
    support : {
        wood: {
            log: 'swl'
        }
    }

}

var tileTypeVars = {
    support: 'Support',
    full: 'Unit',
    dam: 'Dam',
    roots: 'Root'
}

var allegianceVars = {
    ally: 'ally',
    foe: 'foe'
}

var unitAllegianceVars = {
    ally: ['mamal', 'reptile', 'bird'],
    foe: ['treant']
}

var language = JSON.parse(JSON.stringify(messageEn))

var oppositeAllegianceVars = {
    ally: 'foe',
    foe: 'ally'
}

var dataTypes = ['terrain', 'spot', 'unit', 'combatManager', 'logger', 'skill', 'targeting', 'gameState']

var terrainVars = {
    collumnAmount: 5,
    rowAmount: 4,
    wall: 1028,
    fullTile: 967,
    supportTile: 966,
    damTile: 1028,
    rootTile: 950,
    tileSize: 32,
    widthOffset: 20,
    heightOffset: 75 
}
