
let state = {};

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

function displayCard (event) {
    const tgt = event.target;
    if (tgt.classList.contains('open')) {
        tgt.classList.replace('open', 'closed');
        return 1;
    }
    else if (tgt.classList.contains('closed')) {
        tgt.classList.replace('closed', 'open');
        return 0;
    }
    else {
        tgt.classList.add('open');
        return 1;
    }
}

function clickListener (event) {
    console.log("card clicked");
    const status = displayCard(event);
    const card = document.getElementById(event.target.firstChild.innerHTML);
    console.log(card);
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
        let listener = newCardDiv.addEventListener('click', clickListener, false);
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add(shuffledCards[i]);
        state[shuffledCards[i]] = 0;  // Not sure if I want to use id's as keys or fas classes.
        newCardDiv.appendChild(icon);
        board.appendChild(newCardDiv);
    }
    console.log(state);
}

addCardsToBoard(cards);
