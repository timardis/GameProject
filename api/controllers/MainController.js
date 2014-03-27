/**
 * MainControllerController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var MainController = {
    
  index: function(req, res){

  	//	Request sent over socket, a.k.a. from front-end javaScript
  	if(req.isSocket)
  	{
      var flag = req.param('flag')
      if(flag = 'player info') {
        Player.create({
          playerName: req.param('name'),
          playerId: 'req.socket.id',
          tableId: 1
          }).done(function(err, player) {

          })
      }
      Player.find('req.socket.id').exec(function(err, player) {
        res.json(player)
      })
  	}

  	//	Request for view
  	else
  	{
      initEventListeners()
  		res.view()
  	}
  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to MainController)
   */
  _config: {}

  
};

function initEventListeners() {
  sails.io.on('player info', function(data) {
    var msg = 'success message'
    socket.emit('got player info', msg)
  })
}

module.exports = MainController
