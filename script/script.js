//listeners for enabling save button
$('.idea-input').keyup(enabledBtn);
$('.main-title').keyup(enabledBtn);


//on page load retrieve local storage
$(document).ready(function() {
getIdea();
});

//retrieve parsed local storage or empty array
function getIdea (id) {
	var retrieveIdea = JSON.parse(localStorage.getItem(id));
	if (retrieveIdea ) {
		return retrieveIdea;
	} else {
		return [];
	}
};


//enabling button on both fields keyup
function enabledBtn() {
    if ( $('.idea-input').val() === "" && $('.main-title').val() === "") {
      $('#submit-button').attr("disabled", true)
    } else {
      $('#submit-button').attr("disabled", false);
    }
};

//call addIdea function on click of submit button
$('#submit-button').on('click', addIdea);

//on keyup of title and body inputs
$('.main-title', '.idea-input').on('keyup', function (e) {
	//if enter button (keyCode13) is pressed and both inputs have a value
	if (e.keyCode === 13 && ($('.main-title').val() && $('.idea-input').val())){
		addIdea(e)
	}
});

//////////////////////////////////////global variable .... array??
var keys = Object.keys(localStorage)

keys.forEach(function(key){
localStorage[key]
prependIdea(JSON.parse(localStorage[key]))
})
///////////////////////////////////////////////


//constructor function 
function Idea (title, body, status ) {
	this.title = title;
	this.body = body; 
	//can this.staus = status??
	this.status = 'swill'; 
	this.id = Date.now();
}

//taking input values, creating idea object, prepending, sending storage
function addIdea (e) {
	e.preventDefault();
	var title = $('.main-title').val();
	var body = $('.idea-input').val();
	///do you need this??
	var status = 'swill';
	//new object called anotherIdea
	var anotherIdea = new Idea(title, body, status);
	prependIdea(anotherIdea);
	storeIdea(anotherIdea.id, anotherIdea);
}

//prepending created ideacards, using new stored values, clearing input fields
function prependIdea (idea) {
	$('.bookmark-list').prepend(
		`<article id=${idea.id} class="idea-article">
		<h2 class="idea-title" contenteditable=true >${idea.title}</h2> 
		<div class="delete-button-div icon-buttons delete-button right">
		</div>
		<p contenteditable="true" class="idea-paragraph">${idea.body}</p>
		<div class="quality-rank"> 
		<div class="upvote-button-div icon-buttons upvote-button">
		</div>
		<div class="downvote-button-div icon-buttons downvote-button"> 
		</div>
		<p> quality: <span class = "quality-content">${idea.status}</span> </p> </div>
		<hr /> 
		</article>`)
	$('.main-title').val("");
	$('.idea-input').val("");
}

//eventlistener for delete button and function to remove from section and localStorage
$('.bookmark-list').on('click', '.delete-button-div', function() {
	$(this).closest('.idea-article').remove();
	//maybe just update local storage here rather than removeItem
	localStorage.removeItem(($(this).closest('.idea-article').attr('id')));
});

//sending to localStorage (as above by passing in id and newly created card)
function storeIdea (id, card) {
	localStorage.setItem(id, JSON.stringify(card));
}

//event listener on section for upvote - function if quality is swill - change to plausible, else change to genius
//and send to localStorage with new quality string
$('.bookmark-list').on('click', '.upvote-button-div', function() {
	 	var checkStatus = $(this).closest('.quality-rank').find('.quality-content').text(); //grab the quality content span (swill)
	 	var id = ($(this).closest('.idea-article').attr('id'));
	 	var uniqueCard = JSON.parse(localStorage.getItem(id));
	 	if (checkStatus === 'swill') {
	     	$(this).closest('.quality-rank').find('.quality-content').text('plausible');
	     	uniqueCard.status = 'plausible';
			localStorage.setItem(id, JSON.stringify(uniqueCard));
     	} else {
     		$(this).closest('.quality-rank').find('.quality-content').text('genius');
     		uniqueCard.status = 'genius';
     		localStorage.setItem(id, JSON.stringify(uniqueCard));
     	}
	});

// same as upvote but for downvoting
$('.bookmark-list').on('click', '.downvote-button-div', function() {
  	var checkStatus = $(this).closest('.quality-rank').find('.quality-content').text();
  	var id = ($(this).closest('.idea-article').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));
  if (checkStatus === 'genius') {
		$(this).closest('.quality-rank').find('.quality-content').text('plausible');
		uniqueCard.status = 'plausible';
		localStorage.setItem(id, JSON.stringify(uniqueCard));
  } else {
  		$(this).closest('.quality-rank').find('.quality-content').text('swill');
  		uniqueCard.status = 'swill';
		localStorage.setItem(id, JSON.stringify(uniqueCard));
  }
});

//on keyup of body content(after edit) sent to localStorage 
$('.bookmark-list').on('keyup', '.idea-paragraph', editBody);
//also makes enterkey focus out
function editBody(e) {
var id = ($(this).closest('.idea-article').attr('id'));
var uniqueCard = JSON.parse(localStorage.getItem(id));
if (e.keyCode === 13) {
	e.preventDefault();
	this.blur();
}
uniqueCard.body = $(this).text();
localStorage.setItem(id, JSON.stringify(uniqueCard));
}

//on keyup of title content... ^^^^
$('.bookmark-list').on('keyup', '.idea-title', editTitle);

function editTitle (event){
var id = ($(this).closest('.idea-article').attr('id'));
var uniqueCard = JSON.parse(localStorage.getItem(id));
if (event.keyCode === 13) {
	event.preventDefault();
	this.blur();
}
uniqueCard.title = $(this).text();
localStorage.setItem(id, JSON.stringify(uniqueCard));
}


///////////NEED HELP UNDERSTANDING////////////////////////////////////////
//grab search value and run doYouMatch function to add or remove class to display
function realtimeSearch() {
    var searchTerm = $('.search-box').val().toUpperCase();
    // console.log(searchTerm);
    $('.idea-article').each ( function (index, element) {
		// console.log(element);
	if (doYouMatch(searchTerm, index)) {
            $(element).removeClass('card-display-none');
        } else {
            $(element).addClass('card-display-none');  
        }
   });
};

//event listener for keyup on search input
$('.search-box').on('keyup', realtimeSearch)

//why? is ideatitle/paragraph an array? why do we look for the index? 
//how is the !== -1 thing working?????
function doYouMatch (searchTerm, index) {
	var title = $($('.idea-title')[index]).html();
	var upperCaseTitle = title.toUpperCase();
	var body = $($('.idea-paragraph')[index]).html();
	var upperCaseBody = body.toUpperCase();

	// console.log(title)
	// console.log(body)

	if (upperCaseTitle.indexOf(searchTerm) !== -1) {
		return true;
	}
	 else if (upperCaseBody.indexOf(searchTerm) !== -1){
	 	return true;
	 } else {
	        return false
	    };

};










