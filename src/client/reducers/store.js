import {
  SET_PLAYER,
  SET_PLAYER_RESPONSE,
  SET_PLAYERS,
  SET_LOBBIES,
  SET_LOBBY,
  SET_LOBBY_RESPONSE,
  SET_LOBBIES_RESPONSE,
  ADD_MESSAGE,
  RESET_MESSAGES,
  SET_GAME_STARTED,
  SET_PANIC,
} from "actions/store";

export const initialState = {
  player: {},
  playerResponse: {},
  players: {},
  lobbies: {},
  lobbiesResponse: {},
  lobby: {},
  lobbyResponse: {},
  messages: [],
  game: {},
  panic: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYER_RESPONSE:
      return { ...state, playerResponse: action.playerResponse };
    case SET_PLAYER:
      return { ...state, player: action.player };
    case SET_PLAYERS:
      return { ...state, players: action.players };
    case SET_LOBBIES:
      return { ...state, lobbies: action.lobbies };
    case SET_LOBBY:
      return { ...state, lobby: action.lobby };
    case SET_LOBBY_RESPONSE:
      return { ...state, lobbyResponse: action.lobbyResponse };
    case SET_LOBBIES_RESPONSE:
      return { ...state, lobbiesResponse: action.lobbiesResponse };
    case ADD_MESSAGE:
      const allMessages = [...state.messages, action.message];
      const newMessages = allMessages.slice(
        Math.max(allMessages.length - 50, 0),
      );
      return {
        ...state,
        messages: newMessages,
      };
    case RESET_MESSAGES:
      return { ...state, messages: [] };
    case SET_GAME_STARTED:
      return { ...state, game: action.game };
    case SET_PANIC:
      return { ...state, panic: true };
    default:
      return state;
  }
}
