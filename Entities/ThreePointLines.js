export class ThreePointLines {
    constructor(x, y, radius) {
        this.pos = { x, y };
        this.radius = radius;
        this.color = "blue";
    }

    getState() {
        return {
            pos: this.pos,
            radius: this.radius,
            color: this.color
        }
    }
}