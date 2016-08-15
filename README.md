# OpenID Connect Relying Party

OpenID Connect Relying Party client library for Node.js and the browser.

## Planned Features

- Dynamic Configuration and Client Registration
- Authorization Code, Implicit, Hybrid, Refresh, and Client Credentials grants.
- Simultaneous use of multiple OpenID Connect Providers
- Full page, popup, and embedded UI
- Automated key rotation based on JWK `kid` value
- Session management, front- and back-channel logout
- Request parameters as JWT
- Claims request parameter
- Claims language tags
- ACDC and Proof of Possession
- OAuth 2.0 Bearer Token requests
- Compatible with Webpack

## Dependencies

This package is a work in progress, dependent on other ongoing projects. Code
contained herein will be completed when the following dependencies are ready to
release:

- [anvilresearch/webcrypto](https://github.com/anvilresearch/webcrypto)
- [anvilresearch/jose](https://github.com/anvilresearch/jose)

The current contents of the respository should be considered a "sketch".

## Running tests

### Nodejs

```bash
$ npm test
```

### Browser (karma)

```bash
$ npm run karma
```

## MIT License

Copyright (c) 2016 Anvil Research, Inc.


