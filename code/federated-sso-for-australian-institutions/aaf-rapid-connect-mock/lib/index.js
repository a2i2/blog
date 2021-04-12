import fs from "fs";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import template from "lodash.template";
import { encode as encodeJWT } from "jwt-simple";

const html = template(fs.readFileSync(path.resolve(__dirname, "..", "templates", "index.html"), "utf8"));
const defaultOptions = {
  appUrl: "https://example.com",
  authUrl: "/auth",
  pageTitle: "AAF Rapid Connect"
};

export default function(options = {}) {
  let { appUrl, authUrl, jwtSecret, pageTitle } = Object.assign({}, defaultOptions, options);

  if (!appUrl) throw new Error(`Option "appUrl" is undefined.`);
  if (!authUrl) throw new Error(`Option "authUrl" is undefined.`);
  if (!jwtSecret) throw new Error(`Option "jwtSecret" is undefined.`);

  let app = express();

  app.get("/", (req, res) => {
    let { baseUrl } = req;
    res.send(html({ authUrl, baseUrl, pageTitle }));
  });

  app.post("/", bodyParser.json(), (req, res) => {
    let { name, email } = req.body;
    let jwt = {
      aud: appUrl,
      exp: Math.round(Date.now() / 1000) + 60,
      "https://aaf.edu.au/attributes": {
        displayname: name,
        edupersonscopedaffiliation: [
          "affiliate@deakin.edu.au",
          "staff@deakin.edu.au",
          "member@deakin.edu.au"
        ].join(";"),
        edupersontargetedid: new Buffer(email).toString("base64"),
        mail: email
      },
      iss: "https://rapid.aaf.edu.au",
      jti: Date.now().toString(),
      nbf: Math.round(Date.now() / 1000) - 60
    };
    let assertion = encodeJWT(jwt, jwtSecret);
    res.send({ assertion });
  });

  return app;
}
