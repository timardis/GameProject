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
    playerId: {
      type: 'STRING',
      defaultsTo: 'undefined'
    }

    // Game handle for this player
    // Default: 'undefined'
    playerName: {
      type: 'STRING',
      defaultsTo: 'undefined'
    }

    // Id of the table this deck belongs to
    // Default: 1
  	tableId: {
      type: 'INTEGER',
      defaultsTo: 1
    }

  	// Call a function on the player's hand
  	hand: function(cb) {
  		Hand.findOneByPlayerId(this.playerId).done(function(err, hand) {
  			cb(hand);
  		});
  	},

  	// Call a function on the table this deck belongs to
  	tableOwner: function(cb) {
  		Table.findOneByTableId(this.tableId).done(function(err, table) {
  			cb(table);
  		});
  	}
    
  }

};
