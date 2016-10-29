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
	StatusBar.overlaysWebView(false);	
				
	$$('#next-step').on('click touchstart', function(){
		var distance = document.getElementById("valBox").html;
		var fbid = localStorage.getItem("fbid");
		setPreferences(distance, fbid, function(){
			StatusBar.overlaysWebView(true);
			mainView.router.loadPage('passo2.html');
		})
	})
});	

myApp.onPageInit('passo2', function (page) {
	var picture = localStorage.getItem("picture");
	document.getElementById('picture').src = picture;
	$$("#finalizar").on("click", function(){
		var descricao = $$("#passo2-description").val();
		var profissao = $$("#passo2-profissao").val();
		var faculdade = $$("#passo2-faculdade").val();
		var idade     = $$("#passo2-idade").val();
		
		localStorage.setItem("age", idade);
		localStorage.setItem("description", descricao);
		localStorage.setItem("occupation", profissao);
		localStorage.setItem("college", faculdade);
		
		var fbid = localStorage.getItem("fbid");
		//Chamada ao servidor para atualização de informações de perfil
		setProfile(descricao, profissao, idade, faculdade, fbid);
		
		mainView.router.loadPage('index.html');
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
	$$("#description").html(localStorage.getItem("description"));
	$$("#picture").attr("src", localStorage.getItem("picture"));
	$$("#occupation").html(localStorage.getItem("occupation"));
	$$("#graduation").html(localStorage.getItem("college"));
	//$$("#location").html(localStorage.getItem("location"));
	
});


//SHOWN USER
myApp.onPageInit('user', function (page) {
	var suid = localStorage.getItem("shown_user_id");
	var token = localStorage.getItem("token");
	var d = {shown_user_id: suid, access_token: token};
	console.log(token)
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
									
									//Handler dos amigos em comum
									var json = JSON.parse(data[0].mutual_friends);
									var context = json.context;
									alert(context.mutual_friends)
									if(context.mutual_friends){
										alert(context);
									} 
								}
							});
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
	
	
	
	// Handle message
$$('.messagebar').on('click', function () {
	// Init Messages
	var myMessages = myApp.messages('.messages', {
	  autoLayout:true
	});
	
	// Init Messagebar
	var myMessagebar = myApp.messagebar('.messagebar');
  // Message text
  var messageText = myMessagebar.value().trim();
  // Exit if empy message
  if (messageText.length === 0) return;
 
  // Empty messagebar
  myMessagebar.clear()
  
  // Message type
  var messageType = "sent";
  
  myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType
  })
  
  //Put message on DB via ajax
  var putMessageData = {
	  user: user_id,
	  message: messageText,
	  combinacao: match
  }
	  $.ajax({
									url: 'http://thecoffeematch.com/webservice/put-message.php',
									type: 'post',
									dataType: 'json',
									data: putMessageData,
									success: function (data) {
										
									}
		});
 
  
 
	}); 
	
	//Request ajax que recupera a conversa
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-messages.php',
								type: 'post',
								dataType: 'json',
								data: g,
								success: function (data) {
									var user;
									var message_id;
									for(i = 0; i < data.length; i++){
										
										if(data[i].id === user_id){
											var line0 = "<div class='message message-sent'>"
														+ "<div class='message-text'>"+data[i].message+"</div>"
														+ "</div>";
											$(".messages").append(line0);
										} else {
											user = data[i].id;
											
											//Monta o DOM
											var line1 = "<div class='message message-received' id="+data[i].message_id+">"
															+ "<div class='message-name'>"+data[i].name+"</div>"
															+ "<div class='message-text'>"+data[i].message+"</div>"
															+ "</div>";
											$(".messages").append(line1);
										}
									
									}
									
									myInterval = setInterval(function(){ 
										getLastMessage(user, match); 
									}, 3000);
									
								}
	});
	
	
	
	function getLastMessage(user, combinacao){
		var last_message_id = $(".message-received").last().attr("id");
		var lm = {
			  user: user,
			  last_message_id: last_message_id,
			  combinacao: combinacao
		}
		
		$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-last-message.php',
								type: 'post',
								dataType: 'json',
								data: lm,
								success: function (data) {
									
									var line1 = "<div class='message message-received' id="+data.message_id+">"
															+ "<div class='message-name'>"+data.name+"</div>"
															+ "<div class='message-text'>"+data.message+"</div>"
															+ "</div>";
											$(".messages").append(line1);
								}
		});
	}
	
	
	
});

myApp.onPageBack('chat', function (page) {
	$$("#toolbar").toggleClass("visivel none");
	clearInterval(myInterval);
});

myApp.onPageInit('match', function (page) {
	var suid = localStorage.getItem("shown_user_id");
	var d = {shown_user_id: suid};
	
	//Ajax request to get user info
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-user-list.php',
								type: 'post',
								dataType: 'json',
								data: d,
								success: function (data) {
									
									$$("#user-one-name").html(localStorage.getItem("name"));
									$$("#user-two-name").html(data[0].name);
									$$("#user-one-img").attr("src", localStorage.getItem("picture"));
									$$("#user-two-img").attr("src", data[0].picture);						
								}
							});
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
function setProfile(description, occupation, age, college, fbid){
	var info = {
		description: description, 
		occupation: occupation,
		age: age,
		college: college,
		fbid: fbid
		}
	$.ajax({
								url: 'http://thecoffeematch.com/webservice/set-profile-info.php',
								type: 'post',
								dataType: 'json',
								data: info,
								success: function (data) {
									
									if(data.code == 1){
										
										//Atualiza preferências e executa função de callback
										localStorage.setItem("description", description);
										myApp.alert("Bem vindo ao Coffee Match!");
										//mainView.router.loadPage('index.html');
									}
								}
							});
}



	