import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import mockRapidConnect from "aaf-rapid-connect-mock";
import validateJWT, { ValidationError } from "aaf-rapid-connect-jwt-validator";

const port = process.env.PORT || 3000;
const appUrl = process.env.APP_URL || `http://localhost:${port}`;
const ssoUrl = process.env.SSO_URL; // e.g. https://rapid.aaf.edu.au/jwt/authnrequest/research/XXXXXXXX
const jwtSecret = process.env.JWT_SECRET || "secret";
const tokens = [];
const app = express();

app.set("views", __dirname);

app.set("view engine", "ejs");

app.use(cookieSession({
  secret: "secret",
  secureProxy: appUrl.startsWith("https://"),
  maxAge: 3600000
}));

app.get("/", (req, res) => {
  res.render("index", { session: req.session });
});

app.get("/auth", (req, res) => {
  res.redirect(ssoUrl || "/mock_sso");
});

app.post("/auth", bodyParser.urlencoded({ extended: true }), (req, res) => {
  validateJWT({
    assertion: req.body.assertion,
    jwtSecret,
    appUrl,
    findToken: token => tokens.includes(token),
    storeToken: token => tokens.push(token)
  }).then(attrs => {
    let user = {
      id: attrs.edupersontargetedid,
      email: attrs.mail,
      name: attrs.displayname
    };

    Object.assign(req.session, { user });
    res.redirect(appUrl);
  }).catch(error => {
    if (error instanceof ValidationError) {
      res.status(500).send(error.message);
    } else {
      res.sendStatus(500);
    }
  });
});

app.delete("/auth", (req, res) => {
  req.session = null;
  res.sendStatus(204);
});

if (!ssoUrl) {
  app.use("/mock_sso", mockRapidConnect({
    jwtSecret,
    appUrl,
    pageTitle: "Deakin University"
  }));
}

app.listen(port, () => console.log(`Web server started on port ${port}.`));
