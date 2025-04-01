// import Set


// Una función que cuente la ocurrencia de un caracter en una cadena

function countCharacter(str: string, char: string): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) {
            count++;
        }
    }
    return count;
}

const lambda_countCharacter = (str: string, char: string): number => str.split('').filter(c => c === char).length;

// Una función que obtenga el enésimo número más grande de un array

function nthLargest(arr: number[], n: number): number {
    const uniqueArr = arr
    uniqueArr.sort((a, b) => b - a);
    return uniqueArr[n - 1];
}

const lambda_nthLargest = (arr: number[], n: number): number => arr.sort((a, b) => b - a)[n - 1];

// Implementar una lista doblemente enlazada

class MyNode<T> {
    public next: MyNode<T> | null = null;
    public prev: MyNode<T> | null = null;
    constructor(private _data: T) {}

    get data(): T {
        return this._data;
    }

}

class MyLinkedList<T> {
    private head: MyNode<T> | null = null;
    private tail: MyNode<T> | null = null;

    add(data: T): void {
        const newNode = new MyNode(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    display(): void {
        let current = this.head;
        while (current) {
            console.log(current.data);
            current = current.next;
        }
    }
}

const myList = new MyLinkedList<number>();
myList.add(1);
myList.add(2);
myList.add(3);
myList.display(); // 1, 2, 3