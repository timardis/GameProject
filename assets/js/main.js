/*
*	main.js: Front-end javaScript for the main game page
*	
*/

//	Global variables
var canvas, stage, title,
	players = [],
	cardsSpriteSheet,
	cards = []
var index, interval, data
var clickedCards = []

function init() {
	canvas = document.getElementById('gameCanvas')
	stage = new createjs.Stage(canvas)
	stage.autoClear = false
	stage.enableDOMEvents(true)

    initCards()

    initSocketListeners()

	stage.update()

  	joinTable()
}

//	Send player information
//	
function joinTable() {
	socket.get('/main/newPlayer', { name: document.getElementById('nameinput').value }, function (response) {
		console.log(response);
	});
}

//	helper function for printing out text for debug purposes
function printDebugText(str) {
	var t = new createjs.Text(str, '14px Tacoma', 'black')
	t.x = 400
	t.y = 400
	stage.addChild(t)
	stage.update()
}

function showCard(value, xVal, yVal) {
	cards[value - 1].x = xVal
	cards[value - 1].y = yVal
	stage.addChild(cards[value - 1])

	stage.update()
}

//	experimental helper function to show deck of cards
function displayCard(){
	if(index < 52)
	{
		cards[index].x = 100 + index * 15
		cards[index].y = 100
		stage.addChild(cards[index])

		index++
	}
}
//	Initialize socket.io event listeners
//
function initSocketListeners() {
	socket.on('update', function(data) {
		socket.get('/main/update', {}, function(response) {
			var mainHandArray = response.handArray
			for(var i = 0; i < mainHandArray.length; i++) {
				showCard(mainHandArray[i], 300 + 15*i, 400)
			}
		})
	})
}

//	Initialize array of card Sprites
//	It's a mess because of the way the cards 
//	are arranged on the sprite image
// 
function initCards() {
	for(var i = 0; i < 51; i++) {
		clickedCards[i] = false;
	}

	cardsSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/cards.png"],
		frames: {width:73, height:98}
	})

	for(var i = 0; i < 52; i++)
	{
		cards.push(new createjs.Sprite(cardsSpriteSheet, 13 * Math.floor(i%4) + i/4 ))
		cards[i].paused = true
		cards[i].addEventListener('click', function() {
			if(clickedCards[i] == false) {
				cards[i] = true
				console.log("Card #" + (i+1) + " added")
				socket.get('/main/addCombo', {cardId: i + 1})

				cards[i].y += 25
				stage.update()
			}
			else {
				cards[i] = false
				console.log("Card #" + (i+1) + " removed")
				socket.get('/main/removeCombo', {cardId: i + 1})

				cards[i].y -= 25
				stage.update()	
			}
			
		})
	}
	return true
}
