const id = require('./id')

module.exports = (owner) => {
  return {
    id: id(),
    owner,

    position: {
      x: 0,
      y: 0,
    },

    vertices: [
      { x: 1, y: 0, },
      { x: 0, y: 1, },
      { x: 1, y: 1, },
      { x: 0, y: -1, },
      { x: -1, y: 0, },
      { x: -1, y: -1, },
    ],

    stats: {
      health: 100,
      range: 10,
      durations: {
        loli: 10,
      },
    },

    actions: [
      'hello',
      'train:loli',
    ],
  }
}
