//listeners for enabling save button
$('.body-input').keyup(enabledBtn);
$('.title-input').keyup(enabledBtn);


//on page load retrieve local storage
// $(document).ready(function() {
// getIdea();
// });

// //retrieve parsed local storage or empty array
// function getIdea (id) {
// 	var retrieveIdea = JSON.parse(localStorage.getItem(id));
// 	if (retrieveIdea ) {
// 		return retrieveIdea;
// 	} else {
// 		return [];
// 	}
// };


//enabling button on both fields keyup
function enabledBtn() {
    if ( $('.body-input').val() === "" && $('.title-input').val() === "") {
      $('.submit-button').attr("disabled", true)
    } else {
      $('.submit-button').attr("disabled", false);
    }
};

//call addIdea function on click of submit button
$('.submit-button').on('click', addIdea);

//on keyup of title and body inputs
$('.title-input', '.body-input').on('keyup', function (e) {
	//if enter button (keyCode13) is pressed and both inputs have a value
	if (e.keyCode === 13 && ($('.title-input').val() && $('.body-input').val())){
		addIdea(e)
	}
});

//////////////////////////////////////refactor into a function we can recall throughout
var keys = Object.keys(localStorage)

keys.forEach(function(key){
	// console.log(key);
// localStorage[key]
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
	var title = $('.title-input').val();
	var body = $('.body-input').val();
	///do you need this??
	var status = 'swill';
	//new object called anotherIdea
	var anotherIdea = new Idea(title, body, status);
	prependIdea(anotherIdea);
	storeIdea(anotherIdea.id, anotherIdea);
}

//prepending created ideacards, using new stored values, clearing input fields
function prependIdea (idea) {
	$('.card-list').prepend(
		`<article id=${idea.id} class="card">
		<h2 class="card-title" contenteditable="true">${idea.title}</h2> 
		<div class="delete-button-div icon-buttons delete-button">
		</div>
		<p contenteditable="true" class="card-body">${idea.body}</p>
		<div class="rank"> 
		<div class="upvote-button-div icon-buttons upvote-button">
		</div>
		<div class="downvote-button-div icon-buttons downvote-button"> 
		</div>
		<p> quality: <span class="rank-status">${idea.status}</span> </p> </div>
		<hr /> 
		</article>`)
	$('.title-input').val("");
	$('.body-input').val("");
	enabledBtn()
}

//eventlistener for delete button and function to remove from section and localStorage
$('.card-list').on('click', '.delete-button-div', function() {
	$(this).closest('.card').remove();
	//maybe just update local storage here rather than removeItem
	localStorage.removeItem(($(this).closest('.card').attr('id')));
});

//sending to localStorage (as above by passing in id and newly created card)
function storeIdea (id, card) {
	localStorage.setItem(id, JSON.stringify(card));
}

//event listener on section for upvote - function if quality is swill - change to plausible, else change to genius
//and send to localStorage with new quality string
$('.card-list').on('click', '.upvote-button-div', function() {
	 	var checkStatus = $(this).closest('.rank').find('.rank-status').text(); //grab the quality content span (swill)
	 	var id = ($(this).closest('.card').attr('id'));
	 	var uniqueCard = JSON.parse(localStorage.getItem(id));
	 	if (checkStatus === 'swill') {
	     	$(this).closest('.rank').find('.rank-status').text('plausible');
	     	uniqueCard.status = 'plausible';
			localStorage.setItem(id, JSON.stringify(uniqueCard));
     	} else {
     		$(this).closest('.rank').find('.rank-status').text('genius');
     		uniqueCard.status = 'genius';
     		localStorage.setItem(id, JSON.stringify(uniqueCard));
     	}
	});

// same as upvote but for downvoting
$('.card-list').on('click', '.downvote-button-div', function() {
  	var checkStatus = $(this).closest('.rank').find('.rank-status').text();
  	var id = ($(this).closest('.card').attr('id'));
	var uniqueCard = JSON.parse(localStorage.getItem(id));
  if (checkStatus === 'genius') {
		$(this).closest('.rank').find('.rank-status').text('plausible');
		uniqueCard.status = 'plausible';
		localStorage.setItem(id, JSON.stringify(uniqueCard));
  } else {
  		$(this).closest('.rank').find('.rank-status').text('swill');
  		uniqueCard.status = 'swill';
		localStorage.setItem(id, JSON.stringify(uniqueCard));
  }
});

//on keyup of body content(after edit) sent to localStorage 
$('.card-list').on('keyup', '.card-body', editBody);
//also makes enterkey focus out
function editBody(e) {
var id = ($(this).closest('.card').attr('id'));
var uniqueCard = JSON.parse(localStorage.getItem(id));
if (e.keyCode === 13) {
	e.preventDefault();
	this.blur();
}
uniqueCard.body = $(this).text();
localStorage.setItem(id, JSON.stringify(uniqueCard));
}

//on keyup of title content... ^^^^
$('.card-list').on('keyup', '.card-title', editTitle);

function editTitle (event){
var id = ($(this).closest('.card').attr('id'));
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
    var searchTerm = $('.search-input').val().toUpperCase();
    // console.log(searchTerm);
    $('.card').each ( function (index, element) {
		// console.log(index + element);
	if (doYouMatch(searchTerm, index)) {
            $(element).removeClass('card-display-none');
        } else {
            $(element).addClass('card-display-none');  
        }
   });
};

//event listener for keyup on search input
$('.search-input').on('keyup', realtimeSearch)

//why? is ideatitle/paragraph an array? why do we look for the index? 
//how is the !== -1 thing working?????
function doYouMatch (searchTerm, index) {
	var title = $($('.card-title')[index]).html();
	var upperCaseTitle = title.toUpperCase();
	var body = $($('.card-body')[index]).html();
	var upperCaseBody = body.toUpperCase();
	console.log(index)
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










