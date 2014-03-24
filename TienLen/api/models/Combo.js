/**
 * Combo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	type: 'STRING',

  	length: 'INTEGER',

  	compareValue: 'INTEGER',
  	
  	cards: {
  		collection: 'Card',
  		via: 'owner_combo'
  	}
    
  }

};
