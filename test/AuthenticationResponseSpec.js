'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

/**
 * Assertions
 */
chai.should()
chai.use(chaiAsPromised)
let expect = chai.expect

/**
 * Code under test
 */
const {JWT} = require('@trust/jose')
const IDToken = require('../src/IDToken')
const AuthenticationResponse = require('../src/AuthenticationResponse')
const {RsaPrivateCryptoKey, RsaPublicCryptoKey} = require('./keys')

/**
 * Tests
 */
describe('AuthenticationResponse', () => {

  /**
   * parseResponse
   */
  describe('parseResponse', () => {
    it('should throw with redirect and body', () => {
      expect(() => {
        AuthenticationResponse.parseResponse({
          redirect: 'https://example.com/callback?code=1234',
          body: 'code=1234'
        })
      }).to.throw('Invalid response mode')
    })

    it('should throw with query and fragment', () => {
      expect(() => {
        AuthenticationResponse.parseResponse({
          redirect: 'https://example.com/callback?code=1234#code=1234'
        })
      }).to.throw('Invalid response mode')
    })

    it('should parse query response', () => {
      let response = { redirect: 'https://example.com/callback?code=1234' }
      AuthenticationResponse.parseResponse(response)
      response.params.should.eql({ code: '1234' })
      response.mode.should.equal('query')
    })

    it('should parse fragment response', () => {
      let response = { redirect: 'https://example.com/callback#code=1234' }
      AuthenticationResponse.parseResponse(response)
      response.params.should.eql({ code: '1234' })
      response.mode.should.equal('fragment')
    })

    it('should parse form post response', () => {
      let response = { body: 'code=1234' }
      AuthenticationResponse.parseResponse(response)
      response.params.should.eql({ code: '1234' })
      response.mode.should.equal('form_post')
    })
  })

  /**
   * matchRequest
   */
  describe('matchRequest', () => {
    let response

    beforeEach(() => {
      response = {
        rp: {
          provider: {
            configuration: {
              issuer: 'https://forge.anvil.io'
            }
          }
        },
        params: {
          state: '1234'
        },
        session: {
          'https://forge.anvil.io/requestHistory/1234': JSON.stringify({
            scope: 'openid'
          })
        }
      }
    })

    it('should throw with missing state parameter', () => {
      expect(() => {
        delete response.params.state
        AuthenticationResponse.matchRequest(response)
      }).to.throw('Missing state parameter in authentication response')
    })

    it('should throw with mismatching state parameter', () => {
      expect(() => {
        response.params.state = '1235'
        AuthenticationResponse.matchRequest(response)
      }).to.throw('Mismatching state parameter in authentication response')
    })

    it('should deserialize the matched request', () => {
      AuthenticationResponse.matchRequest(response).request
        .should.eql({ scope: 'openid' })
    })
  })

  /**
   * validateStateParam
   */
  describe('validateStateParam', () => {
    let response

    beforeEach(() => {
      response = {
        request: {
          state: [234, 32, 145, 21]
        },
        params: {
          state: 'QRGTj6K-tdhEps0rgQ6S0h_UQkIij3sy_Cx8VGR0EIw'
        }
      }
    })

    it('should reject with mismatching state parameter', () => {
      response.request.state.push(123)
      return AuthenticationResponse.validateStateParam(response)
        .should.be
        .rejectedWith('Mismatching state parameter in authentication response')
    })

    it('should resolve with its argument', () => {
      return AuthenticationResponse.validateStateParam(response)
        .should.be.eventually.equal(response)
    })
  })

  /**
   * errorResponse
   */
  describe('errorResponse', () => {
    it('should reject with error response', () => {
      return AuthenticationResponse.errorResponse({
        params: {
          error: 'access_denied'
        }
      }).should.be.rejectedWith('access_denied')
    })

    it('should resolve with its argument', () => {
      let response = { params: {} }
      return AuthenticationResponse.errorResponse(response)
        .should.eventually.equal(response)
    })
  })

  /**
   * validateResponseMode
   */
  describe('validateResponseMode', () => {
    let response

    beforeEach(() => {
      response = {
        request: { response_type: 'id_token token' },
        mode: 'fragment'
      }
    })

    it('should throw with `query` mode for non-"code" response type', () => {
      expect(() => {
        response.mode = 'query'
        AuthenticationResponse.validateResponseMode(response)
      }).to.throw('Invalid response mode')
    })

    it('should return its argument with valid response mode', () => {
      AuthenticationResponse.validateResponseMode(response)
        .should.equal(response)
    })
  })

  /**
   * validateResponseParams
   */
  describe('validateResponseParams', () => {
    let response

    beforeEach(() => {
      response = {
        request: { response_type: 'code id_token token' },
        params: {
          code: 'c0d3',
          id_token: 'jwt',
          access_token: 'r4nd0m',
          token_type: 'bearer'
        }
      }
    })

    it('should throw with missing authorization code', () => {
      expect(() => {
        delete response.params.code
        AuthenticationResponse.validateResponseParams(response)
      }).to.throw('Missing authorization code in authentication response')
    })

    it('should throw with missing id_token', () => {
      expect(() => {
        delete response.params.id_token
        AuthenticationResponse.validateResponseParams(response)
      }).to.throw('Missing id_token in authentication response')
    })

    it('should throw with missing access_token', () => {
      expect(() => {
        delete response.params.access_token
        AuthenticationResponse.validateResponseParams(response)
      }).to.throw('Missing access_token in authentication response')
    })

    it('should throw with missing token_type', () => {
      expect(() => {
        delete response.params.token_type
        AuthenticationResponse.validateResponseParams(response)
      }).to.throw('Missing token_type in authentication response')
    })

    it('should return its argument with expected parameters', () => {
      AuthenticationResponse
        .validateResponseParams(response)
        .should.equal(response)
    })
  })

  /**
   * exchangeAuthorizationCode
   */
  describe('exchangeAuthorizationCode', () => {
    it('should not exchange the code unless response type is exactly `code`')
    it('should exchange the code if response type is exactly `code`')
    it('should throw with a public client')
    it('should set Content-Type header')
    it('should include grant_type in the request')
    it('should include authozation_code in the request')
    it('should include redirect_uri in the request')
    it('should authenticate client with HTTP Basic credentials')
    it('should authenticate client with form POST credentials')
    it('should authenticate client with JWT')
    it('should validate the presence of access_token in token response')
    it('should validate the presence of token_type in token response')
    it('should validate the presence of id_token in token response')
    it('should include token response in response params')
    it('should return its argument')
  })

  /**
   * validateIDToken
   */

  /**
   * decodeIDToken
   */
  describe('decodeIDToken', () => {
    let response, jwt

    beforeEach(() => {
      jwt = 'eyJhbGciOiJSUzI1NiIsImtpZCI6InI0bmQwbWJ5dDNzIn0.eyJpc3MiOiJodHRwczovL2ZvcmdlLmFudmlsLmlvIn0.FMer-lRR4Q4BVivMc9sl-jF3c-QWEenlH2pcW9oXTsiPRSEzc7lgPEryuXTimoToSKwWFgVpnjXKnmBaTaPVLpuRUMwGUeIUdQu0bQC-XEo-TKlwlqtUgelQcF2viEQwxU04UQaXWBh9ZDTIOutfXcjyhEPiMfCFLxT_aotR0zipmAi825lF1qBmxKrCv4c_9_46ACuaeuET6t0XvcAMDf3fjkEdw_0KPN2wnAlp2AwPP05D8Nwn8NqDAlljdN7bjnO99uJvhNWbvZgBYfhNXkMeDVJcukv0j3Cz6LCgedbXdX0rzJv_4qkO6l-LU9QeK1s0kwHfRUIWoa0TLJ4FtQ'
      response = { params: { id_token: jwt } }
    })

    it('should decode id_token response parameter', () => {
      AuthenticationResponse.decodeIDToken(response).decoded
        .should.be.instanceof(JWT)
    })

    it('should ignore response without id_token', () => {
      delete response.params.id_token
      expect(AuthenticationResponse.decodeIDToken(response).decoded)
        .to.be.undefined
    })

    it('should return its argument', () => {
      AuthenticationResponse.decodeIDToken(response).should.equal(response)
    })
  })

  /**
   * validateIssuer
   */
  describe('validateIssuer', () => {
    let response

    beforeEach(() => {
      response = {
        rp: {
          provider: {
            configuration: {
              issuer: 'https://forge.anvil.io'
            }
          }
        },
        decoded: {
          payload: {
            iss: 'https://forge.anvil.io'
          }
        }
      }
    })

    it('should throw with mismatching issuer', () => {
      expect(() => {
        response.decoded.payload.iss = 'https://example.com'
        AuthenticationResponse.validateIssuer(response)
      }).to.throw('Mismatching issuer in ID Token')
    })

    it('should return its argument', () => {
      AuthenticationResponse.validateIssuer(response).should.equal(response)
    })
  })

  /**
   * validateAudience
   */
  describe('validateAudience', () => {
    let response

    beforeEach(() => {
      response = {
        rp: {
          registration: {
            client_id: 'uuid'
          }
        },
        decoded: {
          payload: {
            aud: 'uuid'
          }
        }
      }
    })

    it('should throw with mismatching string audience', () => {
      expect(() => {
        response.decoded.payload.aud = 'other'
        AuthenticationResponse.validateAudience(response)
      }).to.throw('Mismatching audience in id_token')
    })

    it('should throw with missing client in audience list', () => {
      expect(() => {
        response.decoded.payload.aud = ['other']
        AuthenticationResponse.validateAudience(response)
      }).to.throw('Mismatching audience in id_token')
    })

    it('should throw with missing authorized party', () => {
      expect(() => {
        response.decoded.payload.aud = ['other', 'uuid']
        AuthenticationResponse.validateAudience(response)
      }).to.throw('Missing azp claim in id_token')
    })

    it('should throw with mismatching authorized party', () => {
      expect(() => {
        response.decoded.payload.aud = ['other', 'uuid']
        response.decoded.payload.azp = 'wrong'
        AuthenticationResponse.validateAudience(response)
      }).to.throw('Mismatching azp claim in id_token')
    })

    it('should return its argument', () => {
      AuthenticationResponse.validateAudience(response).should.equal(response)
    })
  })

  /**
   * resolveKeys
   */

  /**
   * verifySignature
   */
  describe('verifySignature', () => {
    let response

    beforeEach(() => {
      let token = new IDToken({
        header: {
          alg: 'RS256',
          kid: 'r4nd0mbyt3s'
        },
        payload: {
          iss: 'https://forge.anvil.io',
          sub: 'uid',
          aud: 'cid',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          nonce: 'n0nc3'
        },
        key: RsaPrivateCryptoKey
      })

      return token.encode().then(jwt => {
        let decoded = IDToken.decode(jwt)
        decoded.key = RsaPublicCryptoKey
        response = {
          decoded,
          rp: {
            registration: {
              id_token_signed_response_alg: 'RS256'
            }
          }
        }
      })
    })

    it('should throw with mismatching signing algorithm', () => {
      expect(() => {
        response.rp.registration['id_token_signed_response_alg'] = 'HS256'
        AuthenticationResponse.verifySignature(response)
      }).to.throw('Expected ID Token to be signed with HS256')
    })

    it('should reject with invalid ID Token signature', () => {
      response.decoded.signature += 'wrong'
      return AuthenticationResponse.verifySignature(response)
        .should.be.rejectedWith('Invalid ID Token signature')
    })

    it('should resolve its argument', () => {
      return AuthenticationResponse.verifySignature(response)
        .should.eventually.equal(response)
    })
  })

  /**
   * validateExpires
   */
  describe('validateExpires', () => {
    let response

    beforeEach(() => {
      let token = new IDToken({
        header: {
          alg: 'RS256',
          kid: 'r4nd0mbyt3s'
        },
        payload: {
          iss: 'https://forge.anvil.io',
          sub: 'uid',
          aud: 'cid',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          nonce: 'n0nc3'
        },
        key: RsaPrivateCryptoKey
      })

      return token.encode().then(jwt => {
        let decoded = IDToken.decode(jwt)
        decoded.key = RsaPublicCryptoKey
        response = {
          decoded,
          rp: {
            registration: {
              id_token_signed_response_alg: 'RS256'
            }
          }
        }
      })
    })

    it('should throw with expired ID Token', () => {
      expect(() => {
        response.decoded.payload.exp -= 7200
        AuthenticationResponse.validateExpires(response)
      }).to.throw('Expired ID Token')
    })

    it('should return its argument', () => {
      AuthenticationResponse.validateExpires(response).should.equal(response)
    })
  })

  /**
   * verifyNonce
   */
  describe('verifyNonce', () => {
    let response

    beforeEach(() => {
      let token = new IDToken({
        header: {
          alg: 'RS256',
          kid: 'r4nd0mbyt3s'
        },
        payload: {
          iss: 'https://forge.anvil.io',
          sub: 'uid',
          aud: 'cid',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          nonce: 'QRGTj6K-tdhEps0rgQ6S0h_UQkIij3sy_Cx8VGR0EIw'
        },
        key: RsaPrivateCryptoKey
      })

      return token.encode().then(jwt => {
        let decoded = IDToken.decode(jwt)
        decoded.key = RsaPublicCryptoKey
        response = {
          decoded,
          request: {
            nonce: [234, 32, 145, 21]
          }
        }
      })
    })

    it('should throw with missing nonce claim', () => {
      delete response.decoded.payload.nonce
      expect(() => {
        AuthenticationResponse.verifyNonce(response)
      }).to.throw('Missing nonce in ID Token')
    })

    it('should reject with mismatching nonce claim', () => {
      response.request.nonce.push(123)
      return AuthenticationResponse.verifyNonce(response)
        .should.be
        .rejectedWith('Mismatching nonce in ID Token')
    })

    it('should resolve with its argument', () => {
      return AuthenticationResponse.verifyNonce(response)
        .should.be.eventually.equal(response)
    })
  })

  /**
   * validateAcr
   */

  /**
   * validateAccessTokenHash
   */

  /**
   * validateAuthorizationCodeHash
   */
})
