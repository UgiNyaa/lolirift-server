# lolirift server

The lolirift-server contains the logic implementation of the lolirift world, so every __unit__ and __action__ is defined and implemented here. The client merely takes all that information and renders them on screen.

## Prove your waifu is superior!

The lolirift-server offeers a way for users to make a server you can connect to with [lolirift-client](https://github.com/htl22-3ahif/lolirift-client) client, and enjoy a lolified take on real time strategy games.

## Getting Started

- have [node.js](https://nodejs.org/en/) installed
- open your terminal of choice that supports the [npm package manager](https://www.npmjs.com/) (usually the default one works, if you decided to let node.js add the command to your bash)
- clone the git repository for the client https://github.com/htl22-3ahif/lolirift-server.git
- cd into the repository
- execute `npm install` to install

### launching the server

- cd into the repository
- execute `npm start` to start

it's that easy!

### additional steps for running the client

- clone the git repository for the client https://github.com/htl22-3ahif/lolirift-client.git
- cd into the repository
- execute `npm install` to install
- execute `npm start` to start

## Frameworks used

```
{
  "name": "lolirift-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "babel app -d build && node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Ugi",
  "license": "MIT",
  "dependencies": {
    "bufferutil": "^3.0.0",
    "express": "^4.15.2",
    "utf-8-validate": "^3.0.1",
    "ws": "^2.2.3"
  },
  "devDependencies": {
    "babel-cli": "^6.24.0",
    "babel-preset-env": "^1.3.2",
    "babel-preset-es2015": "^6.24.0",
    "babel-preset-stage-1": "^6.22.0"
  }
}
```
## Game Logic

The Game Logic that powers lolirift is a generalized concept that makes use of the web technologies' simplicity to exchange information and manage states in the game.

It is as follows...

### Structure

The structure of the lolirift world can easily be described through a JSON file (since everything here is based on JSON)

```
"world": {
  "players": [],
  "units": [],
  "actions": []
}
```

Firstly, the world contains a __players__ array, which holds all the players currently playing in the lolirift world. This is mainly used for management, very rarely for the acual world. So it will be used for authentication, so that one player can not controll a unit from another.

As next there are the __units__. With these, you can win, but also loose the game. To understand units better, we can look at the JSON representation.

```
unit: {
  "id": 0,
  "owner": "some player",
  "type": "remilia",
  "position": {
    "x": 0,
    "y": 0
  },
  "vertices": [],
  "stats": {
    "health": 1000
  },
  "actions": [ "walk", "destroy everything" ]
}
```

At last, __actions__ are there to manipulate your units. To explain it simple, they are just methods, but methods, that can be called by the client, so through the network. Since the client should not be able to set the unit's stats or position as they please, but rather have to go through methods, that restrict the manipulation.

## Communication

The communication part is kept very simple. The server just sends unit and action data, when one of the player's units gets to see a unit of another player. Also the action information like paramTypes is just sent to the client.

Everything is packed in a JSON format, since JSON is easy to implement and both ends are running javascript.

A common communication message is built like this:

```
{
  "units": [ { ... } ],
  "actions": [ { ... } ]
}
```

Also mentionable is, that everything is running through websockets, because we have the intention to keep it all on the web.
