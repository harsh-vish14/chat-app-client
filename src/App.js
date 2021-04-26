import { useEffect, useState } from 'react';
import MainChat from './components/Chat/mainChat';
import GoogleLogin from './components/register/googleLogin';
import { auth } from './firebase';
import Loading from './loading/loading';
// let socket
function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged((userInfo) => {
      if (userInfo) {
        setUserLogin(true);
        setLoading(false);
      }
    })
  }, []);
 
  return (
    <div className="App">
      {
        loading ? (
          <Loading />
        ) : (
          userLogin ? (
            <MainChat />
          ) : (
            <GoogleLogin setUserLogin={setUserLogin} />
          )
            
        )
      }
    </div>
  );
}

export default App;
