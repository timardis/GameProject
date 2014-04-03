/**
 * Deck
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

  	// Call a function on the cards in the deck
  	cards: function(cb) {
  		Card.findByDeckId(this.id).done(function(err, cards) {
  			cb(cards);
  		});
  	},

  	// Call a function on the table this deck belongs to
  	tableOwner: function(cb) {
  		Table.findOne(this.tableId).done(function(err, table) {
  			cb(table);
  		});
  	},

    init: function(cb) {
      Deck.findOne(1).done(function(err, deck) {
        deck.load(function() {
          deck.deal(function() {
            cb();
          })
        })
      })
    },
    
    // Fill the deck with all of the cards
    load: function(cb) {
      for (var i = 0; i < 52; i++) {
        Card.create({
          suit: i % 4
        }).done(function(err, card) {
          console.log('Card ' + card.id + ' loaded into deck!');

          if (i == 51) { 
            console.log('Deck loaded, calling back!');
            cb();
          }
        });
      }
    },

    deal: function(cb) {
      for (var i = 52; i >= 1; i--) {
        Player.findOne((i%4) + 1).done(function(err, player) {
          player.hand(function(hand) {
            Card.findByDeckId(1).done(function(err, cards) {
              var pos = Math.floor(Math.random() * i);
              cards[pos].deckId = -1;
              cards[pos].handId = hand.id;
              cards[pos].save(function(err) {
                console.log('Card ' + cards[pos].id + ' given to player ' + player.id + '!');
                if (i == 1) {
                  cb();
                }
              })
            })
          })
        })
      }
    }
  }
};
