cards = [
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

// MAYBE USE createDocumentFragment !!!!!

function addCardsToBoard(cardArray) {
    const cards = cardArray.concat(cardArray);
    const shuffledCards = shuffle(cards);

    const board = document.querySelector('.gameboard');

    for (let i = 0; i < shuffledCards.length; i++) {
        // Probably a better way to add multiple classes
        let newCardDiv = document.createElement('div');
        newCardDiv.classList.add('box');
        newCardDiv.classList.add('card');
        let icon = document.createElement('i');
        icon.classList.add('fas');
        icon.classList.add(shuffledCards[i]);

        newCardDiv.appendChild(icon);
        board.appendChild(newCardDiv);
    }
}

addCardsToBoard(cards);
