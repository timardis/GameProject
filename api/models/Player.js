/**
 * Player
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	// Unique identifier for this player
    // Default: -1
    sessionId: {
      type: 'STRING',
      defaultsTo: 'undefined'
    },

    // Game handle for this player
    // Default: 'undefined'
    playerName: {
      type: 'STRING',
      defaultsTo: 'undefined'
    },

    // Id of the table this deck belongs to
    // Default: 1
  	tableId: {
      type: 'INTEGER',
      defaultsTo: 1
    },

    // Id's of the players to the left, right and across
    leftId: {
      type: 'INTEGER'
    },

    rightId: {
      type: 'INTEGER'
    },

    crossId: {
      type: 'INTEGER'
    },

  	// Call a function on the player's hand
  	hand: function(cb) {
  		Hand.findOneByPlayerId(this.id).done(function(err, hand) {
  			cb(hand);
  		});
  	},

  	// Call a function on the table this deck belongs to
  	tableOwner: function(cb) {
  		Table.findOne(this.tableId).done(function(err, table) {
  			cb(table);
  		});
  	},

    // Play the combo in the player's hand
    play: function(cb) {
      this.hand(function(hand) {
        hand.combo(function(combo) {
          combo.play(function() {
            cb();
          });
        });
      });
    },

    // Pass over the player's turn, return a random card from the stack to their hand (if the stack has any cards)
    pass: function(cb) {
      var obj = this.toObject();

      Card.findByStackId(1).done(function(err, cards) {
        if (cards.length > 0) {
          var pos = Math.floor(Math.random() * cards.length);
          cards[pos].handId = obj.id;
          cards[pos].stackId = -1;
          cards[pos].comboId = -1;

          cards[pos].save(function(err) {
            console.log('Card ' + cards[pos].id + ' given to player ' + obj.id + '!\n\n');
            cb();
          });
        }

        else {
          cb();
        }
      });
    },

    // Return the number of cards in the other players' hands
    toJSON: function() {
      var obj = this.toObject();

      Player.findOne(this.leftId).done(function(err, player) {
        player.hand(function(hand) {
          hand.cards(function(cards) {
            obj.leftHandSize = cards.length;
          });
        });
      });

      Player.findOne(this.crossId).done(function(err, player) {
        player.hand(function(hand) {
          hand.cards(function(cards) {
            obj.crossHandSize = cards.length;
          });
        });
      });

      Player.findOne(this.rightId).done(function(err, player) {
        player.hand(function(hand) {
          hand.cards(function(cards) {
            obj.rightHandSize = cards.length;
          });
        });
      });

      return obj;
    }
    
  }

};
