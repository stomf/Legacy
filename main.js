var canvas, context; // public variables to hold Canvas references
var stage;

function init() {
	stage = new createjs.Stage("stagecanvas");
	var circle = new createjs.Shape();
	circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
	circle.x = 100;
	circle.y = 100;
	stage.addChild(circle);
	stage.update();
	
	drawGrid();
}

function drawGrid() {

}

