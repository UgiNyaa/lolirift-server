module.exports = {
  readyToSend: (units) => {
    var json = {
      units: [],
      actions: []
    }

    units.forEach((u) => {
      json.units.push(u)
      u.actions.forEach((a) => {
        var i = a.indexOf(':') < 0 ? a.length : a.indexOf(':')
        var action = require('../actions' + '/' + a.substring(0, i))
        json.actions.push({ name: a, paramTypes: action.paramTypes })
      })
    })

    return JSON.stringify(json)
  }
}
