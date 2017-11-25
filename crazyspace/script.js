var width = 640, height = 480;
var pjs = new PointJS('2D', width, height);

var log = pjs.system.log;
var game = pjs.game;
var OOP = pjs.OOP;
var p = pjs.vector.point;
var s = pjs.vector.size;
var brush = pjs.brush;
var mouse = pjs.mouseControl.initMouseControl();


var score = 0;

var bg = [], oldB;
OOP.forInt(2, function (i) {
	oldB = game.newImageObject({
		file : 'img/background.jpg',
		h : height,
		onload : function () {
			this.x = i * this.w;
		}
	});
	bg.push(oldB);
});

var drawBG = function () {
	OOP.forArr(bg, function (el) {
		el.draw();

		el.move(p(-1, 0));

		if (el.x + el.w < 0) {
			el.x = oldB.x + oldB.w - 3;
			oldB = el;
		}

	});
};

var gr = [], oldG;
OOP.forInt(25, function (i) {
	oldG = game.newImageObject({
		file : 'img/gr.png',
		w : width / 20,
		onload : function () {
			this.x = i * this.w;
			this.y = -this.h + height;
		}
	});
	gr.push(oldG);
});

var drawGR = function () {
	OOP.forArr(gr, function (el) {
		el.draw();

		el.move(p(-2, 0));

		if (el.x + el.w < 0) {
			el.x = oldG.x + oldG.w - 3;
			oldG = el;
		}

	});
};

var bird = game.newImageObject({
	w : 17, h : 20,
	positionC : p(width / 2, height / 2),
	scale : 2.5,
	file : 'img/player.png',
	userData : {
		dy : 0
	}
});

bird.setBox({
	offset : p(4, 5),
	size : s(-15, -10)
});

var laser = game.newRectObject({
	x : 5, y : 0,
	w : 10, h : height,
	fillColor : 'red'
})
var intr = game.newTextObject({
			x : width / 10,
			y : height / 1.3,
			text : 'Инструкция',
			size : 30,
			color : 'white',
			font : 'font',
			align : 'center'
		});





var Menu = function () {

	this.update = function () {

		drawBG();
		laser.setAlpha(0.8)
		laser.draw()
		bird.draw();
		//bird.drawStaticBox();
		drawGR();

		brush.drawText({
			x : width / 2,
			y : height / 5,
			text : 'CrazySpace',
			size : 50,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		brush.drawText({
			x : width / 2,
			y : height / 8 - 30,
			text : '<<< О нет, лазер! Быстрее!',
			size : 30,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		intr.draw()
		if (mouse.isPeekObject('LEFT', intr)) {
			game.setLoop('InstrLoop')
		}

		if (mouse.isPress('LEFT')) {
			return game.setLoop('game');
		}
		
	};

};

var Game = function () {

	var blocks = [], oldBlock = false;
	var space =  80;

	var addBlock = function (y) {

		var dX = oldBlock ? oldBlock.top.x + pjs.math.random(150, 280) : width;

		var o = game.newImageObject({
			file : 'img/block2.png',
			x : dX, y : 0,
			w : width / 10,
			angle : 180,
			onload : function () {
				this.y = -this.h + y - space;
			}
		});

		var o2 = game.newImageObject({
			file : 'img/block2.png',
			x : dX, y : 0,
			w : width / 10,
			onload : function () {
				this.y = y + space;
			}
		});

		var obj = {
			'top' : o,
			'bottom' : o2
		}

		oldBlock = obj;
		blocks.push(obj);
	};

	var drawBlocks = function () {
		OOP.forArr(blocks, function (el) {
			el.top.draw();
			el.bottom.draw();

			el.top.move(p(-3, 0));
			el.bottom.move(p(-3, 0));

			if (el.top.x + el.top.w < 0) {
				el.top.x = el.bottom.x = oldBlock.top.x + oldBlock.top.w + pjs.math.random(150, 250);
				score ++
				oldBlock = el;
			}


			if (el.top.isInCamera()) {
				if (el.top.isIntersect(bird)) {
					gameOver();
				}
			}

			if (el.bottom.isInCamera()) {
				if (el.bottom.isIntersect(bird)) {
					gameOver();
				}
			}

			if (bird.y < 0) {
				gameOver();
			}

			if (bird.y + bird.h > height) {
				gameOver();
			}


		});
	};

	var gameOver = function () {
		game.setLoop('GameOver');
	};

	game.newLoop('InstrLoop', function () {
		drawBG()
		brush.drawText({
			x : width / 2,
			y : height / 3,
			text : 'Кликайте, чтобы корабль подлетел вверх',
			size : 18,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		brush.drawText({
			x : width / 2,
			y : height / 2,
			text : 'Проходите через трубы, не упав или поднявшись высоко',
			size : 18,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		brush.drawText({
			x : width / 2,
			y : height / 1.5,
			text : 'Вы получаете очки за то, что лазер прошёл через трубу',
			size : 18,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		brush.drawText({
			x : width / 2,
			y : height / 1.2,
			text : 'Веселитесь!',
			size : 20,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		if (mouse.isPress('LEFT')) {
			game.startLoop('menu')
		}

	})

	this.update = function () {
		drawBG();
		bird.draw();
		bird.dy += 0.4;
		bird.y += bird.dy;
		bird.angle = bird.dy;

		if (mouse.isPress('LEFT')) {
			bird.dy = -9;

		}

		var wtfText = game.newTextObject({
			x : width - 100,
			y : height / 1.3,
			text : 'EASY',
			size : 40,
			color : 'white',
			font : 'font',
			align : 'center'
		})
		



		drawBlocks();
		laser.setAlpha(0.8)
		laser.draw()

		if (score >= 50) {
			wtfText.draw()
		} 
		drawGR();
		

		brush.drawText({
			x : width / 2,
			y : height / 20,
			text : score,
			size : 50,
			color : 'white',
			font : 'font',
			align : 'center'
		});
		


	};

	this.entry = function () {

		bird.dy = 0;

		blocks = [], oldBlock = false;

		OOP.forInt(5, function () {
			addBlock(pjs.math.random(space*2, height-space*2));
		});


		bird.setPositionC(p(width / 2, height / 2));
		score = 0;
	};
};

game.newLoopFromClassObject('menu', new Menu());
game.newLoopFromClassObject('game', new Game());


var restart = game.newTextObject({
	text : 'Restart',
	positionC : p(width/2, height/2),
	font : 'font',
	size : 50,
	color : '#FFFFFF'
});


game.newLoop('GameOver', function () {
	game.clear();
	drawBG();
	laser.setAlpha(0.8)
	laser.draw()
	drawGR();

	brush.drawText({
		x : width / 2,
		y : height / 20,
		text : score,
		size : 50,
		color : 'white',
		font : 'font',
		align : 'center'
	});

	restart.draw();

	if (mouse.isPeekObject('LEFT', restart)) {
		game.setLoop('game');
	}



});

game.startLoop('menu');
