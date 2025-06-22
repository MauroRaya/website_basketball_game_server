import { randomUUID } from "crypto";
import { Ball } from "./Entities/Ball.js";
import { Court } from "./Entities/Court.js";
import { Player } from "./Entities/Player.js";

const court = new Court(600, 800);
const ball = new Ball(court.width / 2, court.height / 2);
const players = new Map();
const teamCounts = {
  A: { players: 0, score: 0 },
  B: { players: 0, score: 0 }
};

export const addPlayer = (name) => {
  const id = randomUUID();

  const team = teamCounts.A.players < teamCounts.B.players ? "A" : "B";
  const spawnX = court.width / 2;
  const spawnY = team == "A" ? court.height * 0.25 : court.height * 0.75;
  const color = team == "A" ? "blue" : "red";

  players.set(id, new Player(id, name, spawnX, spawnY, team, color));
  teamCounts[team]++;

  return id;
}

export const deletePlayer = (id) => {
  const player = players.get(id);
  if (player) {
    teamCounts[player.team].players--;
    players.delete(id);
  }
}

export const applyInput = (id, input) => {
  const player = players.get(id);
  if (!player) return;

  const dist = 1.5;
  const force = {
    x: input.dir.x * dist,
    y: input.dir.y * dist
  };

  player.applyForce(force);

  player.aim = input.mouse.pos;
  player.hasShot = input.mouse.isDown;
};


export const getState = () => {
  const playersObj = {};
  players.forEach((player, id) => {
    playersObj[id] = player.getState();
  });

  return {
    court: court.getState(),
    ball: ball.getState(),
    players: playersObj
  };
};

export const step = () => { 
  players.forEach(player => player.update(court, ball));
  ball.update(court);
};