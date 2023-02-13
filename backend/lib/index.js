"use strict";
export const __esModule = true;
import { PeerServer } from "peer";
var peerServer = (0, PeerServer)({
    port: 9000,
    path: '/myapp'
});
var state = {
    $gameState: true,
    players: []
};
function updateState() {
    clients.forEach(function (client) {
        client.getSocket().send(JSON.stringify(state));
    });
}
var clients = [];
peerServer.on('connection', function (client) {
    var _a, _b;
    console.log('CONNECTION');
    clients.push(client);
    (_a = client.getSocket()) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(state));
    (_b = client.getSocket()) === null || _b === void 0 ? void 0 : _b.on('message', function (data) {
        // console.log(data);
        var json = JSON.parse(data);
        if (json.delta) {
            var player = state.players.find(function (p) { return p.id === client.getId(); });
            if (player) {
                player.z += json.delta[0];
                player.x += json.delta[1];
                updateState();
            }
        }
        else if (json.player) {
            if (state.players.find(function (p) { return p.id === client.getId(); })) return
            state.players.push({
                id: client.getId(),
                team: json.player.team,
                x: 0,
                z: 0,
                a: 0
            });
            updateState();
        }
    });
});
peerServer.on('disconnect', function (client) {
    console.log('DISCONNECT');
    clients.splice(clients.indexOf(client), 1);
});
