import runServer, { killServer } from "run";
import { httpServer } from "httpserver";
import request from "supertest";

beforeAll((done) => {
  runServer().then(() => done());
});

afterAll((done) => {
  killServer().then(() => done());
});

describe("Testing run server", () => {
  test("Should get 200", async () => {
    const res = await request(httpServer).get("/");
    expect(res.statusCode).toEqual(200);
  });

  test("Should get 200", async () => {
    const res = await request(httpServer).get("/test");
    expect(res.statusCode).toEqual(404);
  });
});
