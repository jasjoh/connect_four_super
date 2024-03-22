import request from "supertest";
import app from "./app";
import db from "./db";

test("not found for site 404", async function () {
  const resp = await request(app).get("/no-such-path");
  expect(resp.statusCode).toEqual(404);
});

afterAll(function () {
  db.end();
});