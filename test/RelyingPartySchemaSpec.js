'use strict'

/**
 * Test dependencies
 */
const chai = require('chai')

/**
 * Assertions
 */
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const RelyingPartySchema = require('../src/RelyingPartySchema')

/**
 * Tests
 */
describe('RelyingPartySchema', () => {
  it('should be an instance of JSONSchema')
  it('should define "provider"')
  it('should define "provider.name" type')
  it('should define "provider.url" type')
  it('should define "provider.url" format')
  it('should require "provider.url" property')
  it('should define "provider.configuration"')
  it('should define "provider.jwks"')
  it('should define "defaults"')
  it('should define "defaults.authenticate"')
  it('should define "defaults.authenticate.redirect_uri" type')
  it('should define "defaults.authenticate.redirect_uri" format')
  it('should define "defaults.authenticate.response_type" type')
  it('should define "defaults.authenticate.response_type" default')
  it('should define "defaults.authenticate.response_type" enum')
  it('should define "defaults.authenticate.display" type')
  it('should define "defaults.authenticate.display" default')
  it('should define "defaults.authenticate.display" enum')
  it('should define "defaults.authenticate.scope" type')
  it('should define "defaults.authenticate.scope" default')
  it('should define "defaults.register" object')
  it('should define "registration"')
  it('should define "store" type')
  it('should define "store" default')
})

