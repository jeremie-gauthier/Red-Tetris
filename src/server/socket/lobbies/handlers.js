import Lobby from "models/lobby";
import { pushLobby, popLobby } from "storage/lobbies";
import { LOBBIES } from "../../../config/actions/lobbies";
import GROUP_DOMAIN, { GROUP } from "../../../config/actions/group";
import eventEmitter from "listeners";
import event from "listeners/events";

export const handlerAddLobby = async (socket, { name, maxPlayer, owner }) => {
  const lobby = new Lobby({ name, maxPlayer, owner });
  const response = await pushLobby(lobby, socket.id);
  socket.emit(LOBBIES.RESPONSE, response);

  if (response.type === "success") {
    socket.join(`${GROUP_DOMAIN}:lobby-${lobby.id}`);

    eventEmitter.emit(event.lobbies.change);
  }
};

export const handlerDeleteLobby = async (socket, { lobbyId, ownerId }) => {
  const response = await popLobby(lobbyId, ownerId);
  socket.emit(LOBBIES.RESPONSE, response);

  if (response.type === "success") {
    eventEmitter.emit(event.lobby.change, {
      lobbyId,
    });

    eventEmitter.emit(event.lobbies.change);
  }
};

export const handlerSubscribeLobbies = async (socket) => {
  socket.join(GROUP.LOBBIES);

  eventEmitter.emit(event.lobbies.subscribe, {
    socket,
  });
};

export const handlerUnsubscribeLobbies = async (socket) => {
  socket.leave(GROUP.LOBBIES);
};
