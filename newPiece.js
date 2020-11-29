function newPiece(x, y, player) {
    return {
        x,
        y,
        player,
        type: "piece",
        isKing: false,
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
    };
}
