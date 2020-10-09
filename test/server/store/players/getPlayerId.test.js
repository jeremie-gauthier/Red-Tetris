import { getPlayerId, pushPlayer } from "store/players";
import {
  quitRedis,
  deleteKeyFromRedis,
  setComplexObjectToRedis,
} from "../../../../src/server/store";
import runRedis from "../../../../src/server/store";

test("getPlayerId() should return null", async () => {
  runRedis();

  expect(await getPlayerId("56")).toEqual(null);

  quitRedis();
});

test("getPlayerId() should return a Player", async () => {
  runRedis();

  const players = {
    2: {
      id: "2",
      name: "test2",
      socketId: "si2",
    },
    3: {
      id: "3",
      name: "test3",
      socketId: "si3",
    },
  };
  await setComplexObjectToRedis("players", players);

  expect(await getPlayerId("si2")).toEqual("2");

  deleteKeyFromRedis("players");
  quitRedis();
});
