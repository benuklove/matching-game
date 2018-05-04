cards = [
    '<i class="fas fa-umbrella"></i>',
    '<i class="fas fa-fire"></i>',
    '<i class="fas fa-chess-rook"></i>',
    '<i class="fas fa-heart"></i>',
    '<i class="fas fa-paw"></i>',
    '<i class="far fa-snowflake"></i>',
    '<i class="fas fa-tree"></i>',
    '<i class="fas fa-truck-moving"></i>',
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
