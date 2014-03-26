/**
 * Card
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
    // Unique identifier for this card
    // Default: -1
    cardId: 'integer',

    // Suit of this card ('spade', 'club', 'diamond', 'heart')
    // Default: 'undefined'
  	suit: 'string',

    // Value of the card (Starts at '1' for 3 of Spades, goes up to '52' for 2 of Hearts)
    // Default: -1
  	value: 'integer',

    // Id of the hand this card belongs to
    // Default: -1
  	handId: 'integer',

    // Id of the combo this card belongs to
    // Default: -1
  	comboId: 'integer',

    // Id of the combo this card belongs to
    // Default: 1
  	deckId: 'integer',

    // Id of the stack this card belongs to
    // Default: -1
  	stackId: 'integer',

    // Call a function on the hand this card belongs to
    handOwner: function(cb) {
      Hand.findOneByHandId(this.handId).done(function(err, hand) {
        cb(hand);
      });
    },

    // Call a function on the combo this card belongs to
    comboOwner: function(cb) {
      Combo.findOneByComboId(this.comboId).done(function(err, combo) {
        cb(combo);
      });
    },

    // Call a function on the deck this card belongs to
    deckOwner: function(cb) {
      Deck.findOneByDeckId(this.deckId).done(function(err, deck) {
        cb(deck);
      });
    },

    // Call a function on the stack this card belongs to
    stackOwner: function(cb) {
      Stack.findOneByStackId(this.stackId).done(function(err, stack) {
        cb(stack);
      });
    }
    
  }

};
