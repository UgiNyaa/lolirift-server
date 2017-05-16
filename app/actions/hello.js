module.exports = {
  name: 'hello',
  paramTypes: { },
  run: (player, world, unit, params) => {
    player.ws.send({ action: 'hello', message: 'hello' })
  }
}
