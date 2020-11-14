import redismock from "redis-mock";
import { setRedis, quitRedis, deleteKeyFromRedis } from "storage";
import { setLoser, setGame, getGame, hasLost } from "storage/game";
import { game1mock } from "../../mocks";
import { deepCopy } from "helpers/functional";

beforeAll(() => {
  setRedis(redismock.createClient());
});

afterAll(() => {
  quitRedis();
});

beforeEach(() => {
  deleteKeyFromRedis(`game-${game1mock.id}`);
});

describe("hasLost function", () => {
  test("Should return false for both", async () => {
    await setGame(game1mock);

    expect(await hasLost(game1mock.id, game1mock.players[0].player.id)).toBe(
      false,
    );
    expect(await hasLost(game1mock.id, game1mock.players[1].player.id)).toBe(
      false,
    );
  });

  test("Should return false for one", async () => {
    const game = deepCopy(game1mock);
    game.players[0].loser = true;
    await setGame(game);

    expect(await hasLost(game1mock.id, game1mock.players[0].player.id)).toBe(
      true,
    );
    expect(await hasLost(game1mock.id, game1mock.players[1].player.id)).toBe(
      false,
    );
  });

  test("Should return true for both", async () => {
    const game = deepCopy(game1mock);
    game.players[0].loser = true;
    game.players[1].loser = true;

    await setGame(game);

    expect(await hasLost(game1mock.id, game1mock.players[0].player.id)).toBe(
      true,
    );
    expect(await hasLost(game1mock.id, game1mock.players[1].player.id)).toBe(
      true,
    );
  });

  test("Should return null no game", async () => {
    expect(
      await hasLost(game1mock.id, game1mock.players[0].player.id),
    ).toBeNull();
  });
});
