/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
				
		var logged = localStorage.getItem("teste");
		
		//Verifica se usuário está logado
		if(logged == null){
			myApp.onPageInit('index', function() {
				mainView.router.loadPage('login.html');
			}).trigger();
		} else {
			
			myApp.onPageInit('index', function() {
				StatusBar.overlaysWebView(false);
				$$("#invisible-container").removeClass("none");
				$$("#invisible-nav").removeClass("navbar-hidden");
			}).trigger();
		}
		
		//Configura barra de navegação
		StatusBar.overlaysWebView(false);
		StatusBar.styleLightContent();
		StatusBar.backgroundColorByHexString("#8D7A4B");
		
		//Pega localização do usuário
		var latitude;
		var longitude;
		
		navigator.geolocation.getCurrentPosition(function(position){
			latitude  = position.coords.latitude;
			longitude = position.coords.longitude;
		}, function(){
			alert('Não foi possível encontrar a sua localização');
		});
		
		myApp.onPageInit('starbucks-map', function(){
			var latLng = new google.maps.LatLng(latitude, longitude);
			var mapOptions = {
				center: latLng,
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById('map'), mapOptions);
			
			$.ajax({
								url: 'http://thecoffeematch.com/webservice/get-starbucks-map.php',
								type: 'get',
								dataType: 'json',
								success: function (data) {
									//Renderiza markers no mapa
									for(i in data) {
										var pin = data[i];		
										var lat = pin.lat;
										var lng = pin.lng;
										
										var coordenadas = new google.maps.LatLng(lat, lng);
										
										var marker = new google.maps.Marker({
											position: coordenadas,
											map: map,
											title: pin.name
										});
									}
								}
							});
			
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				title: 'Titulo'
			});
		});

		
		myApp.onPageInit('login', function() {
			    StatusBar.overlaysWebView(true);
					
				facebookConnectPlugin.browserInit("1647443792236383");	
				var fbLoginSuccess = function (userData) {
				 facebookConnectPlugin.api("/me?fields=id, name, email, birthday", ["id, name, email, birthday"],
					  function onSuccess (result) {
						  
						    var person = {
								id: result.id,
								name: result.name,
								email: result.email,
								birthday: result.birthday,
								picture: 'https://graph.facebook.com/' + result.id + '/picture?type=normal'
							}
							
						  //Chamada ajax para registrar/autenticar usuário
						  $.ajax({
								url: 'http://thecoffeematch.com/webservice/register.php',
								type: 'post',
								dataType: 'json',
								success: function (data) {
									if(data.code == 1){
										//Armazena localmente os dados e redireciona para HOME
										localStorage.setItem("name", result.name);
										localStorage.setItem("fbid", result.id);
										localStorage.setItem("email", result.email);
										localStorage.setItem("picture", 'https://graph.facebook.com/' + result.id + '/picture?type=normal');
										
										mainView.router.loadPage('index.html');
									} 
									if(data.code == 2){
										//Armazena localmente os dados e redireciona para PASSO 1
										localStorage.setItem("name", result.name);
										localStorage.setItem("fbid", result.id);
										localStorage.setItem("email", result.email);
										localStorage.setItem("picture", 'https://graph.facebook.com/' + result.id + '/picture?type=normal');
										
										mainView.router.loadPage('passo1.html');
									}
									
									
								},
								data: person
							});
						  
						
					  }, function onError (error) {
						alert(error);
					  }
					);
				};		
				
				$$('#loginFB').on('click', function(){
					
					facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
					  function loginError (error) {
						alert(error);
					  }
					);
				});
				
			});
			
		
		
		myApp.onPageInit('passo1', function() {
			    StatusBar.overlaysWebView(false);		
			});
		
		myApp.onPageInit('user', function() {
			    StatusBar.overlaysWebView(true);		
			});
		
		myApp.onPageBeforeRemove('user', function() {
			    StatusBar.overlaysWebView(false);		
			});
		}
		
};
