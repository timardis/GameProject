/**
 * Deck
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	cards: {
  		collection: 'Card',
  		via: 'owner_deck'
  	}

  	owner_table: {
  		model: 'Table'
  	}
    
  }

};
