function newPiece(id, pos, player) {
    return {
        id,
        pos,
        player,
        type: "piece",
        _isKing: false,
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
                return [...this["1"], ...this["2"]];
            }
        },
        get paths() {
            return this.isKing ? this._paths.king : this._paths[this.player];
        },

        get isKing() {
            if (this._isKing) {
                return true;
            } else if (
                (this.player == "1" && this.pos.y == 0) ||
                (this.player == "2" && this.pos.y == 7)
            ) {
                this._isKing = true;
                return this._isKing;
            } else {
                return false;
            }
        }
    };
}
