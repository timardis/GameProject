var canvas, stage, title, cards = []
var index = 0
var interval
function init() {
	canvas = document.getElementById('gameCanvas')
	stage = new createjs.Stage(canvas)
	stage.autoClear = false
	stage.enableDOMEvents(true)

	
	stage.addChild(title)

    init_cards()

 	cards_spritesheet.addEventListener('complete', function(){
 		interval = setInterval(display_card, 40)
 	})
 //    createjs.Ticker.setInterval(500)
	// createjs.Ticker.addEventListener("tick", stage)
}

var cards_spritesheet = new createjs.SpriteSheet({
	framerate: 20,
	images: ["../images/cards-sprite.png"],
	frames: {width:73, height:98}
})

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
	}
	return true
}

function get_card(index) {
	if(0 <= index && index < 52)
		return cards[index]
	else
		return false
}