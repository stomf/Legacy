var MAPXSIZE = 25;
var MAPYSIZE = 20;

var FLOOR = 0;
var WALL = 1;
var PERIMETER = 3;
var BLOCKED = 4;
var DOOR_PROSPECT = 5;
var CORRIDOR = 6;
var UP_STAIRS = 7;
var DOWN_STAIRS = 8;

function generateMap() {
	//test map for debugging
	
	/*
	map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	];
	*/
	makeDungeon();
	
}

var minStairDist = 25;
var roomList = [];
var corridorTiles = [];
var map = [];
var roomWithStairsDown = [];

function makeDungeon() {
	var levelInvalid = false;
	do
	{
		resetTileList();
		
		for (var i = 1; i < 12; i++)
		{
			makeRoom();
		}
//		findDoorProspects();
//		removeExcessDoors();
//		clearBlocks();
//		openCorridors();
//		removeBadCorridors();
//		addStairs();
//		betterPathfinding(stairUpLoc._x, stairUpLoc._y, 1000);
//		levelInvalid = ((stairDownLoc.count < minStairDist) || (stairDownLoc.count == 100000));
//		if (floorCount() > reachable()) //too many blocked off tiles
//		{
//			levelInvalid = true;
//		}
	}
	while (levelInvalid)
	
//	buildCorridorArray();
//	pruneRoomList();
}

function resetTileList() {
	map = [];
	roomList = [];
	roomWithStairsDown = [];
	corridorTiles = [];
	
	for (var y = 0; y < MAPYSIZE; y++) {
		var column = [];
		for (var x = 0; x < MAPXSIZE; x++) {
			var newTile = {x : x, y : y, content : FLOOR, isCorner : false, protectedDoor : false};
			column.push(newTile);
		}
		map.push(column);
	}
}

function oddyfy(i) {
	//make a number odd.
	if ((i % 2) == 0) {
		i--;
	}
	return i;
}

function step2 (x) {
	//step 2 spaces either + or -
	if (Math.random() < 0.5)
	{
		return x + 2;
	}
	else
	{
		return x - 2;
	}
}

function makeRoom() {
	var fail = false;
	var roomTileList = [];
	var borderTileList = [];
	var blockTileList = [];
	var cornerTileList = [];
	var roomSize = {x: 0, y: 0}; 
	
	//the centre of the room
	var roomLocX = oddyfy(Math.floor(Math.random() * MAPXSIZE));
	var roomLocY = oddyfy(Math.floor(Math.random() * MAPYSIZE));
	
	//the size of the room
	hollowOutRectangle(roomTileList, borderTileList, cornerTileList, roomLocX, roomLocY, 5, roomSize);
	
	//chance to leave room simple rectangle
	if (Math.random() < 0.6)
	{
		if (roomTileList.length < 30)
		{
			//else if small, make room complex conglomerate
			roomLocX = step2(roomLocX);
			roomLocY = step2(roomLocY);
		
			hollowOutRectangle(roomTileList, borderTileList, cornerTileList, roomLocX, roomLocY, 4, roomSize);
			if (Math.random() < 0.6)
			{
				roomLocX = step2(roomLocX);
				roomLocY = step2(roomLocY);
				hollowOutRectangle(roomTileList, borderTileList, cornerTileList, roomLocX, roomLocY, 4, roomSize);
			}
		}
		else
		{
			//else create interesting shape (cross / diamond / t / pillars)
			if (Math.random() < 0.4)
			{
				//pillars
				//addPillars(roomSize, roomLocX, roomLocY, blockTileList);
			}
			else if (Math.random() < 0.5)
			{
				//cross shape
				//fillInCornersSquarely(roomSize, roomLocX, roomLocY, blockTileList);
			}
			else
			{
				//diamond shape
				//fillInCorners(roomSize, roomLocX, roomLocY, blockTileList);
			}
		}
	}
	
	var r = {x : 0, y : 0, content : 0, isCorner : false, protectedDoor : false};
	
	//check for overlaps with existing rooms
	for (r in borderTileList)
		{
			if (r.content == WALL)
			{
				fail = true;
			}
		}
		for (r in roomTileList)
		{
			if (r.content != WALL)
			{
				fail = true;
			}
		}
	
	if (!fail)
	{
		var newRoom = [];
		for (r in blockTileList)
		{
			r.content = MapTile.BLOCKED;
		}
		for (r in borderTileList)
		{
			if (r.content != MapTile.BLOCKED)
			{
				r.content = MapTile.PERIMETER;
				newRoom.push(r);
			}
		}
		for (r in roomTileList)
		{
			if (r.content != MapTile.BLOCKED)
			{
				r.content = MapTile.FLOOR;
				newRoom.push(r);
			}
		}
		for (r in cornerTileList)
		{
			r.isCorner = true;
		}
		addNewRoom(newRoom);
	}
}

function hollowOutRectangle(roomTileList, borderTileList, cornerList, roomLocX, roomLocY, maxRoomSize, roomSize) {
	var x;
	var y;
	
	roomSize.x  = 1 + Math.floor(maxRoomSize * Math.pow(Math.random(), 1.25)); 
	roomSize.y  = 1 + Math.floor((maxRoomSize-1) * Math.pow(Math.random(), 1.25));
	
	var leftBorder = roomLocX - roomSize.x-1;
	var rightBorder = roomLocX + roomSize.x+1;
	var topBorder = roomLocY - roomSize.y-1;
	var bottomBorder = roomLocY + roomSize.y+1;
	
	for (x = leftBorder; x <= rightBorder; x++)
	{
		for (y = topBorder; y <= bottomBorder; y++)
		{
			//temp
			if ((x == leftBorder) || (x == rightBorder) || (y == topBorder) || (y == bottomBorder))
			{
				borderTileList.push(getTile(x, y));
			}
			else
			{
				roomTileList.push(getTile(x, y));
			}
		}
	}
	
	//push the corners into an array. If this room does not fail, we will want to mark the corners
	//so we don't place doorways there.
	cornerList.push(getTile(leftBorder, topBorder));
	cornerList.push(getTile(rightBorder, topBorder));
	cornerList.push(getTile(leftBorder, bottomBorder));
	cornerList.push(getTile(rightBorder, bottomBorder));
	
	//this removes inside walls if the room is a conglomerate of several rectangles.
	for (var r in roomTileList)
	{
		if (borderTileList.indexOf(r) != -1)
		{
			borderTileList.splice(borderTileList.indexOf(r), 1);
		}
	}
}

function addNewRoom(newRoom) {
	//adds the room newRoom to the roomList array
	//but first, I want to remove duplicated tiles
	
	var i = 0;
	var j = 0;
	
	for (i = 0; i < newRoom.length - 1; i++) {
		for (j = i + 1; j < newRoom.length; j++) {
			if (newRoom[i] === newRoom[j]) {
				newRoom.splice(j, 1);
			}
		}
	}
	roomList.push(newRoom);
}