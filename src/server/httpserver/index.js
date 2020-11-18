import { loginfo } from "utils/log";
import express from "express";
import http from "http";
import { createHttpTerminator } from "http-terminator";
import path from "path";
import params from "../../config/params/params";

const app = express();
export const httpServer = http.createServer(app);
const httpTerminator = createHttpTerminator({
  server: httpServer,
});

const runHttpServer = () =>
  new Promise((resolve) => {
    app.get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../index.html"));
    });

    httpServer.listen(params.server.port, () => {
      loginfo("Server listening on port:", params.server.port);
      resolve(httpServer);
    });
  });

export const quitHttpServer = async () =>
  new Promise((resolve) => {
    httpTerminator.terminate().then(() => resolve());
  });

export default runHttpServer;
