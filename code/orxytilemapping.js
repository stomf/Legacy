'use strict';

var tileMap = new Array(9, 10, 13, 16, 12, 11, 17, 21, 15, 18, 14, 23, 19, 24, 22, 20);
var mapDressing = 12;

function getTileImage(x, y) {
	//in: x,y location of tile
	//out: number of tile for that location
	//known: global tile map
	var tileType = getTile(x,y).content;
	//1 = wall,
	//0 = floor.
	if (tileType == 0) {
		return (mapDressing * 54) + 4;
	}
	
	var tileAbove = getTile(x, y-1);
	var tileBelow = getTile(x, y+1);
	var tileLeft = getTile(x-1, y);
	var tileRight = getTile(x+1, y);
	
	var tileAboveContent = 0;
	var tileBelowContent = 0;
	var tileLeftContent = 0;
	var tileRightContent = 0;
	
	if (isWall(tileAbove)) {
		tileAboveContent = 1;
	}
	
	if (isWall(tileBelow)) {
		tileBelowContent = 1;
	}

	if (isWall(tileLeft)) {
		tileLeftContent = 1;
	}

	if (isWall(tileRight)) {
		tileRightContent = 1;
	}

	
	var tileIndex = tileRightContent + tileBelowContent*2 + tileLeftContent*4 + tileAboveContent * 8;
	
	return (mapDressing * 54) + tileMap[tileIndex];
}