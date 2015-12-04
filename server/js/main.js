var isInitiator = 0;
username = ""
inCallUserUsername = ""
while(true)
{
    username = prompt("Enter username:");
    if (username !== "")
        break;

}
var remoteSdpAdded = 0;

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
var connectionEstablished = 0;
var localVideo = document.querySelector('#localVideo');
var remoteVideo = document.querySelector('#remoteVideo');
var sendButton = document.getElementById("sendButton");

sendButton.disabled = true;
sendButton.onclick = sendData;
var msgReceiver;
iceCandidates = []
socket.on('gotIceCandidate',function(message){


	var candidate = new RTCIceCandidate({
      'sdpMLineIndex': message.label,
      'candidate': message.candidate,
      'sdpMid' : message.id
    });
  if(remoteSdpAdded)
    pc.addIceCandidate(candidate);
  else
    iceCandidates.push(candidate);
    // if(isInitiated)
    // {
    // 	console.log("adding ice candidate");
    // 	pc.addIceCandidate(candidate);
    // }
});


socket.on('gotSdp',function(message)
{
	if(!isInitiator)
	{
		console.log("YAY SDP");
		initAnswer(message.replyTo,message);
	}
	else
	{
		console.log("YAY answerSDP");

		pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    remoteSdpAdded = 1;
    for(var i=0;i<iceCandidates.length;++i)
      pc.addIceCandidate(iceCandidates[i]);
	sendButton.disabled = false;
	}

});

socket.on('gotMsg',function(message)
{
	document.getElementById("dataChannelReceive").value = message.msg;

});


function call(Calleeusername)
{

	isInitiator = true;
	msgReceiver = Calleeusername;
	function handleIceCandidate(event) {
  			console.log('handleIceCandidate event: ', event);
  			if (event.candidate) {
    		socket.emit('sendIceCandidate',{
    			'name': Calleeusername,
    			'replyTo' : username,
      			'type': 'candidate',
      			'label': event.candidate.sdpMLineIndex,
      			'id': event.candidate.sdpMid,
      			'candidate': event.candidate.candidate});


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
    console.log('Remote stream remove error');

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
  					'name': Calleeusername,
  					'replyTo': username,
  					'sdp' : sessionDescription


  				}

  				socket.emit('sendSdp', message);

	}

	function handleCreateOfferError(event){
  		console.log('createOffer() error: ', e);
	}

	getUserMedia(constraints, handleUserMedia, handleUserMediaError);








}



function initAnswer(Callerusername,message)
{

	msgReceiver = Callerusername;
	console.log('Creating answer for '+Callerusername);

	function handleIceCandidate(event) {
  			console.log('handleIceCandidate event: ', event);
  			if (event.candidate) {
    		socket.emit('sendIceCandidate',{
    			name: Callerusername,
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
    pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    remoteSdpAdded = 1;
    for(var i=0;i<iceCandidates.length;++i)
      pc.addIceCandidate(iceCandidates[i]);

	

	function handleUserMediaError(error)
	{
  		console.log('getUserMedia error: ', error);
	}

	function handleUserMedia(stream)
	{
		localVideo.src = window.URL.createObjectURL(stream);

		pc.addStream(stream);
		console.log('sending answer to'+Callerusername);
		pc.createAnswer(sendSdp);
		sendButton.disabled = false;
		
	}
	function sendSdp(sessionDescription)
	{
  				pc.setLocalDescription(sessionDescription);
  				console.log('setLocalAndSendMessage sending message' , sessionDescription);

  				console.log('sending sdp to '+ Callerusername);
  				message = {
  					'name':Callerusername,
  					'sdp' :sessionDescription


  				}

  				socket.emit('sendSdp', message);

	}


	getUserMedia(constraints, handleUserMedia, handleUserMediaError);



   	isInitiated = 1;









}

function sendData() {
  var data = document.getElementById("dataChannelSend").value;
  textMsg = {
  					'receiver': msgReceiver,
  					'msg' : data


  			}
  socket.emit('sendMsg', textMsg);
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
