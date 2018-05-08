
// let state = {};
let state = [];

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

    // console.log("card clicked");
    let status = getDeckStatus();  // A number

    if (status == 0) {
        displayCard(target);
    }
    else if (status == 1) {
        displayCard(target);
        compareCards();
    }
}

// Determine if it's okay to flip the card (if there are 0 or 1 cards open)
function getDeckStatus() {
    let total = 0;
    for (let c = 0; c < 16; c++) {
        if (state[c].open == 1 && state[c].locked == 0) {
            total = total + 1;
        }
    }
    console.log("total: ", total);
    return total;
}

function compareCards () {
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
    // console.log("cardOne: ", cardOne, "cardTwo: ", cardTwo);
    // const status = displayCard(event);
    // const card = event.target.id;
    // state[card].open = 1;
}

function itsAMatch (firstCard, secondCard) {
    firstCard.locked = 1;
    secondCard.locked = 1;
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
    console.log(state[parseInt(target.id, 10)]);
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
        // let listener = newCardDiv.addEventListener('click', clickListener, false);
        newCardDiv.classList.add('box');
        newCardDiv.classList.add('card');
        newCardDiv.id = i;
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add(shuffledCards[i]);

        newCardDiv.addEventListener('click', clickListener, false);
        // icon.addEventListener('click', clickListener, false);
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
    console.log(state);
}

addCardsToBoard(cards);
