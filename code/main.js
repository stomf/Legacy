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
		{src: "worldsheet.png", id: "worldsheet"},
		{src: "actorsheet.png", id: "actorsheet"},
	];
	
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest, true, "assets/");
	
	this.document.onkeydown = keydown;
    this.document.onkeyup = keyup;
}

function handleComplete() {
	setUpPlayer();
	
	createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(30);
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
