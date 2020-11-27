function newPiece(player) {
    return {
        player,
        type: "piece",
        king: false,
        moves: [],
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
        }
    };
}
