// on page load retrieve local storage
$(document).ready(retrieveCard);

//listeners for enabling save button
$('.body-input').keyup(enabledBtn);
$('.title-input').keyup(enabledBtn);
//call addCard function on click of submit button
$('.submit-button').on('click', addCard);
//on keyup of title and body inputs
$('.title-input').on('keyup', enterPress); 
$('.body-input').on('keyup', enterPress);
//delete card listeners
$('.card-list').on('click', '.delete-button-div', deleteCard);
//space for upvote downvote listener
$('.card-list').on('click', '.upvote-button-div, .downvote-button-div', statusChange);
//task complete button
$('.card-list').on('click', '.completed', completeTask)
//on keyup of title content
$('.card-list').on('keyup', '.card-title', editTitle);
//on keyup of body content(after edit) sent to localStorage 
$('.card-list').on('keyup', '.card-body', editBody);
//event listener for keyup on search input
$('.search-input').on('keyup', realtimeSearch);
//event listener for show completed button
$('.show-completed').on('click', showCompletedTasks);
//status filter buttons event listeners
$('.none-button').on('click', showNone);
$('.low-button').on('click', showLow);
$('.normal-button').on('click', showNormal);
$('.high-button').on('click', showHigh);
$('.critical-button').on('click', showCritical);

function showNone() {
	var updateCard = [];
	Object.keys(localStorage).forEach(function(key){
		updateCard.push(JSON.parse(localStorage.getItem(key)))
	})
	var filteredCards = updateCard.filter(function(card){
		return card.status === 'none'
	})
	showFiltered(filteredCards)
};

function showLow() {
	var updateCard = [];
	Object.keys(localStorage).forEach(function(key){
		updateCard.push(JSON.parse(localStorage.getItem(key)))
	})
	var filteredCards = updateCard.filter(function(card){
		return card.status === 'low'
	})
	showFiltered(filteredCards)
};

function showNormal() {
	var updateCard = [];
	Object.keys(localStorage).forEach(function(key){
		updateCard.push(JSON.parse(localStorage.getItem(key)))
	})
	var filteredCards = updateCard.filter(function(card){
		return card.status === 'normal'
	})
	showFiltered(filteredCards)
};

function showHigh() {
	var updateCard = [];
	Object.keys(localStorage).forEach(function(key){
		updateCard.push(JSON.parse(localStorage.getItem(key)))
	})
	var filteredCards = updateCard.filter(function(card){
		return card.status === 'high'
	})
	showFiltered(filteredCards)
};

function showCritical() {
	var updateCard = [];
	Object.keys(localStorage).forEach(function(key){
		updateCard.push(JSON.parse(localStorage.getItem(key)))
	})
	var filteredCards = updateCard.filter(function(card){
		return card.status === 'critical'
	})
	showFiltered(filteredCards)
};

function showFiltered(array) {
$('.card-list').empty();
	array.forEach(function(card){
$('.card-list').append(prependCard(card));
		
	})
};

//constructor function 
function Card(title, body) {
	this.title = title;
	this.body = body; 
	this.status = 'normal'; 
	this.id = Date.now();
	this.completed = false;
};


//retrieve parsed local storage 
function retrieveCard() {
	Object.keys(localStorage).forEach(function(key){
		prependCard(JSON.parse(localStorage[key]))
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
	// console.log(e)
	if (e.keyCode === 13 && ($('.title-input').val() && $('.body-input').val())){
		// e.preventDefault();
		addCard(e)
	}
};

//taking input values, creating idea object, prepending, sending storage
function addCard(e) {
	e.preventDefault();
	var title = $('.title-input').val();
	var body = $('.body-input').val();
	var anotherCard = new Card(title, body);
	prependCard(anotherCard);
	storeCard(anotherCard);
	$('.title-input').focus();
}

//prepending created ideacards, using new stored values, clearing input fields
function prependCard(card) {
	$('.card-list').prepend(
		`<article id=${card.id} class="card">
		<h2 class="card-title" contenteditable="true">${card.title}</h2> 
		<div class="delete-button-div icon-buttons delete-button">
		</div>
		<p contenteditable="true" class="card-body">${card.body}</p>
		<div class="rank"> 
		<div class="upvote-button-div icon-buttons upvote-button">
		</div>
		<div class="downvote-button-div icon-buttons downvote-button"> 
		</div>
		<p> importance: <span class="rank-status">${card.status}</span> </p> 
		</div>
		<button class="completed">Task Complete</button>
		<hr /> 
		</article>`)
	if (card.completed) {
		$(`#${card.id}`).children().addClass('strike-through');
		$(`#${card.id}`).addClass('card-display-none');
	};
	resetFields();
	enabledBtn();
};

//returns the card ID
function getId($element) {
	return $element.closest('.card').attr('id');
};

//sending to localStorage 
function storeCard(card) {
	localStorage.setItem(card.id, JSON.stringify(card));
};

//deletes card
function deleteCard() {
	$(this).closest('.card').remove();
	localStorage.removeItem(getId($(this)));
};

//changes importance status
function statusChange() {
		var statusArray = ['none', 'low', 'normal', 'high', 'critical'];
		var $checkStatus = $(this).closest('.rank').find('.rank-status');
		var statusIndex = statusArray.indexOf($checkStatus.text());
		var increment = $(this).hasClass('upvote-button-div') ? 1:-1;
		var newStatus = statusArray[statusIndex + increment];
		var updateCard = JSON.parse(localStorage.getItem(getId($(this))));
		$checkStatus.text(newStatus);
		updateCard.status = newStatus;
		storeCard(updateCard)	
};

//edit title text and save on enter/clickout
function editTitle(e) {
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
function doYouMatch(searchTerm, index) {
	var title = $($('.card-title')[index]).html();
	var upperCaseTitle = title.toUpperCase();
	var body = $($('.card-body')[index]).html();
	var upperCaseBody = body.toUpperCase();
	if (upperCaseTitle.indexOf(searchTerm) !== -1 || upperCaseBody.indexOf(searchTerm) !== -1) {
		return true;
	}
};

function completeTask() {
	var updateCard = JSON.parse(localStorage.getItem(getId($(this))));
	updateCard.completed = !updateCard.completed;
	$(this).siblings().toggleClass('strike-through');
	storeCard(updateCard);
};

function showCompletedTasks() {
	var foundCard = $('.card-list').find('.card-display-none');
	if (foundCard) {
		foundCard.removeClass('card-display-none');
		$('.card-list').prepend(foundCard);
	}
};









