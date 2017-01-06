'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Dependencies
 */
var crypto = require('webcrypto');

/**
 * Nonce
 */

var Nonce = function () {
  function Nonce() {
    _classCallCheck(this, Nonce);
  }

  _createClass(Nonce, [{
    key: 'verify',


    /**
     * verify
     */
    value: function verify() {}
  }], [{
    key: 'generate',


    /**
     * generate
     *
     * @description
     * Generate a base64url encoded SHA-256 hashed random nonce of a given length.
     *
     * @param {Number} nonce
     * @returns {Promise}
     */
    value: function generate(length) {
      var random = crypto.getRandomValues(new Uint32Array(length));
      return crypto.subtle.digest('SHA-256', random).then(function (hash) {
        return base64url(hex(hash));
      });
    }
  }]);

  return Nonce;
}();

/**
 * Export
 */


module.exports = Nonce;