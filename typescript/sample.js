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
var student = {
    name: "John Doe",
    age: 20,
    major: "Computer Science"
};
var Person = /** @class */ (function () {
    function Person(_name, _age) {
        this._name = _name;
        this._age = _age;
    }
    return Person;
}());
var Student = /** @class */ (function (_super) {
    __extends(Student, _super);
    function Student(_name, _age, _major) {
        var _this = _super.call(this, _name, _age) || this;
        _this._major = _major;
        _this.goodAt = "Math";
        _this._major = _major;
        return _this;
    }
    Student.prototype.getDetails = function () {
        return "".concat(this.name, ", ").concat(this.age, " years old, Major: ").concat(this.major);
    };
    Object.defineProperty(Student.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Student.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (age) {
            if (age < 0) {
                return;
            }
            this._age = age;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Student.prototype, "major", {
        get: function () {
            return this._major;
        },
        set: function (major) {
            this._major = major;
        },
        enumerable: false,
        configurable: true
    });
    return Student;
}(Person));
var student1 = new Student("Jane Doe", 22, "Mathematics");
console.log(student1.getDetails());
student1.age = 23;
console.log(student1.getDetails());
student1.age = -5; // Invalid age, won't change
console.log(student1.getDetails());
