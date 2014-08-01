module.exports = function Route(app){
	var users = {};
	var messages = [];
	app.get('/', function(req, res) {
		res.render('main');
	})

	app.io.route('got_a_new_user', function(req) {
		req.io.emit('user_setup', {name: req.data.name, users: users, messages: messages});
		users[req.sessionID] = {name: req.data.name};
		var message = "<p>"+req.data.name+" has joined the chat.</p>"
		messages.push(message);
		req.io.broadcast('new_user', {name: req.data.name, message: message});
	})
	app.io.route('new_message', function(req) {
		var message = "<p>"+req.data.name+" says: "+req.data.message+"</p>"
		messages.push(message);
		app.io.broadcast('display_message', {message: message});
	})

	app.io.route('disconnect', function(req) {
		req.io.broadcast('user_disconnected', {id: req.sessionID})
		delete users[req.sessionID]
	})
}