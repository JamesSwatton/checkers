const layout = [
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1]
];

const paths = {
    "1": [
        { x: -1, y: 1 },
        { x: 1, y: 1 }
    ],
    "2": [
        { x: -1, y: -1 },
        { x: 1, y: -1 }
    ],
    get king() {
        return [this["1"], this["2"]];
    }
};

const pieces = [...layout];

// player related data
let activePlayer = 1;
let opponent = 2;
let selectedPiecePos = null;
let selectedMovePos = null;
let moves = {};
let canCapture = false;
let canMove = false;

renderBoard();
renderPieces();
moves = getMoves();
renderMoveIndicators();

// event listeners - GAME LOGIC
document.querySelector("#pieces-container").addEventListener("click", event => {
    let selected = event.target.id;
    if (hasSelectedValidPiecePos(selected, moves)) {
        selectedPiecePos = selected;
    }
    if (selectedPiecePos && !selectedMovePos) {
        if (hasSelectedValidMovePos(selected, selectedPiecePos, moves)) {
            selectedMovePos = selected;
            movePiece(selectedPiecePos, selectedMovePos, moves);
            prepNextTurn();
        }
    }
    renderMoveIndicators();
});

// movement
function getMoves() {
    let currentPos;
    let moves = {};
    let captureMoves = {};

    let playerPaths = paths[`${activePlayer}`];
    for (let y = 0; y < pieces.length; y++) {
        for (let x = 0; x < pieces[y].length; x++) {
            currentPos = pieces[y][x];
            if (currentPos == activePlayer) {
                // get moves
                pieceKey = `{"x":${x}, "y":${y}}`;
                moves[pieceKey] = [];
                captureMoves[pieceKey] = [];
                playerPaths.forEach(path => {
                    let newY = y - path.y;
                    let newX = x - path.x;
                    let piecesAtMovePos;
                    if (
                        pieces[newY] != undefined &&
                        pieces[newX] != undefined
                    ) {
                        piecesAtMovePos = pieces[newY][newX];
                        if (
                            piecesAtMovePos == opponent &&
                            pieces[newY - path.y][newX - path.x] == 0
                        ) {
                            canCapture = true;
                            captureMoves[pieceKey].push([
                                `{"x":${newX - path.x}, "y":${newY - path.y}}`,
                                `{"x":${newX}, "y":${newY}}`
                            ]);
                        } else if (piecesAtMovePos == 0) {
                            canMove = true;
                            moves[pieceKey].push([
                                `{"x":${newX}, "y":${newY}}`
                            ]);
                        }
                    }
                });
                if (captureMoves[pieceKey].length == 0) {
                    delete captureMoves[pieceKey];
                }
                if (moves[pieceKey].length == 0) {
                    delete moves[pieceKey];
                }
            }
        }
    }
    return canCapture ? captureMoves : moves;
}

function hasSelectedValidPiecePos(selected, moves) {
    return selected in moves;
}

function hasSelectedValidMovePos(selected, selectedPiecePos, moves) {
    return moves[selectedPiecePos].map(m => m[0]).includes(selected);
}

function movePiece(selectedPiecePos, selectedMovePos, moves) {
    let parsedPiecePos = JSON.parse(selectedPiecePos);
    // TODO: this logic is a bit smelly
    let parsedMovePos = JSON.parse(selectedMovePos);
    let parsedCapturePos;
    pieces[parsedMovePos.y][parsedMovePos.x] = activePlayer;
    pieces[parsedPiecePos.y][parsedPiecePos.x] = 0;
    if (canCapture) {
        parsedCapturePos = JSON.parse(
            moves[selectedPiecePos].find(m => {
                return m[0] == selectedMovePos;
            })[1]
        );
        pieces[parsedCapturePos.y][parsedCapturePos.x] = 0;
    }
}

// clearing, swapping and resetting

function prepNextTurn() {
    selectedPiecePos = null;
    selectedMovePos = null;
    if (activePlayer == 1) {
        activePlayer = 2;
        opponent = 1;
        canCapture = false;
        canMove = false;
    } else {
        activePlayer = 1;
        opponent = 2;
        canCapture = false;
        canMove = false;
    }
    moves = getMoves();
    renderPieces();
    // console.log(`can capture: ${canCapture}`);
    // console.log(`can move: ${canMove}`);
}

// board and pieces rendering
function renderBoard() {
    const boardContainer = document.getElementById("board-container");
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement("div");
            square.className = "square";
            if ((i + j) % 2 == 0) {
                square.classList.add("dark");
                boardContainer.appendChild(square);
            } else {
                square.classList.add("light");
                boardContainer.appendChild(square);
            }
        }
    }
}

function renderPieces() {
    const piecesContainer = document.getElementById("pieces-container");
    piecesContainer.innerHTML = "";
    for (let y = 0; y < pieces.length; y++) {
        for (let x = 0; x < pieces[y].length; x++) {
            const piece = document.createElement("div");
            piece.className = "piece";
            piece.id = `{"x":${x}, "y":${y}}`;
            if (pieces[y][x] == 1) {
                piece.classList.add("player-1");
                piecesContainer.appendChild(piece);
            } else if (pieces[y][x] == 2) {
                piece.classList.add("player-2");
                piecesContainer.appendChild(piece);
            } else {
                const blank = document.createElement("div");
                blank.className = "blank";
                blank.id = `{"x":${x}, "y":${y}}`;
                piecesContainer.appendChild(blank);
            }
        }
    }
}

function renderMoveIndicators() {
    let ps = Object.keys(moves);
    document.querySelectorAll(".blank").forEach(el => (el.innerHTML = ""));
    document.querySelectorAll(".piece").forEach(el => (el.innerHTML = ""));
    ps.forEach(p => {
        let pElement = document.getElementById(p);
        let marker = createMarkerEl();
        pElement.appendChild(marker);
    });
    if (selectedPiecePos) {
        moves[selectedPiecePos].forEach(m => {
            let mElement = document.getElementById(m[0]);
            let marker = createMarkerEl();
            mElement.appendChild(marker);
        });
    }
}

function createMarkerEl() {
    let marker = document.createElement("div");
    marker.className = "marker";
    activePlayer == 1
        ? (marker.style.backgroundColor = "black")
        : (marker.style.backgroundColor = "white");
    return marker;
}
