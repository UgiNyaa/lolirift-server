class Action {

  constructor (paramTypes, callback) {
    console.log(typeof callback);
    this.callback = callback
    this.paramTypes = paramTypes
  }

  run (params) {
    if (this.checkParams(params, this.paramTypes)) {
      return false
    }

    this.callback(params)
  }

  checkParams(p, t) {
    if (typeof t === 'object') {
      if (typeof p === 'object') {
        Object.keys(t).forEach((k) => {
          if (p[k] === 'undefined') {
            return false
          }
          checkParams(p[k], t[k])
        })
      } else {
        return false
      }
    }

    return t === typeof p
  }

  hello (obj) {
    console.log(typeof obj);
  }

}

module.exports = Action
