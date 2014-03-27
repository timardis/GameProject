/**
 * Combo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
    // Id of the combo this card belongs to
    // Default: -1
  	comboId: 'integer',

    // Type of this combo ('repeat', 'straight', 'chop')
    // Default: 'undefined'
  	type: 'string',

    // Length of this combo:
    // For a straight or chop type, this will be the length of the run
    // For a repeat type, this will be the number of times the card appears (i.e. single -> '1', double -> '2'...)
    // Default: 0
  	length: 'integer',

    // Value of the hand for comparison purposes
    // This will be the value of the highest card in the combo
    // Default: -1
  	compareValue: 'integer',

    // Id of the hand this card belongs to
    // Default: -1
  	handId: 'integer',

    // Id of the stack this card belongs to
    // Default: -1
  	stackId: 'integer',

  	// Call a function on the hand this card belongs to
  	handOwner: function(cb) {
  		Hand.findOneByHandId(this.handId).done(function(err, hand) {
  			cb(hand);
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
