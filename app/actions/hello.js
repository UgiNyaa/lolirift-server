module.exports = {
  name: 'hello',
  paramTypes: { },
  run: (player, world, unit, params) => {
    player.ws.send(JSON.stringify({ message: 'hello' }))
  }
}
