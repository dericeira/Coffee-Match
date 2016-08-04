// Initialize app
var myApp = new Framework7({
    
});
 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

var logged = localStorage.getItem("teste");
alert(logged);

if(logged == null){
	myApp.onPageInit('index', function() {
		mainView.router.loadPage('login.html');
	}).trigger();
} else {
	myApp.onPageInit('index', function() {
		$$("#invisible-container").removeClass("none");
		$$("#invisible-nav").removeClass("navbar-hidden");
	}).trigger();
}

myApp.onPageInit('login', function() {
		localStorage.setItem("teste", true);
	});


/**
 * jTinder initialization
 */
$("#tinderslide").jTinder({
	
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').bind('click touchstart', function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});



	