let board;
board = Object.create(Board);

// STATE
let activePlayer = "1";
let opponent = "2";
let move = [];

// USER INTERACTION
window.addEventListener("load", () => {
    board.setup();
    console.log(board.pieces);
    console.log(board.possibleMoves);

    if (activePlayer == "1") {
        document
            .getElementById("pieces-container")
            .addEventListener("click", ev => {
                // won't throw and error if you select the board
                if (ev.target.id != "pieces-container") {
                    let coor = JSON.parse(ev.target.id);
                    if (board.getPiece(coor).player == "1") {
                        board.selectedPieceCoor = ev.target.id;
                        board.renderMoveIndicators();
                        move[0] = ev.target.id;
                        move[1] = null;
                    } else if (board.getPiece(coor).type == "blank") {
                        move[1] = ev.target.id;
                    }
                    // console.log(move);
                    if (
                        move.includes(null) ||
                        move.includes(undefined) ||
                        move.length == 0
                    ) {
                        return;
                    } else {
                        if (playerMakeMove(move)) {
                            computerMakeMove();
                        }
                    }
                }
            });
    }
});

// HELPERS
function swapPlayers() {
    board.moveChainCoor = "";

    if (activePlayer == "1") {
        activePlayer = "2";
        opponent = "1";
    } else {
        activePlayer = "1";
        opponent = "2";
    }
}

function getWinner() {
    let winner = null;
    if (!board.canMove && !board.canCapture) {
        winner = activePlayer == "1" ? "Player 2" : "Player 1";
        console.log(`${winner} is the winner!`);
        renderWinner(winner)
    }
}

function renderWinner(winner) {
    document.getElementById("game-status").innerHTML = 
        `${winner} is the winner!`
}

function playerMakeMove(move) {
    winner = getWinner();
    if (board.canCapture) {
        let currentState = board.getPiece(JSON.parse(move[0])).isKing;
        let newState;
        if (board.movePiece(move)) {
            board.prepNextTurn();
            newState = board.getPiece(JSON.parse(move[1])).isKing;
            if (board.canCapture && currentState == newState) {
                return;
            } else {
                swapPlayers();
                board.prepNextTurn();
                return true;
            }
        }
    } else if (board.canMove) {
        if (board.movePiece(move)) {
            swapPlayers();
            board.prepNextTurn();
            return true;
        }
    }
}

function computerMakeMove() {
    winner = getWinner();
    if (board.canCapture) {
        setTimeout(() => {
            let move = computerGetMove();
            let currentState = board.getPiece(JSON.parse(move[0])).isKing;
            let newState;
            board.movePiece(computerGetMove());
            board.prepNextTurn();
            newState = board.getPiece(JSON.parse(move[1])).isKing;
            if (board.canCapture && currentState == newState) {
                computerMakeMove();
            } else {
                swapPlayers();
                board.prepNextTurn();
            }
        }, 1000);
    } else if (board.canMove) {
        console.log("hi");
        setTimeout(() => {
            board.movePiece(computerGetMove());
            swapPlayers();
            board.prepNextTurn();
        }, 1000);
    }
}

function computerGetMove() {
    let move = [];
    let randomPiecePos = Math.floor(
        Math.random() * Object.keys(board.possibleMoves).length
    );
    move[0] = Object.keys(board.possibleMoves)[randomPiecePos];
    let randomMovePos = Math.floor(
        Math.random() * board.possibleMoves[move[0]].length
    );
    move[1] = board.possibleMoves[move[0]][randomMovePos][0];
    return move;
}
