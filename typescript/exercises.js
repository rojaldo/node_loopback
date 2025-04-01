// import Set
// Una función que cuente la ocurrencia de un caracter en una cadena
function countCharacter(str, char) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] === char) {
            count++;
        }
    }
    return count;
}
var lambda_countCharacter = function (str, char) { return str.split('').filter(function (c) { return c === char; }).length; };
// Una función que obtenga el enésimo número más grande de un array
function nthLargest(arr, n) {
    var uniqueArr = arr;
    uniqueArr.sort(function (a, b) { return b - a; });
    return uniqueArr[n - 1];
}
var lambda_nthLargest = function (arr, n) { return arr.sort(function (a, b) { return b - a; })[n - 1]; };
// Implementar una lista doblemente enlazada
var MyNode = /** @class */ (function () {
    function MyNode(_data) {
        this._data = _data;
        this.next = null;
        this.prev = null;
    }
    Object.defineProperty(MyNode.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    return MyNode;
}());
var MyLinkedList = /** @class */ (function () {
    function MyLinkedList() {
        this.head = null;
        this.tail = null;
    }
    MyLinkedList.prototype.add = function (data) {
        var newNode = new MyNode(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        }
        else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    };
    MyLinkedList.prototype.display = function () {
        var current = this.head;
        while (current) {
            console.log(current.data);
            current = current.next;
        }
    };
    return MyLinkedList;
}());
var myList = new MyLinkedList();
myList.add(1);
myList.add(2);
myList.add(3);
myList.display(); // 1, 2, 3
