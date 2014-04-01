/**
 * MainControllerController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var MainController = {
    
  index: function(req, res){

  	//	Request sent over socket, a.k.a. from front-end javaScript
  	if(req.isSocket)
  	{
      res.json({
        message: 'test message'
      })
  	}

  	//	Request for view
  	else
  	{
  		res.view()
  	}
  },

  newPlayer: function(req, res) {
    Player.create({
      playerName: req.param('name'),
      sessionId: req.socket.id
    }).done(function(err, player) {
      Hand.create({
        playerId: player.id
      }).done(function(err, hand) {
        Player.findByTableId(1).done(function(err, players) {

          console.log('New player ' + player.playerName + ' playerId: ' + player.id + ' found!');
          console.log('Total number of players is ' + players.length + '!');
          
          // Here we will test to see how many players have joined
          // If we have 4 players, we can start the game
          if (players.length == 4) {
             Table.create().done(function(err, table) {
                 table.newGame(function() {
                    console.log('Table created, deck loaded, cards dealt!');
                 })
             })
          }
        })
      })
    })

    req.socket.on('disconnect', function() {
      console.log('Player from ' + req.socket.id + ' disconnected')
      Player.destroy({
         sessionId: req.socket.id
      }).done(function(){
        console.log('Removed player')
      })
    })
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MainController)
   */
  _config: {}

  
};


module.exports = MainController
