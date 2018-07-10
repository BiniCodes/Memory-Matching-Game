//Vanilla Javascript used to create a Memory Game

//cards array to display memory card's icons
const icons = ["<i class ='far fa-hand-point-right'></i>",
"<i class = 'far fa-hand-peace'></i>",
"<i class = 'far fa-grin-stars'></i>",
"<i class = 'far fa-grin-squint-tears'></i>",
"<i class = 'far fa-hand-spock'></i>",
"<i class = 'far fa-kiss-wink-heart'></i>",
"<i class = 'far fa-thumbs-up'></i>",
"<i class = 'far fa-grin-tongue-squint'></i>"];

//Doubling the array
const cardIcons = icons.concat(icons);

//variables and arrays for the deck and OPENED and MACTHED cards
const cardsDeck= document.querySelector(".deck");
let openedCards = [];
let matchedCards = [];


/* Shuffle function to shuffle cards of memory game
 From http://stackoverflow.com/a/2450976 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    } return array;
}

//Call shuffle function for cardIcons array
shuffle(cardIcons);


/* Timer for memory game 
From: https://www.youtube.com/watch?v=kDnfrlK2CLg */

// Variables for timer
let time = 0;
let running = 0;
let playPauseButton = document.getElementById('playPause');


/* Start and stop timer &
Switch from play to pause button */
function startStopTimer(){
	if(running == 0){
		running = 1;
		increment();
		playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
	} else {
		running = 0;
		playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
	}
}

// Reset timer
function resetTimer(){
	running = 0;
	time = 0;
	startStopTimer()	
}

/* Increment function to add the time to the timer 
and increment it every second*/
function increment(){
	if(running == 1){
		setTimeout(function(){
			time++;
			var mins = Math.floor(time/10/60);
			var secs = Math.floor(time/10);
			var tenths = time % 10;

			if(mins < 10){
				mins = "0" + mins;
			}
			if(secs < 10){
				secs = "0" + secs;
			}

			var output = document.getElementById('timer');
      output.innerHTML = mins + ':' + secs + ':' + "0" + tenths;
			increment();
		}, 100);
	}
}

//Add event listener to start/ pause button
playPauseButton.addEventListener("click", startStopTimer, false);
/*playPauseButton.onpause = function() {
	alert('The game has been paused');
};*/

//Create the cards
function createCards(){
	for(const cardIcon of cardIcons){

		console.log(cardIcon);

		//Create cards
		const card = document.createElement("li");
		card.classList.add("card", "hovereffect");
		card.innerHTML = cardIcon;
		cardsDeck.appendChild(card);


			//Add event handler to have a card click event
			//call matchCards function
			card.addEventListener("click",matchCards,false);

			//Stop cards from being able to turn while pausing
			if(running===0){
				playPauseButton.addEventListener("click", function(){	
				card.removeEventListener("click",matchCards,false);
				card.classList.remove('hovereffect');
				});	
			} 
				/*playPauseButton.addEventListener("click", function(){	
				//Add event handler to have a card click event
				card.addEventListener("click",matchCards,false);
				card.classList.add('hovereffect');
				});	
				*/
	}
}


//Changes made to the matchCards() function with help of the following study jam video:
//FROM: https://www.youtube.com/watch?v=G8J13lmApkQ&feature=youtu.be

//Variable for cards
const selectCard = document.querySelector('li');
//Compare cards and see if they match
function matchCards() {

		console.log(selectCard.innerHTML);
		 
		 //Variables of the clicked cards
		 const currentCard = this;
		 const previousCard = openedCards[0];

			 //open a card function
			 function openCard(){
			 		currentCard.classList.add("open","show");
					currentCard.classList.remove("hovereffect");
					openedCards.push(currentCard);
			 }	 

		 //Check if there is already an opened card
		 let numOpenedCards = openedCards.length;
		 //We have an existing OPENED card
		 if(numOpenedCards >= 1) {		 	

			// We open the card and add it to our openedCards array
			openCard();

			//We increase the moves variable (we add a move)
			addMove();
	
			//Compare the two opened cards
			if(currentCard.innerHTML === previousCard.innerHTML) {
				
				//The open cards MATCH

				//We add the matcheffect to show that the cards match
				currentCard.classList.add("matchEffect");
				previousCard.classList.add("matchEffect");

				//Wait 600 ms and then remove matcheffect and log as matched
				setTimeout(function() {
				//We remove the matcheffect 
				currentCard.classList.remove("matchEffect");
				previousCard.classList.remove("matchEffect");
				
				/*We log the cards as matched and add them to our 
				matchedCards array */
				currentCard.classList.add("match", "noPointer");
				previousCard.classList.add("match", "noPointer");
				}, 600);		

				matchedCards.push(currentCard,previousCard);

				//Reset the openedCards array to empty
				openedCards = [];

				console.log("Matched!");
				
				// Check if game is over
				isOver();

			} else {
				//NO MATCH 

				//Add no match effect
				currentCard.classList.add("noMatchEffect");
				previousCard.classList.add("noMatchEffect");
				
				//Wait 600ms and then turn cards
				setTimeout(function() {
				currentCard.classList.remove("open","show", "noMatchEffect");
				previousCard.classList.remove("open","show", "noMatchEffect");
				openedCards = [];
				}, 600);

				currentCard.classList.add("hovereffect");
				previousCard.classList.add("hovereffect");

				console.log("Doesn't match!");
			}
		
		} else {
			//We don't have any opened cards and open the first card
				openCard();
		}

	};

