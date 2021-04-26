import io from 'socket.io-client';
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const connectionOptions = {
  "force new connection": true,
  "reconnectionAttempts": "Infinity",
  "timeout": 10000,
  "transports": ["websocket"]
};
let socket = io(ENDPOINT, connectionOptions);
export default socket;