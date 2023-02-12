import { PeerServer } from 'peer'

const peerServer = PeerServer({
  port: 9000,
  path: '/myapp'
})

const state = {
  $gameState: true,
  players: [{
    id: '1',
    team: 'red',
    agentId: '12',
    x: 0,
    z: 0,
    a: 0
  },
  {
    id: '2',
    team: 'red',
    agentId: '123',
    x: 0,
    z: 0,
    a: 0
  }]
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

  client.getSocket()?.send(JSON.stringify(state))
  client.getSocket()?.on('message', (data) => {
    const json = JSON.parse(data as string)
    if (json.delta) {
      const player = state.players.find((p) => p.id === client.getId())
      if (player) {
        player.z += json.delta[0]
        player.x += json.delta[1]
        updateState()
      }
    }
  })
})

peerServer.on('disconnect', (client) => {
  console.log('DISCONNECT');
  clients.splice(clients.indexOf(client), 1)
})