/**
 * Combo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
    // Type of this combo ('repeat', 'straight', 'chop')
    // Default: 'undefined'
  	type: {
      type: 'STRING',
      defaultsTo: 'undefined'
    },

    // Length of this combo:
    // For a straight or chop type, this will be the length of the run
    // For a repeat type, this will be the number of times the card appears (i.e. single -> '1', double -> '2'...)
    // Default: 0
  	length: {
      type: 'INTEGER',
      defaultsTo: 0
    },

    // Value of the hand for comparison purposes
    // This will be the value of the highest card in the combo
    // Default: -1
  	compareValue: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Id of the hand this card belongs to
    // Default: -1
  	handId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Id of the stack this card belongs to
    // Default: 1
  	stackId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Call a function on the cards in this combo
    cards: function(cb) {
      Card.findByComboId(this.id).done(function(err, cards) {
        cb(cards);
      });
    },

  	// Call a function on the hand this card belongs to
  	handOwner: function(cb) {
  		Hand.findOne(this.handId).done(function(err, hand) {
  			cb(hand);
  		});
  	},

  	// Call a function on the stack this card belongs to
    stackOwner: function(cb) {
    	Stack.findOne(this.stackId).done(function(err, stack) {
  			cb(stack);
  		});
    },

    // Add a card to this combo
    add: function(cardId, cb) {
      var comboId = this.id;

      Card.findOne(cardId).done(function(err, card) {
        card.comboId = comboId;

        card.save(function(err) {
          console.log('Card ' + cardId + ' added to combo ' + comboId + '!');
          cb();
        });
      });
    },

    // Remove a card from this combo
    remove: function(cardId, cb) {
      Card.findOne(cardId).done(function(err, card) {
        card.comboId = -1;

        card.save(function(err) {
          console.log('Card ' + cardId + ' removed from combo!');
          cb();
        });
      });
    },

    // Play this combo, updating each card in the hand
    play: function(cb) {

      // Update card properties
      this.cards(function(cards) {
        for (var i = 0; i < cards.length; i++) {
          cards[i].stackId = 1;
          cards[i].handId = -1;
        }
      });

      // Update combo properties
      this.stackId = 1;
      this.handId = -1;

      // Update stack properties
      var topId = this.id;
      this.stackOwner(function(stack) {
        stack.topComboId = topId;
        stack.save(function(err) {
          console.log('Stack updated!');
        });
      });

      // Save this combo
      this.save(function(err) {
        console.log('Combo played!');
      });

      // Callback
      cb();
    }
    
  }

};
