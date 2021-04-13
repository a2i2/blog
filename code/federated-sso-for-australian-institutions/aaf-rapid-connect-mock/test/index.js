import request from "supertest";
import mockRapidConnect from "../lib";

describe("aaf-rapid-connect-mock", () => {
  it("should serve sign-in page", done => {
    let jwtSecret = "secret";
    request(mockRapidConnect({ jwtSecret })).get("/").expect(200, done);
  });
});
