let board;
board = Object.create(Board);

// STATE
let activePlayer = "1";
let opponent = "2";
let canMove;
let canCapture;

window.addEventListener("load", () => {
    board.setup();
});
