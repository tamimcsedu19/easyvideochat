var isInitiator = 0;
var grid;

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

//var small_film_set = [];

var onlineUsers = [];

var isInitiated = 0;
var pc;
var connectionEstablished = 0;
var localVideo ;
var remoteVideo;
var sendButton;
var onlineUserlistElement = document.getElementById("testA");
var selectedUsername;
var callButton = document.getElementById("callButton");
var infoButton = document.getElementById("infoButton");


callButton.addEventListener('click', callUser, false);


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
	alert("HIIIIIII");
	if(!isInitiator)
	{
		alert(message.replyTo + " is Calling you");
		console.log("YAY SDP");
		$('body').load('chat.html',{},function(){
			
			localVideo = document.querySelector('#video1');
			remoteVideo = document.querySelector('#video2');
			//sendButton = document.getElementById("sendButton");
			//sendButton.disabled = true;
			//sendButton.onclick = sendData;
			
			
			
			
			
			
			initAnswer(message.replyTo,message);
				
		});
		
		
		
	}
	else
	{
		console.log("YAY answerSDP");

		pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    remoteSdpAdded = 1;
    for(var i=0;i<iceCandidates.length;++i)
      pc.addIceCandidate(iceCandidates[i]);
		//sendButton.disabled = false;
	}

});



function call(Calleeusername)
{
	
	$(".box-title").html(Calleeusername);
	alert('YAY YAY Calling '+Calleeusername);
	console.log("Calling "+selectedUsername);

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
	  	$('body').load('index.html',{},function(){
				
		});
	  
    console.log('Remote stream remove error');

  }




	var pc_config = {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
	var constraints = {video: true,audio:true};
	
	alert("Creating Peer Connection");
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
		alert("Inside getusermedia");
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

	alert("Calling get usermedia");
	getUserMedia(constraints, handleUserMedia, handleUserMediaError);
	alert("Called get usermedia");







}



function initAnswer(Callerusername,message)
{
	$(".box-title").html(Callerusername);

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
		pc.createAnswer(sendSdp,handleUserMediaError);
		//sendButton.disabled = false;
		
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



function callUser(){
	var username = String(selectedUsername).trim(); 
	//alert("Caling");
	if(!selectedUsername) alert("Select an online user");
	var id ;
	for(var i=0;i<onlineUsers.length;++i)
	{
		if(onlineUsers[i].title == username){
			id = onlineUsers[i].id;
			break;
		}
	}
	var item = grid.getItem(id);
	if(item.online == '0') alert("Select an online user");
	else{
		$('body').load('chat.html',{},function(){
			
			localVideo = document.querySelector('#video1');
			remoteVideo = document.querySelector('#video2');
			//sendButton = document.getElementById("sendButton");
			//sendButton.disabled = true;

			alert("Calling "+selectedUsername);
			console.log("Calling "+selectedUsername);
			call(selectedUsername);
				
		});
		

	}
	}

function sendData(message) {
  textMsg = {
  					'receiver': msgReceiver,
  					'msg' : message


  			}
  socket.emit('sendMsg', textMsg);
}




function displayUserFriends(friends)
{
	for(var i=0; i<friends.friends.length; ++i)
	{
		var username = String(friends.friends[i]).trim(); 
		onlineUsers.push({
			'id':i+1,
			'title':username,
			'online':friends.online[i]
		});
		
	}

	webix.ready(function (){
		grid = webix.ui({
			container:document.getElementById("testA"),
			view:"datatable",
			scheme:{
				$change:function(item){
					if (item.online == "1"){
						item.$css = "highlight";
					}
					else
					{
						item.$css = "lowlight";
					}
				}
			},
			columns:[
				{ id:"id",	header:"", css:"rank",  		width:50},
				{ id:"title",	header:"Friends",width:200}
				//,
				//{ id:"online",	header:"Online" , width:80}
			],
			select:"cell",
			autoheight:true,
			autowidth:true,

			on:{
				onSelectChange:function(){
					var text = "Selected: "+grid.getSelectedId(true).join();
					selectedUsername = friends.friends[grid.getSelectedId(true).join() - 1];
					document.getElementById('testB').innerHTML = selectedUsername;
				}
			},

			data:onlineUsers
		});		
});
	
	

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

function makeOffline(Cusername)
{

  /**Update the UI so that the username is set to online **/
	var username = String(Cusername).trim(); 
	var id ;
	for(var i=0;i<onlineUsers.length;++i)
	{
		if(onlineUsers[i].title == username)
		{
			id = onlineUsers[i].id;
			break;
		}
	}
	var item = grid.getItem(id);
    item.online = "0"; //setting the new value for the item 
    grid.updateItem(id, item); //the dataset is updated!
	//updateUi();
	



}
function makeOnline(Cusername)
{
    /**Update the UI so that the username is set to online **/
	var username = String(Cusername).trim(); 
	var id ;
	for(var i=0;i<onlineUsers.length;++i)
	{
		if(onlineUsers[i].title == username)
		{
			id = onlineUsers[i].id;
			break;
		}
	}
	var item = grid.getItem(id);
    item.online = "1"; //setting the new value for the item 
	
    grid.updateItem(id, item); //the dataset is updated!
	
	//updateUi();

}

