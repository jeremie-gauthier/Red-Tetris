import redismock from "redis-mock";
import socketIOClient from "socket.io-client";
import { setRedis, quitRedis } from "storage";
import { getPlayerId, getPlayer } from "../../../src/server/storage/players";
import { getLobbies } from "../../../src/server/storage/lobbies";
import runHttpServer, { quitHttpServer } from "httpserver";
import runSocketIo, { quitSocketIo } from "socket";
import { promiseTimeout } from "utils/promise";

let socketClient;

beforeAll(async (done) => {
  try {
    const httpServer = await promiseTimeout(
      runHttpServer,
      "Failed to run runHttpServer within 5 seconds.",
    );
    runSocketIo(httpServer);
    setRedis(redismock.createClient());
    socketClient = socketIOClient("http://0.0.0.0:3004");
  } catch (error) {
    console.log("Promise rejected:", error);
  }
  done();
});

afterAll(async (done) => {
  quitRedis();
  socketClient.close();
  try {
    await promiseTimeout(
      quitHttpServer,
      "Failed to run quitHttpServer within 5 seconds.",
    );
    await promiseTimeout(
      quitSocketIo,
      "Failed to run quitSocketIo within 5 seconds.",
    );
  } catch (error) {
    console.log("Promise rejected:", error);
  }
  done();
});

describe("Socket tests", () => {
  test("Should create a player", (done) => {
    socketClient.on("player:response", (response) => {
      expect(response.type).toBe("success");
      socketClient.off("player:response");
      done();
    });
    socketClient.emit("player:create", { name: "player1" });
  });

  test("Should subscribe to lobbies", (done) => {
    socketClient.on("lobbies:publish", (response) => {
      socketClient.off("lobbies:publish");
      expect(response).toBeNull();
      done();
    });
    socketClient.emit("lobbies:subscribe");
  });

  test("Should fail to join lobby", async (done) => {
    socketClient.on("lobby:response", (response) => {
      expect(response.type).toEqual("error");
      socketClient.off("lobby:response");
      done();
    });
    const playerId = await getPlayerId(socketClient.id);
    socketClient.emit("lobby:subscribe", {
      playerId,
      lobbyId: "2",
    });
  });

  test("Should create lobby", async (done) => {
    socketClient.on("lobbies:response", (response) => {
      expect(response.type).toBe("success");
      socketClient.off("lobbies:response");
      done();
    });
    const playerId = await getPlayerId(socketClient.id);
    const player = await getPlayer(playerId);

    socketClient.emit("lobbies:add", {
      name: "lobby1",
      maxPlayer: 4,
      owner: player,
    });
  });

  test("Should subscribe to lobby", async (done) => {
    socketClient.on("lobby:response", (response) => {
      expect(response.type).toBe("success");
      socketClient.off("lobby:response");
      done();
    });

    const playerId = await getPlayerId(socketClient.id);
    const lobbies = await getLobbies();
    const lobbyId = Object.keys(lobbies)[0];

    socketClient.emit("lobby:subscribe", {
      playerId,
      lobbyId,
    });
  });

  test("Should fail to be ready", async (done) => {
    socketClient.on("lobby:response", async (response) => {
      expect(response.type).toBe("error");
      expect(response.reason).toBe("You are the owner!");
      socketClient.off("lobby:response");
      done();
    });

    const playerId = await getPlayerId(socketClient.id);
    const lobbies = await getLobbies();
    const lobbyId = Object.keys(lobbies)[0];

    socketClient.emit("lobby:ready", {
      playerId,
      lobbyId,
    });
  });

  test("Should fail to start game", async (done) => {
    socketClient.on("lobby:response", (response) => {
      if (response.action === "lobby:start") {
        expect(response.type).toBe("error");
        socketClient.off("game:response");
        done();
      }
    });

    const playerId = await getPlayerId(socketClient.id);
    const lobbies = await getLobbies();
    const lobbyId = Object.keys(lobbies)[0];

    socketClient.emit("lobby:start", {
      ownerId: playerId,
      lobbyId,
    });
  });

  test("Should send message", async (done) => {
    socketClient.on("message:publish", (response) => {
      expect(response.message).toEqual("message");
      socketClient.off("message:publish");
      done();
    });

    const lobbies = await getLobbies();
    const lobbyId = Object.keys(lobbies)[0];

    socketClient.emit("message:send", {
      message: "message",
      sender: "player1",
      lobbyId,
    });
  });

  test("Should leave lobby and lobby should be deleted", async (done) => {
    socketClient.on("lobby:response", (response) => {
      expect(response.type).toBe("success");
      socketClient.off("lobby:response");
      done();
    });

    const playerId = await getPlayerId(socketClient.id);
    const lobbies = await getLobbies();
    const lobbyId = Object.keys(lobbies)[0];

    socketClient.emit("lobby:unsubscribe", {
      playerId,
      lobbyId,
    });
  });

  test("Should create, join and then delete lobby", async (done) => {
    socketClient.on("lobbies:response", async (response) => {
      if (response.action === "lobbies:delete") {
        expect(response.type).toBe("success");
        expect(response.payload).toEqual({});
        expect(await getLobbies()).toEqual({});
        socketClient.off("lobbies:response");
        done();
      }
      if (response.action === "lobbies:add") {
        subscribeToLobby();
      }
    });

    socketClient.on("lobby:response", (response) => {
      if (response.action === "lobby:subscribe") {
        deleteLobby();
        socketClient.off("lobby:response");
      }
    });

    const playerId = await getPlayerId(socketClient.id);
    const player = await getPlayer(playerId);
    socketClient.emit("lobbies:add", {
      name: "lobby1",
      maxPlayer: 4,
      owner: player,
    });

    const subscribeToLobby = async () => {
      const playerId = await getPlayerId(socketClient.id);
      const lobbies = await getLobbies();
      const lobbyId = Object.keys(lobbies)[0];

      socketClient.emit("lobby:subscribe", {
        playerId,
        lobbyId,
      });
    };

    const deleteLobby = async () => {
      const playerId = await getPlayerId(socketClient.id);
      const lobbies = await getLobbies();
      const lobbyId = Object.keys(lobbies)[0];
      socketClient.emit("lobbies:delete", {
        ownerId: playerId,
        lobbyId,
      });
    };
  });
});
