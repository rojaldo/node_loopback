class TetrisPiece {
    constructor(protected _shape: number[][], protected _color: string, protected _rotation: number = 0) {
     
    }

    rotate (): void {

        this._shape = this._shape[0].map((_, index) => this._shape.map(row => row[index]).reverse());
    }

    print (): void {
        console.log(this._shape.map(row => row.join(" ")).join("\n"));
    }
}

class LPiece extends TetrisPiece {
    constructor() {
        super([[0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 1, 0], [0, 0, 0, 0, 0]], "blue");
    }

    rotate(): void {
        super.rotate();
        this._rotation = (this._rotation + 1) % 4;
    }
}

class OPiece extends TetrisPiece {
    constructor() {
        super([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0]], "yellow");
    }

    rotate(): void {
        // O piece does not need to rotate
    }
}

class IPiece extends TetrisPiece {
    constructor() {
        super([[0, 0, 0, 0, 0], [0, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], "cyan");
    }

    rotate(): void {
        super.rotate();
        this._rotation = (this._rotation + 1) % 2;
    }
}

let piece = new LPiece();
piece.print();
piece.rotate();
console.log("After rotation:");
piece.print();