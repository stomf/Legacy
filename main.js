var canvas;
var stage;
var keys = {};
var player;
var lastDown = 0;

var gridSize = 24;

var LEFT = {x: -1, y: 0};
var RIGHT = {x:1, y:0};
var UP = {x:0, y:-1};
var DOWN = {x:0, y:1};
var STILL = {x:0, y:0};

function init() {
	stage = new createjs.Stage("stagecanvas");
	
	manifest = [
		{src: "red_squire.png", id: "grant"},
	];
	
	//to do: load multiple assets
	var playerimg = new Image();
    playerimg.src = "assets/red_squire.png";
    playerimg.onload = playerImageLoaded;
	
	createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(30);
	
	this.document.onkeydown = keydown;
    this.document.onkeyup = keyup;
}

function playerImageLoaded(event) {
	setUpPlayer();
	var image = event.target;
	player.view = new createjs.Bitmap(image);
	player.view.regX = gridSize / 2;
	stage.addChild(player.view);
	updatePlayerView();
}

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

function tick() {
	movePlayer();
    stage.update();
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

function drawCircle() {
	//debug function
	var circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	circle.x = 100;
	circle.y = 100;
	stage.addChild(circle);
	stage.update();
}

function keydown(event) {
    keys[event.keyCode] = true;
	lastDown = event.keyCode;
}

function keyup(event) {
    delete keys[event.keyCode];
	if (event.keyCode == 37 && player.nextMovement == LEFT) {
		player.nextMovement = STILL;
	}
	if (event.keyCode == 38 && player.nextMovement == UP) {
		player.nextMovement = STILL;
	}
	if (event.keyCode == 39 && player.nextMovement == RIGHT) {
		player.nextMovement = STILL;
	}
	if (event.keyCode == 40 && player.nextMovement == DOWN) {
		player.nextMovement = STILL;
	}

}