import redismock from "redis-mock";
import { quitRedis, setRedis, deleteKeyFromRedis } from "storage";
import Response from "models/response";
import { LOBBY } from "../../../../src/config/actions/lobby";
import { kickedFromLobby, pushLobby } from "storage/lobbies";
import { lobby1mock, lobby2mock } from "../../mocks";

beforeAll(() => {
  setRedis(redismock.createClient());
});

afterAll(() => {
  quitRedis();
});

beforeEach(() => {
  deleteKeyFromRedis("lobbies");
});

describe("kickedFromLobby function", () => {
  test("Should return a Success response", async () => {
    await pushLobby(lobby1mock, lobby1mock.owner.socketId);
    await pushLobby(lobby2mock, lobby2mock.owner.socketId);

    expect(
      await kickedFromLobby(
        lobby1mock.owner.id,
        lobby1mock.players[1].player.id,
        lobby1mock.id,
      ),
    ).toEqual(
      Response.success(LOBBY.KICK, {
        socketId: lobby1mock.players[1].player.socketId,
      }),
    );
  });

  test("Should return an Error response `Lobby doesn't exists!` ", async () => {
    await pushLobby(lobby2mock, lobby2mock.owner.socketId);

    expect(
      await kickedFromLobby(
        lobby1mock.owner.id,
        lobby1mock.players[1].player.id,
        lobby1mock.id,
      ),
    ).toEqual(Response.error(LOBBY.KICK, "Lobby doesn't exists!"));
  });

  test("Should return an Error response `Lobby doesn't exists!` 2", async () => {
    expect(
      await kickedFromLobby(
        lobby1mock.owner.id,
        lobby1mock.players[1].player.id,
        lobby1mock.id,
      ),
    ).toEqual(Response.error(LOBBY.KICK, "Lobby doesn't exists!"));
  });

  test("Should return an Error response : Can't kick yourself", async () => {
    await pushLobby(lobby1mock, lobby1mock.owner.socketId);

    expect(
      await kickedFromLobby(
        lobby1mock.owner.id,
        lobby1mock.players[0].player.id,
        lobby1mock.id,
      ),
    ).toEqual(Response.error(LOBBY.KICK, "You cannot kick yourself!"));
  });

  test("Should return an Error response : Need to be owner", async () => {
    await pushLobby(lobby1mock, lobby1mock.owner.socketId);

    expect(
      await kickedFromLobby(
        lobby1mock.players[1].player.id,
        lobby1mock.players[0].player.id,
        lobby1mock.id,
      ),
    ).toEqual(
      Response.error(LOBBY.KICK, "You need to be the owner of the Lobby!"),
    );
  });

  test("Should return an Error response : Player not in lobby", async () => {
    await pushLobby(lobby1mock, lobby1mock.owner.socketId);

    expect(
      await kickedFromLobby(
        lobby1mock.owner.id,
        lobby2mock.players[0].player.id,
        lobby1mock.id,
      ),
    ).toEqual(Response.error(LOBBY.KICK, "The player is not in your Lobby!"));
  });
});
