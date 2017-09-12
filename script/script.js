//listeners for enabling save button
$('.body-input').keyup(enabledBtn);
$('.title-input').keyup(enabledBtn);


// on page load retrieve local storage
$(document).ready(retrieveCard);

//retrieve parsed local storage 
function retrieveCard () {
	Object.keys(localStorage).forEach(function(key){
		prependIdea(JSON.parse(localStorage[key]))
	})
};


//enabling button on both fields keyup
function enabledBtn() {
    if ( $('.body-input').val() === "" && $('.title-input').val() === "") {
      $('.submit-button').attr("disabled", true)
    } else {
      $('.submit-button').attr("disabled", false);
    }
};
//reset fields to empty strings
function resetFields() {
	$('.title-input').val("");
	$('.body-input').val("");
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


//constructor function 
function Idea (title, body) {
	this.title = title;
	this.body = body; 
	this.status = 'normal'; 
	this.id = Date.now();
};

// Idea.prototype.statusString = function() {
// 	var statusArray = ['swill', 'plausible', 'genius'];
// 	return statusArray[this.status];
// };

//taking input values, creating idea object, prepending, sending storage
function addIdea (e) {
	e.preventDefault();
	var title = $('.title-input').val();
	var body = $('.body-input').val();
	var anotherIdea = new Idea(title, body);
	prependIdea(anotherIdea);
	storeIdea(anotherIdea);
	$('.title-input').focus();
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
	resetFields();
	enabledBtn();
}

function deleteCard(){
	console.log(this);
	$(this).closest('.card').remove();
	localStorage.removeItem(getId($(this)));
}


$('.card-list').on('click', '.delete-button-div', deleteCard);


function getId ($element) {
	return $element.closest('.card').attr('id');
};

//sending to localStorage 
function storeIdea (card) {
	localStorage.setItem(card.id, JSON.stringify(card));
};




$('.card-list').on('click', '.upvote-button-div, .downvote-button-div', function(e) {
		var statusArray = ['none', 'low', 'normal', 'high', 'critical'];
		var $checkStatus = $(this).closest('.rank').find('.rank-status');
		var statusIndex = statusArray.indexOf($checkStatus.text());
		var incriment = $(this).hasClass('upvote-button-div') ? 1:-1;
		var newStatus = statusArray[statusIndex + incriment];
			$checkStatus.text(newStatus);
		});
	
		//e.target closest to rankdiv, grab the descendents of 
	 	// var checkStatus = $(this).closest('.rank').find('.rank-status').text(); 
	 	//  var uniqueCard = JSON.parse(localStorage.getItem(getId($(this))));
	 	// if (checkStatus === 'swill') {
	  //    	$(this).closest('.rank').find('.rank-status').text('plausible');
	  //    	uniqueCard.status = 'plausible';
			// localStorage.setItem(getId($(this)), JSON.stringify(uniqueCard));
   //   	} else {
   //   		$(this).closest('.rank').find('.rank-status').text('genius');
   //   		uniqueCard.status = 'genius';
   //   		localStorage.setItem(getId($(this)), JSON.stringify(uniqueCard));
   //   	}
	

// same as upvote but for downvoting
// $('.card-list').on('click', '.downvote-button-div', function() {
//   	var checkStatus = $(this).closest('.rank').find('.rank-status').text();
// 	var uniqueCard = JSON.parse(localStorage.getItem(getId($(this))));
//   if (checkStatus === 'genius') {
// 		$(this).closest('.rank').find('.rank-status').text('plausible');
// 		uniqueCard.status = 'plausible';
// 		localStorage.setItem(id, JSON.stringify(uniqueCard));
//   } else {
//   		$(this).closest('.rank').find('.rank-status').text('swill');
//   		uniqueCard.status = 'swill';
// 		localStorage.setItem(id, JSON.stringify(uniqueCard));
//   }
// });

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










