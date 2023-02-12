import { PeerServer } from 'peer'

const peerServer = PeerServer({
  port: 9000,
  path: '/myapp'
})

const state = {
  $gameState: true,
  // DELETE THIS PLAYER
  players: [{
    id: 'test',
    team: 'red',
    x: 0,
    z: 0,
    a: 0
  }],
}

function updateState() {
  clients.forEach((client) => {
    client.getSocket().send(JSON.stringify(state))
  })
}

const clients: any[] = []

peerServer.on('connection', (client) => {
  console.log('CONNECTION')
  clients.push(client)
  const socket = client.getSocket()
  if (socket) {
    socket.send(JSON.stringify(state))
    socket.on('message', (data) => {
      console.log(data);
      const json = JSON.parse(data as string)
      if (json.delta) {
        const player = state.players.find((p) => p.id === client.getId())
        if (player) {
          player.z += json.delta[0]
          player.x += json.delta[1]
          updateState()
        }
      } else if (json.player) {
        state.players.push({
          id: client.getId(),
          team: json.player.team,
          x: 0,
          z: 0,
          a: 0
        })
        updateState()
      }
    })
  }
})

peerServer.on('disconnect', (client) => {
  console.log('DISCONNECT');
  clients.splice(clients.indexOf(client), 1)
})