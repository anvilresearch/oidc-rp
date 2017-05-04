'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Dependencies
 */
var assert = require('assert');
var fetch = require('node-fetch');
var Headers = fetch.Headers ? fetch.Headers : global.Headers;

var _require = require('json-document'),
    JSONSchema = _require.JSONSchema,
    JSONDocument = _require.JSONDocument;

var _require2 = require('jose'),
    JWKSet = _require2.JWKSet;

var AuthenticationRequest = require('./AuthenticationRequest');
var AuthenticationResponse = require('./AuthenticationResponse');
var RelyingPartySchema = require('./RelyingPartySchema');
// const Session = require('./Session')

/**
 * RelyingParty
 *
 * @class
 * Client interface for OpenID Connect Relying Party.
 *
 * @example
 *  let client = RelyingParty({
 *    provider: {
 *      name: 'Anvil Research, Inc.',
 *      url: 'https://forge.anvil.io'
 *      // configuration
 *      // jwks
 *    },
 *    authenticate: {
 *      response_type: 'code',
 *      display: 'popup',
 *      scope: 'openid profile email'
 *    },
 *    register: {
 *      client_name: 'Example',
 *      client_uri: 'https://example.com',
 *      logo_uri: 'https://example.com/assets/logo.png',
 *      redirect_uris: ['https://app.example.com/callback'],
 *      response_types: ['code', 'code id_token token'],
 *      grant_types: ['authorization_code'],
 *      default_max_age: 7200,
 *      post_logout_redirect_uris: ['https://app.example.com']
 *    },
 *    registration: {
 *      // if you have it saved somewhere
 *    },
 *    store: localStorage || req.session,
 *    popup: { width: 400, height: 300 }
 *  })
 *
 *  client.discover() => Promise
 *  client.jwks() => Promise
 *  client.authenticate()
 *  client.authenticateUri()
 *  client.validateResponse(uri) => Promise
 *  client.userinfo() => Promise
 *  client.logout()
 */

