var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);

var io = require('socket.io').listen(app);

var fs = require("fs");
var user_to_Socket_Map = new HashMap();
var socket_to_user_Map = new HashMap();
var userInCall_Map = new HashMap();

function makeOnline(username,socket)
{
	if(user_to_Socket_Map.has(username) != "true"){
		user_to_Socket_Map.set(username, socket.id);
		socket_to_user_Map.set(socket.id, username);
        getSocket(username).emit('hi')
		userInCall_Map.set(username, "false");
	}
	
    /** To be done by rakib **/
    /*
        This function makes the user with the username online
        this also gets a socket variable so that u can make user
        offline

    */



}

function makeOffline(socket)
{
	var curUsername;
	if(user_to_Socket_Map.has(username) == "true"){
		user_to_Socket_Map.delete(username);
		curUsername = socket_to_user_Map.get(socket.id);
		socket_to_user_Map.delete(socket.id);
		userInCall.delete(username);
	}
	return curUsername;
    /** To be done by rakib **/
    /*
        This function makes the user with the socket offline
        and also returns the username of the user belonging to
        this socket
    */
}

function isOnline(username)
{
	return user_to_Socket_Map.has(username);
    /** To be done by rakib **/
    /*
         Checks if the user with username is online
    */

}
function getFriends(username)
{
	var data = fs.readFileSync((username+".txt"));
	var fileData = data.toString();
	var array;
	var indx = 0;
	var prev=0;
	for(var i = 0; i<=fileData.length; i++){
		if(fileData.charAt(i) == '\n') {
			array[indx] = fileData.slice(prev, i);
			prev = i+1;
			indx = indx+1;
		}
	}
	return array;
    /** To be done by rakib **/
    /*
        This function collects the username of the friends of the user
        and then return an ARRAY of usernames which are his friends

        use-case:
            getFriends('tamim')
            returns ['mahfuz','rakib','tuhin','masum']

    */
}

function getSocket(username)
{
	if(user_to_Socket_Map.has(username) == "true"){
		return io.sockets.socket(user_to_Socket_Map.get(username));
	}
    /** To be done by rakib **/
    /** Returns the socket corresponding to the current username **/


}

function getUsername(socket)
{
	if(socket_to_user_Map.has(socket.id) == "true"){
		return socket_to_user_Map.get(socket.id);
	}
        /** To be done by rakib **/
    /** Returns the username corresponding to the current socket **/

}

function setUserInCall(username){
	if(userInCall_Map.get(username) == "false"){
		userInCall_Map.set(username, "true");	
	}
}

function removeUserInCall(username){
	if(userInCall_Map.get(username) == "true"){
		userInCall_Map.set(username, "false");	
	}
}

function isUserInCall(username){
	return userInCall_Map.get(username);
} //Declaration to be deteremined







io.sockets.on('connection', function (socket)
{
    socket.on('connected',function(username){
        


    });

    socket.on('disconnect', function() {
      /** To be done by tamim and mahfuz **/
      console.log('Got disconnect!');

      disconnectedUser = makeOffline(socket);
      friends = getFriends(disconnectedUser);
      // Code to call



   });





});

