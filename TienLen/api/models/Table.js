/**
 * Table
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	players: {
  		collection: 'Player',
  		via: 'owner_table'
  	}

  	deck: {
  		model: 'Deck'
  	}

  	stack: {
  		model: 'Stack'
  	}
    
  }

};
