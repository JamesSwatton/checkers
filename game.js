let board;
board = Object.create(Board);

// STATE
let activePlayer = "1";
let opponent = "2";
let move = [];

window.addEventListener("load", () => {
    board.setup();
    console.log(board.pieces);
    console.log(board.possibleMoves);

    document.getElementById("title").addEventListener("click", () => {
        startAnimation();
    });

    // USER INTERACTION
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
        winner = activePlayer == "1" ? "2" : "1";
        renderWinner(winner);
    }
}

function renderWinner(winner) {
    const message = () => {
        if (winner == "1") {
            return { text: "You won!", emoticon: "(. ❛ ᴗ ❛.)" };
        } else {
            return { text: "Com wins...", emoticon: "╮ (. ❛ ᴗ ❛.) ╭" };
        }
    };
    document.getElementById("game-status-text").innerHTML = message().text;
    document.getElementById(
        "game-status-emoticon"
    ).innerHTML = message().emoticon;
}

function playerMakeMove(move) {
    if (board.canCapture) {
        let currentState = board.getPiece(JSON.parse(move[0])).isKing;
        let newState;
        if (board.movePiece(move)) {
            prepNextTurn();
            newState = board.getPiece(JSON.parse(move[1])).isKing;
            if (board.canCapture && currentState == newState) {
                return;
            } else {
                swapPlayers();
                prepNextTurn();
                return true;
            }
        }
    } else if (board.canMove) {
        if (board.movePiece(move)) {
            swapPlayers();
            prepNextTurn();
            return true;
        }
    }
}

function computerMakeMove() {
    if (board.canCapture) {
        setTimeout(() => {
            let move = computerGetMove();
            let currentState = board.getPiece(JSON.parse(move[0])).isKing;
            let newState;
            board.movePiece(computerGetMove());
            prepNextTurn();
            newState = board.getPiece(JSON.parse(move[1])).isKing;
            if (board.canCapture && currentState == newState) {
                computerMakeMove();
            } else {
                swapPlayers();
                prepNextTurn();
            }
        }, 1000);
    } else if (board.canMove) {
        console.log("hi");
        setTimeout(() => {
            board.movePiece(computerGetMove());
            swapPlayers();
            prepNextTurn();
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

function prepNextTurn() {
    board.prepNextTurn();
    getWinner();
}

// STARTUP ANIMATION
function startAnimation() {
    const gradient = document.getElementById("gradient");
    const gradient2 = document.getElementById("gradient-2");
    const title = document.getElementById("title");
    const boardContainer = document.getElementById("board-container");
    document.body.style.top = "0";
    gradient.style.height = "0";
    title.style.color = "white";
    title.style.marginBottom = "0";
    setTimeout(() => {
        boardContainer.style.boxShadow = "10px 10px 30px black";
        gradient2.style.backgroundColor = "rgba(255, 255, 255, 0)";
        setTimeout(() => {
            gradient2.style.display = "none";
        }, 2000);
    }, 1500);
}
