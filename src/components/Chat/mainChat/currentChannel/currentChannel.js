import { useEffect, useState } from 'react'
import { BiSend } from 'react-icons/all'
import { auth, db } from '../../../../firebase';
import createTextIcon from '../../../../helper/functions';
import './currentChannel.css'
const CurrentChannel = ({ channelId }) => {
    const [channelData, setChannelData] = useState();
    const [message, setMessage] = useState('');
    const [userID,setUserID] = useState('');
    useEffect( async () => {
        await db.collection('channels').doc(channelId).get()
            .then((snapshot) => {
                const data = snapshot.data();
                console.log(data);
                setChannelData(data);
            })
        auth.onAuthStateChanged((userInfo) => {
            if (userInfo) {
                setUserID(userInfo.uid);
            }
        })
    }, []);
    const sendMessage = () => {
        // if (message.length > 0) {
        //     console.log(userID);
        //     const messageInfo = {
        //         userId = userID,
        //         message,

        //     }
        //     // db.collection('channels').doc(channelId).update({
        //     //     chat: firebase.firestore.FieldValue.arrayUnion()
        //     // })
        // }
    };
    return (
        <div className='chat-channel' style={{background: `url(${process.env.PUBLIC_URL}/images/pattern.png)`}}>
            {
                channelData ? (
                    <>
                        <div className='chat-channel-header'>
                            <div className='chat-channel-header-icon'>
                                {createTextIcon(channelData.title)}
                            </div>
                            <div className='chat-channel-header-title'>
                                {channelData.title}
                            </div>
                            <div></div>
                        </div>
                        {
                            channelData.chat.length != 0 ? (
                                channelData.chat.map((chat) => {
                                    return (
                                        <div>
                                            <div className="chat-title">{chat.title}</div>
                                            <div className="chat-time">{chat.time}</div>
                                        </div>

                                    )
                                })
                            ): (
                                    <div></div>
                            )
                        }
                        <div className='chat-channel-input'>
                            <input type='text' placeholder='Type a message' onChange={(e)=>{setMessage(e.target.value)}} value={message} />
                            <div className='chat-channel-send-message'><BiSend /></div>
                        </div>
                    </>
                ) : (
                    <div>Loading</div>
                )
            }
        </div>
    );
}

export default CurrentChannel