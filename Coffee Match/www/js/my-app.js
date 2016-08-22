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

myApp.onPageInit('user', function (page) {
	var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
  });
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



	