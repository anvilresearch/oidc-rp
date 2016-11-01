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
const AuthenticationRequest = require('../src/AuthenticationRequest')

/**
 * Tests
 */
describe('AuthenticationRequest', () => {
  let rp, options, session

  beforeEach(() => {
    rp = {
      provider: {
        configuration: {
          issuer: 'https://forge.anvil.io',
          authorization_endpoint: 'https://forge.anvil.io/authorize'
        }
      },
      defaults: {
        authenticate: {
          scope: 'openid',
          response_type: 'id_token token',
          redirect_uri: 'https://example.com/callback'
        }
      },
      registration: {
        client_id: 'uuid'
      }
    }

    options = {}
    session = {}
  })

  describe('create', () => {
    it('should return a promise', () => {
      AuthenticationRequest.create(rp, options, session)
        .should.be.instanceof(Promise)
    })

    it('should reject with missing OpenID Configuration', () => {
      delete rp.provider.configuration
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('RelyingParty provider OpenID Configuration is missing')
    })

    it('should reject with missing default parameters', () => {
      delete rp.defaults.authenticate
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('RelyingParty default authentication parameters are missing')
    })

    it('should reject with missing client registration', () => {
      delete rp.registration
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('RelyingParty client registration is missing')
    })

    it('should reject with missing issuer', () => {
      delete rp.provider.configuration.issuer
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('Missing issuer in provider OpenID Configuration')
    })

    it('should reject with missing authorization endpoint', () => {
      delete rp.provider.configuration.authorization_endpoint
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('Missing authorization_endpoint in provider OpenID Configuration')
    })
    it('should reject with missing `scope` parameter', () => {
      delete rp.defaults.authenticate.scope
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('Missing scope parameter in authentication request')
    })

    it('should reject with missing `response_type` parameter', () => {
      delete rp.defaults.authenticate.response_type
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('Missing response_type parameter in authentication request')
    })

    it('should reject with missing `client_id` parameter', () => {
      delete rp.registration.client_id
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('Missing client_id parameter in authentication request')
    })

    it('should reject with missing `redirect_uri` parameter', () => {
      delete rp.defaults.authenticate.redirect_uri
      return AuthenticationRequest.create(rp, options, session)
        .should.be
        .rejectedWith('Missing redirect_uri parameter in authentication request')
    })

    it('should persist the request to session by `state` param', () => {
      return AuthenticationRequest.create(rp, options, session).then(() => {
        for (let key in session) {
          key.should.include('https://forge.anvil.io/requestHistory/')
          key.split('/').pop().length.should.equal(43)
        }
      })
    })

    it('should persist the random octets for `state` to session', () => {
      return AuthenticationRequest.create(rp, options, session).then(() => {
        for (let key in session) {
          let octets = JSON.parse(session[key]).state
          octets.forEach(octet => {
            expect(Number.isInteger(octet)).to.equal(true)
          })
        }
      })
    })

    it('should persist the random octets for `nonce` to session', () => {
      return AuthenticationRequest.create(rp, options, session).then(() => {
        for (let key in session) {
          let octets = JSON.parse(session[key]).nonce
          octets.forEach(octet => {
            expect(Number.isInteger(octet)).to.equal(true)
          })
        }
      })
    })

    it('should resolve an authentication request URI', () => {
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.should.include('https://forge.anvil.io/authorize?')
      })
    })

    it('should set default paramters', () => {
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.should.include('scope=openid')
        url.should.include('response_type=id_token%20token')
        url.should.include('redirect_uri=https%3A%2F%2Fexample.com%2Fcallback')
      })
    })

    it('should override default paramters', () => {
      options = { scope: 'openid profile email' }
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.should.include('scope=openid%20profile%20email')
      })
    })

    it('should set `client_id` parameter', () => {
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.should.include('client_id=uuid')
      })
    })

    it('should set `state` parameter', () => {
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.split('state=').pop().split('&').shift().length.should.equal(43)
      })
    })

    it('should set `nonce` parameter', () => {
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.split('nonce=').pop().split('&').shift().length.should.equal(43)
      })
    })

    it('should set optional parameters', () => {
      options = { display: 'page' }
      return AuthenticationRequest.create(rp, options, session).then(url => {
        url.should.include('display=page')
      })
    })

    it('should optionally encode parameters as JWT')
  })
})

