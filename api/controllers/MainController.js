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
      var pID = players[i].sessionId
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
          sessionId: pID
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
    refreshSockets();

    Player.create({
      playerName: req.param('name'),
      sessionId: req.socket.id
    }).done(function(err, player) {
      Hand.create({
        playerId: player.id
      }).done(function(err, hand) {
        Combo.create({
          handId: hand.id
        }).done(function(err, combo) {
          Player.findByTableId(1).done(function(err, players) {

            console.log('New player ' + player.playerName + ' playerId: ' + player.id + ' found!');
            console.log('Total number of players is ' + players.length + '!');
            
            // Here we will test to see how many players have joined
            // If we have 4 players, we can start the game
            if (players.length == 4) {
               Table.create().done(function(err, table) {
                   table.newGame(function() {
                      console.log('Table created, deck loaded, cards dealt!');
                      table.changeTurn(function() {});
                      sails.io.sockets.emit('update');
                   });
               });
            }
          });
        });
      });
    });

    //  Remove player on socket disconnection
    req.socket.on('disconnect', function() {
      refreshSockets();
    });
  },

  // Update the table (Stack, player hand size)
  update: function(req, res) {
    Player.findOneBySessionId(req.socket.id).done(function(err, player) {
      player.hand(function(hand) {
        res.json(hand);
      });
    });
  },

  // Add a card to the player's combo
  addCombo: function(req, res) {
    Player.findOneBySessionId(req.socket.id).done(function(err, player) {
      player.hand(function(hand) {
        hand.combo(function(combo) {
          combo.add(req.param('cardId'), function() {
            res.json(hand);
          });
        });
      });
    });
  },

  // Remove a card from the player's combo
  removeCombo: function(req, res) {
    Player.findOneBySessionId(req.socket.id).done(function(err, player) {
      player.hand(function(hand) {
        hand.combo(function(combo) {
          combo.remove(req.param('cardId'), function() {
            res.json(hand);
          });
        });
      });
    });
  },

  // Play a combo from a player's hand
  play: function(req, res) {

  },

  // Pass over a player's turn
  pass: function(req, res) {

  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MainController)
   */
  _config: {}

  
};


module.exports = MainController
