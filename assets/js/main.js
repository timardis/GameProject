/*
*	main.js: Front-end javaScript for the main game page
*	
*/

var canvas, stage, title, cards = []
var index, interval

function init() {
	canvas = document.getElementById('gameCanvas')
	stage = new createjs.Stage(canvas)
	stage.autoClear = false
	stage.enableDOMEvents(true)

    init_cards()

    //display_card_array(handcards)

    print_debug_text()

 	cards_spritesheet.addEventListener('complete', function(){
		index = 0;
 		var interval = setInterval(display_card, 40)
 	})
	//	createjs.Ticker.setInterval(500)
	//	createjs.Ticker.addEventListener("tick", stage)
}

var cards_spritesheet = new createjs.SpriteSheet({
	framerate: 20,
	images: ["../images/cards-sprite.png"],
	frames: {width:73, height:98}
})

//	helper function for printing out text for debug purposes
function print_debug_text() {
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
function display_card_array(array) {
	for(var i = 0; i < array.length; i++){
		var card_index = array[i]
		
		cards[card_index].x = 400 + i * 15
		cards[card_index].y = 300
		stage.addChild(cards[card_index])
	}

	stage.update()
}

//	experimental helper function to show deck of cards
function display_card(){
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

// Initialize array of card Sprites
// It's a mess because of the way the cards 
// are arranged on the sprite sheet
// 
function init_cards() {
	for(var i = 0; i < 52; i++)
	{
		if(i < 13)
			cards.push(new createjs.Sprite(cards_spritesheet, (i+1)%13 + 13))
		else if(13 <= i && i < 26)
			cards.push(new createjs.Sprite(cards_spritesheet, (i+1)%13))
		else if(26 <= i && i < 39)
			cards.push(new createjs.Sprite(cards_spritesheet, (i+1)%13 + 39))
		else if(39 <= i && i < 52)
			cards.push(new createjs.Sprite(cards_spritesheet, (i+1)%13 + 26))
		else
			return false

		cards[i].paused = true;
	}
	return true
}
