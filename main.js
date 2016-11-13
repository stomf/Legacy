var canvas, context; // public variables to hold Canvas references
var stage;

function init() {
	stage = new createjs.Stage("stagecanvas");
	
	manifest = [
		{src: "red_squire.png", id: "grant"},
	];
	
	//to do: load multiple assets
	var player = new Image();
    player.src = "assets/red_squire.png";
    player.onload = handleComplete;
	
	drawDude();
}

function handleComplete(event) {
	var image = event.target;
	var player = new createjs.Bitmap(image);
	stage.addChild(player);
	player.x = 200;
	player.y = 100;
	
	drawCircle();
}

function drawDude() {
	
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
