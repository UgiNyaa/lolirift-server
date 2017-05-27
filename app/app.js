const WebSocket = require('ws')
const url = require('url')
const crypto = require('crypto')

const base = require('./units/base')
const loli = require('./units/loli')

let nextPlayerID = 0

var world = {
  players: [],
  units: [],
  processing: [],
}

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
  if (ws.upgradeReq.headers.authorization === undefined) {
    ws.send(JSON.stringify({ action: 'error', message: 'no authentication' }))
    console.log('error')
    ws.close()
    return
  }

  var auth = new Buffer(ws.upgradeReq.headers.authorization.split(' ')[1], 'base64').toString('ascii')
  var namepass = auth.split(':')

  if (namepass.length !== 2) {
    ws.send(JSON.stringify({ action: 'error', message: 'authentication error' }))
    console.log('error')
    ws.close()
    return
  }

  var name = namepass[0]
  var passHash = crypto.createHash('md5').update(namepass[1]).digest('hex')

  var player = world.players.find((p) => p.name === name)

  if (player !== undefined && player.passHash !== passHash) {
    ws.send(JSON.stringify({ action: 'error', message: 'wrong password for playername: ' + name }))
    console.log('error')
    ws.close()
    return
  }

  // checking whether the player with the given name is already in the world or not
  if (player !== undefined) {
    // if he is, check whether the player is active or not
    if (player.active) {
      // if the player with the given name is alredy active, respond with an error
      ws.send(JSON.stringify({ action: 'error', message: 'player with the name ' + name + ' already is active'}))

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
      name,
      passHash,
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

    // var loliUnit = loli(player.id)
    // loliUnit.position.x = player.id * 10 + 5
    // loliUnit.position.y = player.id * 10 + 5
    // world.units.push(loliUnit)
    //
    // ws.send(JSON.stringify(loliUnit))
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

    var splited = json.action.split(':')
    var actionString = splited[0]
    var modifier =  splited.length > 1 ? splited[1] : ""

    // getting the action that is going to manipulate the unit
    const action = require('./actions/' + actionString)

    // manipulating the unit with the given action
    world.processing.push(new action(world, player, unit, modifier, json.params))
  })

  // reacting to a disconnect from the player
  ws.on('close', () => {
    console.log(player.name + ' has disconnected')

    player.active = false
    player.ws = undefined
  })
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
