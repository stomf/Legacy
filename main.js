var canvas;
var stage;
var keys = {};
var player;

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
	player = new createjs.Bitmap(image);
	stage.addChild(player);
	player.x = 200;
	player.y = 100;
	
	//drawCircle();
}

function tick() {
	if (keys[37]) player.x -= 5;
    if (keys[38]) player.y -= 5;
    if (keys[39]) player.x += 5;
    if (keys[40]) player.y += 5;
    stage.update();
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