//start the game immediately after calling the website
start();

/*Check if the Game is over and alert a message 
giving the time needed to finish and the hearts left */
function isOver(){
	if(matchedCards.length === cardIcons.length){
		/*Call finalRating function to alert the number of hearts left 
		at the end of the game.*/
		let hearts = finalRating();
		//Get the time of the game when the game is over
		let endTime = document.getElementById('timer').textContent;
		console.log(endTime);
		//Log the message
		console.log("You won! \n " + "Your time was " + endTime +".\n" + " You have "+ hearts + " left.");
		//Display model window
		modalCall();
		//Stop the timer when the game is over.
		startStopTimer();
		playPauseButton.removeEventListener("click", startStopTimer, false);
		playPauseButton.classList.add("noPointer");
	}
}


/* Modal window made with help of the following resourse:
FROM: https://www.w3schools.com/howto/howto_css_modals.asp */

// Variables for modal window
const modal = document.getElementById('myModal');
const close = document.getElementsByClassName("close")[0];
const okay = document.getElementById('okay');
const modalText = document.getElementById('modalText');

// Function to call when to close the modal
function closeModal(){
	modal.style.display = "none";
}

//Event listener and function for closing X in the modal window
close.addEventListener('click',closeModal,false);

function modalCall(){
	//Display the modal window
	modal.style.display = "block";
	//Add message to modal window
	let hearts = finalRating();
	let endTime = document.getElementById('timer').textContent;
	modalText.innerHTML ="Congratulations, you won! " + "Your time was " + endTime + " ."+ " You have "+ hearts + " left.";
	//Add click event listener to the 'Restart Game' button
	okay.addEventListener('click',function(){
		modal.style.display = "none";
		restart();
	});

	// When the user clicks anywhere outside of the modal, close it
	window.addEventListener('click', function(e){
	    if (e.target == modal) {
	        modal.style.display = "none";
	    }
	});
}

//Add MOVE COUNTER

//Move counter variables
const moveContainer = document.querySelector(".moves");
let moves = 0;
//Set move Counter to 0
moveContainer.innerHTML = 0;

//Add a move everytime the function addMove() is called
function addMove(){ 
	moves++;
	moveContainer.innerHTML = moves;
	console.log(moves);

	//Call rating function
	rating();
}

//Set the RATING

//Rating variables
const heartOne = document.querySelector("#firstHeart");
const heartTwo = document.querySelector("#secondHeart");
const heartThree = document.querySelector("#thirdHeart");
const moveText = document.querySelector("#move"); 

//Rating function
function rating() {	
	switch(moves){
		case 0:
			console.log(0);
		break;

		case 1:
			moveText.innerHTML = 'Move';
		break;

		case 2:
			moveText.innerHTML = 'Moves';
		break;

		case 10:
		//After the 10th move delete one heart
			heartThree.classList.add('delStar');
		break;

		case 18:
		//After the 18th move delete a second heart
			heartTwo.classList.add('delStar');
			break;

		case 25:
		/* After the 25th move delete the last heart
		The game is over : Alert "Game over" and restart the game */
			heartOne.classList.add('delStar');
			alert("GAME OVER! \n Want to try again =) ?");
			restart();
			break;

		default:
    	console.log('default');
	}
}

//Final rating function to see how many hearts are left when the game is won
function finalRating() {
	if( // no hearts left
		heartOne.classList.contains("delStar") && 
		heartTwo.classList.contains("delStar") &&
		heartThree.classList.contains("delStar")){
		return 'no hearts ';
	} else if ( 
		// one heart is left
		!heartOne.classList.contains("delStar") && 
		heartTwo.classList.contains("delStar") &&
		heartThree.classList.contains("delStar")) {
		return 'one heart ';
	
	} else if ( 
		// two hearts left
		!heartOne.classList.contains("delStar") && 
		!heartTwo.classList.contains("delStar") &&
		heartThree.classList.contains("delStar")) {
		return 'two hearts ';
	
	} else {
		// All three hearts left
		return 'three hearts ';
	}
}

//RESTART THE GAME with restart button

// Variable to select the restart button
const restartGame = document.querySelector(".restart");

// Restart funtion
function restart() {
	//Delete all cards
	cardsDeck.innerHTML = "";
	//call "init" to create new cards
	start();
	//Reset ANY RELATED variables
	matchedCards = [];
	moves = 0;
	moveContainer.innerHTML = moves;
	//Reset hearts to three 
	heartThree.classList.remove('delStar');
	heartTwo.classList.remove('delStar');
	heartOne.classList.remove('delStar');
	//Reset timer
	resetTimer();
	//Add Event Handler to Play/Pause button
	playPauseButton.addEventListener("click", startStopTimer, false);
	playPauseButton.classList.remove("noPointer");

	console.log(cardsDeck);
}

//Add event listener to restart button and call restart function as handler
restartGame.addEventListener("click", restart, false);

//start() function to start the game
function start() {
	shuffle(cardIcons);
	createCards();
	startStopTimer();
}

