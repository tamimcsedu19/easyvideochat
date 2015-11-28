var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);

var io = require('socket.io').listen(app);


function makeOnline(username,socket)
{
    /** To be done by rakib **/
    /*
        This function makes the user with the username online
        this also gets a socket variable so that u can make user
        offline

    */



}

function makeOffline(socket)
{
    /** To be done by rakib **/
    /*
        This function makes the user with the socket offline
        and also returns the username of the user belonging to
        this socket
    */
}

function isOnline(username)
{
    /** To be done by rakib **/
    /*
         Checks if the user with username is online
    */

}
function getFriends(username)
{
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
    /** To be done by rakib **/
    /** Returns the socket corresponding to the current username **/


}

function getUsername(socket)
{
        /** To be done by rakib **/
    /** Returns the username corresponding to the current socket **/

}


function userInCall() //Declaration to be deteremined







io.sockets.on('connection', function (socket)
{
    socket.on('connected',function(username){
        /**
            todo by mahfuz , when a new user is connected,
            notify each of users friend about that he is
            online.
            Set a socket aside for him


        **/


    });

    socket.on('disconnect', function() {
      /** To be done by tamim and mahfuz **/
      console.log('Got disconnect!');

      disconnectedUser = makeOffline(socket);
      friends = getFriends(disconnectedUser);
      // Code to call



   });





});







