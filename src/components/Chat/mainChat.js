import {FiMenu} from 'react-icons/all'
import Chat from "./mainChat/chat"
import Sidebar from "./sideBar/Sidebar"
import { useEffect, useState } from 'react'
import './mainChat.css'

const MainChat = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const [currentChannel, setCurrentChannel] = useState('');
    const [usersId, setUsersId] = useState([]);

    useEffect(() => {
        if (window.innerWidth > 400) {
            setShowSideBar(true);
        }
        //(window.innerWidth)
    }, [showSideBar]);
    return (
        <div style={{display: 'flex'}}>
            { showSideBar ? <Sidebar setShowSideBar={setShowSideBar} showSideBar={showSideBar} setCurrentChannel={setCurrentChannel} usersId={usersId} /> : null}
            <div className="chat-box" style={{width: '75%'}}>
            <Chat currentChannel={currentChannel} setUsersId={setUsersId} />
            </div>
            <div className='menu-icon' onClick={() => { window.innerWidth <= 400 ? (setShowSideBar(!showSideBar)):(setShowSideBar(true))}}>
                <FiMenu />
            </div>
        </div>
    );
}

export default MainChat