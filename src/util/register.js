/**
 * @memberof Cite.util
 * @param {Object} [data={}] - initial values
 */
class Register {
  constructor (data = {}) {
    this.data = data
  }

  /**
   * @param {String} key
   * @param {*} value
   * @return {Register} this
   */
  set (key, value) {
    this.data[key] = value
    return this
  }

  /**
   * @borrows Cite.util.Register#set as Cite.util.Register#add
   */
  add (...args) {
    return this.set(...args)
  }

  /**
   * @param {String} key
   * @return {Register} this
   */
  delete (key) {
    delete this.data[key]
    return this
  }

  /**
   * @param {String} key
   * @return {*} value
   */
  get (key) {
    return this.data[key]
  }

  /**
   * @param {String} key
   * @return {Boolean} register has key
   */
  has (key) {
    return this.data.hasOwnProperty(key)
  }

  /**
   * @return {Array<String>} list of keys
   */
  list () {
    return Object.keys(this.data)
  }
}

export default Register
