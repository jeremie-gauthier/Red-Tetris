import { bindEvent } from "socket/helpers/socket";
import { loginfo } from "utils/log";
import socketIO from "socket.io";

import * as piece from "socket/piece";
import * as player from "socket/player";
import * as lobbies from "socket/lobbies";
import * as lobby from "socket/lobby";
import * as message from "socket/message";
import * as disconnect from "socket/disconnect";
import * as game from "socket/game";

const handlers = Object.values({
  ...piece,
  ...player,
  ...lobbies,
  ...lobby,
  ...message,
  ...disconnect,
  ...game,
});

export let io;

const runSocketIo = (httpServer) => {
  io = socketIO(httpServer, { cookie: false });

  io.on("connection", async (socket) => {
    loginfo("A new socket has connected!");

    /* Test on reconnect */
    socket.on("reconnect", (attemptNumber) => {
      loginfo(socket.id, "Tried to reconnect... attemptNumber:", attemptNumber);
    });

    handlers.forEach((handler) => {
      bindEvent(socket, handler);
    });
  });
  loginfo("SocketIO initialized");
};

export const quitSocketIo = () =>
  new Promise((resolve) => {
    io.close(resolve);
  });

export default runSocketIo;
