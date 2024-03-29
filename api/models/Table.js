/**
 * Table
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // Id of the player whose turn it is
    turnId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

  	// Call a function on the deck for the table
  	deck: function(cb) {
  		Deck.findOneByTableId(this.id).done(function(err, deck) {
  			cb(deck);
  		});
  	},

  	// Call a function on the stack for the table
  	stack: function(cb) {
  		Stack.findOneByTableId(this.id).done(function(err, stack) {
  			cb(stack);
  		});
  	},

  	// Call a function on the players at the table
  	players: function(cb) {
  		Player.findByTableId(this.id).done(function(err, players) {
  			cb(players);
  		});
  	},

    // Return JSON information
    toJSON: function() {
      var obj = this.toObject();

      obj.stackArray = [];

      Player.findOne(this.turnId).done(function(err, player) {
        obj.turnSocketId = player.sessionId;
      });

      this.stack(function(stack) {
        stack.combo(function(combo) {
          if (typeof combo !== "undefined") {
            combo.cards(function(cards) {
              for (var i = 0; i < cards.length; i++) {
                obj.stackArray.push(cards[i].id);
              }
            });
          }
        });
      });

      return obj;
    },

    //
    //
    // GAME LOGIC AND HELPERS
    // 
    // 

    // Initialize game models and behaviors
    newGame: function(cb) {
      this.assignSeats(function() {
        Deck.create().done(function(err, deck) {
          deck.init(function() {
            cb();
          });
        });
      });
    },

    // Change turns, player owning 3-S at beginning, next playerId during game
    changeTurn: function(cb) {
      var turnId = this.turnId;

      if (turnId == -1) {
        Card.findOne(1).done(function(err, card) {
          card.handOwner(function(hand) {
            hand.playerOwner(function(player) {
              turnId = player.id;
            });
          });
        });
      }

      else {
        Player.findByTableId(this.id).done(function(err, players) {
          if (turnId == players[players.length - 1].id) {
            turnId = players[0].id;
          }
          else {
            turnId++;
          }
        });
      }

      this.turnId = turnId;
      this.save(function(err) {
        console.log('Your move, player ' + turnId + '!');
        cb();
      });
    },

    // Assign players seats (set their left, right, and cross players)
    assignSeats: function(cb) {
      this.players(function(players) {
        for (var i = 0; i < 4; i++) {
          var id = players[i].id;

          if (id == 1) {
            players[i].leftId = 2;
            players[i].crossId = 3;
            players[i].rightId = 4;
          }
          else if (id == 2) {
            players[i].leftId = 3;
            players[i].crossId = 4;
            players[i].rightId = 1;
          }
          else if (id == 3) {
            players[i].leftId = 4;
            players[i].crossId = 1;
            players[i].rightId = 2;
          }
          else {
            players[i].leftId = 1;
            players[i].crossId = 2;
            players[i].rightId = 3;
          }

          players[i].save(function(err) {
            if (i == 3) {
              cb();
            }
          });
        }
      });
    }
    
  }

};
