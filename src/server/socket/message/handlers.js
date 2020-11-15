import { nanoid } from "nanoid";
import eventEmitter from "listeners";
import event from "listeners/events";

export const handlerSendMessage = async (
  socket,
  { message, sender, lobbyId },
) => {
  if (message && message.trim() !== "" && message.length <= 150) {
    const messageObject = { id: nanoid(), message, sender };
    eventEmitter.emit(event.message.new, {
      lobbyId,
      messageObject,
    });
  }
};
