const CryptoKey = require('@trust/webcrypto/src/keys/CryptoKey')

/**
 * RsaPrivateKey
 */
const RsaPrivateKey =
`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAiEJoO1tBT1Yc9jdYWI5JUkMnOlFD+weoi1rkxsWvZoBRJJGi
fjrdmIn/5xOaaW38Cg535lo6NEorsVsq7V6zGan2QCT1TRCb7vJq4UIEq6tL5uB0
BZMyByKBYDKVGAinXYd502nJ1T7sbZQnSjZFC3HgDvrqb/4bDIbO0+sAiaTumt+2
uyIYcGYBuIfTi8vmElz2ngUFh+8K/uQyH7YjrOrg6ThOldh8IVzaOSA7LAb/DjyC
+H44F/J24qMRLGuWK53gz+2RazSBotiNUsGoxdZv30Sud3Yfbz9ZjSXxPWpRnG6m
ZAZW76oSbn8FvTSTWrf0iU6MyNkv/QuAjF+1BQIDAQABAoIBAHb3G8/vDad59NFX
Yu/2Urfa363/882BUztQQXv2bvycPbwi1u9E7+JVYjLbH667ExmopjBdSIIM2/b+
NQ2H5/EZPmGkovME9E/8ISrInBFR/nP2NfYEHOKz0qctopSYQZ/cP5ZAv7JKPNwz
RNZ7aW7jno8VrYfYIL+gF4ZYoGCLdIdw2rFaobZFGtUQ1ASpuBIS3NAQjxQLTdlz
jUXCqqE02VKVW6Chr/ZPDnsjDmVxZjY5+vLoZRyS4jWBR64fgVrA+FoCFqtbKh5X
ZCGUSRhGYs06XLlnjLn91ftgO6Di3FbQ2d4nrMRkD8ciOPv1iao429wKThiChTge
0DRF5SECgYEAvblqHOYDjdRTPV2rumoWKPzREhebi0ljKeMBFPvqVBM/IvOhqpVa
cBsDCNGHwkOo3lX+M+c8y381ZR66pJb5QpF7qfIjlOQEYQfLc31HErYcHiPtKSNj
L4HP5kAoZT4ILFZlfnVJP8oZ/S+BKO27juMwDVUk/wlI2CiN0a1oPWkCgYEAt9vB
+yjoWydrBXy5q4m0pMcTm9FZum9kahCXx/0QjYPLjxwX6+d8Tc1Y1/VROtQDAIxu
yMZxkboQ0L8uXtVQCjVz8hG1UDeqzISxLyTVP+JtD6yijhyrtQdgtokgAFzBHpYa
MKgr8tARtojF5EyWPTQJpBSI2+tl0GgwEOa3Gz0CgYB65SQLXCNpN+RDl+2pbxaz
rjBvm8Mx0nPdqiIFSblchKsdJNvP97cBbz3j9HYQLGuyudlUHbGPz/LycZlNDE6i
BEMqrqLFy33arIXpZXkocbZ8/6CcSUPyfhABggWoryn0LnLIG4k7PNrg2mi77mLU
B+4UdNbmLUl2W66h58XiIQKBgDG6kMccE2zERqAfUiDhiCihZ95XS4uvoVtGzabb
/eQo55/3m0jFPcvVZNhUk/nzajR1x2kqs4EU8INlkmc4DwQT3R52R7JAvEPBCCOW
NM+osJLywKzreE3ohvIYOL2gWOOq+b57Xhe4y3GxoMTVKjW3o3vryfChxNIPvCB2
JsSJAoGBAJV3gcwgFgAA6t8m7g4YStDKANJngttdfHZC1IhGFOtKPc/rneobgDCt
48gw9bQD8gy87laRb/hjm/0Az4bjtDDOkKY5yhCUtipnpx4FR12nGRmMfRGedLJh
rrdlkni8537vUl2rwiG3U3LTi9vHMIbBQek5rxlbc8jS8ejGUFdc
-----END RSA PRIVATE KEY-----`

