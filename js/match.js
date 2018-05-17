// Global variables to manage game state
let state = [];
let moveCount = 0;
let gameover = 0;
let intervalID;

// Card icons from Font Awesome, https://fontawesome.com/
const cards = [
    "fa-umbrella",
    "fa-fire",
    "fa-chess-rook",
    "fa-heart",
    "fa-snowflake",
    "fa-paw",
    "fa-tree",
    "fa-truck-moving",
]

// Main function call to set up the game
configureGame();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function clickListener (event) {
    let target = event.target;
    // Handle icon or card div clicks
    if (target.classList.contains("fas")) {
        target = target.parentElement;
    }
    let status = getDeckStatus(target);

    if (status == 0) {
        displayCard(target);
    }
    else if (status == 1) {
        displayCard(target);
        compareCards();
    }
}

/**
 * @description Check for game completion, if so, handle timer, stars and congrats
 */
function gameComplete() {
    setTimeout(function () {
        let lockedCount = 0;
        for (let c = 0; c < 16; c++) {
            if (state[c].locked == 1) {
                lockedCount = lockedCount + 1;
            }
        }
        if (lockedCount == 16) {
            gameover = 1;
            const timeLoc = document.querySelector('.timer');
            const time = parseInt(timeLoc.textContent.split(" ")[1], 10);
            clearInterval(intervalID);
            time.textContent = "Time: " + time;

            const starsCollection = document.getElementsByClassName('fa-star');
            let stars = 0;
            for (let s = 0; s < 3; s++) {
                if (starsCollection[s].classList.contains("fas")) {
                    stars++;
                }
            }
            congrats(time, stars);
        }
    }, 1000);
}

/**
 * @description Congratulations modal with resulting game info
 * @param {number} gameTime - Length of game in seconds
 * @param {number} starCount - Number of stars earned in the game
 */
