import redismock from "redis-mock";
import { quitRedis, setRedis, deleteKeyFromRedis } from "storage";
import { setLobbyWon, pushLobby } from "storage/lobbies";
import { lobby1mock } from "../../mocks";
import { deepCopy } from "helpers/functional";

beforeAll(() => {
  setRedis(redismock.createClient());
});

afterAll(() => {
  quitRedis();
});

beforeEach(() => {
  deleteKeyFromRedis("lobbies");
});

describe("setLobbyWon function", () => {
  test("Should return a lobby won with same owner", async () => {
    const lobby = deepCopy(lobby1mock);
    lobby.isPlaying = true;
    await pushLobby(lobby, lobby1mock.owner.socketId);

    expect(
      await setLobbyWon(lobby1mock.id, lobby1mock.players[0].player),
    ).toEqual(lobby1mock);
  });

  test("Should return a lobby won with another owner", async () => {
    const lobby = deepCopy(lobby1mock);
    lobby.isPlaying = true;
    await pushLobby(lobby, lobby1mock.owner.socketId);

    const lobbyResponse = deepCopy(lobby1mock);
    lobby.owner = lobby1mock.players[1];
    await pushLobby(lobby, lobby1mock.owner.socketId);

    expect(
      await setLobbyWon(lobby1mock.id, lobby1mock.players[0].player),
    ).toEqual(lobbyResponse);
  });

  test("Should return null", async () => {
    expect(
      await setLobbyWon(lobby1mock.id, lobby1mock.players[1].player),
    ).toBeNull();
  });
});
