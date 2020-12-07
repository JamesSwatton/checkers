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
        "20202010",
        "02020202",
        "20202020",
        "00000000",
        "00000000",
        "01010101",
        "10101010",
        "01020101"
    ],

    _pieces: [],

    get pieces() {
        return this._pieces;
    },

    _selectedPieceCoor: "",

    set selectedPieceCoor(coor) {
        this._selectedPieceCoor = coor;
    },

    _canCapture: false,

    get canCapture() {
        return Object.keys(this._possibleMoves.capture).length > 0
            ? true
            : false;
    },

    _canMove: false,

    get canMove() {
        return !this.canCapture &&
            Object.keys(this._possibleMoves.std).length > 0
            ? true
            : false;
    },

    _possibleMoves: {
        std: {},
        capture: {}
    },

    get possibleMoves() {
        return Object.keys(this._possibleMoves.capture).length > 0
            ? this._possibleMoves.capture
            : this._possibleMoves.std;
    },

    // SETUP
    setup() {
        this.createPieces();
        this.calcMoves();
        this.renderBoard();
        this.renderPieces();
        this.renderMoveIndicators();
    },

    createPieces() {
        let layout = this.layout;
        layout.forEach((row, y) => {
            let r = [];
            row.split("").forEach((el, x) => {
                el == "0"
                    ? r.push({ type: "blank" })
                    : r.push(newPiece({ x: x, y: y }, el));
            });
            this._pieces.push(r);
        });
    },

    calcMoves() {
        this._pieces.forEach((row, y) => {
            row.forEach((p, x) => {
                if (p.player == activePlayer) {
                    // set key in possible moves
                    p.paths.forEach(path => {
                        if (
                            // check for std move
                            this.pathIsInBoard(x, y, path) &&
                            this._pieces[y - path.y][x - path.x].type == "blank"
                        ) {
                            this.addPiece(`{"x":${x},"y":${y}}`, "std", [
                                `{"x":${x - path.x},"y":${y - path.y}}`
                            ]);
                        } else if (
                            // check for capture move
                            this.pathIsInBoard(x, y, path) &&
                            this.pathIsInBoard(x - path.x, y - path.y, path) &&
                            this._pieces[y - path.y][x - path.x].player ==
                                opponent &&
                            this._pieces[y - path.y * 2][x - path.x * 2].type ==
                                "blank"
                        ) {
                            this.addPiece(`{"x":${x},"y":${y}}`, "capture", [
                                `{"x":${x - path.x * 2},"y":${y - path.y * 2}}`,
                                `{"x":${x - path.x},"y":${y - path.y}}`
                            ]);
                        }
                    });
                }
            });
        });
        // console.log(this.pieces)
    },

    // MOVEMENT
    movePiece(move) {
        let [p, m] = move;
        let parsedP = JSON.parse(p);
        let parsedM = JSON.parse(m);
        if (this.isValidMove(move)) {
            // remove opponent piece if catpuring
            if (this.canCapture) {
                this.possibleMoves[p].forEach(mv => {
                    if (mv.includes(m)) {
                        let targCoor = JSON.parse(mv[1]);
                        this._pieces[targCoor.y][targCoor.x] = {
                            type: "blank"
                        };
                    }
                });
            }
            this._pieces[parsedM.y][parsedM.x] = this._pieces[parsedP.y][
                parsedP.x
            ];
            this._pieces[parsedM.y][parsedM.x].pos = {
                x: parsedM.x,
                y: parsedM.y
            };
            this._pieces[parsedP.y][parsedP.x] = { type: "blank" };
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
                } else if (p.player == "2") {
                    pEl.classList.add("player-2");
                } else {
                    pEl.className = "blank";
                }
                if (p.player && p.isKing) {
                    pEl.appendChild(this.createEl("div", { class: "king" }));
                }
                pc.appendChild(pEl);
            }
        }
    },

    renderMoveIndicators() {
        let ps = Object.keys(this.possibleMoves);
        document.querySelectorAll(".blank").forEach(el => (el.innerHTML = ""));
        document.querySelectorAll(".marker").forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        let getStyle = () =>
            activePlayer == "1"
                ? "background-color: black"
                : "background-color: white";
        ps.forEach(p => {
            let pElement = document.getElementById(p);
            let marker = this.createEl("div", {
                class: "marker",
                style: "background-color: #dc4c38"
            });
            if (p == this._selectedPieceCoor) {
                marker = this.createEl("div", {
                    class: "marker",
                    style: `${getStyle()}`
                });
            }
            pElement.appendChild(marker);
        });
        if (Object.keys(this.possibleMoves).includes(this._selectedPieceCoor)) {
            this.possibleMoves[this._selectedPieceCoor].forEach(m => {
                let mElement = document.getElementById(m[0]);
                let marker = this.createEl("div", {
                    class: "marker",
                    style: `${getStyle()}`
                });
                mElement.appendChild(marker);
            });
        }
    },

    createEl(name, attrs) {
        let el = document.createElement(name);
        for (attr in attrs) {
            el.setAttribute(attr, attrs[attr]);
        }
        return el;
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

    addPiece(key, type, arr) {
        if (typeof this._possibleMoves[type][key] == "object") {
            this._possibleMoves[type][key].push(arr);
        } else {
            this._possibleMoves[type][key] = [];
            this._possibleMoves[type][key].push(arr);
        }
    },

    isValidMove(move) {
        let [p, m] = move;
        return Object.keys(this.possibleMoves).includes(p) &&
            this.possibleMoves[p].map(mv => mv[0]).includes(m)
            ? true
            : false;
    },

    prepNextTurn() {
        this._selectedPieceCoor = "";
        this._possibleMoves = { std: {}, capture: {} };
        this.calcMoves();
        this.renderPieces();
        this.renderMoveIndicators();
    }
};
