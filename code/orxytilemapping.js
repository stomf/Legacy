'use strict';

var tileMap = new Array(9, 10, 13, 16, 12, 11, 17, 21, 15, 18, 14, 23, 19, 24, 22, 20);

function getTileImage(x, y) {
	//in: x,y location of tile
	//out: number of tile for that location
	//known: global tile map
	var tileType = getTile(x,y);
	//1 = wall,
	//0 = floor.
	if (tileType == 0) {
		return 4;
	}
	
	var tileAbove = getTile(x, y-1);
	var tileBelow = getTile(x, y+1);
	var tileLeft = getTile(x-1, y);
	var tileRight = getTile(x+1, y);
	
	var tileIndex = tileRight + tileBelow*2 + tileLeft*4 + tileAbove * 8;
	
	return tileMap[tileIndex];
}