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
const AccessToken = require('../src/AccessToken')
const AccessTokenSchema = require('../src/AccessTokenSchema')

/**
 * Tests
 */
describe('AccessToken', () => {
  describe('schema', () => {
    it('should be AccessTokenSchema', () => {
      AccessToken.schema.should.equal(AccessTokenSchema)
    })
  })
})
