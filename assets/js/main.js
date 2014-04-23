/*;
*	main.js: Front-end javaScript for the main game page;
*
*/

//	Global variables;
var canvas, stage, title,
	players = [],
	cardsSpriteSheet,
	cards = [];
var index, interval, data;
var comboCards = [], mainHandArray = [];
var playButton, passButton;
var currentTurn, comboIsValid, comboIsBetter;
var cardsX = 300, cardsY = 400;
var cardsGap = 15;

function init() {
	canvas = document.getElementById('gameCanvas');
	stage = new createjs.Stage(canvas);
	stage.autoClear = false;
	stage.enableDOMEvents(true);
	stage.enableMouseOver(10);

	var background = new createjs.Bitmap("../images/bg.png");
	background.x = 0;
	background.y = 0;
	stage.addChild(background);

	currentTurn = false;
	comboIsValid = false;

	initPlayButton();
	initPassButton();

    initCards();

    initSocketListeners();

	stage.update();

  	joinTable();
}

//	Send player information;
//
function joinTable() {
	socket.get('/main/newPlayer', { name: document.getElementById('nameinput').value }, function (response) {
		console.log(response);
	});
}

//	helper function for printing out text for debug purposes;
function printDebugText(str) {
	var t = new createjs.Text(str, '14px Tacoma', 'black');
	t.x = 400;
	t.y = 400;
	stage.addChild(t);
	stage.update();
}

function showCard(value, xVal, yVal) {
	cards[value - 1].x = xVal;
	cards[value - 1].y = yVal;
	stage.addChild(cards[value - 1]);

	stage.update();
}

function unshowCard(value) {
	stage.removeChild(cards[value - 1]);
	stage.update();
}

//	Initialize socket.io event listeners;
//;
function initSocketListeners() {
	socket.on('update', function(data) {
		socket.get('/main/update', {}, function(response) {
			console.log('socket get update');
			console.log(response);

			if(response.tableJson.turnSocketId == socket.socket.sessionid) {
				console.log("It's my turn now!");
				currentTurn = true;
			}
			else {
				currentTurn = false;
			}

			if(currentTurn) {
				setPassButton("active");
			}
			else {
				setPassButton("inactive");
			}

			if(comboIsValid && comboIsBetter && currentTurn) {
				setPlayButton("active");
			}
			else {
				setPlayButton("inactive");
			}

			if(mainHandArray.length > 0) {
				for(var i = 0; i < mainHandArray.length; i++) {
					unshowCard(mainHandArray[i]);
				}
			}

			mainHandArray = response.handJson.handArray;
			for(var i = 0; i < mainHandArray.length; i++) {
				showCard(mainHandArray[i], cardsX + cardsGap*i, cardsY);
			}
		});
	});
}

function initPlayButton() {
	console.log("initPlayButton");
	playSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/playbutton.png"],
		frames: {width:40, height:23},

		animations: {
			active: [1],
			over: [0],
			inactive: [2]
		}
	});

	setPlayButton("inactive");
}

function setPlayButton(state) {
	stage.removeChild(playButton);
	playButton = new createjs.Sprite(playSpriteSheet, state);
	playButton.x = cardsX + 150;
	playButton.y = cardsY + 115;
	if(state == "active") {
		playButton.addEventListener("mouseover", function(event) {
			setPlayButton("over");
		});
		playButton.addEventListener("click", handlePlayClick);
	}
	else if(state == "over") {
		playButton.addEventListener("mouseout", function(event) {
			setPlayButton("active");
		});
		playButton.addEventListener("click", handlePlayClick);
	}
	else if(state == "inactive") {
		playButton.removeAllEventListeners();
	}
	stage.addChild(playButton);
	stage.update();
}

function handlePlayClick(event) {
	playButton.removeAllEventListeners();
	comboIsBetter = false;
	comboIsValid = false;
	socket.get("/main/play", {}, function(response) {
		console.log('socket get play');
		console.log(response);
	});
	setPlayButton("inactive");
}

function initPassButton() {
	console.log("initPassButton");
	passSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/passbutton.png"],
		frames: {width:40, height:23},

		animations: {
			active: [1],
			over: [0],
			inactive: [2]
		}
	});

	setPassButton("inactive");
}

function setPassButton(state) {
	stage.removeChild(passButton);
	passButton = new createjs.Sprite(passSpriteSheet, state);
	passButton.x = playButton.x + 50;
	passButton.y = playButton.y;
	if(state == "active") {
		passButton.addEventListener("mouseover", function(event) {
			setPassButton("over");
		});
		passButton.addEventListener("click", handlePassClick);
	}
	else if(state == "over") {
		passButton.addEventListener("mouseout", function(event) {
			setPassButton("active");
		});
		passButton.addEventListener("click", handlePassClick);
	}
	else if(state == "inactive") {
		passButton.removeAllEventListeners();
	}
	stage.addChild(passButton);
	stage.update();
}

function handlePassClick(event) {
	passButton.removeAllEventListeners();
	comboIsBetter = false;
	comboIsValid = false;
	socket.get("/main/pass", {}, function() {});
	setPassButton("inactive");
}

//	Initialize array of card Sprites;
// ;
function initCards() {
	for(var i = 0; i < 52; i++) {
		comboCards[i] = false;
	}

	cardsSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/cards.png"],
		frames: {width:73, height:98}
	});



	for(var i = 0; i < 52; i++)
	{
		cards.push(new createjs.Sprite(cardsSpriteSheet, 13 * Math.floor(i%4) + i/4 ));
		cards[i].paused = true;
		cards[i].id = i;
		cards[i].addEventListener('click', function(event) {
			var eventCardId = event.target.id;
			if(comboCards[eventCardId] == false) {
				comboCards[eventCardId] = true;
				console.log("Card #" + (eventCardId+1) + " added");
				console.log('new code');
				socket.get('/main/addCombo', {cardId: eventCardId + 1}, function(response){
					console.log('socket get addCombo');
					console.log(response);

					comboIsValid = response.isValid;
					comboIsBetter = response.isBetter;
					if(comboIsValid && comboIsBetter && currentTurn) {
						setPlayButton("active");
					}
					else {
						setPlayButton("inactive");
					}
				});

				event.target.y -= 25;
				stage.update();
			}
			else {
				comboCards[eventCardId] = false;
				console.log("Card #" + (eventCardId+1) + " removed");
				socket.get('/main/removeCombo', {cardId: eventCardId + 1}, function(response) {
					console.log('socket get removeCombo');
					console.log(response);

					comboIsValid = response.isValid;
					comboIsBetter = response.isBetter;
					if(comboIsValid && comboIsBetter && currentTurn) {
						setPlayButton("active");
					}
					else {
						setPlayButton("inactive");
					}
				});

				event.target.y += 25;
				stage.update()
			}
		
		});
	}
	return true;
}
