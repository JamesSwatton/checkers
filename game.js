let board;
board = Object.create(Board);

// STATE
let activePlayer = "1";
let opponent = "2";
let move = [];

// USER INTERACTION
Window.addEventListener("load", () => {
    board.setup();
    document
        .getElementById("pieces-container")
        .addEventListener("click", ev => {
            // won't throw and error if you select the board
            if (ev.target.id != "pieces-container") {
                let coor = JSON.parse(ev.target.id);
                if (board.getPiece(coor).player == activePlayer) {
                    move[0] = coor;
                    move[1] = null;
                } else if (board.getPiece(coor).type == "blank") {
                    move[1] = coor;
                }
                if (
                    move.includes(null) ||
                    move.includes(undefined) ||
                    move.length == 0
                ) {
                    return;
                } else {
                    if (board.movePiece(move)) {
                        swapPlayers();
                        board.prepNextTurn();
                    }
                }
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
