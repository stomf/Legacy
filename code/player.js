'use strict';

function setUpPlayer() {
	player = new Object();
	
	player.speed = 4; //preferably factor of gridSize
	player.x = stairUpLoc.x;
	player.y = stairUpLoc.y;
	
	player.movement = STILL;
	player.nextMovement = STILL;
	
	player.moveProgress = 0;
	
	var playerSpriteSheetData = {
		"images": [loader.getResult("actorsheet")],
		"frames": {width:24, height:24, count:402, regX: 12, regY:0, spacing:0, margin:0},
		"animations": {"stand": {frames: [9, 27], speed: 0.1}}
	};
	
	var playerSpriteSheet = new createjs.SpriteSheet(playerSpriteSheetData);
	player.view = new createjs.Sprite(playerSpriteSheet, "stand");
	
	stage.addChild(player.view);
	updatePlayerView();
}

function updatePlayerView() {
	player.view.x = player.x * GRIDSIZE + (player.movement.x * player.moveProgress * player.speed) + GRIDSIZE / 2;
	player.view.y = player.y * GRIDSIZE + (player.movement.y * player.moveProgress * player.speed);
}

function movePlayer() {
	//read keyboard input
	
	var ignoreUpDown = false;
	if ((keys[37] || keys[39]) && (keys[38] || keys[40])) {
		//conflict
		if (lastDown == 37 || lastDown == 39) {
			ignoreUpDown = true;
		}
	}
	
	if (keys[37] && !keys[39]) { //left
		player.view.scaleX = 1;
		player.nextMovement = LEFT;
	}
    else if (keys[39] && !keys[37]) { //right
		player.view.scaleX = -1;
		player.nextMovement = RIGHT;
	}
	
	if (!ignoreUpDown)
	{
		if (keys[38] && !keys[40]) { //up
			player.nextMovement = UP;
		}
		else if (keys[40] && !keys[38]) { //down
			player.nextMovement = DOWN;
		}
	}
	
	if (player.movement == STILL) {
		tryMove();
		player.nextMovement = STILL;
		player.moveProgress = 0;
	}
	
	if (player.movement != STILL) {
		player.moveProgress += 1;
		if (player.moveProgress * player.speed >= GRIDSIZE) {
			player.x = player.x + player.movement.x;
			player.y = player.y + player.movement.y;
			player.movement = STILL;
			player.moveProgress = 0;
		}
	}
	
	updatePlayerView();
}

function tryMove() {
	var targetx = player.x + player.nextMovement.x;
	var targety = player.y + player.nextMovement.y;
	if (!isWall(getTile(targetx, targety))) {
		player.movement = player.nextMovement;
	}
}

function haltPlayerMovement(keyCode) {
	if (keyCode == 37 && player.nextMovement == LEFT) {
		player.nextMovement = STILL;
	}
	if (keyCode == 38 && player.nextMovement == UP) {
		player.nextMovement = STILL;
	}
	if (keyCode == 39 && player.nextMovement == RIGHT) {
		player.nextMovement = STILL;
	}
	if (keyCode == 40 && player.nextMovement == DOWN) {
		player.nextMovement = STILL;
	}
}