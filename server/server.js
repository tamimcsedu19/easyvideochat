var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);
var io = require('socket.io').listen(app);
global.HashMap = require('hashmap');
var fs = require("fs");
var user_to_Socket_Map = new Array();
var socket_to_user_Map = new Array();
var userInCall_Map = new Array();

function makeOnline(username,socket)
{

		user_to_Socket_Map[username] =  socket.id;
		socket_to_user_Map[socket.id] = username;
		console.log("making online "+user_to_Socket_Map[username]);
		userInCall_Map[username] = 0;
	
	
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
	
		user_to_Socket_Map[username] = 0;
		curUsername = socket_to_user_Map[socket.id];
		socket_to_user_Map[socket.id] = 0;
		userInCall[username] = 0;
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
	if(username in user_to_Socket_Map)
    	return 1;
    else
    	return 0;
/** To be done by rakib **/
    /*
         Checks if the user with username is online
    */

}
function getFriends(username)
{
	var data = fs.readFileSync((username+".txt"));
	var fileData = data.toString();
	var array = [];
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
	//if(user_to_Socket_Map.has(username) == "true"){
		return io.sockets.socket(user_to_Socket_Map[username]);
	//}
    /** To be done by rakib **/
    /** Returns the socket corresponding to the current username **/


}

function getUsername(socket)
{
	
		return socket_to_user_Map[socket.id];
	
        /** To be done by rakib **/
    /** Returns the username corresponding to the current socket **/

}

function setUserInCall(username){
	userInCall_Map[username] = 1;
}

function removeUserInCall(username){

		userInCall_Map[username] = 0;	
}

function isUserInCall(username){
	return userInCall_Map[username];
} //Declaration to be deteremined






io.sockets.on('connection', function (socket)
{
    socket.on('connected',function(username){
        /**
            todo by mahfuz , when a new user is connected,
            notify each of users friend about that he is
            online.
            Set a socket aside for him


        **/
        console.log(username + ' connected');
        makeOnline(username,socket);

        calleeSocket = getSocket(username);
        
        
        
        if(calleeSocket)
        	console.log('YAY it works');


        var friends = getFriends(username);
        var online = [];

        for (var i = 0; i < friends.length; i++) { 

    		var friendSocket = getSocket(friends[i]);
    		
    		if(isOnline(friends[i]))
			{
				online.push('1');
				friendSocket.emit('friendOnline',username);
			}
			else{
				online.push('0');	
			}
		}

		var onlineFriends = {

			'friends' : friends,
			'online'  :online
		};


		var onlineFriendsStr = JSON.stringify(onlineFriends);

		socket.emit('gotUserFriends',onlineFriends);










    });


    socket.on('sendIceCandidate',function(message){

    	calleeSocket = getSocket(message.name);
    	calleeSocket.emit('gotIceCandidate',message);


    });


    socket.on('sendSdp',function(message){

    	calleeSocket = getSocket(message.name);
    	calleeSocket.emit('gotSdp',message);


    });




    socket.on('disconnect', function() {
      /** To be done by tamim and mahfuz **/
      console.log('Got disconnect!');

      disconnectedUser = makeOffline(socket);
      friends = getFriends(disconnectedUser);

      for (var i = 0; i < friends.length; i++) { 

    		var friendSocket = getSocket(friends[i]);
    		
    		if(isOnline(friends[i]))
			{
				friendSocket.emit('friendOffline',username);
			}
		}
      // Code to call



   });





});







