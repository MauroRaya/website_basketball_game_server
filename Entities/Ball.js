export class Ball {
    constructor(x, y) {
        this.pos = { x, y, z: 0 };
        this.vel = { x: 0, y: 0, z: 0 };
        this.acc = { x: 0, y: 0, z: 0 };
        this.radius = 10;
        this.mass = 1;
        this.color = "orange";
    }

    applyForce(force) {
        this.acc.x += force.x / this.mass;
        this.acc.y += force.y / this.mass;
    }

    update(court) {
        this.handleMovement();
        this.handleEdges(court);
    }

    handleMovement() {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.vel.z += this.acc.z - 1.5;

        this.vel.x *= 0.9;
        this.vel.y *= 0.9;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.z += this.vel.z;

        if (this.pos.z < 0) {
            this.pos.z = 0;
            this.vel.z *= -0.5;
        }

        this.acc.x = 0;
        this.acc.y = 0;
        this.acc.z = 0;
    }

    
    handleEdges(court) {
        const r = this.radius;

        if (this.pos.x < r) {
            this.pos.x = r;
            this.vel.x *= -0.5;
        } else if (this.pos.x > court.width - r) {
            this.pos.x = court.width - r;
            this.vel.x *= -0.5;
        }

        if (this.pos.y < r) {
            this.pos.y = r;
            this.vel.y *= -0.5;
        } else if (this.pos.y > court.height - r) {
            this.pos.y = court.height - r;
            this.vel.y *= -0.5;
        }
    }

    follow(player) {
        this.pos.x = player.pos.x + 15;
        this.pos.y = player.pos.y;
    }

    getState() {
        return {
            pos: this.pos,
            radius: this.radius,
            color: this.color
        };
    }
}