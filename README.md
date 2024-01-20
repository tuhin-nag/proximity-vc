# Real-Time Proximity Voice with TypeScript and PeerJS

## Overview

This application is a real-time multiplayer game built using Svelte for the frontend and PeerJS for the backend. The program allows users to log in, control player movement, and interact with other players in a shared virtual space.

## Frontend 

### Main App Component 

- Manages the overall structure of the application.
- Controls authentication and login flow, rendering the main content when the user is authenticated.

### Login Component

- Provides a button to initiate the login process.
- Generates a random UUID using `crypto.randomUUID()` and sets it as the user's ID (`$myId`).

### Player  Component 

- Handles player movement and audio updates.
- Utilizes the microphone through the `getMicrophone` function and sets up audio handling.
- Updates the player's position based on user input (key presses) and communicates the changes to the server using the `sendToPeer` function.
- Represents players visually on the screen using Svelte components (`Player` and `MyPlayer`).

## Backend (PeerJS Server)

### PeerJS Server 

- Sets up a PeerJS server using the `PeerServer` from the "peer" library.
- Initializes an initial game state (`state`) with a single player.
- Defines a function (`updateState`) to send the current state to all connected clients.
- Manages an array of connected clients (`clients`).
- Listens for 'connection' events when a new client connects:
  - Adds the client to the `clients` array.
  - Sends the current state to the new client.
  - Listens for 'message' events from the client's socket, updating the game state based on the received data.
- Listens for 'disconnect' events when a client disconnects:
  - Removes the disconnected client from the `clients` array.


## Flow Explanation

- Upon user login, a PeerJS connection is established on the frontend, and the user's ID is set (`myId`).
- The backend manages the game state, handling player connections, disconnections, and messages (player movement or new player additions).
- The frontend, particularly the `PlayerMovement` component, captures user input and updates the player's position, sending this information to the backend using the `sendToPeer` function.
- The backend, upon receiving messages from clients, updates the game state accordingly and broadcasts the updated state to all connected clients.
- The game state changes are reflected in the frontend, updating the visual representation of players and maintaining a real-time multiplayer experience.

