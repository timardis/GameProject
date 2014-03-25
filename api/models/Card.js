/**
 * Card
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	suit: 'string',

  	value: 'integer',

  	handId: 'integer',

  	comboId: 'integer',

  	playerId: 'integer',

  	deckId: 'integer',

  	stackId: 'integer',

  	owner: function() {

  	}
    
  }

};
