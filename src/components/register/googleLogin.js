import {GoogleLogin} from '../../services/auth'
import socket from '../../socket';
import './register.css';

const GoogleSignIn = ({setUserLogin}) => {
    const Google = () => {
        var user = GoogleLogin()
        if (user) {
            //(user);
            socket.emit('user-connected', user);
        }
    };
    return (
        <div className="register-google">
            <div className="title">
                You must have Google Account
            </div>
            <div className='bth' onClick={Google}>
                Google Login
            </div>
        </div>
    )
}

export default GoogleSignIn