/**
 * RsaPrivateJwk
 */
const RsaPrivateJwk = {
  kty: 'RSA',
  n: 'iEJoO1tBT1Yc9jdYWI5JUkMnOlFD-weoi1rkxsWvZoBRJJGifjrdmIn_5xOaaW38Cg535lo6NEorsVsq7V6zGan2QCT1TRCb7vJq4UIEq6tL5uB0BZMyByKBYDKVGAinXYd502nJ1T7sbZQnSjZFC3HgDvrqb_4bDIbO0-sAiaTumt-2uyIYcGYBuIfTi8vmElz2ngUFh-8K_uQyH7YjrOrg6ThOldh8IVzaOSA7LAb_DjyC-H44F_J24qMRLGuWK53gz-2RazSBotiNUsGoxdZv30Sud3Yfbz9ZjSXxPWpRnG6mZAZW76oSbn8FvTSTWrf0iU6MyNkv_QuAjF-1BQ',
  e: 'AQAB',
  d: 'dvcbz-8Np3n00Vdi7_ZSt9rfrf_zzYFTO1BBe_Zu_Jw9vCLW70Tv4lViMtsfrrsTGaimMF1Iggzb9v41DYfn8Rk-YaSi8wT0T_whKsicEVH-c_Y19gQc4rPSpy2ilJhBn9w_lkC_sko83DNE1ntpbuOejxWth9ggv6AXhligYIt0h3DasVqhtkUa1RDUBKm4EhLc0BCPFAtN2XONRcKqoTTZUpVboKGv9k8OeyMOZXFmNjn68uhlHJLiNYFHrh-BWsD4WgIWq1sqHldkIZRJGEZizTpcuWeMuf3V-2A7oOLcVtDZ3iesxGQPxyI4-_WJqjjb3ApOGIKFOB7QNEXlIQ',
  p: 'vblqHOYDjdRTPV2rumoWKPzREhebi0ljKeMBFPvqVBM_IvOhqpVacBsDCNGHwkOo3lX-M-c8y381ZR66pJb5QpF7qfIjlOQEYQfLc31HErYcHiPtKSNjL4HP5kAoZT4ILFZlfnVJP8oZ_S-BKO27juMwDVUk_wlI2CiN0a1oPWk',
  q: 't9vB-yjoWydrBXy5q4m0pMcTm9FZum9kahCXx_0QjYPLjxwX6-d8Tc1Y1_VROtQDAIxuyMZxkboQ0L8uXtVQCjVz8hG1UDeqzISxLyTVP-JtD6yijhyrtQdgtokgAFzBHpYaMKgr8tARtojF5EyWPTQJpBSI2-tl0GgwEOa3Gz0',
  dp: 'euUkC1wjaTfkQ5ftqW8Ws64wb5vDMdJz3aoiBUm5XISrHSTbz_e3AW894_R2ECxrsrnZVB2xj8_y8nGZTQxOogRDKq6ixct92qyF6WV5KHG2fP-gnElD8n4QAYIFqK8p9C5yyBuJOzza4Npou-5i1AfuFHTW5i1JdluuoefF4iE',
  dq: 'MbqQxxwTbMRGoB9SIOGIKKFn3ldLi6-hW0bNptv95Cjnn_ebSMU9y9Vk2FST-fNqNHXHaSqzgRTwg2WSZzgPBBPdHnZHskC8Q8EII5Y0z6iwkvLArOt4TeiG8hg4vaBY46r5vnteF7jLcbGgxNUqNbeje-vJ8KHE0g-8IHYmxIk',
  qi: 'lXeBzCAWAADq3ybuDhhK0MoA0meC2118dkLUiEYU60o9z-ud6huAMK3jyDD1tAPyDLzuVpFv-GOb_QDPhuO0MM6QpjnKEJS2KmenHgVHXacZGYx9EZ50smGut2WSeLznfu9SXavCIbdTctOL28cwhsFB6TmvGVtzyNLx6MZQV1w'
}

