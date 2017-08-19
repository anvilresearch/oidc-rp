/**
 * Shims a Web Storage interface to an async interface (https://developer.mozilla.org/en-US/docs/Web/API/Storage)
 */
module.exports = class AsyncStorage {
  constructor (syncStorage) {
    this.store = syncStorage || new MemStorage()
  }

  get length () {
    return Promise.resolve(this.store.length)
  }

  key (n) {
    return Promise.resolve(this.store.key(n))
  }

  getItem (key) {
    return Promise.resolve(this.store.getItem(key))
  }

  setItem (key, val) {
    return Promise.resolve(this.store.setItem(key, val))
  }

  removeItem (key) {
    return Promise.resolve(this.store.removeItem(key))
  }

  clear () {
    return Promise.resolve(this.store.clear())
  }
}

class MemStorage {
  constructor () {
    this.store = {}
  }

  get length () {
    return Object.values(this.store).length
  }

  key (n) {
    return Object.keys(this.store)[n]
  }

  getItem (key) {
    return this.store.key
  }

  setItem (key, val) {
    this.store.key = val
  }

  removeItem (key) {
    delete this.store.key
  }

  clear () {
    this.store = {}
  }
}
