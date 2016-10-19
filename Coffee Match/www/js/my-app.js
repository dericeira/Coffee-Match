// Initialize app
var myApp = new Framework7({
    statusbarOverlay:false 
});
 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true,
  animateNavBackIcon: true
});  

myApp.onPageInit('passo1', function (page) {
	$$('#next-step').on('click touchstart', function(){
		var distance = document.getElementById("valBox").html;
		var fbid = localStorage.getItem("fbid");
		setPreferences(distance, fbid, function(){
			mainView.router.loadPage('passo2.html');
		})
	})
});	

myApp.onPageInit('combinacoes', function (page) {
	var user_id = localStorage.getItem("user_id");
	var x = {user_id: user_id}
	
	//Ajax request to get user
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-matches.php',
								type: 'post',
								dataType: 'json',
								data: x,
								success: function (data) {
									
									for(i = 0; i < data.length; i++){
										//Monta o DOM
									var line1 = "<li class='item-content'>"
												+ "<div class='item-media'>"
												+ "<img class='icon icons8-Settings-Filled' src="+data[i].picture+"  style='border-radius: 100%; margin-top: 5px; width: 60px; height: 60px'>"
												+ "</div>"
												+ "<div class='item-inner'>"
												+ "<a href='chat.html' class='item-link match' id="+data[i].id+">"
												+ "<div class='item-title'><span id='matches-name'>"+data[i].name+"</span><br>"
												+ "<span class='subtitle'>"+data[i].date+"</span></div></div></a></li>";		
									$("#match-li").append(line1);
									
									}
									$(".match").on("click", function(){
										localStorage.setItem("match", this.id);
										
									});
								}
															
							});
							
	
});

myApp.onPageInit('profile', function (page) {
	
	$$("#profile-name").html(localStorage.getItem("name"));
	$$("#profile-age").html(localStorage.getItem("age"));
	$$("#picture").attr("src", localStorage.getItem("picture"));
	$$("#description").val(localStorage.getItem("description"));
	$$("#occupation").html(localStorage.getItem("occupation"));
	$$("#graduation").html(localStorage.getItem("graduation"));
	$$("#location").html(localStorage.getItem("location"));
	
	$$("#save").on("click", function(){
		
		var description = $$("#description").val();
		var fbid = localStorage.getItem("fbid");
		//Chamada ao servidor para atualização de informações de perfil
		setProfile(description, fbid);
	});
});


//SHOWN USER
myApp.onPageInit('user', function (page) {
	var suid = localStorage.getItem("shown_user_id");
	var d = {shown_user_id: suid};
	
	//Ajax request to get user
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-user-list.php',
								type: 'post',
								dataType: 'json',
								data: d,
								success: function (data) {
									
									$$("#nome").html(data[0].name);
									$$("#idade").html(data[0].age);
									$$("#college").html(data[0].college);
									$$("#picture").attr("src", data[0].picture);
									
								}
							});
});

myApp.onPageInit('passo2', function (page) {
	var picture = localStorage.getItem("picture");
	document.getElementById('picture').src = picture;
});

myApp.onPageInit('settings', function (page) {
	$$('#salvar').on('click touchstart', function(){
		var distance = document.getElementById("valBox").html;
		var fbid = localStorage.getItem("fbid");
		setPreferences(distance, fbid, function(){
			mainView.router.loadPage('index.html');
		})
	})
});

myApp.onPageInit('chat', function (page) {
	$$("#toolbar").toggleClass("none visivel");
	var user_id = localStorage.getItem("user_id");
	
	var match = localStorage.getItem("match");
	var g = {match: match};
	
	// Init Messages
var myMessages = myApp.messages('.messages', {
  autoLayout:true
});
	
	// Init Messagebar
	var myMessagebar = myApp.messagebar('.messagebar');
	
	// Handle message
$$('.messagebar').on('click', function () {
  // Message text
  var messageText = myMessagebar.value().trim();
  // Exit if empy message
  if (messageText.length === 0) return;
 
  // Empty messagebar
  myMessagebar.clear()
 
  // Random message type
  var messageType = "sent";
 
  // Avatar and name for received message
  var name;
  
  // Add message
  myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
	//Name
    name: name
  })
 
}); 
	
	//Request ajax que recupera a conversa
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-messages.php',
								type: 'post',
								dataType: 'json',
								data: g,
								success: function (data) {
									
									for(i = 0; i < data.length; i++){
										if(data[i].id == user_id){
											var line0 = "<div class='message message-sent'>"
														+ "<div class='message-text'>"+data[i].message+"</div>"
														+ "</div>";
											$(".messages").append(line0);
										} else {
											//Monta o DOM
											var line1 = "<div class='message message-received'>"
															+ "<div class='message-name'>"+data[i].name+"</div>"
															+ "<div class='message-text'>"+data[i].message+"</div>"
															+ "</div>";
											$(".messages").append(line1);
										}
									
									}
									
									
								}
	});
	
	
	
});

myApp.onPageBack('chat', function (page) {
	$$("#toolbar").toggleClass("visivel none");
});


//Manipulação de evento de mudança do slider de distância
function showVal(newVal){
  document.getElementById("valBox").innerHTML=newVal;
}

//Seta preferências
function setPreferences(distance, user_id, callback){
	var pref = {distance: distance, user_id: user_id};
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/set-preferences.php',
								type: 'post',
								dataType: 'json',
								data: pref,
								success: function (data) {
									if(data.status == 1){
										//Atualiza preferências e executa função de callback
										localStorage.setItem("distance", distance);
										callback();
									}
								}
							});
}

//Seta informações do perfil (somente descrição por enquanto)
function setProfile(description, fbid){
	var info = {description: description, fbid: fbid};
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/set-profile-info.php',
								type: 'post',
								dataType: 'json',
								data: info,
								success: function (data) {
									
									if(data.code == 1){
										
										//Atualiza preferências e executa função de callback
										localStorage.setItem("description", description);
										alert("Informações atualizadas!");
										mainView.router.loadPage('index.html');
									}
								}
							});
}



	