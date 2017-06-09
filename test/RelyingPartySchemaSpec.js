'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.use(require('dirty-chai'))
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const {JSONSchema} = require('@trust/json-document')
const RelyingPartySchema = require('../src/RelyingPartySchema')

/**
 * Tests
 */
describe('RelyingPartySchema', () => {
  it('should be an instance of JSONSchema', () => {
    RelyingPartySchema.should.be.instanceof(JSONSchema)
  })

  describe('provider', () => {
    const provider = RelyingPartySchema.properties.provider

    it('should define "provider"', () => {
      expect(provider).to.exist()
    })

    it('should define "provider.name" type', () => {
      expect(provider.properties.name.type).to.equal('string')
    })

    it('should define "provider.url" type', () => {
      expect(provider.properties.url.type).to.equal('string')
    })

    it('should define "provider.url" format', () => {
      expect(provider.properties.url.format).to.equal('uri')
    })

    it('should require "provider.url" property', () => {
      expect(provider.required).to.eql(['url'])
    })

    it('should define "provider.configuration"', () => {
      expect(provider.properties.configuration).to.exist()
    })

    it('should define "provider.jwks"', () => {
      expect(provider.properties.jwks).to.exist()
    })
  })

  describe('defaults', () => {
    const defaults = RelyingPartySchema.properties.defaults
    const authenticate = defaults.properties.authenticate

    it('should define "defaults"', () => {
      expect(defaults).to.exist()
    })

    it('should define "defaults.authenticate"', () => {
      expect(authenticate).to.exist()
    })

    it('should define "defaults.authenticate.redirect_uri" type', () => {
      expect(authenticate.properties['redirect_uri'].type).to.equal('string')
    })

    it('should define "defaults.authenticate.redirect_uri" format', () => {
      expect(authenticate.properties['redirect_uri'].format).to.equal('uri')
    })

    it('should define "defaults.authenticate.response_type" type', () => {
      expect(authenticate.properties['response_type'].type).to.equal('string')
    })

    it('should define "defaults.authenticate.response_type" default', () => {
      expect(authenticate.properties['response_type'].default).to.equal('id_token token')
    })

    it('should define "defaults.authenticate.response_type" enum', () => {
      expect(authenticate.properties['response_type'].enum).to.eql([
        'code',
        'token',
        'id_token token',
        'id_token token code'
      ])
    })

    it('should define "defaults.authenticate.display" type', () => {
      expect(authenticate.properties['display'].type).to.equal('string')
    })

    it('should define "defaults.authenticate.display" default', () => {
      expect(authenticate.properties['display'].default).to.equal('page')
    })

    it('should define "defaults.authenticate.display" enum', () => {
      expect(authenticate.properties['display'].enum).to.eql([
        'page',
        'popup'
      ])
    })

    it('should define "defaults.authenticate.scope" type', () => {
      expect(authenticate.properties['scope'].type).to.eql(['string', 'array'])
    })

    it('should define "defaults.authenticate.scope" default', () => {
      expect(authenticate.properties['scope'].default).to.eql(['openid'])
    })

  })

  it('should define "defaults.register" object', () => {
    expect(RelyingPartySchema.properties.defaults.properties.register).to.exist()
  })

  it('should define "registration"', () => {
    expect(RelyingPartySchema.properties.registration).to.exist()
  })

  describe('store', () => {
    const store = RelyingPartySchema.properties.store

    it('should define "store" type', () => {
      expect(store.type).to.equal('object')
    })

    it('should define "store" default', () => {
      expect(store.default).to.eql({})
    })
  })
})

