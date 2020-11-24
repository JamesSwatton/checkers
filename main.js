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
    king: [this["1"], this["2"]]
};

const pieces = [...layout];

// player related data
let activePlayer = 1;
let selectedPiecePos = {};
let selectedMovePos = {};
let selectedPiece = () => {
    return selectedPiecePos
        ? pieces[selectedPiecePos.y][selectedPiecePos.x]
        : null;
};
let moves = {
    moves: [],
    captureMoves: []
};

renderBoard();
renderPieces();

// event listeners
document.querySelector("#pieces-container").addEventListener("click", event => {
    selectedPiecePos = JSON.parse(event.target.getAttribute("position"));
});

// movement
function getMoves() {
    let moves = {};
    let playerPaths = paths[`${activePlayer}`];
    console.log(playerPaths);
    for (let y = 0; y < pieces.length; y++) {
        for (let x = 0; x < pieces[y].length; x++) {
            if (pieces[y][x] == activePlayer) {
                // get moves
                moves.forEach(move => {
                    let piecesAtMovePos = pieces[move.y][move.x];
                    let newMove = [];
                    if (piecesAtMovePos != undefined) {
                        if (piecesAtMovePos == 0) {
                            newMove.push({ x: x, y: y });
                            newMove.push({ x: x, y: y });
                        }
                    }
                });
            }
        }
    }
}

function movePiece(selectedPiecePos, selectedMovePos) {
    pieces[selectedMovePos.y][selectedMovePos.x] = activePlayer;
    pieces[selectedPiecePos.y][selectedPiecePos.x] = 0;
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
            piece.setAttribute("position", `{"x":${x}, "y":${y}}`);
            if (pieces[y][x] == 1) {
                piece.classList.add("player-1");
                piecesContainer.appendChild(piece);
            } else if (pieces[y][x] == 2) {
                piece.classList.add("player-2");
                piecesContainer.appendChild(piece);
            } else {
                const blank = document.createElement("div");
                blank.className = "blank";
                blank.setAttribute("position", `{"x":${x}, "y":${y}}`);
                piecesContainer.appendChild(blank);
            }
        }
    }
}
