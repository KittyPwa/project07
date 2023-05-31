var visualVars= {
    windowGrabOffset: 32,

    screenWidth: 800,
    screenHeight: 600,

    rectLineColor: 0x1a65ac, 
    rectLineThickness: 2,
    rectSpacing : 30,
    rectSize : 30,

    validColor: 0x44ff44,
    invalidColor: 0xFF0000,
    selectedColor: 0xffffe0,

}

var unitTypeVars = {
    summon: 'summon',
    full: 'full',
    general: 'general',
}

var tileTypeVars = {
    summon: 'summon',
    full: 'full',
    dam: 'dam',
    roots: 'roots'
}

var allegianceVars = {
    ally: 'ally',
    foe: 'foe'
}

var language = JSON.parse(JSON.stringify(messageEn))

var oppositeAllegianceVars = {
    ally: 'foe',
    foe: 'ally'
}

var dataTypes = ['terrain', 'spot', 'unit', 'combatManager', 'logger']

var terrainVars = {
    collumnAmount: 5,
    rowAmount: 4,
    wall: 1028,
    fullTile: 967,
    summonTile: 966,
    damTile: 1028,
    rootTile: 950,
    tileSize: 32
}
