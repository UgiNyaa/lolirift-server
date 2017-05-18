const WebSocket = require('ws')
const url = require('url')

const base = require('./units/base')

let nextPlayerID = 0

var world = {
  players: [],
  units: [],
  processing: [],
}

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {

  var player = world.players.find((p) => p.name === ws.upgradeReq.headers.name)

  // checking whether the player with the given name is already in the world or not
  if (player !== undefined) {
    // if he is, check whether the player is active or not
    if (player.active) {
      // if the player with the given name is alredy active, respond with an error
      ws.send({ action: 'error', message: 'player with the name ' + ws.upgradeReq.headers.name + ' already is active'})

      // and close the connection
      ws.close()
      return
    } else {
      // if the player is not active, make him active again
      console.log('player ' + player.name + ' is active again');

      // set him active
      player.active = true

      // give him the new player websocket connection
      player.ws = ws

      // send him all his unit informations
      for (var i = 0; i < world.units.length; i++) {
        if (world.units[i].owner === player.id) {
          ws.send(JSON.stringify(world.units[i]))
        }
      }
    }
  } else {
    // if there is no player with the given name at all, create the player with new id and the given name
    player = {
      id: nextPlayerID++,
      name: ws.upgradeReq.headers.name,
      ws,
      active: true,
    }

    console.log('player named ' + player.name + ' connected');

    // also add the player to the world
    world.players.push(player)

    var baseUnit = base(player.id)
    baseUnit.position.x = player.id * 10
    baseUnit.position.y = player.id * 10
    world.units.push(baseUnit)

    ws.send(JSON.stringify(baseUnit))
  }


  // reacting to players request
  ws.on('message', (message) => {

    try {
      var json = JSON.parse(message)
    } catch (e) {
      ws.send(JSON.stringify({ message: 'not a valid json message'}))
      return
    }

    // getting the unit the player wants to manipulate
    var unit = world.units.find((u) => u.id === json.unit)

    // checking whether the player owns this unit
    if (unit.owner !== player.id) {
      ws.send(JSON.stringify({ message: 'you do not own this unit' }))
      return
    }

    // checking whether the unit can be manipulated with this action
    if (unit.actions.find((a) => a === json.action) === undefined) {
      ws.send(JSON.stringify({ message: 'this unit can not use the action: ' + json.action }))
      return
    }

    // getting the action that is going to manipulate the unit
    const action = require('./actions/' + json.action)

    // manipulating the unit with the given action
    world.processing.push(new action(world, player, unit, json.params))
  })

  // reacting to a disconnect from the player
  ws.on('close', () => {
    console.log(player.name + ' has disconnected')

    player.active = false
    player.ws = undefined
  })

  ws.send(JSON.stringify({ msg: 'you succesfully connected' }))
});

setInterval(() => {
    for (var i = 0; i < world.processing.length; i++) {
      // process and determin whether the process is finished or not
      if (!world.processing[i].run(.1)) {
        console.log(world.processing[i].constructor.name + ' has been processed');
        world.processing.splice(i, 1)
        i--
      }
    }
}, 100)