function congrats(gameTime, starCount) {
    const modal = document.getElementById('endGameModal');
    const span = document.getElementsByClassName('close')[0];

    const lineOne = document.createElement('p');
    lineOne.textContent = `Congratulations!`;
    const lineTwo = document.createElement('p');
    lineTwo.textContent = `You finished the game in ${gameTime} seconds!`;
    const lineThree = document.createElement('p');
    if (starCount > 1) {
        lineThree.textContent = `Star Rating: ${starCount} stars!`;
    }
    else {
        lineThree.textContent = `Star Rating: ${starCount} star!`;
    }
    const lineFour = document.createElement('p');
    lineFour.textContent = `Would you like to play again?`;
    lines = [lineOne, lineTwo, lineThree, lineFour];

    for (let l = 0; l < lines.length; l++) {
        modal.firstElementChild.appendChild(lines[l]);
    }

    modal.style.display = 'block';
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

/**
 * @description Determine if it's okay to flip the card (if there are 0 or 1 cards open)
 * @param {Event.target} target - The event.target of the EventListener
 * @returns {number} total - Flag variable, 0, 1, or 2
 */
function getDeckStatus(target) {
    // Check if clicked on same card
    if (state[parseInt(target.id, 10)].open == 1) {
        return 2;
    }

    let total = 0;
    let duplicate = 0;
    for (let c = 0; c < 16; c++) {
        if (state[c].open == 1 && state[c].locked == 0) {
            total++;
        }
    }
    return total;
}

function move() {
    moveCount++;
    const counter = document.querySelector('.moves');
    counter.textContent = moveCount + " moves";

    if (moveCount == 15) {
        let star = document.getElementById('star2');
        star.classList.replace('fas', 'far');
    }
    if (moveCount == 18) {
        let star = document.getElementById('star1');
        star.classList.replace('fas', 'far');
    }
}

/**
 * @description Compare the card names to see if they are the same
 * @param {null} This function acts on the global 'state' array
 */
function compareCards () {
    move();
    let flag = 0;
    let cardOne;
    let cardTwo;
    for (let c = 0; c < 16; c++) {
        if (state[c].open == 1 && state[c].locked == 0) {
            if (flag == 0) {
                cardOne = c;
                flag = 1;
            }
            else {
                cardTwo = c;
            }
        }
    }
    if (state[cardOne].cardName === state[cardTwo].cardName) {
        itsAMatch(state[cardOne], state[cardTwo]);
    }
    else {
        itsNotAMatch(state[cardOne], state[cardTwo]);
    }
}

/**
 * @description If cards match, animate, lock, and check for end of game
 * @param {number} cardOne - Index of the card in the 'state' array
 * @param {number} cardOne - Index of the card in the 'state' array
 */
function itsAMatch (cardOne, cardTwo) {
    cardOne.locked = 1;
    cardTwo.locked = 1;

    let firstCard = document.getElementById(cardOne.divID);
    let secondCard = document.getElementById(cardTwo.divID);
    firstCard.classList.add('animate-right');
    secondCard.classList.add('animate-right');

    gameComplete();
}

/**
 * @description If cards do not match, animate and close
 * @param {number} cardOne - Index of the card in the 'state' array
 * @param {number} cardOne - Index of the card in the 'state' array
 */
function itsNotAMatch (cardOne, cardTwo) {
    let firstCard = document.getElementById(cardOne.divID);
    let secondCard = document.getElementById(cardTwo.divID);

    firstCard.classList.add('animate-wrong');
    secondCard.classList.add('animate-wrong');

    setTimeout(function () {
        cardOne.open = 0;
        cardTwo.open = 0;

        firstCard.classList.remove('animate-wrong');
        secondCard.classList.remove('animate-wrong');

        firstCard.classList.replace('open', 'closed');
        secondCard.classList.replace('open', 'closed');
    }, 2000);
}

/**
 * @description Display card icon
 * @param {Event.target} target - The event.target of the EventListener
 * @returns {number} flag - Flag variable, 0 or 1
 */
function displayCard (target) {
    let flag = 0;
    if (target.classList.contains('open')) {
        target.classList.replace('open', 'closed');
        flag = 1;
    }
    else if (target.classList.contains('closed')) {
        target.classList.replace('closed', 'open');
        flag = 0;
    }
    else {
        target.classList.add('open');
        flag = 1;
    }
    state[parseInt(target.id, 10)].open = 1;
    return flag;
}

/**
 * @description Create cards, icons, and add card properties to 'state' array
 * @param {array} cardArray - Array of strings describing icon classes
 */
function addCardsToBoard(cardArray) {
    const cards = cardArray.concat(cardArray);
    const shuffledCards = shuffle(cards);

    const board = document.querySelector('.gameboard');

    for (let i = 0; i < shuffledCards.length; i++) {
        let newCardDiv = document.createElement('div');
        newCardDiv.classList.add('box', 'card');
        newCardDiv.id = i;
        let icon = document.createElement('i');
        icon.classList.add('fas', shuffledCards[i]);

        newCardDiv.addEventListener('click', clickListener, false);
        let cardProps = {};
        cardProps["cardName"] = icon.classList.item(1);
        cardProps["open"] = 0;
        cardProps["divID"] = i;
        cardProps["locked"] = 0;
        state.push(cardProps);

        newCardDiv.appendChild(icon);
        board.appendChild(newCardDiv);
    }
}

/**
 * @description Game and statistics setup with start game button
 */
function configureGame() {
    const infoSection = document.querySelector('.info');
    const infoDiv = document.createElement('div');
    infoDiv.classList.add('info-div');
    infoSection.appendChild(infoDiv);

    // Start/reset game button
    let startButton = document.createElement('div');
    startButton.classList.add('start');
    startButton.innerHTML = '<button onclick="startGame()">Start!</button>';
    infoDiv.appendChild(startButton);

    let timerDiv = document.createElement('div');
    timerDiv.classList.add('timer');
    timerDiv.textContent = "Time: 0";
    infoDiv.appendChild(timerDiv);

    let counterDiv = document.createElement('div');
    counterDiv.classList.add('moves');
    counterDiv.textContent = moveCount + " moves";
    infoDiv.appendChild(counterDiv);

    let starTable = document.createElement('table');
    starTable.classList.add('stars');
    let starRow = document.createElement('tr');
    for (let s = 0; s < 3; s++) {
        let star = document.createElement('td');
        star.classList.add('fas', 'fa-star');
        star.id = "star" + s;
        starRow.appendChild(star);
    }
    starTable.appendChild(starRow);
    infoDiv.appendChild(starTable);
}

/**
 * @description Everything concerned with starting (or restarting) a new game
 */
function startGame() {
    // Remove cards if game hasn't started yet
    let isNewGame = 0;
    if (document.getElementById(0)) {
        for (let c = 0; c < 16; c++) {
            let card = document.getElementById(c);
            card.remove();
        }
        moveCount = 0;
        const newCounterDiv = document.querySelector('.moves');
        newCounterDiv.textContent = moveCount + " moves";
        state = [];
        gameover = 0;
        isNewGame = 1;
        resetStars();
        resetModal();
    }

    addCardsToBoard(cards);
    const start = Date.now();
    gameTimer(start, isNewGame);
}

/**
 * @description Main game timer
 * @param {number} startTime - Milliseconds of UNIX epoch time
 * @param {number} isNewGame - Flag indicating a game restart or brand new game
 */
function gameTimer(startTime, isNewGame) {

    if (isNewGame == 0) {
        intervalID = window.setInterval(function() {
            let sec = Math.floor((Date.now() - startTime)/1000);
            let timer = document.querySelector('.timer');
            timer.textContent = "Time: " + sec;
        }, 1000);
    }
    else {
        if (gameover == 1) {
            clearInterval(intervalID);
        }
        else {
            clearInterval(intervalID);
            intervalID = window.setInterval(function() {
                let sec = Math.floor((Date.now() - startTime)/1000);
                let timer = document.querySelector('.timer');
                timer.textContent = "Time: " + sec;
            }, 1000);
        }
    }
}

function resetStars() {
    for (let s = 0; s < 3; s++) {
        const starId = "star" + s;
        const star = document.getElementById(starId);
        if (star.classList.contains('far')) {
            star.classList.replace('far', 'fas');
        }
    }
}

function resetModal() {
    let paragraphs = document.querySelectorAll('p');
    for (let p = 0; p < paragraphs.length; p++) {
        paragraphs[p].remove();
    }
}
