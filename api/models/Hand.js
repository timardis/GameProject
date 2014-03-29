/**
 * Hand
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	// Unique identifier for this card
    // Default: -1
    handId: {
      type: 'INTEGER',
      defaultsTo: -1
    }

    // Id of the player this hand belongs to
    // Default: 'undefined'
  	playerId: {
      type: 'STRING',
      defaultsTo: 'undefined'
    }

  	// Call a function on the cards in the hand
  	cards: function(cb) {
  		Card.findByHandId(this.handId).done(function(err, cards) {
  			cb(cards);
  		});
  	},

  	// Call a function on the combo in the hand
  	combo: function(cb) {
  		Combo.findOneByHandId(this.handId).done(function(err, combo) {
  			cb(combo);
  		});
  	},

  	// Call a function on the player this hand belongs to
  	playerOwner: function(cb) {
  		Player.findOneByHandId(this.handId).done(function(err, player) {
  			cb(player);
  		});
  	}
    
  }

};
