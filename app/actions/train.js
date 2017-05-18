class train {
  constructor (world, player, unit, modifier, params) {
    this.world = world
    this.player = player
    this.unit = unit
    this.params = params

    this.remaining = this.unit.stats.durations[modifier]
    this.trained = require('../units/' + modifier)(this.player.id)
    this.trained.position.x = this.unit.position.x
    this.trained.position.y = this.unit.position.y + 2
  }

  run (dt) {
    if (this.remaining <= 0) {
      this.world.units.push(this.trained)
      this.player.ws.send(JSON.stringify(this.trained))
      return false
    }

    this.remaining -= dt
    return true
  }
}

module.exports = train
