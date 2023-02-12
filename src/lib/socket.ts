import { get, writable } from 'svelte/store';
import { Peer } from 'peerjs'
import { readable } from 'svelte/store';



export const myId = writable<string>(
  localStorage.getItem('playerId') ?? ''
)

myId.subscribe((id) => {
  localStorage.setItem('playerId', id)
})

export const peer = new Peer(get(myId), {
  host: 'localhost',
  port: 9000,
  path: '/myapp'
})

export function sendToPeer(data: unknown) {
  ws?.send(JSON.stringify(data))
}

export type Player = {
  id: string;
  team: 'red' | 'blue';
  agentId: string;
  x: number;
  z: number;
  a: number;
}

export function getIsInitiator(id: string) {
  return peer.id < id
}


export type GameState = {
  players: Player[];
}

let ws: WebSocket | undefined

export const gameState = readable<GameState>({
  players: [],
}, (set) => {
  peer.socket.once('message', () => {

    ws = (peer.socket as any)._socket as WebSocket
    sendToPeer({ player: { team: 'red' } })
    ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.$gameState) {
          delete data.$gameState
          set(data)
        }
      } catch (error) {
        console.error(error)
      }
    })
  })
})

