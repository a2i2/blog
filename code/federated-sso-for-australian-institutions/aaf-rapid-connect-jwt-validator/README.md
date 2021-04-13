# aaf-rapid-connect-jwt-validator [![NPM version](http://img.shields.io/npm/v/aaf-rapid-connect-jwt-validator.svg?style=flat-square)](https://www.npmjs.org/package/aaf-rapid-connect-jwt-validator) [![Build status](http://img.shields.io/travis/dstil/aaf-rapid-connect-jwt-validator.svg?style=flat-square)](https://travis-ci.org/dstil/aaf-rapid-connect-jwt-validator)

Validate JWT claims according to AAF's recommendations in the Rapid Connect [developer guide](https://rapid.aaf.edu.au/developers).

## Installation

Install the package with NPM:

```bash
$ npm install aaf-rapid-connect-jwt-validator
```

## Usage

Example:

```js
import validateJWT from "aaf-rapid-connect-jwt-validator";

let options = { ... };

validateJWT(options)
.then(attrs => console.log(attrs))
.catch(error => console.log(error));
```

As shown, the package exposes a function that validates a JWT and returns a Promise. When validation is successful, the Promise is resolved with user attributes extracted from the JWT; otherwise, it is rejected.

The following `options` must be specified:

- `assertion` – A raw assertion string containing the signed JWT.
- `appUrl` – The main entry point URL of the application the JWT is intended for.
- `jwtSecret` – The secret key used to sign the JWT.
- `findToken` – A function that searches your token storage mechanism to determine whether the JWT is a "duplicate", returning `true` if so; otherwise, `false`. The JWT's identifier is supplied to the function as its only argument, and the return value can be resolved via a Promise if necessary.
- `storeToken` – A function that persists the JWT to your token storage mechanism. The JWT's identifier is supplied to the function as its only argument.
