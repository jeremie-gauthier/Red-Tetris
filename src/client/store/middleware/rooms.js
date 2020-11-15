import { LOBBY } from "../../../config/actions/lobby";
import { LOBBIES } from "../../../config/actions/lobbies";
import { MESSAGE } from "../../../config/actions/message";
import { PLAYERS } from "../../../config/actions/players";

import {
  setPlayers,
  setLobbies,
  setLobbiesResponse,
  setLobby,
  setLobbyResponse,
  addMessage,
  resetMessages,
  setGameStarted,
} from "actions/store";

export function setupSocketRooms(socket, dispatch) {
  socket.on(LOBBIES.PUBLISH, (data) => {
    dispatch(setLobbies(data));
  });

  socket.on(LOBBIES.RESPONSE, (data) => {
    dispatch(setLobbiesResponse(data));
  });

  socket.on(LOBBY.RESPONSE, (data) => {
    dispatch(setLobbyResponse(data));
  });

  socket.on(LOBBY.PUBLISH, (data) => {
    dispatch(setLobby(data));
  });

  socket.on(LOBBY.STARTED, (data) => {
    dispatch(setGameStarted(data));
  });

  socket.on(PLAYERS.PUBLISH, (data) => {
    dispatch(setPlayers(data));
  });

  socket.on(LOBBY.KICKED, () => {
    dispatch(setLobby({}));
    dispatch(resetMessages());
  });

  socket.on(MESSAGE.PUBLISH, (data) => {
    dispatch(addMessage(data));
  });
}
