/*
*	main.js: Front-end javaScript for the main game page
*	
*/

//	Global variables
var canvas, stage, title,
	players = [],
	cardsSpriteSheet,
	cards = []
var index, interval

function init() {
	canvas = document.getElementById('gameCanvas')
	stage = new createjs.Stage(canvas)
	stage.autoClear = false
	stage.enableDOMEvents(true)

    initCards()
    sendPlayerInfo('Cuong Ngo')

    getPlayers()
    //displayCardArray(handcards)

    printDebugText()

 	cardsSpriteSheet.addEventListener('complete', function(){
		index = 0
 		var interval = setInterval(displayCard, 40)
 	})
}

//	Send player information
//	
function sendPlayerInfo(playerName) {
	var playerInfo = {
		name: playerName
	}
	socket.emit('player info', playerInfo)
}

//	Get players from the server
//	
function getPlayers() {
	socket.on('start game', function(data) {
		//	should get a 'players' array
		players = data.players
	})
}

//	helper function for printing out text for debug purposes
function printDebugText() {
	var text
	socket.get('/', {message: 'the view said hi!'}, function (res){
		text = res.message

		var t = new createjs.Text(text, '14px Tacoma', 'black')
		t.x = 400
		t.y = 400
		stage.addChild(t)
		stage.update()
	})

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

//	experimental helper function to show deck of cards
function displayCard(){
	if(index > 51)
	{
		clearInterval(interval)
	}
	else
	{
		cards[index].paused = true
		cards[index].x = 100 + index * 15
		cards[index].y = 100
		stage.addChild(cards[index])

		stage.update()
		index++
	}
}


//	Initialize array of card Sprites
//	It's a mess because of the way the cards 
//	are arranged on the sprite image
// 
function initCards() {
	cardsSpriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		images: ["../images/cards-sprite.png"],
		frames: {width:73, height:98}
	})

	for(var i = 0; i < 52; i++)
	{
		if(i < 13)
			cards.push(new createjs.Sprite(cardsSpriteSheet, (i+1)%13 + 13))
		else if(13 <= i && i < 26)
			cards.push(new createjs.Sprite(cardsSpriteSheet, (i+1)%13))
		else if(26 <= i && i < 39)
			cards.push(new createjs.Sprite(cardsSpriteSheet, (i+1)%13 + 39))
		else if(39 <= i && i < 52)
			cards.push(new createjs.Sprite(cardsSpriteSheet, (i+1)%13 + 26))
		else
			return false

		cards[i].paused = true
	}
	return true
}
