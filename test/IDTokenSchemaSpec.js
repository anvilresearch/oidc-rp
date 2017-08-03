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
const {JSONSchema} = require('@trust/json-document')
const IDTokenSchema = require('../src/IDTokenSchema')

/**
 * Tests
 */
describe('IDTokenSchema', () => {
  const header = IDTokenSchema.properties.header
  const payload = IDTokenSchema.properties.payload

  it.skip('should be an instance of JSONSchema', () => {
    IDTokenSchema.should.be.instanceof(JSONSchema)
  })

  it.skip('should require "header" to not have "x5u" property', () => {
    header.not.required.should.include('x5u')
  })

  it.skip('should require "header" to not have "x5c" property', () => {
    header.not.required.should.include('x5c')
  })

  it.skip('should require "header" to not have "jku" property', () => {
    header.not.required.should.include('jku')
  })

  it.skip('should require "header" to not have "jwk" property', () => {
    header.not.required.should.include('jwk')
  })

  it('should define "payload.iss" type', () => {
    payload.properties.iss.type.should.equal('string')
  })

  it('should define "payload.iss" format', () => {
    payload.properties.iss.format.should.equal('url')
  })

  it('should define "payload.sub" type', () => {
    payload.properties.sub.type.should.equal('string')
  })

  it('should define "payload.sub" maxLength', () => {
    payload.properties.sub.maxLength.should.equal(255)
  })

  it('should define "payload.aud" type', () => {
    payload.properties.aud.type.should.eql(['array', 'string'])
  })

  it('should define "payload.aud" items', () => {
    payload.properties.aud.items.should.exist()
  })

  it('should define "payload.aud" items format', () => {
    payload.properties.aud.items.format.should.equal('StringOrURI')
  })

  it('should define "payload.exp" type', () => {
    payload.properties.exp.type.should.equal('number')
  })

  it('should define "payload.exp" format', () => {
    payload.properties.exp.format.should.equal('NumericDate')
  })

  it('should define "payload.iat" type', () => {
    payload.properties.iat.type.should.equal('number')
  })

  it('should define "payload.iat" format', () => {
    payload.properties.iat.format.should.equal('NumericDate')
  })

  it('should define "payload.auth_time" type', () => {
    payload.properties.auth_time.type.should.equal('integer')
  })

  it('should define "payload.auth_time" format', () => {
    payload.properties.iat.format.should.equal('NumericDate')
  })

  it('should define "payload.nonce" type', () => {
    payload.properties.nonce.type.should.equal('string')
  })

  it('should define "payload.acr" type', () => {
    payload.properties.nonce.type.should.equal('string')
  })

  it('should define "payload.amr" type', () => {
    payload.properties.amr.type.should.equal('array')
  })

  it('should define "payload.amr" items', () => {
    payload.properties.amr.items.should.exist()
  })

  it('should define "payload.amr" items type', () => {
    payload.properties.amr.items.type.should.equal('string')
  })

  it('should define "payload.azp" type', () => {
    payload.properties.azp.type.should.equal('string')
  })

  it('should define "payload.azp" format', () => {
    payload.properties.azp.format.should.equal('StringOrURI')
  })

  it('should require "payload" to have "iss" property', () => {
    payload.required.should.include('iss')
  })

  it('should require "payload" to have "sub" property', () => {
    payload.required.should.include('sub')
  })

  it('should require "payload" to have "aud" property', () => {
    payload.required.should.include('aud')
  })

  it('should require "payload" to have "exp" property', () => {
    payload.required.should.include('exp')
  })

  it('should require "payload" to have "iat" property', () => {
    payload.required.should.include('iat')
  })
})

