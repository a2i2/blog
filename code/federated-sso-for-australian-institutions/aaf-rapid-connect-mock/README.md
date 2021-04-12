# aaf-rapid-connect-mock [![NPM version](http://img.shields.io/npm/v/aaf-rapid-connect-mock.svg?style=flat-square)](https://www.npmjs.org/package/aaf-rapid-connect-mock) [![Build status](http://img.shields.io/travis/dstil/aaf-rapid-connect-mock.svg?style=flat-square)](https://travis-ci.org/dstil/aaf-rapid-connect-mock)

Host a local "mock" instance of [AAF Rapid Connect](https://rapid.aaf.edu.au).

## Installation

Install the package with NPM:

```bash
$ npm install aaf-rapid-connect-mock
```

## Usage

Example:

```js
import mockRapidConnect from "aaf-rapid-connect-mock";

let options = { ... };
mockRapidConnect(options).listen(3000);
```

As shown, the package exposes a function that returns an [Express](http://expressjs.com) application instance. The following `options` can be specified:

- `jwtSecret` – The secret key used to sign JWTs. Required!
- `appUrl` – The main entry point URL of the application. Defaults to `https://example.com`.
- `authUrl` – The callback URL that JWTs are sent to on sign-in. Defaults to `/auth`.
- `pageTitle` – The title of the sign-in page. Defaults to `AAF Rapid Connect`.

## Tip

To integrate the package into an *existing* Express application, simply mount it at a path:

```js
import express from "express";
import mockRapidConnect from "aaf-rapid-connect-mock";

let app = express();

if (process.env.NODE_ENV !== "production") {
  let jwtSecret = "secret";
  app.use("/mock", mockRapidConnect({ jwtSecret }));
}

app.listen(3000);
```
