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
var comboCards = []
var playButton

function init() {
	canvas = document.getElementById('gameCanvas')
	stage = new createjs.Stage(canvas)
	stage.autoClear = false
	stage.enableDOMEvents(true)
	stage.enableMouseOver(10)

	initPlayButton()
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
			var mainHandArray = response.handJson.handArray
			for(var i = 0; i < mainHandArray.length; i++) {
				showCard(mainHandArray[i], 300 + 15*i, 400)
			}
		})
	})
}

function initPlayButton() {
	console.log("initPlayButton")
	playSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/playbutton.png"],
		frames: {width:40, height:23},

		animations: {
			active: [1],
			over: [0],
			inactive: [2]
		}
	})

	setPlayButton("inactive")
}

function setPlayButton(state) {
	stage.removeChild(playButton)
	playButton = new createjs.Sprite(playSpriteSheet, state)
	playButton.x = 570
	playButton.y = 460
	if(state == "active") {
		playButton.addEventListener("mouseover", function(event) {
			setPlayButton("over")
		})
		playButton.addEventListener("click", function(event) {
			socket.get("/main/play", {}, function(response) {
				console.log(response)
			})
			setPlayButton("inactive")
		})
	}
	else if(state == "over") {
		playButton.addEventListener("mouseout", function(event) {
			setPlayButton("active")
		})
		playButton.addEventListener("click", function(event) {
			socket.get("/main/play", {}, function(response) {
				console.log(response)
			})
			setPlayButton("inactive")
		})
	}
	stage.addChild(playButton)
	stage.update()
}

//	Initialize array of card Sprites
// 
function initCards() {
	for(var i = 0; i < 52; i++) {
		comboCards[i] = false;
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
		cards[i].id = i
		cards[i].addEventListener('click', function(event) {
			var eventCardId = event.target.id
			if(comboCards[eventCardId] == false) {
				comboCards[eventCardId] = true
				console.log("Card #" + (eventCardId+1) + " added")
				socket.get('/main/addCombo', {cardId: eventCardId + 1}, function(response){
					if(response.isValid) {
						setPlayButton("active")
					}
					else {
						setPlayButton("inactive")
					}
				})

				event.target.y -= 25
				stage.update()
			}
			else {
				comboCards[eventCardId] = false
				console.log("Card #" + (eventCardId+1) + " removed")
				socket.get('/main/removeCombo', {cardId: eventCardId + 1}, function(response) {
					if(response.isValid) {
						setPlayButton("active")
					}
					else {
						setPlayButton("inactive")
					}
				})

				event.target.y += 25
				stage.update()	
			}
			
		})
	}
	return true
}
