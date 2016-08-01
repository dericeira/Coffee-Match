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
$("#tinderslide").jTinder({
	
});

/**
 * Set button action to trigger jTinder like & dislike.
 */
$('.actions .like, .actions .dislike').bind('click touchstart', function(e){
	e.preventDefault();
	$("#tinderslide").jTinder($(this).attr('class'));
});

function addCircle() {
        var $circle = $('<div class="circle"></div>');
        $circle.animate({
            'width': '600px',
            'height': '600px',
            'margin-top': '-300px',
            'margin-left': '-300px',
            'opacity': '0'
        }, 3000, 'easeOutCirc');
        $('#search-box').append($circle);
    
        setTimeout(function __remove() {
            $circle.remove();
        }, 5000);
    }
    addCircle();
    setInterval(addCircle, 1000);