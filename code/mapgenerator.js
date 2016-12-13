'use strict';

var MAPXSIZE = 25;
var MAPYSIZE = 20;

var FLOOR = 2;
var WALL = 1;
var PERIMETER = 3;
var BLOCKED = 4;
var DOOR_PROSPECT = 5;
var CORRIDOR = 6;
var UP_STAIRS = 7;
var DOWN_STAIRS = 8;

var UP = {x : 0, y : -1};
var DOWN = {x : 0, y : 1};
var LEFT = {x : -1, y : 0};
var RIGHT = {x : 1, y : 0};

var minStairDist = 25;
var roomList = [];
var corridorTiles = [];
var map = [];
var roomWithStairsDown = [];
var stairUpLoc = {x : 2, y : 2};
var stairDownLoc = {x : 2, y : 2};
		
function generateMap() {
	
	makeDungeon();
	
}

function makeDungeon() {
	var levelInvalid = false;
	do
	{
		resetTileList();
		
		for (var i = 1; i < 120; i++)
		{
			makeRoom();
		}
		//debugRooms();
		findDoorProspects();
		removeExcessDoors();
		clearBlocks();
		openCorridors();
		removeBadCorridors();
		addStairs();
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
			var newTile = {x : x, y : y, content : WALL, isCorner : false, protectedDoor : false};
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
	var roomSize = {x: 0, y: 0}; 
	var roomObject = {roomTileList : [], borderTileList : [], cornerTileList : [], blockTileList : []};
	//the centre of the room
	var roomLocX = oddyfy(1 + Math.floor(Math.random() * (MAPXSIZE - 2)));
	var roomLocY = oddyfy(1 + Math.floor(Math.random() * (MAPYSIZE - 2)));
	
	//the size of the room
	hollowOutRectangle(roomObject, roomLocX, roomLocY, 5, roomSize);
	
	//chance to leave room simple rectangle
	if (Math.random() < 0.6)
	{
		if (roomObject.roomTileList.length < 30)
		{
			//else if small, make room complex conglomerate
			roomLocX = step2(roomLocX);
			roomLocY = step2(roomLocY);
		
			hollowOutRectangle(roomObject, roomLocX, roomLocY, 4, roomSize);
			if (Math.random() < 0.6)
			{
				roomLocX = step2(roomLocX);
				roomLocY = step2(roomLocY);
				hollowOutRectangle(roomObject, roomLocX, roomLocY, 4, roomSize);
			}
		}
		else
		{
			//else create interesting shape (cross / diamond / t / pillars)
			if (Math.random() < 0.4)
			{
				addPillars(roomSize, roomLocX, roomLocY, roomObject);
			}
			else if (Math.random() < 0.5)
			{
				fillInCornersSquarely(roomSize, roomLocX, roomLocY, roomObject);
			}
			else
			{
				fillInCorners(roomSize, roomLocX, roomLocY, roomObject);
			}
		}
	}
	
	//check for overlaps with existing rooms
	for (var i = 0; i < roomObject.borderTileList.length; i++) {
		if (roomObject.borderTileList[i].content == FLOOR) {
			//console.log("Failed at 1: overlap at " + roomObject.borderTileList[i].x + "," + roomObject.borderTileList[i].y + ", content was " + roomObject.borderTileList[i].content + " which was equal to " + FLOOR); 
			fail = true;
			break;
		}
		if (roomObject.borderTileList[i].x == 0 || roomObject.borderTileList[i].x == MAPXSIZE-1 || roomObject.borderTileList[i].y == 0 || roomObject.borderTileList[i].y == MAPYSIZE-1)
		{
			//too close to the edge.
			fail = true;
			break;
		}
	}
	for (var i = 0; i < roomObject.roomTileList.length; i++) {
		if (roomObject.roomTileList[i].content != WALL) {
			//console.log("Failed at 2: overlap at " + roomObject.roomTileList[i].x + "," + roomObject.roomTileList[i].y + ", content was " + roomObject.roomTileList[i].content + " which was not equal to " + WALL); 
			fail = true;
			break;
		}
	}
	
	if (!fail) {
		var newRoom = [];
		for (var i = 0; i < roomObject.blockTileList.length; i++) {
			roomObject.blockTileList[i].content = BLOCKED;
		}
		//console.log ("Added blocked tiles, room size is now " + newRoom.length);
		for (var i = 0; i < roomObject.borderTileList.length; i++) {
			if (roomObject.borderTileList[i].content != BLOCKED) {
				roomObject.borderTileList[i].content = PERIMETER;
				newRoom.push(roomObject.borderTileList[i]);
			}
		}
		//console.log ("Added border tiles, Room size is now " + newRoom.length);
		for (var i = 0; i < roomObject.roomTileList.length; i++) {
			if (roomObject.roomTileList[i].content != BLOCKED) {
				roomObject.roomTileList[i].content = FLOOR;
				newRoom.push(roomObject.roomTileList[i]);
			}
		}
		//console.log ("Added floor tiles, Room size is now " + newRoom.length);
		for (var i = 0; i < roomObject.cornerTileList.length; i++) {
			roomObject.cornerTileList[i].isCorner = true;
		}
		//console.log ("Added corner tiles, Room size is now " + newRoom.length);
		addNewRoom(newRoom);
	}
}

function addPillars(roomSize, roomLocX, roomLocY, roomObject) {
	//add pillars to big rooms
	var includeWalls = 1; 
	if ((roomSize.x % 2 != 0) && (roomSize.y % 2 != 0) && (Math.random() < 0.5)) {
		includeWalls = 0;
	}
	var x = 0;
	var y = 0;
	for (x = -roomSize.x+includeWalls; x <= roomSize.x-includeWalls; x++) {
		for (y = -roomSize.y+includeWalls; y <= roomSize.y-includeWalls; y++) {
			if ((x%2 != 0) && (y%2 != 0)) {
				roomObject.blockTileList.push(getTile(roomLocX+x, roomLocY+y));
			}
		}
	}
}

function fillInCorners(roomSize, roomLocX, roomLocY, roomObject) {
	//make diamond shaped rooms
	var cornerSize = Math.max(roomSize.x, roomSize.y);
	var x = 0;
	var y = 0;
	
	for (x = -roomSize.x-1; x <= roomSize.x+1; x++) {
		for (y = -roomSize.y-1; y <= roomSize.y+1; y++) {
			var edgeDist = Math.abs(x) + Math.abs(y);
			if ((edgeDist > cornerSize) && (x != 0) && (y != 0)) {
				roomObject.blockTileList.push(getTile(roomLocX+x, roomLocY+y));
			}
		}
	}
}

function fillInCornersSquarely(roomSize, roomLocX, roomLocY, roomObject) {
	//makes cross or l-shaped rooms
	var cornerSize = 2;
	var x = 0;
	var y = 0;
	
	var allCorners = (Math.random() < 0.5);
	var c1 = (Math.random() < 0.5) || allCorners;
	var c2 = (Math.random() < 0.5) || allCorners;
	var c3 = (Math.random() < 0.5) || allCorners;
	var c4 = (Math.random() < 0.5) || allCorners;
	
	for (x = -roomSize.x; x <= roomSize.x; x++) {
		for (y = -roomSize.y; y <= roomSize.y; y++) {
			if ((x > 1) && (y > 1) && c1) {
				roomObject.blockTileList.push(getTile(roomLocX+x, roomLocY+y));
			}
			if ((x < -1) && (y > 1) && c2) {
				roomObject.blockTileList.push(getTile(roomLocX+x, roomLocY+y));
			}
			if ((x > 1) && (y < -1) && c3) {
				roomObject.blockTileList.push(getTile(roomLocX+x, roomLocY+y));
			}
			if ((x < -1) && (y < -1) && c4) {
				roomObject.blockTileList.push(getTile(roomLocX+x, roomLocY+y));
			}
		}
	}
}

function hollowOutRectangle(roomObject, roomLocX, roomLocY, maxRoomSize, roomSize) {
	var x;
	var y;
	
	roomSize.x  = 1 + Math.floor(maxRoomSize * Math.pow(Math.random(), 1.25)); 
	roomSize.y  = 1 + Math.floor((maxRoomSize-1) * Math.pow(Math.random(), 1.25));
	
	var leftBorder = roomLocX - roomSize.x-1;
	var rightBorder = roomLocX + roomSize.x+1;
	var topBorder = roomLocY - roomSize.y-1;
	var bottomBorder = roomLocY + roomSize.y+1;
	
	//console.log ("room width: " + (rightBorder - leftBorder - 1) + ", room height: " + (bottomBorder - topBorder - 1));
	
	for (x = leftBorder; x <= rightBorder; x++)
	{
		for (y = topBorder; y <= bottomBorder; y++)
		{
			var t = getTile(x,y);
			if ((x == leftBorder) || (x == rightBorder) || (y == topBorder) || (y == bottomBorder)) {
				roomObject.borderTileList.push(t);
				//console.log("added border tile: " + tileString(t));
			}
			else {
				roomObject.roomTileList.push(t);
				//console.log("added room tile: " + tileString(t));
			}
		}
	}
	
	//console.log("new room, size: " + roomObject.roomTileList.length + " And " + roomObject.borderTileList.length + " border tiles");
	
	//push the corners into an array. If this room does not fail, mark the corners so doorways are not placed there.
	roomObject.cornerTileList.push(getTile(leftBorder, topBorder));
	roomObject.cornerTileList.push(getTile(rightBorder, topBorder));
	roomObject.cornerTileList.push(getTile(leftBorder, bottomBorder));
	roomObject.cornerTileList.push(getTile(rightBorder, bottomBorder));
	
	//this removes inside walls if the room is a conglomerate of several rectangles.
	for (var i = 0; i < roomObject.roomTileList.length; i++) {
		var roomTile = roomObject.roomTileList[i];
		var roomIndex = roomObject.borderTileList.indexOf(roomTile);
		if (roomIndex != -1) {
			//console.log("Removing tile " + roomIndex + " from border tile list: " + tileString(roomTile));
			roomObject.borderTileList.splice(roomIndex, 1);
		}
	}
}

function badUniq(a) {
	var objs = [];
	return a.filter(function(item) {
		return objs.indexOf(item) >= 0 ? false : objs.push(item);
	});
}

function Bad2Uniq(a) {
	var arrResult = {};
	var len = a.length;
	for (var i = 0; i < len; i++) {
		var tile = a[i];
		arrResult[tile.x + " - " + tile.x] = tile;
	}

	var i = 0;
	var nonDuplicatedArray = [];    
	for(var item in arrResult) {
		nonDuplicatedArray[i++] = arrResult[item];
	}
	return nonDuplicatedArray;
}

function uniq(a) {
	for (var i = 0; i < a.length - 1; i++) {
		for (var j = i + 1; j < a.length; j++) {
			if (a[i] === a[j]) {
				a.splice(j, 1);
			}
		}
	}
	return a;
}

function addNewRoom(newRoom) {
	//adds the room newRoom to the roomList array
	//but first remove duplicated tiles
	//console.log("Room has " + newRoom.length + " tiles before duplicates checking, here they are:");
	//debugRoom("New Room", newRoom);
	
	var i = 0;
	var j = 0;
	
	newRoom = uniq(newRoom);
	//console.log("After duplicates removes, size " + newRoom.length);
	//debugRoom("New Room", newRoom);
	roomList.push(newRoom);
}

function findDoorProspects() {
	var x = 0;
	var y = 0;
	
	//find tiles which could be 'doors' (corridor entryways) and mark them.
	for (x = 1; x < MAPXSIZE-1; x++) {
		for (y = 1; y < MAPYSIZE-1; y++) {
			checkDoor(x, y);
		}
	}
	
	//remove inside corners
	for (x = 1; x < MAPXSIZE-1; x++) {
		for (y = 1; y < MAPYSIZE-1; y++) {
			removeWrongDoor(x, y);
		}
	}
	//do this twice to fix some edge cases involving rooms with pillars around the edge
	for (x = 1; x < MAPXSIZE-1; x++) {
		for (y = 1; y < MAPYSIZE-1; y++) {
			removeWrongDoor(x, y);
		}
	}
}

function removeWrongDoor(x, y) {
	if (getTile(x, y).content == DOOR_PROSPECT) {
		if (insideRoomCorner(x,y)) {
			getTile(x, y).content = PERIMETER;
		}
		
		var corridorTest = chooseStartDirection(x, y);
		if ((corridorTest.x == 0) && (corridorTest.y == 0) && (adjCount(x,y, FLOOR) == 0)) {
			getTile(x, y).content = PERIMETER;
		}
	}
}

function xCount(x, room) {
	//count how many tiles there are of type x in the room
	var count = 0;
	for (var i = 0; i < room.length; i++) {
		if (room[i].content == x) {
			count++;
		}
	}
	return count;
}

function allDoorsProtected(room) {
	//return true if all remaining doors in this room are protected
	//used to prevent an infinite loop issue with removing excessive doors
	var answer = true;
	for (var i = 0; i < room.length; i++) {
		var t = room[i];
		if ((t.content == DOOR_PROSPECT) && (t.protectedDoor == false)) {
			//we found an unprotected door
			answer = false;
		}
	}
	return answer;
}

function removeExcessDoors() {
	protectDoors();
	
	for (var i = 0; i < roomList.length; i++) {
		var maxDoors = 4;
		var doorCount = xCount(DOOR_PROSPECT, roomList[i]);
		console.log("Counted " + doorCount + " doors.");
		while (doorCount > maxDoors && !allDoorsProtected(roomList[i])) {
			cropDoor(roomList[i]);
			doorCount = xCount(DOOR_PROSPECT, roomList[i]);
		}
		protectDoors();
	}
}

function protectDoors() {
	//if a room has less than 4 doors, mark remaining doors as protected
	//to prevent them being removed as part of a door purge on an adjacent room.
	for (var i = 0; i < roomList.length; i++) {
		if (xCount(DOOR_PROSPECT, roomList[i]) < 4) {
			for (var j = 0; j < roomList[i].length; j++) {
				var t = roomList[i][j];
				if (t.content == DOOR_PROSPECT) {
					t.protectedDoor = true;
				}
			}
		}
	}
}

function cropDoor (room) {
	//change a single door prospect tile in the room back into a perimeter tile.
	var doorList = [];
	for (var i = 0; i < room.length; i++) {
		if ((room[i].content == DOOR_PROSPECT) && (room[i].protectedDoor == false)) {
			doorList.push(room[i]);
		}
	}
	var doorToPurge = Math.floor(Math.random() * doorList.length);
	doorList[doorToPurge].content = PERIMETER;
}

function isOutsideEdge(tile) {
	return ((tile.x <= 0) || (tile.y <= 0) || (tile.x >= MAPXSIZE - 1) || (tile.y >= MAPYSIZE - 1));
}

function checkDoor(x = 0, y = 0) {
	//can this be a door?
	if (!isOutsideEdge(getTile(x,y)) && !getTile(x,y).isCorner) {
		if (isHorizontalWall(x, y) && (x % 2 == 1)) {
			getTile(x, y).content = DOOR_PROSPECT;
		}
		if (isVerticalWall(x, y) && (y % 2 == 1)) {
			getTile(x, y).content = DOOR_PROSPECT;
		}
	}
}

function clearBlocks() {
//remove all the non-edge block tiles.
	for (var x = 1; x < MAPXSIZE-1; x++) {
		for (var y = 1; y < MAPYSIZE-1; y++) {
			if (getTile(x, y).content == BLOCKED) {
				getTile(x, y).content = PERIMETER;
			}
		}
	}
}

function isHorizontalWall(x, y) {
	return (getTile(x, y).content == PERIMETER)
		&& ((getTile(x + 1, y).content == PERIMETER) || (getTile(x + 1, y).content == BLOCKED))
		&& ((getTile(x - 1, y).content == PERIMETER) || (getTile(x - 1, y).content == BLOCKED));
}

function isVerticalWall(x, y) {
	return (getTile(x, y).content == PERIMETER)
		&& ((getTile(x, y+1).content == PERIMETER) || (getTile(x, y+1).content == BLOCKED))
		&& ((getTile(x, y-1).content == PERIMETER) || (getTile(x, y-1).content == BLOCKED));
}

function insideRoomCorner(x, y) {
	//poorly named function. It returns true if the door prospect (x,y) is not suitable.
	
	var answer = false;
	//detect inside room corners
	if ((getTile(x-1, y).content == FLOOR) && (getTile(x, y+1).content == FLOOR)) {
		answer = true;
	}
	if ((getTile(x-1, y).content == FLOOR) && (getTile(x, y-1).content == FLOOR)) {
		answer = true;
	}
	if ((getTile(x+1, y).content == FLOOR) && (getTile(x, y+1).content == FLOOR)) {
		answer = true;
	}
	if ((getTile(x+1, y).content == FLOOR) && (getTile(x, y-1).content == FLOOR)) {
		answer = true;
	}
	
	//remove internal doors 
	if (adjCount(x, y, PERIMETER) > 2) {
		answer = true;
	}
	
	//check for doors with no possible exits
	var tunnelCount = 0; //number of adjacent tiles through which corridors can burrow
	tunnelCount += adjCount(x, y, DOOR_PROSPECT);
	tunnelCount += adjCount(x, y, FLOOR);
	tunnelCount += adjCount(x, y, WALL);
	if (tunnelCount != 2) {
		answer = true;
	} 
	
	return answer;
}

function adjCount(x, y, content) {
	//counts how many tiles of type 'content' are adjacent to the tile at x,y
	var answer = 0;
	if (getTile(x-1, y).content == content) {
		answer++;
	}
	if (getTile(x+1, y).content == content) {
		answer++;
	}
	if (getTile(x, y-1).content == content) {
		answer++;
	}
	if (getTile(x, y+1).content == content) {
		answer++;
	}
	return answer;
}

function openCorridors() {
	var numberOfCorridors = 0;
	
	for (var x = 1; x < MAPXSIZE-1; x+=1) {
		for (var y = 1; y < MAPYSIZE-1; y+=1) {
			if ((getTile(x, y).content == DOOR_PROSPECT) && (numberOfCorridors < 1000)) { //is this an appropriate start location to start a corridor?
				openCorridor(x, y);
				numberOfCorridors++;
			}
		}
	}
}

function openCorridor(x, y) {
	var finished = false;
	var dir = chooseStartDirection(x, y);
	var corridorLength = 0;
	
	getTile(x, y).content = CORRIDOR;
	
	do {
		corridorLength++;
		if (((dir.x == 0) && (dir.y == 0)) || (corridorLength > 1000)) {
			finished = true;
		}
		else {
			x += dir.x;
			y += dir.y;
		
			getTile(x, y).content = CORRIDOR;
			
			var dirClone = {x : dir.x, y: dir.y};
			dir = chooseDirection(x, y, dirClone);
		}
	}
	while (finished == false);
}

function chooseDirection (x, y, dir) {
//continue the corridor. change dir if we need to turn a corner.
//set it to (0,0) to end the corridor.
	var twistyness = 0.5;
	var nextTile = getTile(x + dir.x, y + dir.y); //next tile corridor will visit if direction does not change
	var nextTile2 = getTile(x + dir.x * 2, y + dir.y * 2); //and the tile after that
	var newDir = {x : 0, y : 0};
	var canTurn = false;
	var nextTileBlocked = ((nextTile.content != WALL) && (nextTile.content != DOOR_PROSPECT));
	var nextTile2Blocked = ((nextTile2.content != WALL) && (nextTile2.content != DOOR_PROSPECT) && (nextTile2.content != CORRIDOR));
	
	if ((dir.x != 0) && (x % 2 == 1)) { //dir is horizontal and odd column
		canTurn = true;
	}
	if ((dir.y != 0) && (y % 2 == 1)) { // dir is vertical and odd row number
		canTurn = true;
	}
	
	if (canTurn) {
		if (nextTileBlocked || (Math.random() < twistyness)) {
		//if blocked or sometimes just randomly, change the corridor direction.
			newDir = chooseStartDirection(x, y);
			//(will return 0,0 if no viable choices)
		}
		else {
			if (nextTile2Blocked) {
				if (nextTile.content == DOOR_PROSPECT) {
					newDir = dir; //corridor soon to terminate in a room doorway.
				}
				else {
					newDir = chooseStartDirection(x, y);
				}
			}
			else {
				//next 2 tiles not blocked, continue
				newDir = {x : dir.x, y: dir.y};
			}
		}
	}
			
	else { //can't turn
		if (nextTileBlocked) {
			newDir = {x : 0, y : 0};
		}
		else {
			//continue
			newDir = {x : dir.x, y: dir.y};
		}
	}
	
	return newDir;
} //end of chooseDirection function

function chooseStartDirection(x, y) {
	//new corridor at x,y;
	//which way does it go?
	
	var viableChoices = [];
	if (tunnelable(getTile(x - 1, y)) && tunnelableOrCorridor(getTile(x-2,y))) {
		viableChoices.push(LEFT);
	}
	if (tunnelable(getTile(x + 1, y)) && tunnelableOrCorridor(getTile(x+2,y))) {
		viableChoices.push(RIGHT);
	}
	if (tunnelable(getTile(x, y-1)) && tunnelableOrCorridor(getTile(x,y-2))) {
		viableChoices.push(UP);
	}
	if (tunnelable(getTile(x, y+1)) && tunnelableOrCorridor(getTile(x,y+2))) {
		viableChoices.push(DOWN);
	}
	
	if (viableChoices.length == 0) {
		return {x : 0, y : 0};
	}
	else {
		return viableChoices[Math.floor(Math.random() * viableChoices.length)];
	}
}

function removeBadCorridors() {
	//remove singleton corridors
	for (var x = 1; x < MAPXSIZE-1; x++) {
		for (var y = 1; y < MAPYSIZE-1; y++) {
			if (getTile(x, y).content == CORRIDOR) {
				if (adjCount(x, y, CORRIDOR) == 0) {
					getTile(x, y).content = PERIMETER;
				}
			}
		}
	}
}

function selectEmptyTile (room) {
	//returns an empty tile from the room, if available.
	var tileList = [];
	for (var i = 0; i < room.length; i++) {
		//console.log("Check tile " + i + " for emptyness");
		if (isEmpty(room[i])) {
			tileList.push(room[i]);
		}
	}
	//console.log("Room has " + tileList.length + " empty tiles, placing stairs...");
	if (tileList.length > 0) {
		return tileList[Math.floor(Math.random() * tileList.length)];
	}
	else {
		return null;
	}
}

function addStairs() {
	var room = [];
	var stairTile = {x : 0, y : 0, content : 0, isCorner : false, protectedDoor : false};
	
	//up stairs
	do {
		var r = Math.floor(Math.random() * roomList.length);
		room = roomList[r];
		//console.log("Room " + r + " has " + room.length + " tiles.");
		stairTile = selectEmptyTile(room);
		var adjacentEmpties = adjCount(stairTile.x, stairTile.y, FLOOR);
		//console.log("stair tile " + stairTile + " has " + adjacentEmpties + " empty neighbours.");
	}
	while (adjacentEmpties < 4) //place stairs in middle of a room
	stairTile.content = UP_STAIRS;
	stairUpLoc = stairTile;
	roomList.splice(roomList.indexOf(room), 1); //remove room from room list so we don't spawn MONSTERS there!
	
	//down stairs
	do {
		room = roomList[Math.floor(Math.random() * roomList.length)];
		stairTile = selectEmptyTile(room);
	}
	while (adjCount(stairTile.x, stairTile.y, FLOOR) < 4) //place stairs in middle of a room
	stairTile.content = DOWN_STAIRS;
	stairDownLoc = stairTile;
	roomWithStairsDown = room; //store this; I want to place boss monsters in this room.
}

function walkable (tile) {
	var walktiles = [FLOOR, DOOR_PROSPECT, CORRIDOR,UP_STAIRS, DOWN_STAIRS];
	//console.log("tile " +tile.x + "," + tile.y + "; content: " + tile.content + " " + walktiles.indexOf(tile.content));
	if (walktiles.indexOf(tile.content) >= 0) {
		return true;
	}
	return false;
}

function isEmpty(tile) {
	var answer = walkable(tile);
	if (hasMonster(tile)) {
		answer = false;
	}
	return answer;
}

function hasMonster(tile) {
	return false; //for now....
}

function tunnelableOrCorridor(tile) {
	return (tile.content == WALL) || (tile.content == DOOR_PROSPECT) || (tile.content == CORRIDOR);
}

function tunnelable(tile) {
	return (tile.content == WALL) || (tile.content == DOOR_PROSPECT);
}

function debugRooms () {
	for (var i = 0; i < roomList.length; i++) {
		debugRoom(i, roomList[i]);
	}
}

function debugRoom (i, room) {
	console.log("Room " + i + " has " + room.length + " tiles");
	for (var j = 0; j < room.length; j++) {
		debugTile (j, room[j]);
	}
}

function debugTile (j, tile) {
	console.log("Tile " + j + " data: " + tileString(tile));
}

function tileString(tile) {
	if (tile === null) {
		return ("a mysterious null tile");
	}
	if (tile === undefined) {
		return ("a mysterious undefined tile");
	}

	return "x:" + tile.x + " y:" + tile.y + " content:" + tile.content;
}

function isWall(tile) {
	return (tile.content == WALL) || (tile.content == PERIMETER) || (tile.content == BLOCKED);
}