/**
 * RsaPrivateCryptoKey
 */
const RsaPrivateCryptoKey = new CryptoKey({
  type: 'private',
  algorithm: { name: 'RSASSA-PKCS1-v1_5' },
  extractable: false,
  usages: ['sign'],
  handle: RsaPrivateKey
})

/**
 * RsaPublicKey
 */
const RsaPublicKey =
`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiEJoO1tBT1Yc9jdYWI5J
UkMnOlFD+weoi1rkxsWvZoBRJJGifjrdmIn/5xOaaW38Cg535lo6NEorsVsq7V6z
Gan2QCT1TRCb7vJq4UIEq6tL5uB0BZMyByKBYDKVGAinXYd502nJ1T7sbZQnSjZF
C3HgDvrqb/4bDIbO0+sAiaTumt+2uyIYcGYBuIfTi8vmElz2ngUFh+8K/uQyH7Yj
rOrg6ThOldh8IVzaOSA7LAb/DjyC+H44F/J24qMRLGuWK53gz+2RazSBotiNUsGo
xdZv30Sud3Yfbz9ZjSXxPWpRnG6mZAZW76oSbn8FvTSTWrf0iU6MyNkv/QuAjF+1
BQIDAQAB
-----END PUBLIC KEY-----`

/**
 * RsaPublicJwk
 */
const RsaPublicJwk = {
  kty: 'RSA',
  n: 'iEJoO1tBT1Yc9jdYWI5JUkMnOlFD-weoi1rkxsWvZoBRJJGifjrdmIn_5xOaaW38Cg535lo6NEorsVsq7V6zGan2QCT1TRCb7vJq4UIEq6tL5uB0BZMyByKBYDKVGAinXYd502nJ1T7sbZQnSjZFC3HgDvrqb_4bDIbO0-sAiaTumt-2uyIYcGYBuIfTi8vmElz2ngUFh-8K_uQyH7YjrOrg6ThOldh8IVzaOSA7LAb_DjyC-H44F_J24qMRLGuWK53gz-2RazSBotiNUsGoxdZv30Sud3Yfbz9ZjSXxPWpRnG6mZAZW76oSbn8FvTSTWrf0iU6MyNkv_QuAjF-1BQ',
  e: 'AQAB'
}

/**
 * RsaPrivateCryptoKey
 */
const RsaPublicCryptoKey = new CryptoKey({
  type: 'public',
  algorithm: { name: 'RSASSA-PKCS1-v1_5' },
  extractable: true,
  usages: ['verify'],
  handle: RsaPublicKey
})

