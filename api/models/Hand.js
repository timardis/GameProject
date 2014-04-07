/**
 * Hand
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // Id of the player this hand belongs to
    // Default: 'undefined'
  	playerId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

  	// Call a function on the cards in the hand
  	cards: function(cb) {
      Card.findByHandId(this.id).done(function(err, cards) {
        cb(cards);
      });
    },

  	// Call a function on the combo in the hand
  	combo: function(cb) {
  		Combo.findOneByHandId(this.id).done(function(err, combo) {
  			cb(combo);
  		});
  	},

  	// Call a function on the player this hand belongs to
  	playerOwner: function(cb) {
  		Player.findOne(this.playerId).done(function(err, player) {
  			cb(player);
  		});
  	},

    toJSON: function() {
      var obj = this.toObject();

      obj.handArray = [];
      obj.comboArray = [];

      this.cards(function(cards) {
        for (var i = 0; i < cards.length; i++) {
          obj.handArray.push(cards[i].id);
        }
      })

      this.combo(function(combo) {
        combo.cards(function(cards) {
          for (var i = 0; i < cards.length; i++) {
            obj.comboArray.push(cards[i].id);
          }
        })
      })
    }
    
  }

};
