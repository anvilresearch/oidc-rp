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
describe.only('AuthenticationRequest', () => {

  /**
   * constructor
   */
  describe('constructor', () => {
    it('should assign argument properties', () => {
      let provider = { url : 'https://forge.anvil.io' }
      let store = {}
      let request = new AuthenticationRequest({ provider, store })
      request.provider.should.equal(provider)
      request.store.should.equal(store)
    })

    it('should assert the provider property is present', () => {
      expect(() => {
        new AuthenticationRequest({})
      }).to.throw('Provider must be configured for RelyingParty')
    })

    it('should assert the provider url is defined', () => {
      expect(() => {
        new AuthenticationRequest({ provider: {} })
      }).to.throw('Provider URL must be configured for RelyingParty')
    })

    it('should assert the session store is defined', () => {
      expect(() => {
        new AuthenticationRequest({ provider: { url: 'https://forge.anvil.io' } })
      }).to.throw('A session store must be configured for RelyingParty')
    })
  })

  /**
   * popup
   */
  describe('popup', () => {
    // this only matters in the browser
    if (typeof window !== 'undefined') {
      it('should set "width"', () => {
        AuthenticationRequest.popup(500, 300).should.include('width=red')
      })

      it('should set "height"')
      it('should set "left"')
      it('should set "top"')
      it('should set "dialog"')
      it('should set "dependent"')
      it('should set "scrollbars"')
      it('should set "location"')
    }
  })

  /**
   * submit
   */
  describe('submit', () => {
    if (typeof window !== 'undefined') {
      describe('popup', () => {
        it('should open the authentication request URI in a new window')
      })

      describe('page', () => {
        it('should set window location')
      })
    }
  })

  /**
   * uri
   */
  describe('uri', () => {
    let request

    beforeEach(() => {
      request = new AuthenticationRequest({
        provider: {
          url: 'https://forge.anvil.io',
          configuration: {
            authorization_endpoint: 'https://forge.anvil.io/authorize'
          }
        },
        defaults: {
          authenticate: {
            response_type: 'id_token token',
            redirect_uri: 'https://app.anvil.io/callback',
            scope: 'openid profile'
          }
        },
        registration: {
          client_id: 'uuid'
        },
        store: {}
      })
    })

    it('return a promise', () => {
      return request.uri().should.eventually.be.fulfilled
    })

    it('should reject with missing OpenID Configuration', () => {
      delete request.provider.configuration
      return request.uri()
        .should.be.rejectedWith('OpenID Configuration required')
    })

    it('should reject with missing authorize endpoint', () => {
      delete request.provider.configuration.authorization_endpoint
      return request.uri()
        .should.be.rejectedWith(
          'OpenID Configuration does not specify the authorization endpoint'
        )
    })

    it('should reject with missing client registration', () => {
      delete request.registration
      return request.uri()
        .should.be.rejectedWith(
          'Registration must be provided for the RelyingParty.'
        )
    })

    it('should reject with missing redirect uri', () => {
      delete request.defaults.authenticate.redirect_uri
      return request.uri()
        .should.be.rejectedWith(
          'Redirect URI must be provided for the authentication request.'
        )
    })

    it('should set client_id param', () => {
      return request.uri().then(uri => {
        uri.should.include('client_id=uuid')
      })
    })

    it('should set redirect_uri param', () => {
      return request.uri().then(uri => {
        uri.should.include('redirect_uri=https%3A%2F%2Fapp.anvil.io%2Fcallback')
      })
    })

    it('should set response_type param', () => {
      return request.uri().then(uri => {
        uri.should.include('response_type=id_token%20token')
      })
    })

    it('should set scope param', () => {
      return request.uri().then(uri => {
        uri.should.include('scope=openid%20profile')
      })
    })

    it('should set display param', () => {
      return request.uri({ display: 'popup' }).then(uri => {
        uri.should.include('display=popup')
      })
    })

    it('should set nonce param', () => {
      return request.uri().then(uri => {
        uri.should.include('nonce=')
      })
    })

    it('should set param from options', () => {
      return request.uri({ scope: 'openid email' }).then(uri => {
        uri.should.include('scope=openid%20email')
      })
    })

    it('should set additional param', () => {
      return request.uri({ just: 'because' }).then(uri => {
        uri.should.include('just=because')
      })
    })
  })

  /**
   * nonce
   */
  describe('nonce', () => {
    let request

    beforeEach(() => {
      request = new AuthenticationRequest({
        provider: {
          url: 'https://forge.anvil.io',
          configuration: {
            authorization_endpoint: 'https://forge.anvil.io/authorize'
          }
        },
        defaults: {
          authenticate: {
            response_type: 'id_token token'

          }
        },
        registration: {
          client_id: 'uuid'
        },
        store: {}
      })
    })

    it('should reject with missing client registration', () => {
      delete request.registration
      return request.nonce()
        .should.be.rejectedWith('Missing client registration')
    })

    it('should reject with missing client id', () => {
      delete request.registration.client_id
      return request.nonce()
        .should.be.rejectedWith('Client registration is missing client_id.')
    })

    it('should store random nonce value in session', () => {
      return request.nonce().then(() => {
        request.store.should.have.property('uuid:nonce')
      })
    })

    it('should resolve SHA-256 digest of random value', () => {
      return request.nonce().then(nonce => {
        (typeof nonce).should.equal('string')
        nonce.length.should.equal(43)
      })
    })
  })
})

