// on page load retrieve local storage
$(document).ready(retrieveCard);

//listeners for enabling save button
$('.body-input').keyup(enabledBtn);
$('.title-input').keyup(enabledBtn);
//call addCard function on click of submit button
$('.submit-button').on('click', addCard);
//on keyup of title and body inputs
$('.title-input', '.body-input').on('keyup', enterPress); //not calling function
//delete card listeners
$('.card-list').on('click', '.delete-button-div', deleteCard);
//space for upvote downvote listener

//on keyup of title content
$('.card-list').on('keyup', '.card-title', editTitle);
//on keyup of body content(after edit) sent to localStorage 
$('.card-list').on('keyup', '.card-body', editBody);
//event listener for keyup on search input
$('.search-input').on('keyup', realtimeSearch)


//constructor function 
function Idea (title, body) {
	this.title = title;
	this.body = body; 
	this.status = 'normal'; 
	this.id = Date.now();
};


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

//add card when enter button pressed/////////////////////////////////////////NOT WORKING
function enterPress(e) {
	if (e.keyCode === 13 && ($('.title-input').val() && $('.body-input').val())){
		addCard(e)
	}
};

//taking input values, creating idea object, prepending, sending storage
function addCard (e) {
	e.preventDefault();
	var title = $('.title-input').val();
	var body = $('.body-input').val();
	var anotherIdea = new Idea(title, body);
	prependIdea(anotherIdea);
	storeCard(anotherIdea);
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
};

//returns the card ID
function getId ($element) {
	return $element.closest('.card').attr('id');
};

//sending to localStorage 
function storeCard (card) {
	localStorage.setItem(card.id, JSON.stringify(card));
};

//deletes card
function deleteCard(){
	$(this).closest('.card').remove();
	localStorage.removeItem(getId($(this)));
};

//update status////////////////////////////////////////////////////////////////////REMOVE ANON FUNCTION
$('.card-list').on('click', '.upvote-button-div, .downvote-button-div', function(e) {
		var statusArray = ['none', 'low', 'normal', 'high', 'critical'];
		var $checkStatus = $(this).closest('.rank').find('.rank-status');
		var statusIndex = statusArray.indexOf($checkStatus.text());
		var incriment = $(this).hasClass('upvote-button-div') ? 1:-1;
		var newStatus = statusArray[statusIndex + incriment];
		var updateCard = JSON.parse(localStorage.getItem(getId($(this))));
		$checkStatus.text(newStatus);
		updateCard.status = newStatus;
		storeCard(updateCard)	
});

//edit title text and save on enter/clickout
function editTitle (e){
	var updateCard = JSON.parse(localStorage.getItem(getId($(this)))); 
	if (e.keyCode === 13) {
		e.preventDefault();
		this.blur();
	} 
	updateCard.title = $(this).text();
	storeCard(updateCard)
};

//also makes enterkey focus out
function editBody(e) {
	var updateCard = JSON.parse(localStorage.getItem(getId($(this)))); 
	if (e.keyCode === 13) {
		e.preventDefault();
		this.blur();
	}
	updateCard.body = $(this).text();
	storeCard(updateCard);
};

//grab search value and run doYouMatch function to add or remove class to display
function realtimeSearch() {
  var searchTerm = $('.search-input').val().toUpperCase();
  $('.card').each(function (index, element) {
		if (doYouMatch(searchTerm, index)) {
    	$(element).removeClass('card-display-none');
  	} else {
    	$(element).addClass('card-display-none');  
  	}
  });
};

//checking the search term in title and body
function doYouMatch (searchTerm, index) {
	var title = $($('.card-title')[index]).html();
	var upperCaseTitle = title.toUpperCase();
	var body = $($('.card-body')[index]).html();
	var upperCaseBody = body.toUpperCase();
	if (upperCaseTitle.indexOf(searchTerm) !== -1 || upperCaseBody.indexOf(searchTerm) !== -1) {
		return true;
	}
};










