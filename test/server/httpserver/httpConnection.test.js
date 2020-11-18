import runHttpServer, { httpServer, quitHttpServer } from "httpserver";
import request from "supertest";
import { promiseTimeout } from "utils/promise";

beforeAll(async (done) => {
  try {
    await promiseTimeout(
      runHttpServer,
      "Failed to run runHttpServer within 5 seconds.",
    );
  } catch (error) {
    console.log("Promise rejected:", error);
  }
  done();
});

afterAll(async (done) => {
  try {
    await promiseTimeout(
      quitHttpServer,
      "Failed to run quitHttpServer within 5 seconds.",
    );
  } catch (error) {
    console.log("Promise rejected:", error);
  }
  done();
});

describe("Http Server", () => {
  test("Should get 200", async () => {
    const res = await request(httpServer).get("/");
    expect(res.statusCode).toEqual(200);
  });

  test("Should get 404", async () => {
    const res = await request(httpServer).get("/test");
    expect(res.statusCode).toEqual(404);
  });
});
