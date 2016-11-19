var canvas;
var stage;
var keys = {};
var player = new Object();

var gridSize = 24;

function init() {
	stage = new createjs.Stage("stagecanvas");
	
	manifest = [
		{src: "red_squire.png", id: "grant"},
	];
	
	//to do: load multiple assets
	var playerimg = new Image();
    playerimg.src = "assets/red_squire.png";
    playerimg.onload = handleComplete;
	
	createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(30);
	
	this.document.onkeydown = keydown;
    this.document.onkeyup = keyup;
}

function handleComplete(event) {
	var image = event.target;
	player.view = new createjs.Bitmap(image);
	stage.addChild(player.view);
	player.view.x = 200;
	player.view.y = 100;
	player.view.regX = player.view.image.width / 2;
}

function updatePlayerView() {
	
}

function tick() {
	movePlayer();
    stage.update();
}

function movePlayer() {
	if (keys[37]) {
		player.view.scaleX = 1;
		player.view.x -= 5;
	}
    if (keys[38]) {
		player.view.y -= 5;
	}
    if (keys[39]) {
		player.view.scaleX = -1;
		player.view.x += 5;
	}
    if (keys[40]) {
		player.view.y += 5;
	}
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
}

function keyup(event) {
    delete keys[event.keyCode];
}