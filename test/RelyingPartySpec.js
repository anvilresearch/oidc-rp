'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')
const nock = require('nock')

/**
 * Assertions
 */
chai.use(require('chai-as-promised'))
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const RelyingParty = require('../src/RelyingParty')

/**
 * Tests
 */
describe('RelyingParty', () => {
  describe('class', () => {
    it('should inherit from JSONDocument')
  })

  describe('schema', () => {
    it('should by the RelyingPartySchema')
  })

  describe('from', () => {
    it('should reject with invalid argument')
    it('should request JWK Set if missing from argument')
    it('should import JWK Set if defined in argument')
  })

  describe('static register', () => {
    it('should return a promise')
    it('should resolve a RelyingParty instance')
    it('should request OpenID configuration')
    it('should import provider JWK Set')
    it('should register a client')
  })

  describe('discover', () => {
    it('return a promise')

    it('should reject with missing provider url (issuer)', () => {
      let rp = new RelyingParty({ provider: {} })

      rp.discover().should.be.rejectedWith(/RelyingParty provider must define "url"/)
    })

    it('should resolve and set provider OpenID Configuration', () => {
      let providerUrl = 'https://provider.example.com'
      let providerConfig = { issuer: providerUrl /* etc ...*/ }

      nock(providerUrl).get('/.well-known/openid-configuration')
        .reply(200, providerConfig)

      let rp = new RelyingParty({ provider: { url: providerUrl }})

      return rp.discover()
        .then(() => {
          expect(rp.provider.configuration).to.eql(providerConfig)
        })
    })
  })

  describe('jwks', () => {
    let providerUrl, testJwks

    before(() => {
      providerUrl = 'https://provider.example.com'
      testJwks = require('./resources/jwks.json')
      nock(providerUrl).get('/jwks').reply(200, testJwks)
    })

    it('return a promise')

    it('should reject with missing OpenID Configuration', () => {
      let rp = new RelyingParty({ provider: {} })

      rp.jwks().should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should reject with missing jwks uri', () => {
      let rp = new RelyingParty({ provider: { configuration: {} } })

      rp.jwks().should.be.rejectedWith(/OpenID Configuration is missing jwks_uri/)
    })

    it('should import JWKs')

    it('should set provider JWK Set', () => {
      let provider = {
        url: providerUrl,
        configuration: { jwks_uri: providerUrl + '/jwks' }
      }
      let rp = new RelyingParty({ provider })

      return rp.jwks()
        .then(() => {
          // console.log(rp.provider.jwks)
          expect(rp.provider).to.have.property('jwks')
        })
    })

    it('should resolve JWK Set')
  })

  describe('logout', () => {
    it('should reject with missing OpenID Configuration', () => {
      let rp = new RelyingParty()

      rp.logout().should.be.rejectedWith(/OpenID Configuration is not initialized/)
    })

    it('should reject with missing end_session_endpoint', () => {
      let options = {
        provider: {
          configuration: { issuer: 'https://forge.anvil.io' }
        }
      }
      let rp = new RelyingParty(options)

      rp.logout().should.be.rejectedWith(/OpenID Configuration is missing end_session_endpoint/)
    })

    it('should make a request to the end_session_endpoint')
  })

  describe('register', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing registration endpoint')
    it('should resolve registration')
    it('should set client registration')
  })

  describe('userinfo', () => {
    it('return a promise')
    it('should reject with missing OpenID Configuration')
    it('should reject with missing userinfo endpoint')
    it('should reject with missing access token')
    it('should resolve parsed JSON response')
  })
})
