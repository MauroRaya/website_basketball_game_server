import { randomUUID } from "crypto";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const players = new Map();

class Player {
    constructor(id, x, y) {
        this.id = id;
        this.pos = { x, y, z: 0 };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.aim = { x: 0, y: 0 };
        this.mass = 1;
    }

    applyAcceleration(force) {
        this.acc.x += force.x / this.mass;
        this.acc.y += force.y / this.mass;
    }

    update() {
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

    getState() {
        return {
            id: this.id,
            pos: this.pos,
            aim: this.aim
        };
    }
}

wss.on("connection", (socket) => {
    const id = randomUUID();
    players.set(id, new Player(id, 300, 400));

    console.log(`🟢 Player connected: ${id}`);
    socket.send(JSON.stringify({ type: "init", payload: id }));

    socket.on("message", (message) => {
        try {
            const { type, payload } = JSON.parse(message);

            if (type === "state") {
                const player = players.get(payload.id);
                if (!player) return;

                const { dir, aim } = payload;

                const speedMag = 1.5;
                const force = {
                    x: dir.x * speedMag,
                    y: dir.y * speedMag
                };

                player.applyAcceleration(force);
                player.aim = aim;
            }
        } catch (e) {
            console.error("Bad message:", message);
        }
    });

    socket.on("close", () => {
        players.delete(id);
        console.log(`🔴 Player disconnected: ${id}`);
    });
});

setInterval(() => {
    const state = [];

    players.forEach((player) => {
        player.update();
        state.push(player.getState());
    });

    const message = JSON.stringify({ type: "state", payload: state });

    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
}, 1000 / 60);

console.log("🚀 Server running on ws://localhost:8080");
