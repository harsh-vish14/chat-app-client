import { useEffect } from 'react'
import { auth, db } from '../../../firebase';
import { LogOut } from '../../../services/auth';
import NoChatActive from './noChatActive';
const Chat = ({ currentChannel,setUsersId }) => {
    useEffect( async () => {
        console.log(currentChannel);
        if (currentChannel) {
            await db.collection('channels').doc(currentChannel).get()
            .then((snapshot) => {
                const data = snapshot.data();
                setUsersId(data.activeUser)
            });
        }
    },[currentChannel])
    return (
        <div>
            <div onClick={() => { LogOut() }}>LogOut</div>
            {
                currentChannel ? (
                    <div>{currentChannel}</div>
                ) : (
                    <NoChatActive />
                )
            }
        </div>
    );
}
export default Chat;