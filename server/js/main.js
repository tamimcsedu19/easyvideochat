var isInitiator;
username = ""
while(true)
{
    username = prompt("Enter username:");
    if (username !== "")
        break;

}

var socket = io.connect(); //Connecting to the server with a socket

socket.emit('connected', username); // Invoking the procedure connected
                                    // After this server will call the
                                    // gotUserFriends function

socket.on('gotUserFriends',function (friends){

    /** To be done by tamim **/
    displayUserFriends(friends);


});




function displayUserFriends(friends)
{

    /** To be done by masum vai **/
    /**
        friends is a JSON object corresponding to the friends of the
        current user with username global variable and which of them
        are online.

        The format of the JSON object is like this suppose the username
        is tamim
        friends is a string array containing the names
        online is a boolean array denoting if the friend is online or not


        {
            'friends': ['masum','mahfuz','rakib','tuhin']
            'online' : [1,0,0,1]


        }

        Use this info to update the UI
    **/

}

function makeOffline(username)
{
    /** To be done by masum vai **/
    /** Update the UI so that the username is set to offline **/



}
function makeOnline(username)
{
    /** To be done by masum vai **/
    /**Update the UI so that the username is set to online **/

}


