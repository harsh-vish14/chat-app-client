import { useEffect, useState } from 'react'
import { BiSend } from 'react-icons/all'
import { auth, db } from '../../../../firebase';
import createTextIcon from '../../../../helper/functions';
import socket from '../../../../socket';
import './currentChannel.css'
const CurrentChannel = ({ channelId }) => {
    const [channelData, setChannelData] = useState();
    const [message, setMessage] = useState('');
    const [userID, setUserID] = useState('');
    const [chatdetails, setChatDetails] = useState([]);
    const [user, setUser] = useState()
    useEffect(async () => {
        auth.onAuthStateChanged((userInfo) => {
            if (userInfo) {
                setUserID(userInfo);
            }
        })
        await db.collection('channels').doc(channelId).get()
            .then((snapshot) => {
                const data = snapshot.data();
                data.chat.forEach(userChat => {
                    db.collection('users').doc(userChat.userId).get()
                        .then((snapshot) => {
                            var userData = snapshot.data()
                            setChatDetails((preve) => {
                                return [
                                    ...preve,
                                    {
                                        name: userData.name,
                                        ...userChat
                                    }
                                ]
                            })
                        
                        })
                });
                setChannelData(data);

            })
        
    }, []);
    useEffect(() => {
        socket.on(`message-came-${channelId}`, (chatData) => {
            db.collection('users').doc(chatData.userId).get()
                .then((snapshot) => {
                    var userData = snapshot.data()
                    setChatDetails((preve) => {
                        return [
                            ...preve,
                            {
                                name: userData.name,
                                ...chatData
                            }
                        ]
                    })
                })
        })
    }, []);
    // const userInfo = (id) => {
    //     db.collection('users').doc(id).get()
    //         .then((snapshot) => {
    //             const userdata = { ...snapshot.data() }
                
    //             setUser (
    //                 <>
    //                     <div className='chat-user-image' style={{ background:`url(${userdata.photo})`}}></div>
    //                     <div className='chat-user-name'>{userdata.name}</div>
    //                 </>
    //             )
                
    //         });
    // };
    const sendMessage = () => {
        const date = new Date();

        socket.emit('chat-input', {
            channelId: channelId,
            chatDetails: {
                userId: userID.uid,
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString(),
                message: message
            }
        });
        setMessage('')
        setChatDetails((preve) => {
            return [
                ...preve,
                {
                    userId: userID.uid,
                    name: userID.name,
                    time: date.toLocaleTimeString(),
                    date: date.toLocaleDateString(),
                    message: message
                }
            ]
        })
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
                        <div className='chats'>
                            {console.log(chatdetails)}
                        {
                            
                                chatdetails.length != 0 ? (
                                    
                                    chatdetails.map((chat,i) => {
                                    return (
                                        <div key={i} className='chat-details' style={{marginLeft: chat.userId ==  userID.uid ? ('auto'):('')}}>
                                            <div className='chat-user'>
                                                <div className='chat-user-name'>{chat.userId ==  userID.uid ? ("You"):(chat.name)}</div>
                                            </div>
                                            <div className="chat-title">{chat.message}</div>
                                            <div className="chat-time">{chat.date}  {chat.time}</div>
                                        </div>

                                    )
                                })
                            ): (
                                    <div></div>
                            )
                            }
                        </div>
                            
                        <div className='chat-channel-input'>
                            <input type='text' placeholder='Type a message' onChange={(e)=>{setMessage(e.target.value)}} value={message} />
                            <div className='chat-channel-send-message' onClick={sendMessage}><BiSend /></div>
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