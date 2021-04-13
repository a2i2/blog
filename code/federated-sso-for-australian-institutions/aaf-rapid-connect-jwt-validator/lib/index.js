import { decode as decodeJWT } from "jwt-simple";

export class ValidationError extends Error {}

export default function(options = {}) {
  return new Promise((resolve, reject) => {
    let { assertion, appUrl, jwtSecret, findToken, storeToken } = options;

    if (!assertion) throw new Error(`Option "assertion" is undefined.`);
    if (!appUrl) throw new Error(`Option "appUrl" is undefined.`);
    if (!jwtSecret) throw new Error(`Option "jwtSecret" is undefined.`);
    if (!findToken) throw new Error(`Option "findToken" is undefined.`);
    if (!storeToken) throw new Error(`Option "storeToken" is undefined.`);

    let jwt = (() => {
      try {
        return decodeJWT(assertion, jwtSecret);
      } catch (error) {
        throw new ValidationError("Failed to decode signed JWT.");
      }
    })();

    if (jwt.iss !== "https://rapid.aaf.edu.au") {
      throw new ValidationError("Invalid JWT issuer.");
    }

    if (jwt.aud !== appUrl) {
      throw new ValidationError("Invalid JWT audience.");
    }

    Promise.resolve(findToken(jwt.jti))
    .then(found => {
      if (found) {
        // The same token cannot be used twice.
        throw new ValidationError("Invalid JWT identifier.");
      }

      return storeToken(jwt.jti);
    })
    .then(() => jwt["https://aaf.edu.au/attributes"])
    .then(resolve)
    .catch(reject);
  });
}
