var isInitiator = false;
username = ""
inCallUserUsername = ""
while(true)
{
    username = prompt("Enter username:");
    if (username !== "")
        break;

}

var socket = io.connect(); //Connecting to the server with a socket

console.log('Calling Connected');
socket.emit('connected', username); // Invoking the procedure connected
                                    // After this server will call the
                                    // gotUserFriends function


socket.on('friendOnline',function(username){

	makeOnline(username);

});
socket.on('friendOffline',function(username){
	makeOffline(username);
});


socket.on('gotUserFriends',function (friends){

    /** To be done by tamim **/


    displayUserFriends(friends);


});

var isInitiated = 0;
var pc;
var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
socket.on('gotIceCandidate',function(message){


	var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
    if(isInitiated)
    	pc.addIceCandidate(candidate);
});


socket.on('gotSdp',function(message)
{
	if(!isInitiator)
	{
		console.log("YAY SDP");
		initAnswer(message.name,message);
	}
	else
	{
		console.log("YAY answerSDP");
		pc.setRemoteDescription(new RTCSessionDescription(message.sdp));

	}
});




function call(username)
{

	isInitiator = true;

	function handleIceCandidate(event) {
  			console.log('handleIceCandidate event: ', event);
  			if (event.candidate) {
    		socket.emit('sendIceCandidate',{
    			name: username,
      			type: 'candidate',
      			label: event.candidate.sdpMLineIndex,
      			id: event.candidate.sdpMid,
      			candidate: event.candidate.candidate});
  			

  			}
  			else {
    			console.log('End of candidates.');
  			}
	}
	function handleRemoteStreamAdded(event) {
 		console.log('Remote stream added.');
  		remoteVideo.src = window.URL.createObjectURL(event.stream);
  		remoteStream = event.stream;
	}




	
	var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
	var constraints = {video: true,audio:true};
	pc = new RTCPeerConnection(pc_config);
	pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    //pc.onremovestream = handleRemoteStreamRemoved;


	
	function handleUserMediaError(error)
	{
  		console.log('getUserMedia error: ', error);
	}
	function handleSdpError(error)
	{

		console.log("Error "+error);
	}

	function handleUserMedia(stream)
	{
		console.log('adding local source');
		localVideo.src = window.URL.createObjectURL(stream);
		
		pc.addStream(stream);
		pc.createOffer(sendSdp, handleSdpError);

	}

	function sendSdp(sessionDescription) 
	{
  				pc.setLocalDescription(sessionDescription);
  				console.log('setLocalAndSendMessage sending message' , sessionDescription);
  				
  				message = {
  					'name':username,
  					'sdp' :sessionDescription


  				}

  				socket.emit('sendSdp', message);
  				
	}

	function handleCreateOfferError(event){
  		console.log('createOffer() error: ', e);
	}

	getUserMedia(constraints, handleUserMedia, handleUserMediaError);








}



function initAnswer(username,message)
{



	function handleIceCandidate(event) {
  			console.log('handleIceCandidate event: ', event);
  			if (event.candidate) {
    		socket.emit('sendIceCandidate',{
    			name: username,
      			type: 'candidate',
      			label: event.candidate.sdpMLineIndex,
      			id: event.candidate.sdpMid,
      			candidate: event.candidate.candidate});
  			

  			}
  			else {
    			console.log('End of candidates.');
  			}
	}
	function handleRemoteStreamAdded(event) {
 		console.log('Remote stream added.');
  		remoteVideo.src = window.URL.createObjectURL(event.stream);
  		remoteStream = event.stream;
	}
	function handleRemoteStreamRemoved(event)
	{

		console.log("Remote stream removed");
	}



	
	var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
	var constraints = {video: true,audio:true};
	pc = new RTCPeerConnection(pc_config);
	pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;


	
	function handleUserMediaError(error)
	{
  		console.log('getUserMedia error: ', error);
	}

	function handleUserMedia(stream)
	{
		localVideo.src = window.URL.createObjectURL(stream);
		
		pc.addStream(stream);

	}
	function sendSdp(sessionDescription) 
	{
  				pc.setLocalDescription(sessionDescription);
  				console.log('setLocalAndSendMessage sending message' , sessionDescription);
  				
  				message = {
  					'name':username,
  					'sdp' :sessionDescription


  				}

  				socket.emit('sendSdp', message);
  				
	}


	getUserMedia(constraints, handleUserMedia, handleUserMediaError);


	pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
   
   	pc.createAnswer(sendSdp);

   	isInitiated = 1;









}




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


if(username!='tamim')
	call('tamim');