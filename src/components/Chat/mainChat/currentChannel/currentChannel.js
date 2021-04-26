import { useEffect, useState,useRef } from 'react'
import { BiSend } from 'react-icons/all'
import { auth, db } from '../../../../firebase';
import createTextIcon from '../../../../helper/functions';
import socket from '../../../../socket';
import * as Scroll from 'react-scroll';
import './currentChannel.css'
const CurrentChannel = ({ channelId }) => {
    const messageEl = useRef('');
    const [channelData, setChannelData] = useState();
    const [message, setMessage] = useState('');
    const [userID, setUserID] = useState('');
    const [chatdetails, setChatDetails] = useState([]);
    useEffect(() => {
        if (messageEl.current) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [messageEl.current]);
    useEffect(() => {
        setChatDetails([])
        auth.onAuthStateChanged((userInfo) => {
            if (userInfo) {
                setUserID(userInfo);
            }
        })
        db.collection('channels').doc(channelId).get()
            .then((snapshot) => {
                const data = snapshot.data();
                
                data.chat.forEach(userChat => {
                    setChatDetails((preve) => {
                        return [
                            ...preve,
                            {
                                name: userDetails(userChat.userId),
                                ...userChat
                            }
                        ]
                    })
                });
                setChannelData(data);
            })
        
    }, [channelId]);

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
    }, [channelId]);
    const userDetails = (userid) => {
        db.collection('users').doc(userid).get()
            .then((snapshot) => {
                var userData = snapshot.data()
                return userData.name;
            })
    };
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

        <div className='chat-channel' style={{ background: `url(${process.env.PUBLIC_URL}/images/pattern.png)` }}>
            
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
                        <>
                        
                            <div className='chats'  ref={messageEl}>
                                {
                            
                                    chatdetails.length != 0 ? (
                                    
                                        chatdetails.map((chat, i) => {
                                            return (
                                                <div key={i} className='chat-details' style={{ marginLeft: chat.userId == userID.uid ? ('auto') : ('') }}>
                                                    <div className='chat-user'>
                                                        <div className='chat-user-name'>{chat.userId == userID.uid ? ("You") : (chat.name)}</div>
                                                    </div>
                                                    <div className="chat-title">{chat.message}</div>
                                                    <div className="chat-time">{chat.date}  {chat.time}</div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div></div>
                                    )

                                }
                                
                            </div>
                            <div id="bottom-div"></div>
                        
                        </>
                        <div className='chat-channel-input'>
                            <input type='text' placeholder='Type a message' onChange={(e) => { setMessage(e.target.value) }} value={message} />
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