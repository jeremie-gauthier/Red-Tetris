import { nanoid } from "nanoid";

export default class Message {
  constructor({ message, sender }) {
    this.id = nanoid();
    this.message = message.trim();
    this.sender = sender;
  }
}
