/**
 * Table
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	// Unique identifier for this table
    // Default: 1
  	tableId: {
      type: 'INTEGER',
      defaultsTo: 1
    },

  	// Call a function on the deck for the table
  	deck: function(cb) {
  		Deck.findOneByTableId(this.tableId).done(function(err, deck) {
  			cb(deck);
  		});
  	},

  	// Call a function on the stack for the table
  	stack: function(cb) {
  		Stack.findOneByTableId(this.tableId).done(function(err, stack) {
  			cb(stack);
  		});
  	},

  	// Call a function on the players at the table
  	players: function(cb) {
  		Player.findByTableId(this.tableId).done(function(err, players) {
  			cb(players);
  		});
  	},



    //
    //
    // GAME LOGIC AND HELPERS
    // 
    // 
    
    startGame: function(cb) {
      Deck.Create();
    }
    
  }

};
