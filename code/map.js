'use strict';

var map;
var mapSpriteSheet;

function setUpMap() {

	var mapSpriteSheetData = {
		"images": [loader.getResult("worldsheet")],
		"frames": {width:24, height:24, count:2090, regX: 0, regY:0, spacing:0, margin:0}
	};
	mapSpriteSheet = new createjs.SpriteSheet(mapSpriteSheetData);
	
	generateMap();
	drawMap();
}

function drawMap() {
	for (var x = 0; x < MAPXSIZE; x++) { 
		for (var y = 0; y < MAPYSIZE; y++) {
			drawTile(x,y);
		}
	}
}

function getTile(x,y) {
	if ((x <= 0) || (x >= MAPXSIZE-1) || (y <= 0) || (y >= MAPYSIZE-1)) {
		//off-map
		var t = {x : x, y : y, content : BLOCKED, isCorner : false, protectedDoor : false};
		return t;
	}
	return map[y][x];
}

function drawTile(x,y) {
	
	//to do: tile mappings
	var tileFrame = getTileImage(x, y);
	
	var xLoc = x * GRIDSIZE;
	var yLoc = y * GRIDSIZE;
	
	//to do: replace this array of 500 sprites with a single bitmap
	//to do? add the sprites to and array so I can amend/destroy them later
	var tile = new createjs.Sprite(mapSpriteSheet);
	tile.gotoAndStop(tileFrame);
	tile.x = xLoc;
	tile.y = yLoc;
	stage.addChild(tile);
}