class hello {
  static paramTypes = { }

  constructor (world, player, unit, params) {
    this.world = world
    this.player = player
    this.unit = unit
    this.params = params
  }

  run (dt) {
    this.player.ws.send(JSON.stringify({ message: 'hello' }))
    return false
  }
}

module.exports = hello
