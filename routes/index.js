module.exports = function Route(app){
	var users = {};
	var rooms = {};
	app.get('/', function(req, res) {
		res.render('main');
	})
	// route to create a room
	app.io.route('create_room', function(req) {
		req.io.join(req.data.room); // first join the room (create it)
		rooms[req.data.room] = []; // create a new key value pair in the rooms object with val being messages array
		var message = "<p>"+req.data.name+" has created the room: "+req.data.room+"</p>"
		rooms[req.data.room].push(message) // add the message for creating the room
		req.io.emit('user_setup', {name: req.data.name, messages: rooms[req.data.room], room: req.data.room}) // set up the user who created 
	})
	// route to join a room
	app.io.route('join_room', function(req) {
		req.io.join(req.data.room) // first join the room
		req.io.emit('user_setup', {name: req.data.name, messages: rooms[req.data.room], room: req.data.room}) // set up the user who joined
		var message = "<p>"+req.data.name+" has joined the room</p>"
		rooms[req.data.room].push(message) // add the join message
		req.io.room(req.data.room).broadcast('new_user', {message: message}) // broadcast the join message
	})
	// response for when the user pings for the list of rooms
	app.io.route('get_rooms', function(req) {
		req.io.respond({rooms: rooms})
	})
	// route to add and display a new message
	app.io.route('new_message', function(req) {
		var message = "<p>"+req.data.name+" says: "+req.data.message+"</p>"
		rooms[req.data.room].push(message); // add the message
		app.io.room(req.data.room).broadcast('display_message', {message: message}); // broadcast the message
	})

}