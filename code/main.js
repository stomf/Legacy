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
	
	//to do: load multiple assets
//	manifest = [
//		{src: "oryx_16bit_fantasy_world_trans.png", id: "worldsheet"},
//		{src: "oryx_16bit_fantasy_creatures_trans.png", id: "actorsheet"},
//		{src: "red_squire.png", id: "temp"},
//	];
	
//	loader = new createjs.LoadQueue(false);
//	loader.addEventListener("complete", handleComplete);
//	loader.loadManifest(manifest, true, "assets/");
	
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

function tick() {
	movePlayer();
    stage.update();
}

function keydown(event) {
    keys[event.keyCode] = true;
	lastDown = event.keyCode;
}

function keyup(event) {
    delete keys[event.keyCode];
	haltPlayerMovement(event.keyCode);
}
