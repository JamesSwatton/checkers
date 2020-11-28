function newPiece(x, y, player) {
    return {
        x,
        y,
        player,
        type: "piece",
        _moves: {
            std: [],
            capture: []
        },
        _paths: {
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
        },
        get canCapture() {
            return this._moves.capture.length > 0;
        },
        get canMove() {
            return this._moves.std.length > 0;
        },
        get isKing() {
            return (y == 0 && this.player == "1") ||
                (y == 7 && this.player == "2")
                ? true
                : false;
        },
        get paths() {
            return this.king ? this._paths.king : this._paths[this.player];
        },
        get moves() {
            if (this._moves.capture.length > 0) {
                return this._moves.capture;
            } else {
                return this._moves.std;
            }
        },
        set moves(m) {
            typeof m == "object"
                ? this._moves.capture.push(m)
                : this._moves.std.push(m);
        },
        clearMoves() {
            this._moves.std = [];
            this._moves.capture = [];
        }
    };
}
