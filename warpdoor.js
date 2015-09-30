var key = "_warpdoor_";

function useItem(x, y, z, itemId, blockId, side, itemDamage, blockDamage) {
  var stick = 280;
  var water = 9;
  var magma = 11;
  
  if (itemId == stick) {
    var warpKeyBlock = isWarpDoor(x, y, z);
    if (warpKeyBlock != 0 && getTile(x, y+1, z) == magma) {
      if (saveWarpDoor(x, y, z, warpKeyBlock)) {
        setTile(x, y+1, z, water, 0);
      }
    }
  }
}

function modTick() {
  var water = 9;
  var warpKeyBlock = isWarpDoor(Math.floor(getPlayerX()), Math.floor(getPlayerY())-2, Math.floor(getPlayerZ()));
  var nowTile = getTile(Math.floor(getPlayerX()), Math.floor(getPlayerY())-1, Math.floor(getPlayerZ()));
  if (warpKeyBlock != 0 && nowTile  == water) {
    var savedData = ModPE.readData(Level.getWorldDir() + key + warpKeyBlock);
    var warpDoors = savedData.split("|");
    if (warpDoors.length == 2) {
      var warpDoor1 = warpDoors[0].split(",");
      var warpDoor2 = warpDoors[1].split(",");
      if (Math.floor(getPlayerX())+"" == warpDoor1[0] && Math.floor(getPlayerZ())+"" == warpDoor1[2]) {
        setPosition(getPlayerEnt(), Number(warpDoor2[0])+1, Number(warpDoor2[1])+4, Number(warpDoor2[2]));
      } else if (Math.floor(getPlayerX())+"" == warpDoor2[0] && Math.floor(getPlayerZ())+"" == warpDoor2[2]) {
        setPosition(getPlayerEnt(), Number(warpDoor1[0])+1, Number(warpDoor1[1])+4, Number(warpDoor1[2]));
      }
    }
  }
}

function isWarpDoor(x, y, z) {
  var obsidian = 49;
  var water = 9;
 
  var aroundBlockCoords = [
    {x: x+1, y: y+1, z: z},
    {x: x-1, y: y+1, z: z},
    {x: x, y: y+1, z: z+1},
    {x: x, y: y+1, z: z-1},
    {x: x+1, y: y+1, z: z+1},
    {x: x-1, y: y+1, z: z+1},
    {x: x+1, y: y+1, z: z-1},
    {x: x-1, y: y+1, z: z-1}];

  var obsidianCount = 0;
  var keyBlock = 0;
  for (var i = 0; i < aroundBlockCoords.length; i++) {
    var block = aroundBlockCoords[i];
    if (getTile(block.x, block.y, block.z) == obsidian) {
      obsidianCount += 1;
    } else {
      keyBlock = getTile(block.x, block.y, block.z);
    }
  }
  return obsidianCount == 7 ? keyBlock : 0;
}

function saveWarpDoor(x, y, z, blockId) {
  var warpDoorData = ModPE.readData(Level.getWorldDir() + key + blockId);
  if (warpDoorData == "") {
    ModPE.saveData(Level.getWorldDir() + key + blockId, [x, y, z].join());
    return true;
  }

  var warpDoors = warpDoorData.split("|");
  if (warpDoors.length == 1) {
    ModPE.saveData(Level.getWorldDir() + key + blockId, [warpDoors[0], [x, y, z].join()].join("|"));
    return true;
  } else {
    return false;
  }
}
