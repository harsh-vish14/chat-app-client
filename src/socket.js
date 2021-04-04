import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:4000';
const connectionOptions = {
  "force new connection": true,
  "reconnectionAttempts": "Infinity",
  "timeout": 10000,
  "transports": ["websocket"]
};
let socket = io(ENDPOINT, connectionOptions);
export default socket;