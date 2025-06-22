import * as State from './state.js';
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
  let id = null;

  socket.on("message", (message) => {
    try {
      const parsed = JSON.parse(message);
      if (!parsed) throw new Error("Invalid JSON");

      const { type, payload } = parsed;

      if (type === "join") {
        const name = payload;
        if (!name || typeof name !== "string") {
          throw new Error("Join payload must be a string name");
        }

        id = State.addPlayer(name);
        socket.send(JSON.stringify({ type: "init", payload: id }));
        console.log(`🟢 Player connected: ${id} (${name})`);
      }

      if (type === "state") {
        if (!id) throw new Error("Player has not joined yet");

        const requiredFields = ["id", "dir", "mouse"];
        requiredFields.forEach(field => {
          if (!payload.hasOwnProperty(field)) {
            throw new Error(`Payload missing required field: ${field}`);
          }
        });

        State.applyInput(id, payload);
      }
    } catch (err) {
      console.error(`❌ ${err.message}`);
    }
  });

  socket.on("close", () => {
    if (id) {
      State.deletePlayer(id);
      console.log(`🔴 Player disconnected: ${id}`);
    }
  });
});

setInterval(() => {
  State.step();
  const payload = State.getState();
  const message = JSON.stringify({ type: "state", payload });

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}, 1000 / 60);

console.log("🚀 Server running on ws://localhost:8080");