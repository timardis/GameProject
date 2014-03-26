/**
 * Stack
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	// Unique identifier for this stack
    // Default: 1
    stackId: 'integer',

    // Id of the table this deck belongs to
    // Default: 1
  	tableId: 'integer',

  	// Call a function on the combos in the stack
  	combos: function(cb) {
  		Combo.findByStackId(this.stackId).done(function(err, combos) {
  			cb(combos);
  		});
  	},

  	// Call a function on the table this deck belongs to
  	tableOwner: function(cb) {
  		Table.findOneByTableId(this.tableId).done(function(err, table) {
  			cb(table);
  		});
  	}
    
  }

};
