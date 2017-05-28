# lolirfit-server

The lolirift-server contains the logic implementation of the lolirift world, so every __unit__ and __action__ is defined and implemented here. The client merely takes all that information and renders them on screen.

## Structure

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
  "type": "loli",
  "position": {
    "x": 0,
    "y": 0
  },
  "vertices": [],
  "stats": {
    "health": 100
  },
  "actions": [ "walk" ]
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
