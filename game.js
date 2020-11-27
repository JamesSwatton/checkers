let board;
board = Object.create(Board);

// STATE
let activePlayer = "1";
let opponent = "2";
let canMove;
let canCapture;
let move = [];

window.addEventListener("load", () => {
    board.setup();
    document
        .getElementById("pieces-container")
        .addEventListener("click", ev => {
            // GAME LOGIC
            let coor = JSON.parse(ev.target.id);
            // populate move
            if (isValidPiece(coor, board.pieces)) {
                move[0] = coor;
                move[1] = null;
            } else if (move[0] && isValidBlank(move[0], coor, board.pieces)) {
                move[1] = coor;
            }
            // move piece if move is valid
            if (move.includes(null) || move.length == 0) {
                console.log("not valid move");
                return;
            } else {
                console.log("valid move");
                board.movePiece(move);
                swapPlayers();
                move = [];
                board.prepNextTurn();
            }
        });
});

// HELPERS
function swapPlayers() {
    if (activePlayer == "1") {
        activePlayer = "2";
        opponent = "1";
    } else {
        activePlayer = "1";
        opponent = "2";
    }
}

function isValidPiece(coor, pieces) {
    return pieces[coor.y][coor.x].player == activePlayer ? true : false;
}

function isValidBlank(p, coor, pieces) {
    return pieces[p.y][p.x].moves.includes(JSON.stringify(coor)) ? true : false;
}
