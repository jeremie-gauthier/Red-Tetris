import redismock from "redis-mock";
import { quitRedis, setRedis, deleteKeyFromRedis } from "storage";
import Response from "models/response";
import { LOBBY } from "../../../../src/config/actions/lobby";
import { kickedFromLobby, pushLobby, getLobbies } from "storage/lobbies";
import { lobby1mock, lobby2mock } from "../../mocks";
import { deepCopy } from "helpers/functional";
import { isLobbyPlaying } from "../../../../src/server/storage/lobbies";

beforeAll(() => {
  setRedis(redismock.createClient());
});

afterAll(() => {
  quitRedis();
});

beforeEach(() => {
  deleteKeyFromRedis("lobbies");
});

describe("isLobbyPlaying function", () => {
  test("Should return false", async () => {
    await pushLobby(lobby1mock, lobby1mock.owner.socketId);

    expect(await isLobbyPlaying(lobby1mock.id)).toEqual(false);
  });

  test("Should return false no lobby", async () => {
    expect(await isLobbyPlaying(lobby1mock.id)).toEqual(false);
  });

  test("Should return true", async () => {
    const lobby = deepCopy(lobby1mock);
    lobby.isPlaying = true;
    await pushLobby(lobby, lobby1mock.owner.socketId);

    expect(await isLobbyPlaying(lobby1mock.id)).toEqual(true);
  });
});
