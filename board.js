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

    canCapture: false,

    canMove: false,

    _possibleMoves: {
        std: {},
        capture: {}
    },

    get possibleMoves() {
        return this._possibleMoves.capture.length > 0
            ? this._possibleMoves.capture
            : this._possibleMoves.std;
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
                if (p.player == activePlayer) {
                    // set key in possible moves
                    let pKey = `{"x":${x},"y":${y}}`;
                    this._possibleMoves.std[pKey] = [];
                    this._possibleMoves.capture[pKey] = [];
                    p.paths.forEach(path => {
                        if (
                            // check for std move
                            this.pathIsInBoard(x, y, path) &&
                            this._pieces[y - path.y][x - path.x].type == "blank"
                        ) {
                            this.canMove = true;
                            this._possibleMoves.std[pKey].push(
                                `{"x":${x - path.x},"y":${y - path.y}}`
                            );
                        } else if (
                            // check for capture move
                            this.pathIsInBoard(x, y, path) &&
                            this.pathIsInBoard(x - path.x, y - path.y, path) &&
                            this._pieces[y - path.y][x - path.x].player ==
                                opponent &&
                            this._pieces[y - path.y * 2][x - path.x * 2].type ==
                                "blank"
                        ) {
                            this.canCapture = true;
                            this._possibleMoves.capture[pKey].push([
                                `{"x":${x - path.x},"y":${y - path.y}}`,
                                `{"x":${x - path.x * 2},"y":${y - path.y * 2}}`
                            ]);
                        }
                    });
                    if (this.possibleMoves[pKey].length == 0) {
                        delete this.possibleMoves[pKey];
                    }
                }
            });
        });
        console.log(this.possibleMoves);
    },

    // MOVEMENT
    movePiece(move) {
        let [p, m] = move;
        let selP = this.getPiece(p);
        if (this.isValidMove(move)) {
            // remove opponent piece if catpuring
            if (selP.canCapture) {
                selP.moves.forEach(mv => {
                    if (mv.includes(JSON.stringify(m))) {
                        let targCoor = JSON.parse(mv[0]);
                        this._pieces[targCoor.y][targCoor.x] = {
                            type: "blank"
                        };
                    }
                });
            }
            this._pieces[m.y][m.x] = this._pieces[p.y][p.x];
            this._pieces[m.y][m.x].x = m.x;
            this._pieces[m.y][m.x].y = m.y;
            this._pieces[p.y][p.x] = { type: "blank" };
            return true;
        }
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
                pEl.id = `{"x":${x},"y":${y}}`;
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

    renderMoveIndicators() {
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
    },

    // HELPERS
    getPiece(coor) {
        return this._pieces[coor.y][coor.x];
    },

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

    isValidMove(move) {
        let [p, m] = move;
        let selP = this.getPiece(p);
        // console.log(JSON.stringify(m));
        console.log(`can move: ${this.canMove}`);
        console.log(`can capture: ${this.canCapture}`);
        // console.log(`selP can move: ${selP.canMove}`);
        // console.log(`selP moves: ${selP.moves}`);
        // console.log(
        //     `selP m in moves: ${selP.moves.includes(JSON.stringify(m))}`
        // );
        console.log(this._pieces);
        if (
            this.canCapture &&
            selP.canCapture &&
            selP.moves.map(mv => mv[1]).includes(JSON.stringify(m))
        ) {
            console.log("valid capture move");
            return true;
        } else if (
            !this.canCapture &&
            this.canMove &&
            selP.canMove &&
            selP.moves.includes(JSON.stringify(m))
        ) {
            console.log("valid move");
            return true;
        } else {
            console.log("invalid move");
            return false;
        }
    },

    prepNextTurn() {
        this._possibleMoves = { std: {}, capture: {} };
        this.canCapture = false;
        this.canMove = false;
        this.calcMoves();
        this.renderPieces();
    }
};
