export class Player {
    constructor(id, name, x, y, team, color) {
        this.id = id;
        this.name = name;
        this.pos = { x, y, z: 0 };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.aim = { x: 0, y: 0 };
        this.hands = {
            right: { x: 0, y: 0 },
            left: { x: 0, y: 0 },
        }
        this.hasBall = false;
        this.hasShot = false;
        this.lastShotTime = 0;
        this.team = team;
        this.radius = 12;
        this.mass = 1.2;
        this.color = color;
    }

    applyForce(force) {
        this.acc.x += force.x / this.mass;
        this.acc.y += force.y / this.mass;
    }

    isTouching(ball) {
        const dx = ball.pos.x - this.pos.x;
        const dy = ball.pos.y - this.pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return false;

        return dist < ball.radius + this.radius
    }

    update(court, ball) {
        this.handleMovement();
        this.handleEdges(court);
        
        if (this.isTouching(ball)) {
            const now = Date.now();
            const cooldown = 500;

            if (now - this.lastShotTime > cooldown) {
                this.hasBall = true;
            }
        }

        if (this.hasBall) {
            ball.follow(this);
        }

        if (this.hasBall && this.hasShot) {
            this.handleShooting(ball);
            this.hasBall = false;
            this.hasShot = false;
        }
    }

    handleMovement() {
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        if (this.pos.z === 0) {
            this.vel.x *= 0.8;
            this.vel.y *= 0.8;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.acc.x = 0;
        this.acc.y = 0;
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

    handleShooting(ball) {
        this.lastShotTime = Date.now();

        const dx = this.aim.x - this.pos.x;
        const dy = this.aim.y - this.pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;

        const strength = Math.min(dist * 0.6, 30);
        const force = {
            x: (dx / dist) * strength,
            y: (dy / dist) * strength
        };

        ball.vel.z = Math.min(dist * 0.3, 15);
        ball.applyForce(force);
    }

    getState() {
        return {
            name: this.name,
            pos: this.pos,
            hands: this.hands,
            team: this.team,
            radius: this.radius,
            color: this.color
        };
    }
}
