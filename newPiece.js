function newPiece(x, y, player) {
    return {
        x,
        y,
        player,
        type: "piece",
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
        get isKing() {
            return (y == 0 && this.player == "1") ||
                (y == 7 && this.player == "2")
                ? true
                : false;
        },
        get paths() {
            return this.king ? this._paths.king : this._paths[this.player];
        },
    };
}
