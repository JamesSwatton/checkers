const layout = [
    "20202020",
    "02020202",
    "20202020",
    "00000000",
    "00000000",
    "01010101",
    "10101010",
    "01010101"
];

const pieces = [...layout];
let selectedPiecePos = {};
let selectedMovePos = {};
let selectedPiece = () => {
    return selectedPiecePos
        ? pieces[selectedPiecePos.y][selectedPiecePos.x]
        : null;
};
let activePlayer = 1;

renderBoard();
renderPieces();

// event listeners
const p = document.querySelectorAll(".piece");
p.forEach(piece => {
    piece.addEventListener("click", event => {
        selectedPiecePos = JSON.parse(event.target.getAttribute("position"));
        console.log(selectedPiecePos);
        console.log(selectedPiece());
    });
});

const b = document.querySelectorAll(".blank");
console.log(b);
b.forEach(blank => {
    blank.addEventListener("click", event => {
        selectedMovePos = JSON.parse(event.target.getAttribute("position"));
        console.log(selectedMovePos);
    });
});

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
