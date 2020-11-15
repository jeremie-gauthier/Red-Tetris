import { nanoid } from "nanoid";
import eventEmitter from "listeners";
import event from "listeners/events";

export const handlerSendMessage = async (
  socket,
  { message, sender, lobbyId },
) => {
  const messageObject = { id: nanoid(), message, sender };
  if (message && message.trim() !== "" && message.length <= 150) {
    eventEmitter.emit(event.message.new, {
      lobbyId,
      messageObject,
    });
  }
};
