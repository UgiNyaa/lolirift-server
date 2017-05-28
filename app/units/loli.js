const id = require('./id')

module.exports = (owner) => {
  return {
    id: id(),
    owner,
    type: 'loli',

    position: {
      x: 0,
      y: 0,
    },

    vertices: [],

    stats: {
      health: 10,
      range: 7,
      speed: 1,
    },

    actions: [
      'walk',
      'hello',
    ]
  }
}
