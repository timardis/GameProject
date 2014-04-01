/**
 * Card
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // Suit of this card (0 => Spade, 1 => Club, 2 => Diamond, 3 => Heart)
  	suit: {
      type: 'INTEGER'
    },

    // Id of the hand this card belongs to
    // Default: -1
  	handId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Id of the combo this card belongs to
    // Default: -1
  	comboId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Id of the combo this card belongs to
    // Default: 1
  	deckId: {
      type: 'INTEGER',
      defaultsTo: 1
    },

    // Id of the stack this card belongs to
    // Default: 1
  	stackId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Call a function on the hand this card belongs to
    handOwner: function(cb) {
      Hand.findOne(this.handId).done(function(err, hand) {
        cb(hand);
      });
    },

    // Call a function on the combo this card belongs to
    comboOwner: function(cb) {
      Combo.findOne(this.comboId).done(function(err, combo) {
        cb(combo);
      });
    },

    // Call a function on the deck this card belongs to
    deckOwner: function(cb) {
      Deck.findOne(this.deckId).done(function(err, deck) {
        cb(deck);
      });
    },

    // Call a function on the stack this card belongs to
    stackOwner: function(cb) {
      Stack.findOne(this.stackId).done(function(err, stack) {
        cb(stack);
      });
    }
    
  }

};
