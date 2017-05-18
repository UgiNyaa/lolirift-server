class walk {
  static paramTypes = {
    destination: {
      x: 'number',
      y: 'number',
    }
  }

  constructor (world, player, unit, params) {
    this.world = world
    this.player = player
    this.unit = unit
    this.params = params

    this.direction = {
      x: this.destination.x - this.unit.position.x,
      y: this.destination.y - this.unit.position.y,
    }

    var length = Math.sqrt(
      (this.direction.x * this.direction.x) +
      (this.direction.y * this.direction.y)
    )

    this.direction.x /= length
    this.direction.y /= length

    this.actualPosition = this.unit.position
  }

  run (dt) {
    this.actualPosition.x += (speed * dt * this.direction.x)
    this.actualPosition.y += (speed * dt * this.direction.y)

    if (Math.floor(this.actualPosition.x) !== this.unit.position.x) {
      this.unit.position.x = Math.floor(this.actualPosition.x)
      this.player.ws.send(JSON.stringify(this.unit))
    }

    if (Math.floor(this.actualPosition.y) !== this.unit.position.y) {
      this.unit.position.y = Math.floor(this.actualPosition.y)
      this.player.ws.send(JSON.stringify(this.unit))
    }
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
