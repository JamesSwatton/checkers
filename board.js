const Board = {
    layout: [
        "20202020",
        "02020202",
        "20202020",
        "00000000",
        "00000000",
        "01010101",
        "10101010",
        "01010101"
    ],

    pieces: [],

    // SETUP
    setup() {
        this.createPieces();
        this.renderBoard();
        this.renderPieces();
    },

    createPieces() {
        for (let y of this.layout) {
            let r = [];
            for (let x of y) {
                x == "0" ? r.push({ type: "blank" }) : r.push(newPiece(x));
            }
            this.pieces.push(r);
        }
    },

    calcMoves() {},

    // RENDERING
    renderBoard() {
        const bc = document.getElementById("board-container");
        for (let i = 0; i < this.layout.length; i++) {
            for (let j = 0; j < this.layout[i].split("").length; j++) {
                const s = document.createElement("div");
                if ((i + j) % 2 == 0) {
                    s.classList.add("dark");
                    bc.appendChild(s);
                } else {
                    s.classList.add("light");
                    bc.appendChild(s);
                }
            }
        }
    },

    renderPieces() {
        const pc = document.getElementById("pieces-container");
        pc.innerHTML = "";
        for (let y = 0; y < this.pieces.length; y++) {
            for (let x = 0; x < this.pieces[y].length; x++) {
                let p = this.pieces[y][x];
                const pEl = document.createElement("div");
                pEl.className = "piece";
                pEl.id = `{"x":${x}, "y":${y}}`;
                if (p.player == "1") {
                    pEl.classList.add("player-1");
                    pc.appendChild(pEl);
                } else if (p.player == "2") {
                    pEl.classList.add("player-2");
                    pc.appendChild(pEl);
                } else {
                    const b = document.createElement("div");
                    b.className = "blank";
                    b.id = `{"x":${x}, "y":${y}}`;
                    pc.appendChild(b);
                }
            }
        }
    }
};
