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
    // shuffle here first
    const board = document.querySelector('.gameboard');

    for (let x = 1; x <=2; x++) {
        for (let i = 0; i < cardArray.length; i++) {
            let newCardDiv = document.createElement('div');
            newCardDiv.classList.add('box');
            newCardDiv.classList.add('card');
            let icon = document.createElement('i');
            icon.classList.add('fas');
            icon.classList.add(cardArray[i]);

            newCardDiv.appendChild(icon);
            board.appendChild(newCardDiv);
        }
    }
}

addCardsToBoard(cards);
