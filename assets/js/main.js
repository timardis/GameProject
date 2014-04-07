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

function init() {
	canvas = document.getElementById('gameCanvas')
	stage = new createjs.Stage(canvas)
	stage.autoClear = false
	stage.enableDOMEvents(true)

    initCards()

    initSocketListeners()

    index = 0
    var interval = setInterval(displayCard, 40)



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

//	experimental helper function
function displayCardArray(array) {
	for(var i = 0; i < array.length; i++){
		var cardIndex = array[i]
		
		cards[cardIndex].x = 400 + i * 15
		cards[cardIndex].y = 300
		stage.addChild(cards[cardIndex])
	}

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
	if(index > 51)
	{
		clearInterval(interval)
	}
	else
	{
		cards[index].x = 100 + index * 15
		cards[index].y = 100
		stage.addChild(cards[index])

		stage.update()
		index++
	}
}
//	Initialize socket.io event listeners
//
function initSocketListeners() {
	socket.on('update', function(data) {
		socket.get('/main/update', {}, function(response) {
			data = response;
			console.log(response)
		})
	})
}

//	Initialize array of card Sprites
//	It's a mess because of the way the cards 
//	are arranged on the sprite image
// 
function initCards() {
	cardsSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/cards.png"],
		frames: {width:73, height:98}
	})

	for(var i = 0; i < 52; i++)
	{
		cards.push(new createjs.Sprite(cardsSpriteSheet, 13 * Math.floor(i%4) + i/4 ))
		cards[i].paused = true
	}
	return true
}
