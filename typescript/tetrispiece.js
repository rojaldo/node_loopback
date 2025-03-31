var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TetrisPiece = /** @class */ (function () {
    function TetrisPiece(_shape, _color, _rotation) {
        if (_rotation === void 0) { _rotation = 0; }
        this._shape = _shape;
        this._color = _color;
        this._rotation = _rotation;
    }
    TetrisPiece.prototype.rotate = function () {
        var _this = this;
        this._shape = this._shape[0].map(function (_, index) { return _this._shape.map(function (row) { return row[index]; }).reverse(); });
    };
    TetrisPiece.prototype.print = function () {
        console.log(this._shape.map(function (row) { return row.join(" "); }).join("\n"));
    };
    return TetrisPiece;
}());
var LPiece = /** @class */ (function (_super) {
    __extends(LPiece, _super);
    function LPiece() {
        return _super.call(this, [[0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 1, 0], [0, 0, 0, 0, 0]], "blue") || this;
    }
    LPiece.prototype.rotate = function () {
        _super.prototype.rotate.call(this);
        this._rotation = (this._rotation + 1) % 4;
    };
    return LPiece;
}(TetrisPiece));
var OPiece = /** @class */ (function (_super) {
    __extends(OPiece, _super);
    function OPiece() {
        return _super.call(this, [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0]], "yellow") || this;
    }
    OPiece.prototype.rotate = function () {
        // O piece does not need to rotate
    };
    return OPiece;
}(TetrisPiece));
var IPiece = /** @class */ (function (_super) {
    __extends(IPiece, _super);
    function IPiece() {
        return _super.call(this, [[0, 0, 0, 0, 0], [0, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], "cyan") || this;
    }
    IPiece.prototype.rotate = function () {
        _super.prototype.rotate.call(this);
        this._rotation = (this._rotation + 1) % 2;
    };
    return IPiece;
}(TetrisPiece));
var piece = new LPiece();
piece.print();
piece.rotate();
console.log("After rotation:");
piece.print();
