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
const {JSONSchema} = require('json-document')
const AccessTokenSchema = require('../src/AccessTokenSchema')

/**
 * Tests
 */
describe.skip('AccessTokenSchema', () => {
  let payload

  before(() => {
    payload = AccessTokenSchema.properties.payload
  })

  it('should be an instance of JSONSchema', () => {
    AccessTokenSchema.should.be.instanceof(JSONSchema)
  })

  it('should define "payload.iss" type', () => {
    payload.properties.scope.type.should.eql(['array', 'string'])
  })
})

