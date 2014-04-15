/**
 * Stack
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // Id of the table this deck belongs to
    // Default: 1
  	tableId: {
      type: 'INTEGER',
      defaultsTo: 1
    },

    // Id of the top combo on the stack
    // Default: -1
    topComboId: {
      type: 'INTEGER',
      defaultsTo: -1
    },

    // Call a function on the top combo in the stack
    combo: function(cb) {
      Combo.findOne(this.topComboId).done(function(err, combo) {
        cb(combo);
      });
    },

  	// Call a function on the combos in the stack
  	combos: function(cb) {
  		Combo.findByStackId(this.id).done(function(err, combos) {
  			cb(combos);
  		});
  	},

  	// Call a function on the table this deck belongs to
  	tableOwner: function(cb) {
  		Table.findOne(this.tableId).done(function(err, table) {
  			cb(table);
  		});
  	},

    toJson: function() {
      var obj = this.toObject();
    }

  }

};
