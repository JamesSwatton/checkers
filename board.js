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

    testLayout: [
        "20202020",
        "02020202",
        "20202020",
        "00000000",
        "00001000",
        "01010001",
        "10101010",
        "01010101"
    ],

    _pieces: [],

    get pieces() {
        return this._pieces;
    },

    // SETUP
    setup() {
        this.createPieces();
        this.calcMoves();
        this.renderBoard();
        this.renderPieces();
    },

    createPieces() {
        let layout = this.layout;
        layout.forEach((row, i) => {
            let r = [];
            row.split("").forEach((el, j) => {
                el == "0"
                    ? r.push({ type: "blank" })
                    : r.push(newPiece(j, i, el));
            });
            this._pieces.push(r);
        });
    },

    calcMoves() {
        this._pieces.forEach((row, y) => {
            row.forEach((p, x) => {
                if (p.type == "piece") p.clearMoves();
                if (p.player == activePlayer) {
                    p.paths.forEach(path => {
                        if (
                            // check for std move
                            this.pathIsInBoard(x, y, path) &&
                            this._pieces[y - path.y][x - path.x].type == "blank"
                        ) {
                            console.log("see me");
                            canMove = true;
                            p.moves = `{"x":${x - path.x},"y":${y - path.y}}`;
                        } else if (
                            // check for capture move
                            this.pathIsInBoard(x, y, path) &&
                            this.pathIsInBoard(x - path.x, y - path.y, path) &&
                            this._pieces[y - path.y][x - path.x].player ==
                                opponent &&
                            this._pieces[y - path.y * 2][x - path.x * 2].type ==
                                "blank"
                        ) {
                            canCapture = true;
                            p.moves = [
                                `{"x":${x - path.x},"y":${y - path.y}}`,
                                `{"x":${x - path.x * 2},"y":${y - path.y * 2}}`
                            ];
                        }
                    });
                }
            });
        });
    },

    // MOVEMENT
    movePiece(move) {
        let [p, m] = move;
        console.log("hi");
        this._pieces[m.y][m.x] = this._pieces[p.y][p.x];
        this._pieces[p.y][p.x] = { type: "blank" };
    },

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
        for (let y = 0; y < this._pieces.length; y++) {
            for (let x = 0; x < this._pieces[y].length; x++) {
                let p = this._pieces[y][x];
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
    },

    // HELPERS
    pathIsInBoard(x, y, path) {
        if (
            x - path.x >= 0 &&
            x - path.x < 8 &&
            y - path.y >= 0 &&
            y - path.y < 8
        ) {
            return true;
        }
    },

    prepNextTurn() {
        this.calcMoves();
        this.renderPieces();
    }
};
