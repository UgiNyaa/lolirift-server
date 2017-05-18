class walk {
  static paramTypes = {
    destination: {
      x: 'number',
      y: 'number',
    }
  }

  constructor (world, player, unit, modifier, params) {
    this.world = world
    this.player = player
    this.unit = unit
    this.params = params

    this.direction = {
      x: this.params.destination.x - this.unit.position.x,
      y: this.params.destination.y - this.unit.position.y,
    }

    var length = Math.sqrt(
      (this.direction.x * this.direction.x) +
      (this.direction.y * this.direction.y)
    )

    this.direction.x /= length
    this.direction.y /= length
    player.ws.send(JSON.stringify(this.direction))

    this.actualPosition = {
      x: this.unit.position.x,
      y: this.unit.position.y,
    }

    this.time = 0
  }

  roundx (n) {
    if (this.direction.x > 0)
      return Math.floor(n)
    else
      return Math.ceil(n)
  }

  roundy (n) {
    if (this.direction.y > 0)
      return Math.floor(n)
    else
      return Math.ceil(n)
  }

  run (dt) {
    this.actualPosition.x += (this.unit.stats.speed * dt * this.direction.x)
    this.actualPosition.y += (this.unit.stats.speed * dt * this.direction.y)

    this.player.ws.send(this.time)
    this.time += dt

    if (this.roundx(this.actualPosition.x) !== this.unit.position.x) {
      this.unit.position.x = this.roundx(this.actualPosition.x)
      this.player.ws.send(JSON.stringify(this.unit))
    }

    if (this.roundy(this.actualPosition.y) !== this.unit.position.y) {
      this.unit.position.y = this.roundy(this.actualPosition.y)
      this.player.ws.send(JSON.stringify(this.unit))
    }

    if (
      this.unit.position.x === this.params.destination.x &&
      this.unit.position.y === this.params.destination.y
    ) {
      return false
    }
    return true
  }
}

module.exports = walk

// module.exports = {
//   name: 'walk',
//
//   paramTypes: {
//     destination: {
//       x: 'number',
//       y: 'number',
//     }
//   },
//
//   run: (dt, player, world, unit, params) => {
//     var direction = {
//       x: params.destination.x - unit.position.x,
//       y: params.destination.y - unit.position.y,
//     }
//
//
//
//     walked = dt * unit.stats.speed
//   }
// }