var RelyingParty = function (_JSONDocument) {
  _inherits(RelyingParty, _JSONDocument);

  function RelyingParty() {
    _classCallCheck(this, RelyingParty);

    return _possibleConstructorReturn(this, (RelyingParty.__proto__ || Object.getPrototypeOf(RelyingParty)).apply(this, arguments));
  }

  _createClass(RelyingParty, [{
    key: 'discover',


    /**
     * Discover
     *
     * @description Fetches the issuer's OpenID Configuration.
     *
     * @returns {Promise<Object>} Resolves with the provider configuration response
     */
    value: function discover() {
      var _this2 = this;

      var issuer = void 0;

      var endpoint = '.well-known/openid-configuration';

      try {
        assert(this.provider, 'RelyingParty requires a provider');

        issuer = this.provider.url;

        assert(issuer, 'RelyingParty provider must define "url"');
      } catch (error) {
        console.error('Error in rp.discover() setup:', error);
        return Promise.reject(error);
      }

      return fetch(issuer + '/' + endpoint)
      //.then(status(200))
      .then(function (response) {
        return response.json();
      }).then(function (json) {
        _this2.provider.configuration = json;

        return json;
      }).catch(function (error) {
        console.error('Error in rp.discover() while fetching provider config');
        throw error;
      });
    }

    /**
     * Register
     *
     * @description Registers a client with provider as a Relying Party
     *
     * @param options {Object}
     * @returns {Promise<Object>} Resolves with the registration response object
     */

  }, {
    key: 'register',
    value: function register(options) {
      var _this3 = this;

      var uri = void 0,
          method = void 0,
          headers = void 0,
          params = void 0,
          body = void 0;

      try {
        var configuration = this.provider.configuration;

        assert(configuration, 'OpenID Configuration is not initialized.');
        assert(configuration.registration_endpoint, 'OpenID Configuration is missing registration_endpoint.');

        uri = configuration.registration_endpoint;
        console.log(configuration);

        method = 'post';
        headers = new Headers({ 'Content-Type': 'application/json' });
        params = this.defaults.register;
        body = JSON.stringify(Object.assign({}, params, options));
      } catch (error) {
        console.error('Error in rp.register() setup:', error);
        return Promise.reject(error);
      }

      return fetch(uri, { method: method, headers: headers, body: body })
      //.then(status)
      .then(function (response) {
        return response.json();
      }).then(function (json) {
        _this3.registration = json;
        return json;
      }).catch(function (error) {
        console.error('Error in rp.register() during POST to registration endpoint');
        throw error;
      });
    }

    /**
     * serialize
     *
     * @returns {string}
     */

  }, {
    key: 'serialize',
    value: function serialize() {
      return JSON.stringify(this);
    }

    /**
     * jwks
     *
     * @description Resolves with the issuer's JWK Set.
     *
     * @returns {Promise}
     */

  }, {
    key: 'jwks',
    value: function jwks() {
      var _this4 = this;

      var uri = void 0;

      try {
        var configuration = this.provider.configuration;

        assert(configuration, 'OpenID Configuration is not initialized.');
        assert(configuration.jwks_uri, 'OpenID Configuration is missing jwks_uri.');

        uri = configuration.jwks_uri;
      } catch (error) {
        console.error('Error in rp.jwks() setup:', error);
        return Promise.reject(error);
      }

      return fetch(uri)
      //.then(status(200))
      .then(function (response) {
        return response.json();
      }).then(function (json) {
        return JWKSet.importKeys(json);
      }).then(function (jwks) {
        _this4.provider.jwks = jwks;
        return jwks;
      }).catch(function (error) {
        console.error('Error in rp.jwks() while fetching ' + uri + ' :', error);
        throw error;
      });
    }

    /**
     * createRequest
     *
     * @param options {Object} Authn request options hashmap
     * @param options.redirect_uri {string}
     * @param options.response_type {string} e.g. 'code' or 'id_token token'
     * @param session {Session|Storage} req.session or localStorage
     * @returns {Promise<string>} Authn request URL
     */

  }, {
    key: 'createRequest',
    value: function createRequest(options, session) {
      return AuthenticationRequest.create(this, options, session || this.store).catch(function (error) {
        console.error('Error in rp.createRequest(), options:', options);
        throw error;
      });
    }

    /**
     * Validate Response
     *
     * @description
     *
     * @param response {string} req.query or req.body.text
     * @param session {Session|Storage} req.session or localStorage or similar
     *
     * @returns {Promise<Object>} Custom response object, with `params` and
     *   `mode` properties
     */

  }, {
    key: 'validateResponse',
    value: function validateResponse(response, session) {
      session = session || this.store;

      if (response.match(/^http(s?):\/\//)) {
        response = { rp: this, redirect: response, session: session };
      } else {
        response = { rp: this, body: response, session: session };
      }

      return AuthenticationResponse.validateResponse(response).catch(function (error) {
        console.error('Error in rp.validateResponse():', error);
        throw error;
      });
    }

    /**
     * userinfo
     *
     * @description Promises the authenticated user's claims.
     * @returns {Promise}
     */

  }, {
    key: 'userinfo',
    value: function userinfo() {
      var uri = void 0,
          headers = void 0;

      try {
        var configuration = this.provider.configuration;

        assert(configuration, 'OpenID Configuration is not initialized.');
        assert(configuration.registration_endpoint, 'OpenID Configuration is missing registration_endpoint.');

        uri = configuration.userinfo_endpoint;
        var access_token = this.session.access_token;

        assert(access_token, 'Missing access token.');

        headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + access_token
        });
      } catch (error) {
        console.error('Error in rp.userinfo() setup:', error);
        return Promise.reject(error);
      }

      return fetch(uri, { headers: headers }).then(status(200)).then(function (response) {
        return response.json();
      }).catch(function (error) {
        console.error('Error while fetching rp.userinfo():', error);
        throw error;
      });
    }

    /**
     * Logout
     *
     * @returns {Promise}
     */

  }, {
    key: 'logout',
    value: function logout() {
      var configuration = void 0;
      try {
        configuration = this.provider.configuration;
        assert(configuration, 'OpenID Configuration is not initialized.');
        assert(configuration.end_session_endpoint, 'OpenID Configuration is missing end_session_endpoint.');
      } catch (error) {
        console.error('Error in rp.logout() setup:', error);
        return Promise.reject(error);
      }

      var uri = configuration.end_session_endpoint;
      var method = 'get';

      return fetch(uri, { method: method }).catch(function (error) {
        console.error('Error in rp.logout() while GET /logout:', error);
        throw error;
      });

      // TODO: Validate `frontchannel_logout_uri` if necessary
      /**
       * frontchannel_logout_uri - OPTIONAL. RP URL that will cause the RP to log
       * itself out when rendered in an iframe by the OP.
       *
       * An `iss` (issuer) query parameter and a `sid`
       * (session ID) query parameter MAY be included by the OP to enable the RP
       * to validate the request and to determine which of the potentially
       * multiple sessions is to be logged out. If a sid (session ID) query
       * parameter is included, an iss (issuer) query parameter MUST also be
       * included.
       * @see https://openid.net/specs/openid-connect-frontchannel-1_0.html#RPLogout
       */
    }
  }], [{
    key: 'from',


    /**
     * from
     *
     * @description
     * Create a RelyingParty instance from a previously registered client.
     *
     * @param {Object} data
     * @returns {Promise<RelyingParty>}
     */
    value: function from(data) {
      var rp = new RelyingParty(data);
      var validation = rp.validate();

      // schema validation
      if (!validation.valid) {
        return Promise.reject(validation);
      }

      var jwks = rp.provider.jwks;

      // request the JWK Set if missing
      if (!jwks) {
        return rp.jwks().then(function () {
          return rp;
        });
      }

      // otherwise import the JWK Set to webcrypto
      return JWKSet.importKeys(jwks).then(function (jwks) {
        rp.provider.jwks = jwks;
        return rp;
      }).catch(function (error) {
        console.error('Error in RelyingParty.from() while importing keys', error);
        throw error;
      });
    }

    /**
     * register
     *
     * @param issuer {string} Provider URL
     * @param registration {Object} Client dynamic registration options
     * @param options {Object}
     * @param options.defaults
     * @param [options.store] {Session|Storage}
     * @returns {Promise<RelyingParty>} RelyingParty instance, registered.
     */

  }, {
    key: 'register',
    value: function register(issuer, registration, options) {
      var rp = new RelyingParty({
        provider: { url: issuer },
        defaults: Object.assign({}, options.defaults),
        store: options.store
      });

      return Promise.resolve().then(function () {
        return rp.discover();
      }).then(function () {
        return rp.jwks();
      }).then(function () {
        return rp.register(registration);
      }).then(function () {
        return rp;
      }).catch(function (error) {
        console.error('Error in RelyingParty.register():', error);
      });
    }
  }, {
    key: 'schema',


    /**
     * Schema
     */
    get: function get() {
      return RelyingPartySchema;
    }
  }]);

  return RelyingParty;
}(JSONDocument);

module.exports = RelyingParty;