let board;
board = Object.create(Board);

// STATE
let winner = null;
let activePlayer = "1";
let opponent = "2";
let move = [];

// USER INTERACTION
window.addEventListener("load", () => {
    board.setup();

    document
        .getElementById("pieces-container")
        .addEventListener("click", ev => {
            // won't throw and error if you select the board
            if (!winner) {
                if (ev.target.id != "pieces-container") {
                    let coor = JSON.parse(ev.target.id);
                    if (board.getPiece(coor).player == activePlayer) {
                        board.selectedPieceCoor = ev.target.id;
                        board.renderMoveIndicators();
                        move[0] = ev.target.id;
                        move[1] = null;
                    } else if (board.getPiece(coor).type == "blank") {
                        move[1] = ev.target.id;
                    }
                    if (
                        move.includes(null) ||
                        move.includes(undefined) ||
                        move.length == 0
                    ) {
                        return;
                    } else {
                        if (board.canCapture) {
                            if (board.movePiece(move)) {
                                board.prepNextTurn();
                                if (!board.canCapture) {
                                    swapPlayers();
                                    board.prepNextTurn();
                                    // updatePieceListeners();
                                    winner = getWinner();
                                    if (winner) {
                                        console.log(`${winner} has won!`);
                                    }
                                }
                            }
                        } else if (board.canMove) {
                            if (board.movePiece(move)) {
                                swapPlayers();
                                board.prepNextTurn();
                                // updatePieceListeners();
                                winner = getWinner();
                                if (winner) {
                                    console.log(`${winner} has won!`);
                                }
                            }
                        }
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

function getWinner() {
    if (!board.canMove && !board.canCapture) {
        return activePlayer == "1" ? "player 2" : "player 1";
    } else {
        return null;
    }
}
