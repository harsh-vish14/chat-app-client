import { useEffect } from 'react'
import { auth, db } from '../../../firebase';
import { LogOut } from '../../../services/auth';
import CurrentChannel from './currentChannel/currentChannel';
import NoChatActive from './noChatActive/noChatActive';
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
        <>

            {
                currentChannel ? (
                    <>
                        <CurrentChannel channelId={currentChannel} />
                    </>
                ) : (
                    <NoChatActive />
                )
            }
        </>
    );
}
export default Chat;