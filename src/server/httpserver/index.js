import { loginfo } from "utils/log";
import express from "express";
import http from "http";
import { createHttpTerminator } from "http-terminator";
import path from "path";
import params from "../../config/params/params";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

export const httpServer = http.createServer(app);
const httpTerminator = createHttpTerminator({
  server: httpServer,
});

const runHttpServer = () =>
  new Promise((resolve) => {
    app.get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../index.html"));
    });

    app.get("/score", async (req, res) => {
      const filePath = path.resolve(__dirname, "./leaderboard.json");
      const leaderboard = await fs.promises.readFile(filePath);
      const leaderboardJSON = Object.fromEntries(
        Object.entries(JSON.parse(leaderboard)).sort((c, n) => n[1] - c[1]),
      );
      return res.status(200).json({ leaderboard: leaderboardJSON });
    });

    app.post("/score", async (req, res) => {
      const { playerName, score } = req.body;
      const filePath = path.resolve(__dirname, "./leaderboard.json");
      const leaderboard = await fs.promises.readFile(filePath);
      const leaderboardJSON = JSON.parse(leaderboard);

      if (playerName in leaderboardJSON) {
        if (score > leaderboardJSON[playerName]) {
          leaderboardJSON[playerName] = score;
        }
      } else {
        leaderboardJSON[playerName] = score;
      }

      fs.promises.writeFile(filePath, JSON.stringify(leaderboardJSON));
      return res.status(201).json({ message: "Ok" });
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
