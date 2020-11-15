import { nanoid } from "nanoid";

export default class Lobby {
  constructor({ name, maxPlayer, owner }) {
    this.id = nanoid();
    this.name = name;
    this.maxPlayer = maxPlayer;
    this.isPlaying = false;
    this.players = [];
    this.owner = owner;
  }
}
