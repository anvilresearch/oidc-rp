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
chai.use(require('chai-as-promised'))
chai.use(require('dirty-chai'))
chai.should()
let expect = chai.expect

/**
 * Code under test
 */
const PoPToken = require('../src/PoPToken')
const RelyingParty = require('../src/RelyingParty')
const TestKeys = require('./keys/index')

const providerUri = 'https://provider.example.com'
const clientId = 'https://app.example.com'

const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVHQlp5Y0NnTlNnIn0.eyJpc3MiOiJodHRwczovL2xkbm9kZS5sb2NhbDo4NDQzIiwic3ViIjoiaHR0cHM6Ly9kei5sZG5vZGUubG9jYWw6ODQ0My9wcm9maWxlL2NhcmQjbWUiLCJhdWQiOiI3NWRhN2I3ZTk4MWY5MDkwYjQwZDBmZDM2NWJhNjA1OCIsImV4cCI6MTUwMTg2Nzg4MiwiaWF0IjoxNTAxODY0MjgyLCJqdGkiOiIzYzJhMWUzNzVjNzE5ODlkIiwibm9uY2UiOiJCLXNHYnhobnBxM09PN0FSNGZRQ2RFeEhYV1V3UjBGVW9kbXhMaExueWZvIiwiYXpwIjoiNzVkYTdiN2U5ODFmOTA5MGI0MGQwZmQzNjViYTYwNTgiLCJjbmYiOnsiandrIjp7ImFsZyI6IlJTMjU2IiwiZSI6IkFRQUIiLCJleHQiOnRydWUsImtleV9vcHMiOlsidmVyaWZ5Il0sImt0eSI6IlJTQSIsIm4iOiJ0b0R4VVpKVHlRaVhDSHF4Z0F2Z1I1WTNNY25LdW1NTTFTZE5DT0wzM3pkZURBM0dTVWVNemFpanp6SGFESnpiU2VOcFljMUpWdFVTN2NnQmE0MFRzbnNVWEZEOUprZ3FCaVJnaVByd3R5N1J6LUZaeWlLazhCMDBWT1ZSaTFPSzN3dnc5UlBEbkRJWTZPdDFJWWJmODlLTUZkdVU1d1NVd0luUHBMWlk0RlgzNGNGTks0amNwbFVEdDNkNGZQYk1Ud19yOHNmLUZrTXAyVU40WEFnZFJxOUc2TDBUcmNWXzhiTTJfQ09KN2Z2WGRxR2VudmVTekxGMlZHOXpqUlBXRGNEQThQZVRQSUtteVFWMGhnMzg4Y0JQaE9nbTZCaUZkc3hNZ29kc2FSVDFKM2JzU0pEaHpPQ08zQ2toWUUtZTZlMlZYZzRHc0d4ei11ZTVWQnBWVVEifX0sImF0X2hhc2giOiIzRm43LXZ4Z29UVnZvOUpFRVpfUlZnIn0.lMawcNJn10JtRySV1zDq7jLKGCbSy71P3BJ1k5ZO_7ZhOx1zzktIjgcgdPaXq7OqZHyI_gVPBhF3YIVrzm2izDJP5ZKOMN0L3vjgnyp_545-rTolAoOHA1pw9bqSlU0_-eudouNlqTrTSzSSO7D92uLLRG2q2NTKxpNAnRFkfzOyJUCX2o9slKNINmUe3z978-nzycoN0mefvB16bm7qPykGQUh5KYReajUsLSDHbmdbYdH_PhKEIwgU18V4mZ94sbs0kN55N3pmXcutbuLtAxc-zzuIWJtnXghScd5X-ltCvhpsIAM4mDTjBzJMs44rjo4mCyDV6Jlpw7EJob_VZg&state=8Jx3Y-xn4yoFs0HGHtOfUzljQMHfMw4G2zmZFH4UF7k'

describe('PoPToken', () => {
  let rp

  beforeEach(() => {
    let rpOptions = {
      provider: { url: providerUri },
      registration: { client_id: clientId },
      store: {}
    }

    rp = new RelyingParty(rpOptions)

    rp.store[RelyingParty.SESSION_PRIVATE_KEY] = TestKeys.serializedPrivateKey
  })

  describe('issueFor', () => {
    it('should issue a PoP token', () => {
      return PoPToken.issueFor(providerUri, idToken, rp)
        .then(console.log)
    })
  })
})

