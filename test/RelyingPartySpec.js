'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')
const nock = require('nock')
const sinon = require('sinon')

/**
 * Assertions
 */
chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const RelyingParty = require('../src/RelyingParty')
const RelyingPartySchema = require('../src/RelyingPartySchema')
const AuthenticationRequest = require('../src/AuthenticationRequest')
const AuthenticationResponse = require('../src/AuthenticationResponse')

/**
 * Tests
 */
describe('RelyingParty', () => {
  const providerUrl = 'https://example.com'
  const providerConfig = require('./resources/example.com/openid-configuration.json')
  const providerJwks = require('./resources/example.com/jwks.json')
  const rpRegistration = require('./resources/example.com/registration.json')
  const rpProviderConfig = require('./resources/example.com/rp-provider-config.json')

  afterEach(() => {
    nock.cleanAll()
  })

  describe('schema', () => {
    it('should reference the RelyingPartySchema', () => {
      RelyingParty.schema.should.equal(RelyingPartySchema)
    })
  })

  describe('from', () => {
    it('should reject with invalid argument', () => {
      return RelyingParty.from({ provider: {} })
        .should.be.rejectedWith(/"valid":false/)
    })

    it('should reject if provider config is absent', () => {
      let options = {
        provider: { url: providerUrl }
      }

      return RelyingParty.from(options)
        .should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should request JWK Set if missing from argument', () => {
      let jwkRequest = nock(providerUrl).get('/jwks').reply(200, providerJwks)

      let options = {
        provider: {
          url: providerUrl,
          configuration: rpProviderConfig
        }
      }

      return RelyingParty.from(options)
        .then(rp => {
          expect(rp.provider.jwks.keys[0].alg).to.equal('RS256')
          expect(jwkRequest.isDone()).to.be.true()
        })
    })

    it('should import JWK Set if defined in argument', () => {
      let jwkRequest = nock(providerUrl).get('/jwks').reply(200, providerJwks)

      let options = {
        provider: {
          url: providerUrl,
          configuration: rpProviderConfig,
          jwks: providerJwks
        }
      }

      return RelyingParty.from(options)
        .then(rp => {
          expect(rp.provider.jwks.keys[0].alg).to.equal('RS256')
          // nock request should not have been made
          expect(jwkRequest.isDone()).to.be.false()
        })
    })
  })

  describe('static register', () => {
    let registrationOptions = {}
    let options = {}

    beforeEach(() => {
      nock(providerUrl).get('/.well-known/openid-configuration')
        .reply(200, providerConfig)
      nock(providerUrl).get('/jwks')
        .reply(200, providerJwks)
      nock(providerUrl).post('/register')
        .reply(201, rpRegistration)
    })

    it('should resolve a RelyingParty instance', () => {
      return RelyingParty.register(providerUrl, registrationOptions, options)
        .then(rp => {
          expect(rp).to.be.instanceof(RelyingParty)
        })
    })

    it('should request provider OpenID configuration', () => {
      return RelyingParty.register(providerUrl, registrationOptions, options)
        .then(rp => {
          let providerConfig = rp.provider.configuration

          expect(providerConfig).to.exist()
          expect(providerConfig['registration_endpoint'])
            .to.equal('https://example.com/register')
        })
    })

    it('should import provider JWK Set', () => {
      return RelyingParty.register(providerUrl, registrationOptions, options)
        .then(rp => {
          let providerJwks = rp.provider.jwks

          expect(providerJwks).to.exist()
          expect(providerJwks.keys[0].alg).to.equal('RS256')
        })
    })

    it('should register a client', () => {
      return RelyingParty.register(providerUrl, registrationOptions, options)
        .then(rp => {
          expect(rp.registration).to.eql(rpRegistration)
        })
    })
  })

  describe('discover', () => {
    beforeEach(() => {
      nock(providerUrl).get('/.well-known/openid-configuration')
        .reply(200, providerConfig)
    })

    it('should reject with missing provider url (issuer)', () => {
      let rp = new RelyingParty({ provider: {} })

      return rp.discover().should.be.rejectedWith(/RelyingParty provider must define "url"/)
    })

    it('should resolve and set provider OpenID Configuration', () => {
      let rp = new RelyingParty({ provider: { url: providerUrl }})

      return rp.discover()
        .then(() => {
          expect(rp.provider.configuration).to.eql(providerConfig)
        })
    })
  })

  describe('jwks', () => {
    beforeEach(() => {
      nock(providerUrl).get('/jwks').reply(200, providerJwks)
    })

    it('should reject with missing OpenID Configuration', () => {
      let rp = new RelyingParty({ provider: {} })

      return rp.jwks().should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should reject with missing jwks uri', () => {
      let rp = new RelyingParty({ provider: { configuration: {} } })

      return rp.jwks().should.be.rejectedWith(/OpenID Configuration is missing jwks_uri/)
    })

    it('should import and set provider JWK Set', () => {
      let provider = {
        url: providerUrl,
        configuration: { jwks_uri: providerUrl + '/jwks' }
      }
      let rp = new RelyingParty({ provider })

      return rp.jwks()
        .then(() => {
          expect(rp.provider).to.have.property('jwks')
        })
    })

    it('should resolve JWK Set', () => {
      let provider = {
        url: providerUrl,
        configuration: { jwks_uri: providerUrl + '/jwks' }
      }
      let rp = new RelyingParty({ provider })

      return rp.jwks()
        .then(jwks => {
          expect(jwks.keys[0].alg).to.equal('RS256')
        })
    })
  })

  describe('logout', () => {
    it('should reject with missing OpenID Configuration', () => {
      let rp = new RelyingParty()

      return rp.logout().should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should reject with missing end_session_endpoint', () => {
      let options = {
        provider: {
          configuration: { issuer: 'https://forge.anvil.io' }
        }
      }
      let rp = new RelyingParty(options)

      return rp.logout().should.be.rejectedWith(/OpenID Configuration is missing end_session_endpoint/)
    })

    it('should make a request to the end_session_endpoint', () => {
      let logoutRequest = nock(providerUrl).get('/logout').reply(200)

      let provider = {
        url: providerUrl,
        configuration: rpProviderConfig
      }
      let rp = new RelyingParty({ provider })

      return rp.logout()
        .then(() => {
          expect(logoutRequest.isDone()).to.be.true()
        })
    })
  })

  describe('register', () => {
    beforeEach(() => {
      nock(providerUrl).get('/.well-known/openid-configuration')
        .reply(200, providerConfig)
      nock(providerUrl).get('/jwks')
        .reply(200, providerJwks)
      nock(providerUrl).post('/register')
        .reply(201, rpRegistration)
    })

    it('should reject with missing OpenID Configuration', () => {
      let options = { provider: {} }
      let rp = new RelyingParty(options)

      return rp.register().should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should reject with missing registration endpoint', () => {
      let options = {
        provider: {
          configuration: { issuer: providerUrl }
        }
      }
      let rp = new RelyingParty(options)

      return rp.register().should.be.rejectedWith(/OpenID Configuration is missing registration_endpoint/)
    })

    it('should resolve client registration', () => {
      let options = {
        provider: {
          configuration: {
            issuer: providerUrl,
            'registration_endpoint': 'https://example.com/register'
          }
        }
      }
      let rp = new RelyingParty(options)

      return rp.register()
        .then(response => {
          expect(response).to.eql(rpRegistration)
        })
    })

    it('should set client registration', () => {
      let options = {
        provider: {
          configuration: {
            issuer: providerUrl,
            'registration_endpoint': 'https://example.com/register'
          }
        }
      }
      let rp = new RelyingParty(options)

      return rp.register()
        .then(() => {
          expect(rp.registration).to.eql(rpRegistration)
        })
    })
  })

  describe('userinfo', () => {
    it('should reject with missing OpenID Configuration', () => {
      let options = { provider: {} }
      let rp = new RelyingParty(options)

      return rp.userinfo().should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should reject with missing userinfo endpoint', () => {
      let options = {
        provider: {
          configuration: { issuer: 'https://forge.anvil.io' }
        }
      }
      let rp = new RelyingParty(options)

      return rp.userinfo().should.be.rejectedWith(/OpenID Configuration is missing userinfo_endpoint/)
    })

    it('should reject with missing access token', () => {
      let options = {
        provider: { configuration: rpProviderConfig },
        store: {}
      }
      let rp = new RelyingParty(options)

      return rp.userinfo()
        .should.be.rejectedWith(/Missing access token./)
    })

    it('should resolve parsed JSON response', () => {
      let userinfo = { sub: 'user123' }
      let userInfoReq = nock(providerUrl).get('/userinfo')
        .reply(200, userinfo)

      let options = {
        provider: { configuration: rpProviderConfig },
        store: { 'access_token': '1234' }
      }
      let rp = new RelyingParty(options)

      return rp.userinfo()
        .then(res => {
          expect(res).to.eql(userinfo)
          expect(userInfoReq.isDone()).to.be.true()
        })
    })
  })

  describe('serialize', () => {
    it('should return a JSON serialization', () => {
      let rp = new RelyingParty({})

      expect(rp.serialize()).to.equal('{"defaults":{"authenticate":{"response_type":"id_token token","display":"page","scope":["openid"]}},"store":{}}')
    })
  })

  describe('createRequest', () => {
    after(() => {
      AuthenticationRequest.create.restore()
    })

    it('should create an AuthenticationRequest instance', () => {
      let request = {}
      sinon.stub(AuthenticationRequest, 'create').resolves(request)

      let store = {}
      let rp = new RelyingParty({ store })

      let options = {}

      return rp.createRequest(options)
        .then(res => {
          expect(res).to.equal(request)
          expect(AuthenticationRequest.create).to.have.been
            .calledWith(rp, options, store)
        })
    })
  })

  describe('validateResponse', () => {
    after(() => {
      AuthenticationResponse.validateResponse.restore()
    })

    it('should create an AuthenticationResponse instance', () => {
      let response = {}
      sinon.stub(AuthenticationResponse, 'validateResponse').resolves(response)

      let store = {}
      let rp = new RelyingParty({ store })

      let uri = 'https://app.example.com/callback'

      return rp.validateResponse(uri)
        .then(res => {
          expect(res).to.equal(response)
          expect(AuthenticationResponse.validateResponse).to.have.been
            .calledWith({ rp, session: store, redirect: uri })
        })
    })
  })
})
