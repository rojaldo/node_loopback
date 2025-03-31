let student = {
    name: "John Doe",
    age: 20,
    major: "Computer Science"
}


class Person implements PersonInterface {
    constructor(protected _name: string, protected _age: number) {
}
}

class Student extends Person {

    public readonly goodAt = "Math";

    constructor(_name: string, _age: number, private _major: string) {
        super(_name, _age);
        this._major = _major;
    }

    public getDetails(): string {
        return `${this.name}, ${this.age} years old, Major: ${this.major}`;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get age(): number {
        return this._age;
    }

    set age(age: number) {
        if (age < 0) {
            return;
        }
        this._age = age;
    }

    get major(): string {
        return this._major;
    }

    set major(major: string) {
        this._major = major;
    }
}

let student1 = new Student("Jane Doe", 22, "Mathematics");
console.log(student1.getDetails());
student1.age = 23;
console.log(student1.getDetails());
student1.age = -5; // Invalid age, won't change
console.log(student1.getDetails());
