/**
 * Deck
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	deckId: 'integer',

  	// Call a function on the cards in the deck
  	cards: function(cb) {
  		Card.findByDeckId(this.deckId).done(function(err, cards) {
  			cb(cards);
  		});
  	}
    
  }

};
