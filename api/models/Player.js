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
    id: 'STRING',

    playerName: 'integer',

    // Id of the table this deck belongs to
    // Default: 1
  	tableId: 'integer',

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
