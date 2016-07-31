// Initialize app
var myApp = new Framework7(
	
);
 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: true
});

/**
 * jTinder initialization
 */
 
 $('.dislike').click(function(){
	$(".pane5").animate({"transform": "translate(-" + (900) + "px," + (90*-1.5) + "px) rotate(-60deg)"}, 400, function () {
				
			});
})

$('.like').click(function(){
	$(".pane5").animate({"transform": "translate(" + (900) + "px," + (90*-1.5) + "px) rotate(60deg)"}, 400, function () {
				
			});
})

$("#tinderslide").jTinder({
	// dislike callback
    onDislike: function (item) {
	    // set the status text
        		
    },
	// like callback
    onLike: function (item) {
	    // set the status text
        
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').click(function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});