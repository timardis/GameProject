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

//  Remove players with disconnected sockets
var refreshSockets = function() {
  var clients = sails.io.sockets.clients()
  Player.findByTableId(1).done(function(err, players) {
    console.log('[Refreshing sockets]')
    for(var i = 0; i < players.length; i++) {
      var pID = players[i].playerId
      var connected = false
      for(var j = 0; j < clients.length; j++) {
        if(pID == clients[j].id)
        {
          connected = true
          break
        }
      }
      if(!connected)
      {
        console.log('[Socket ' + pID + ' not connected, getting destroyed]')
        Player.destroy({
          playerId: pID
        }).done(function() {
          console.log('[Removed player at ' + pID + ']')
        })
      }
    }
  })

  }

var MainController = {
    socketArray: {},
  index: function(req, res){

  	//	Request sent over socket, a.k.a. from front-end javaScript
  	if(req.isSocket)
  	{
      
  	}

  	//	Request for view
  	else
  	{
  		res.view()
  	}
  },

  newPlayer: function(req, res) {
    refreshSockets()

    Player.create({
      playerName: req.param('name'),
      playerId: req.socket.id
    }).done(function(err, player) {
      Player.findByTableId(1).done(function(err, players) {
        
        // Here we will test to see how many players have joined
        // If we have 4 players, we can start the game
        // 
        // if (players.length == 4) {
        //    Table.find({ tableId: 1 }).done(function(err, table) {
        //        table.startGame(cb)
        //    })
        // }
        
        //  Emit to all players it's game time
        if (players.length == 4) {
          //  Deal cards to players


          sails.io.sockets.emit('start game', players)
        }

        console.log('New player ' + player.playerName + ' playerId: ' + player.playerId + ' found!');
        console.log('Total number of players is ' + players.length + '!');
      })
    })

    //  Remove player on socket disconnection
    req.socket.on('disconnect', function() {
      refreshSockets()
    })
  },

  

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MainController)
   */
  _config: {}

  
};


module.exports = MainController
