/**
 * Hand
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	cards: {
  		collection: 'Card',
  		via: 'owner_hand'
  	}

  	owner_player: {
  		model: 'Player'
  	}
    
  }

};
