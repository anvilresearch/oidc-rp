'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Dependencies
 */
var assert = require('assert');
var base64url = require('base64url');
var crypto = require('webcrypto');
var FormUrlEncoded = require('./FormUrlEncoded');
var URL = require('urlutils');

/**
 * Authentication Request
 */

var AuthenticationRequest = function () {
  function AuthenticationRequest() {
    _classCallCheck(this, AuthenticationRequest);
  }

  _createClass(AuthenticationRequest, null, [{
    key: 'create',


    /**
     * create
     *
     * @description
     * Create a new authentication request with generated state and nonce,
     * validate presence of required parameters, serialize the request data and
     * persist it to the session, and return a promise for an authentication
     * request URI.
     *
     * @param {RelyingParty} rp – instance of RelyingParty
     * @param {Object} options - optional request parameters
     * @param {Object} session – reference to localStorage or other session object
     *
     * @returns {Promise}
     */
    value: function create(rp, options, session) {
      return new Promise(function (resolve, reject) {
        var provider = rp.provider,
            defaults = rp.defaults,
            registration = rp.registration;

        // validate presence of OP configuration, RP client registration,
        // and default parameters

        assert(provider.configuration, 'RelyingParty provider OpenID Configuration is missing');

        assert(defaults.authenticate, 'RelyingParty default authentication parameters are missing');

        assert(registration, 'RelyingParty client registration is missing');

        // define basic elements of the request
        var issuer = provider.configuration.issuer;
        var endpoint = provider.configuration.authorization_endpoint;
        var client = { client_id: registration.client_id };
        var params = Object.assign(defaults.authenticate, client, options);

        // validate presence of required configuration and parameters
        assert(issuer, 'Missing issuer in provider OpenID Configuration');

        assert(endpoint, 'Missing authorization_endpoint in provider OpenID Configuration');

        assert(params.scope, 'Missing scope parameter in authentication request');

        assert(params.response_type, 'Missing response_type parameter in authentication request');

        assert(params.client_id, 'Missing client_id parameter in authentication request');

        assert(params.redirect_uri, 'Missing redirect_uri parameter in authentication request');

        // generate state and nonce random octets
        params.state = Array.from(crypto.getRandomValues(new Uint8Array(16)));
        params.nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)));

        // hash the state and nonce parameter values
        return Promise.all([crypto.subtle.digest({ name: 'SHA-256' }, new Uint8Array(params.state)), crypto.subtle.digest({ name: 'SHA-256' }, new Uint8Array(params.nonce))])

        // serialize the request with original values, store in session by
        // encoded state param, and replace state/nonce octets with encoded
        // digests
        .then(function (digests) {
          var state = base64url(Buffer.from(digests[0]));
          var nonce = base64url(Buffer.from(digests[1]));
          var key = issuer + '/requestHistory/' + state;

          // store the request params for response validation
          // with serialized octet values for state and nonce
          session[key] = JSON.stringify(params);

          // replace state and nonce octets with base64url encoded digests
          params.state = state;
          params.nonce = nonce;
        })

        // optionally encode a JWT with the request parameters
        .then(function () {
          // TODO
          // optionally encode the request parameters as a JWT
          // and replace params with `{ request: <jwt> }`
        })

        // render the request URI and terminate the algorithm
        .then(function () {
          var url = new URL(endpoint);
          url.search = FormUrlEncoded.encode(params);
          resolve(url.href);
        });
      });
    }
  }]);

  return AuthenticationRequest;
}();

/**
 * Export
 */


module.exports = AuthenticationRequest;