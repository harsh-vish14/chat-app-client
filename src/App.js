import { useEffect, useState } from 'react';
import MainChat from './components/Chat/mainChat';
import GoogleLogin from './components/register/googleLogin';
import { auth } from './firebase';
import socket from './socket';
// let socket
function App() {
  const [userLogin, setUserLogin] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((userInfo) => {
      if (userInfo) {
        // console.log(userInfo);
        // socket.emit('user-connected', userInfo );
        setUserLogin(true);
      }
    })
  }, []);
  // const [player,setPlayer] = useState('')
  // const [player2,setPlayer2] = useState('')
  // useEffect(() => {
  //   socket = io(ENDPOINT,connectionOptions);
  //   socket.on('message-came-chat1', (message) => {
  //     setPlayer(message);
  //   })
  //   socket.on('message-came-chat2', (message) => {
  //     setPlayer2(message);
  //   })
  // },[])
  // const sendMe1 = () => {
  //   socket.emit('chat-input', {
  //     id: 'chat1',
  //     message: 'this is message for chat 1'
  //   });
  // };
  // const sendMe2 = () => {
  //   socket.emit('chat-input', {
  //     id: 'chat2',
  //     message: 'this is message for chat 3'
  //   });
  // };
  return (
    <div className="App">
      {
        userLogin ? (
          <MainChat />
        ): (
            <GoogleLogin setUserLogin={setUserLogin}/>
        )
      }
    </div>
  );
}

export default App;
