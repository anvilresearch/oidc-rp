'use strict';

/**
 * Local dependencies
 */
var _require = require('jose'),
    JWTSchema = _require.JWTSchema;

/**
 * AccessTokenSchema
 */


var AccessTokenSchema = JWTSchema.extend({
  properties: {
    payload: {
      properties: {

        /**
         * scope
         */
        scope: {
          type: ['array', 'string'],
          items: { type: 'string' }
        }
      }
    }
  }
});

/**
 * Export
 */
module.exports = AccessTokenSchema;