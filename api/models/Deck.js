/**
 * Deck
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	// Unique identifier for this card
    // Default: 1
  	deckId: {
      type: 'INTEGER',
      defaultsTo: 1
    }

  	// Id of the table this deck belongs to
    // Default: 1
  	tableId: {
      type: 'INTEGER',
      defaultsTo: 1
    }

  	// Call a function on the cards in the deck
  	cards: function(cb) {
  		Card.findByDeckId(this.deckId).done(function(err, cards) {
  			cb(cards);
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
