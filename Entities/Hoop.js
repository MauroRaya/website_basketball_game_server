export class Hoop {
    constructor(x, y) {
        this.pos = { x, y, z: 15 }
        this.radius = 16;
        this.color = "orange";
    }

    getState() {
        return {
            pos: this.pos,
            radius: this.radius,
            color: this.color
        }
    }
}