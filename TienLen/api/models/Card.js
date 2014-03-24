/**
 * Card
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	suit: 'STRING',

  	value: 'INTEGER',

  	owner_hand: {
  		model: 'Hand'
  	}

  	owner_combo: {
  		model: 'Combo'
  	}

  	owner_deck: {
  		model: 'Deck'
  	}

  	owner_stack: {
  		model: 'Stack'
  	}

  }

};
