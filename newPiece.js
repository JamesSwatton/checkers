function newPiece(x, y, player) {
    return {
        x,
        y,
        player,
        type: "piece",
        king: false,
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
        get paths() {
            return this.king ? this._paths.king : this._paths[this.player];
        },
        get moves() {
            if (this._moves.capture.length > 0) {
                return this._moves.capture;
            } else if (this._moves.std.length > 0) {
                return this._moves.std;
            } else {
                return null;
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
