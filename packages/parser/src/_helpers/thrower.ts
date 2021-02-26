export class Thrower {
    line = 0;

    constructor(public name: string, public message: [string, number][]) {
    }

    addLine(num: number) {
        this.line = num;
    }
}
