//All rights reserved com.albion.tao
var thread;// main thread.
var field = null;// the canvas field.
var context = null;// the canvas context painter.
var spiritUnit;// size of the spirit unit.
var fieldUnit;// size of the field unit.
var snake;// snake array.
var head;// snake's head, the first element of the array.
var egg;// egg for snake to eat.
var offset;// offset of snake move.
var pause;// boolean var for pause game.
var lock;// Thread lock to avoid double key down.
var speed;// game speed.

if (window.addEventListener) {
    window.addEventListener("load", run, false);
}
else {
    window.attachEvent("onload", run);
}

function init() {
	// get canvas
	field = document.getElementById('field');
	// get canvas context
	context = field.getContext('2d');
	// initialize param
	spiritUnit = 9;
	fieldUnit = 10;
	snake = [ [ 6 * fieldUnit, fieldUnit ], [ 5 * fieldUnit, fieldUnit ],
			[ 4 * fieldUnit, fieldUnit ], [ 3 * fieldUnit, fieldUnit ],
			[ 2 * fieldUnit, fieldUnit ], [ 1 * fieldUnit, fieldUnit ] ];
	setEgg();
	offset = [ fieldUnit, 0 ];
	pause = false;
	lock = true;
	speed = 100;
}

// main
function run() {
	init();
	thread = setInterval(drawSpirit, speed);
}
function end() {
	clearInterval(thread);
	init();
	alert("Game Over");
}
// event catch
document.onkeydown = function() {
	if (lock)
		return;
	// set offset and pause by keyCode
	switch (event.keyCode) {
	// up
	case 38:
		if (offset[0] == 0)
			break;
		offset[0] = 0;
		offset[1] = -fieldUnit;
		break;
	// up
	case 69:
		if (offset[0] == 0)
			break;
		offset[0] = 0;
		offset[1] = -fieldUnit;
		break;
	// down
	case 40:
		if (offset[0] == 0)
			break;
		offset[0] = 0;
		offset[1] = fieldUnit;
		break;
	// down
	case 68:
		if (offset[0] == 0)
			break;
		offset[0] = 0;
		offset[1] = fieldUnit;
		break;
	// left
	case 37:
		if (offset[1] == 0)
			break;
		offset[0] = -fieldUnit;
		offset[1] = 0;
		break;
	// left
	case 83:
		if (offset[1] == 0)
			break;
		offset[0] = -fieldUnit;
		offset[1] = 0;
		break;
	// right
	case 39:
		if (offset[1] == 0)
			break;
		offset[0] = fieldUnit;
		offset[1] = 0;
		break;
	// right
	case 70:
		if (offset[1] == 0)
			break;
		offset[0] = fieldUnit;
		offset[1] = 0;
		break;
	// space
	case 32:
		pause = !pause;
		break;
	}
	lock = true;
}

function drawSpirit() {
	lock = false;
	if (pause) {
		return;
	}
	// clear canvas
	context.clearRect(0, 0, field.width, field.height);

	// set new snake position
	setSnake();
	// collapse wall
	if (head[0] == -fieldUnit || head[1] == -fieldUnit
			|| head[0] == field.width || head[1] == field.height) {
		end();
		run();
	}
	// collapse an egg.
	if (head[0] == egg[0] && head[1] == egg[1]) {
		snake.push( [ snake[snake.length - 1][0], snake[snake.length - 1][1] ]);
		setEgg();
		// speed up
		if (speed > 2) {
			clearInterval(thread);
			speed--;
			thread = setInterval(drawSpirit, speed);
		}
	}
	// draw snake
	for ( var i = 0; i < snake.length; i++) {
		// collapse itself
		if(i>3&&head[0]==snake[i][0]&&head[1]==snake[i][1]){
			end();
			run();
			break;
		}
		drawPoint(snake[i][0], snake[i][1], i % 2 == 0 ? "#FF5511" : "white");
	}
	// draw egg
	drawPoint(egg[0], egg[1], "#FFD700");
}

function setEgg() {
	var overlap;
	do {
		overlap = false;
		var eggX = Math.floor(Math.random() * (field.width / fieldUnit))
				* fieldUnit;
		var eggY = Math.floor(Math.random() * (field.height / fieldUnit))
				* fieldUnit;
		egg = [ eggX, eggY ];
		// for each snake body
		for ( var i = 0; i < snake.length; i++) {
			// egg overlaps snake?
			if (egg[0] == snake[i][0] && egg[1] == snake[i][1]) {
				overlap = true;
				break;
			}
		}
	} while (overlap)
}

function setSnake() {
	// set new snake position
	head = snake[0];
	snake.reverse();
	snake.push( [ head[0] + offset[0], head[1] + offset[1] ]);
	snake.reverse();
	snake.length--;
}

function drawPoint(x, y, color) {
	context.fillStyle = color;
	context.fillRect(x, y, spiritUnit, spiritUnit);
}