const sampleSessionKeys = {
  public: {
    kty: 'RSA',
    alg: 'RS256',
    n: '1Urq5L3kf4ojt1TTQOyIXBhgFxs1Ts-kLRnP9PELjrjjV5P5J12D_ejjFduTXDLwJCAvlava1mbortrPMQT-ELSRLLvJGSjtqVWFeazOC_D6mbTfZmt9AaBIx0jDCC3kLDIB1DXuLl7Iihr8ME81vgkXYtLmiHGQjmq9fDFeIocnEH9wgUc4m9N92cHw0ApMLX8RAmLub9_2PFYGvQ00EajOMa8zvmLzIAxcfb09SjRrTZ0nZgkKz2vI9p2emq0EXMABn2NY0hCdWUs7ny8OxrRbVqV3vl8PdEaDXViZQHr1jVhNaa-3p4c2JkeeMEBHZqte0nNRYu66eMZVuODO0w',
    e: 'AQAB',
    key_ops: [ 'verify' ],
    ext: true
  },
  private: {
    kty: 'RSA',
    alg: 'RS256',
    n: '1Urq5L3kf4ojt1TTQOyIXBhgFxs1Ts-kLRnP9PELjrjjV5P5J12D_ejjFduTXDLwJCAvlava1mbortrPMQT-ELSRLLvJGSjtqVWFeazOC_D6mbTfZmt9AaBIx0jDCC3kLDIB1DXuLl7Iihr8ME81vgkXYtLmiHGQjmq9fDFeIocnEH9wgUc4m9N92cHw0ApMLX8RAmLub9_2PFYGvQ00EajOMa8zvmLzIAxcfb09SjRrTZ0nZgkKz2vI9p2emq0EXMABn2NY0hCdWUs7ny8OxrRbVqV3vl8PdEaDXViZQHr1jVhNaa-3p4c2JkeeMEBHZqte0nNRYu66eMZVuODO0w',
    e: 'AQAB',
    d: 'RvjBxlFFagbeMY-hJ7ZM_VADEU01ZL8E4xj2sItQjDILO8X6HtYoKGHIxiolE4XDkFHBY60miTb-78fRL394xrg-okLt_Fg5FKJnYoBUo3aQ_HpJ57uWgecCsIUOmHckuGv_XcyAL5_MXN_z0GNa_5vo0zJYEUiwkCMGX__RUe1Ix4ni-3uDpWM0vxeoxiOgeI4Vo-ngLijVes09YwGc5hrc82IyS6Xe2q2ov8I_tX-0UNSFv_rfYED9_sFnEu5RUjJY91FtmZIGCxQ3ztfLXTAvP1UtWLULKkPFsCRr-5nyHt3u7zQU2y7GGtfboVW5YBYou1ZiugTtl2g1DLCfyQ',
    p: '_ok1zHV7NOulShYFvDYX38gvVlSoAtqBRH5GLfI9-P0uLDPjhezl0pXlbyXpDe0K267TQqPAKCr-2fN7lU8xtHIYvncLPXcu2frRGNQyfqqpqNSK2e3Mkf3Dk30_PdB7bzjC8Yb3XwZrNUmUIl7Cj4zYbtgCRVPo_ykf88VgeDU',
    q: '1oT6mvqdzouaNuI9sSuCnFZNUgK3jMmuJoSc4ZUFEYyrVrQ8MVMH0lZgIMGrvMpzalpxrWPnnuGbUBmA5GrqQf_byEMj9i0vXWNbi2PKZfQoImzTyPVM0Yxb8H-iscG0cW_CZ7ef8HyIrtH-yTmvdhDXDF60vEX3cxAwep3j2-c',
    dp: 'SzvtLejPqP251mMaAN6QQfHepArTujwxlzgnsC74yF61RhV0O8Kgz5TEwwyWjSoyWmqbQQg7pOPIfk1sit5kl6xdyfZP2TQgIgfzw_38itoQ2bkw7WdPXxt9sluD1NaJlX9Wh6NX_Ltd9tsvsNUHdvyvgFvSmAFMThcuvZPqhr0',
    dq: 'A1oQkFtaG-ASiMkALcSARfETRDTGqWx9TBzGVr_9VEjeZHxsdFjXxnGTDu_3vvtq0j6XiB4HgHQF-TpsySTihCV7SaXC6hXKp6rlw0fL4cvu1JretEUg7iVDSn60DBL6vssAPp6f4SIRAKpHUN2V4EJjGc5hBJATTbjzCPdumAE',
    qi: 'GeeRzGT0hFr2-kRAg9asOrP91QXCuXQxj9BopE2_JVyACBsXu-elNUEEzz5iV6AEVXVFhOheCUOYc5y6KL7CtqYRwhy69HHC-QpdXt46heg38fBOponKgen4IjjOEWloVT64bOZurFDL4ztnoxMKFC4nknN6OI36RyWxe10z8fs',
    key_ops: [ 'sign' ],
    ext: true
  }
}

