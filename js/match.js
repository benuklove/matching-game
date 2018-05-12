// let state = {};
let state = [];
let moveCount = 0;
let gameover = 0;
let intervalID;

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
        // newTarget.dispatchEvent(event);
    }
    let status = getDeckStatus(target);  // A number

    if (status == 0) {
        displayCard(target);
    }
    else if (status == 1) {
        displayCard(target);
        compareCards();
    }
}

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
            window.alert("Congratulations! \nYou finished the game! \nzero points");
        }
    }, 1000);
}

// Determine if it's okay to flip the card (if there are 0 or 1 cards open)
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
}

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
        console.log("they match!");
        itsAMatch(state[cardOne], state[cardTwo]);
    }
    else {
        console.log("they don't match.")
        itsNotAMatch(state[cardOne], state[cardTwo]);
    }
}

function itsAMatch (firstCard, secondCard) {
    firstCard.locked = 1;
    secondCard.locked = 1;

    gameComplete();
}

function itsNotAMatch (cardOne, cardTwo) {
    setTimeout(function () {
        cardOne.open = 0;
        cardTwo.open = 0;

        let firstCard = document.getElementById(cardOne.divID);
        let secondCard = document.getElementById(cardTwo.divID);

        firstCard.classList.replace('open', 'closed');
        secondCard.classList.replace('open', 'closed');
    }, 2000);
}

function displayCard (target) {
    let flag = 0;
    // console.log("from displayCard(event): ", typeof(tgt.id), tgt.id);  // A string
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

// IF THERE'S A MATCH - Remove the listeners for those two.

// MAYBE USE createDocumentFragment !!!!!
function addCardsToBoard(cardArray) {
    const cards = cardArray.concat(cardArray);
    const shuffledCards = shuffle(cards);

    const board = document.querySelector('.gameboard');

    for (let i = 0; i < shuffledCards.length; i++) {
        // There's probably a better way to add multiple classes
        let newCardDiv = document.createElement('div');
        newCardDiv.classList.add('box');
        newCardDiv.classList.add('card');
        newCardDiv.id = i;
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add(shuffledCards[i]);

        newCardDiv.addEventListener('click', clickListener, false);
        // state[shuffledCards[i]] = 0;  // Not sure if I want to use id's as keys or fas classes.
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

function configureGame() {
    const infoSection = document.querySelector('.info');

    let timerDiv = document.createElement('div');
    timerDiv.classList.add('timer');
    timerDiv.textContent = "Time: 0";
    infoSection.appendChild(timerDiv);

    let counterDiv = document.createElement('div');
    counterDiv.classList.add('moves');
    counterDiv.textContent = moveCount + " moves";
    infoSection.appendChild(counterDiv);

    // Start/reset game button
    let startButton = document.createElement('div');
    startButton.classList.add('start');
    startButton.innerHTML = '<button onclick="startGame()">Start!</button>';
    infoSection.appendChild(startButton);
}

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
        state = [];  // That one caused headaches!
        gameover = 0;
        isNewGame = 1;
    }
    addCardsToBoard(cards);
    const start = Date.now();
    gameTimer(start, isNewGame);
}

function gameTimer(startTime, isNewGame) {

    if (isNewGame == 0) {
        intervalID = window.setInterval(function() {
            let sec = Math.floor((Date.now() - startTime)/1000);
            let timer = document.querySelector('.timer');
            timer.textContent = "Time: " + sec;
        }, 1000);
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

configureGame();
