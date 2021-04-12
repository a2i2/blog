import should from "should";
import { encode as encodeJWT } from "jwt-simple";
import validateJWT, { ValidationError } from "../lib";

const noop = () => {};
const jwtSecret = "secret";
const appUrl = "https://example.com";
const createValidJWT = () => ({
  iss: "https://rapid.aaf.edu.au",
  aud: appUrl,
  nbf: Math.round(Date.now() / 1000) - 60,
  exp: Math.round(Date.now() / 1000) + 60,
  jti: "abc123",
  "https://aaf.edu.au/attributes": {
    name: "John Smith",
    email: "john.smith@example.com"
  }
});

describe("aaf-rapid-connect-jwt-validator", () => {
  it("should return a Promise resolved with user attributes", () => {
    let jwt = createValidJWT();

    let promise = validateJWT({
      assertion: encodeJWT(jwt, jwtSecret),
      appUrl,
      jwtSecret,
      findToken: noop,
      storeToken: noop
    });

    promise.should.be.a.Promise();

    return promise.then(attrs => {
      attrs.should.be.an.Object().and.have.keys("name", "email");
      attrs.name.should.be.a.String().and.equal("John Smith");
      attrs.email.should.be.a.String().and.equal("john.smith@example.com");
    });
  });

  it("should throw an error when JWT issuer is invalid", done => {
    let jwt = Object.assign(createValidJWT(), { iss: "invalid" });

    validateJWT({
      assertion: encodeJWT(jwt, jwtSecret),
      appUrl,
      jwtSecret,
      findToken: noop,
      storeToken: noop
    }).then(() => {
      throw new Error("Invalid JWT successfully passed validation. :(");
    }).catch(error => {
      if (error instanceof ValidationError && error.message === "Invalid JWT issuer.") {
        done();
      } else {
        done(error);
      }
    });
  });

  it("should throw an error when JWT audience is invalid", done => {
    let jwt = Object.assign(createValidJWT(), { aud: "invalid" });

    validateJWT({
      assertion: encodeJWT(jwt, jwtSecret),
      appUrl,
      jwtSecret,
      findToken: noop,
      storeToken: noop
    }).then(() => {
      throw new Error("Invalid JWT successfully passed validation. :(");
    }).catch(error => {
      if (error instanceof ValidationError && error.message === "Invalid JWT audience.") {
        done();
      } else {
        done(error);
      }
    });
  });

  it("should throw an error when JWT identifier is invalid", done => {
    let jwt = createValidJWT();

    validateJWT({
      assertion: encodeJWT(jwt, jwtSecret),
      appUrl,
      jwtSecret,
      findToken: () => true,
      storeToken: noop
    }).then(() => {
      throw new Error("Invalid JWT successfully passed validation. :(");
    }).catch(error => {
      if (error instanceof ValidationError && error.message === "Invalid JWT identifier.") {
        done();
      } else {
        done(error);
      }
    });
  });
});