const serializedPrivateKey = '{"kty":"RSA","alg":"RS256","n":"1Urq5L3kf4ojt1TTQOyIXBhgFxs1Ts-kLRnP9PELjrjjV5P5J12D_ejjFduTXDLwJCAvlava1mbortrPMQT-ELSRLLvJGSjtqVWFeazOC_D6mbTfZmt9AaBIx0jDCC3kLDIB1DXuLl7Iihr8ME81vgkXYtLmiHGQjmq9fDFeIocnEH9wgUc4m9N92cHw0ApMLX8RAmLub9_2PFYGvQ00EajOMa8zvmLzIAxcfb09SjRrTZ0nZgkKz2vI9p2emq0EXMABn2NY0hCdWUs7ny8OxrRbVqV3vl8PdEaDXViZQHr1jVhNaa-3p4c2JkeeMEBHZqte0nNRYu66eMZVuODO0w","e":"AQAB","d":"RvjBxlFFagbeMY-hJ7ZM_VADEU01ZL8E4xj2sItQjDILO8X6HtYoKGHIxiolE4XDkFHBY60miTb-78fRL394xrg-okLt_Fg5FKJnYoBUo3aQ_HpJ57uWgecCsIUOmHckuGv_XcyAL5_MXN_z0GNa_5vo0zJYEUiwkCMGX__RUe1Ix4ni-3uDpWM0vxeoxiOgeI4Vo-ngLijVes09YwGc5hrc82IyS6Xe2q2ov8I_tX-0UNSFv_rfYED9_sFnEu5RUjJY91FtmZIGCxQ3ztfLXTAvP1UtWLULKkPFsCRr-5nyHt3u7zQU2y7GGtfboVW5YBYou1ZiugTtl2g1DLCfyQ","p":"_ok1zHV7NOulShYFvDYX38gvVlSoAtqBRH5GLfI9-P0uLDPjhezl0pXlbyXpDe0K267TQqPAKCr-2fN7lU8xtHIYvncLPXcu2frRGNQyfqqpqNSK2e3Mkf3Dk30_PdB7bzjC8Yb3XwZrNUmUIl7Cj4zYbtgCRVPo_ykf88VgeDU","q":"1oT6mvqdzouaNuI9sSuCnFZNUgK3jMmuJoSc4ZUFEYyrVrQ8MVMH0lZgIMGrvMpzalpxrWPnnuGbUBmA5GrqQf_byEMj9i0vXWNbi2PKZfQoImzTyPVM0Yxb8H-iscG0cW_CZ7ef8HyIrtH-yTmvdhDXDF60vEX3cxAwep3j2-c","dp":"SzvtLejPqP251mMaAN6QQfHepArTujwxlzgnsC74yF61RhV0O8Kgz5TEwwyWjSoyWmqbQQg7pOPIfk1sit5kl6xdyfZP2TQgIgfzw_38itoQ2bkw7WdPXxt9sluD1NaJlX9Wh6NX_Ltd9tsvsNUHdvyvgFvSmAFMThcuvZPqhr0","dq":"A1oQkFtaG-ASiMkALcSARfETRDTGqWx9TBzGVr_9VEjeZHxsdFjXxnGTDu_3vvtq0j6XiB4HgHQF-TpsySTihCV7SaXC6hXKp6rlw0fL4cvu1JretEUg7iVDSn60DBL6vssAPp6f4SIRAKpHUN2V4EJjGc5hBJATTbjzCPdumAE","qi":"GeeRzGT0hFr2-kRAg9asOrP91QXCuXQxj9BopE2_JVyACBsXu-elNUEEzz5iV6AEVXVFhOheCUOYc5y6KL7CtqYRwhy69HHC-QpdXt46heg38fBOponKgen4IjjOEWloVT64bOZurFDL4ztnoxMKFC4nknN6OI36RyWxe10z8fs","key_ops":["sign"],"ext":true}'

/**
 * Export
 */
module.exports = {
  RsaPrivateKey,
  RsaPrivateJwk,
  RsaPrivateCryptoKey,
  RsaPublicKey,
  RsaPublicJwk,
  RsaPublicCryptoKey,
  sampleSessionKeys,
  serializedPrivateKey
}






