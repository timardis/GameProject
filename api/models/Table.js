/**
 * Table
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

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

    //
    //
    // GAME LOGIC AND HELPERS
    // 
    // 

    newGame: function(cb) {
      Deck.create().done(function(err, deck) {
        deck.init(function() {
          cb();
        })
      })
    }
    
  }

};
