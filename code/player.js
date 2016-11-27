function setUpPlayer() {
	player = new Object();
	
	player.speed = 4; //preferably factor of gridSize
	player.x = 2;
	player.y = 2;
	
	player.movement = STILL;
	player.nextMovement = STILL;
	
	player.moveProgress = 0;
}

function updatePlayerView() {
	player.view.x = player.x * gridSize + (player.movement.x * player.moveProgress * player.speed) + gridSize / 2;
	player.view.y = player.y * gridSize + (player.movement.y * player.moveProgress * player.speed);
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
		player.movement = player.nextMovement;
		player.nextMovement = STILL;
		player.moveProgress = 0;
	}
	
	if (player.movement != STILL) {
		player.moveProgress += 1;
		if (player.moveProgress * player.speed >= gridSize) {
			player.x = player.x + player.movement.x;
			player.y = player.y + player.movement.y;
			player.movement = STILL;
			player.moveProgress = 0;
		}
	}
	
	updatePlayerView();
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