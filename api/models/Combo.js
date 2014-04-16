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

    // Whether this is a valid combo
    isValid: {
      type: 'BOOLEAN',
      defaultsTo: false
    },

    // Whether this combo is a valid move on the current stack combo
    isBetter: {
      type: 'BOOLEAN',
      defaultsTo: false
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

    // Determine the type and length of this combo
    identify: function(cb) {
      var obj = this.toObject();

      this.cards(function(cards) {
        // Initialize max and min of array
        var max, min;

        // If the combo is empty
        if (cards.length == 0) {
          obj.type = 'undefined';
        }
        // If the combo has 1 card
        else if (cards.length == 1) {
          obj.type = 'repeat';
        }
        // If the combo has more than 1 card
        else {
          // Store max and min values from the hand
          max = cards[cards.length - 1].id;
          min = cards[0].id;

          // Determine product of all elements in array
          var product = arrayProduct(cards);

          // Determine factorial data
          var maxFac = factorial(Math.floor((cards[cards.length - 1].id-1) / 4) + 2);
          var minFac = factorial(Math.floor((cards[0].id-1) / 4) + 1);

          // Determine the ratio between the two factorials
          var ratio = maxFac / minFac;

          // If the product is equal to the first item raised to the power of the array length, this is a repeat
          if (product == Math.pow(Math.floor((cards[0].id-1) / 4) + 2, cards.length)) {
            obj.type = 'repeat';
          }

          // If the product is equal to the ratio, this is a straight
          else if (product == ratio && cards.length >= 3) {
            obj.type = 'straight';
          }

          // If the product is equal to the ratio squared, this is a chop
          else if (product == Math.pow(ratio, 2) && cards.length >= 6) {
            obj.type = 'chop';
          }

          // Otherwise, this is not a valid combo
          else {
            obj.type = 'undefined';
          }
        }

        // Set properties based on type
        obj.length = cards.length;

        if (obj.type == 'undefined') {
          obj.isValid = false;
          obj.compareValue = -1;
        }
        else {
          obj.isValid = true;
          obj.compareValue = max;
        }
      });

      // Pass property values back to the model and save
      this.type = obj.type;
      this.isValid = obj.isValid;
      this.length = obj.length;
      this.compareValue = obj.compareValue;
      this.save(function(err) {
        console.log('Combo of type ' + obj.type + ' saved!\n\n');
        cb();
      });
    },

    // Update the combo properties when cards are added or removed
    update: function(topCombo, cb) {
      this.identify(function() {
        cb();
      });
    },

    // Play this combo, updating each card in the hand
    play: function(cb) {
      // Store this combo's handId
      var tempHandId = this.handId;

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

      // Create a new combo for this hand then callback
      Combo.create({
        handId: tempHandId
      }).done(function(err, combo) {
        cb();
      });
    }
    
  }

};

function arrayProduct(array) {
  var product = 1;

  for (var i = 0; i < array.length; i++) {
    product *= (Math.floor((array[i].id-1) / 4) + 2);
  }

  return product;
};

function factorial(n) {
  if (n <= 1) {
    return 1;
  }

  return (n * factorial(n-1));
};