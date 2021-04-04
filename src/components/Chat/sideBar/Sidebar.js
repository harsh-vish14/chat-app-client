import {useEffect,useState} from 'react'
import { auth, db } from '../../../firebase'
import { IoMdAdd, BiSearchAlt2,IoIosArrowBack,AiOutlineWechat } from 'react-icons/all';
import uuid from 'react-uuid'
import firebase from 'firebase'
import './Sidebar.css'
import socket from '../../../socket';
function Sidebar({ setCurrentChannel, usersId }) {

    const [channels, setchannels] = useState([]);
    const [userChannelInput, setUserChannelInput] = useState({
        title: '',
        description: ''
    })
    const [channelsID, setChannelsID] = useState('');
    const [ChannelsData, setChannelsData] = useState({})
    const [showChannel, setShowChannel] = useState(false);
    const [nameThere, setNameThere] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [userInformation, setUserInformation] = useState([])
    const [channelPresent, setChannelPresent] = useState(false);
    useEffect(() => {
        
        socket.on(`chat-${channelsID}`, (data) => {
            
            setUserInformation((preve) => {
                return [
                    ...preve,
                    {
                        photo: data.photo,
                        name: data.name
                    }
                ]
            })
        });
    },[]);
    useEffect(async () => {
        await auth.onAuthStateChanged((userInfo) => {
            if (userInfo) {
                db.collection('users').doc(userInfo.uid).get()
                    .then((snapshot) => {
                        var data = { ...snapshot.data() };
                        // console.log(userInfo);
                        if (data.channels) {
                            const channelsIds = [...data.channels];
                            var channelsData = [];
                            var channelId
                            for (var i = 0; i < channelsIds.length; i++) {
                                channelId = channelsIds[i];
                                db.collection('channels').doc(channelsIds[i]).get()
                                    .then((snapshot) => {
                                        const data = snapshot.data();
                                        setchannels((preve) => {
                                            return [
                                                ...preve,
                                                {
                                                    id: snapshot.id,
                                                    title: data.title
                                                }
                                            ]
                                        })
                                    });
                                console.log(channelsData)
                            }
                        } else {
                            setchannels([])
                            db.collection('users').doc(userInfo.uid).set({
                                photo: userInfo.photoURL,
                                name: userInfo.displayName,
                                email: userInfo.email,
                                phone: userInfo.phoneNumber ? userInfo.phoneNumber : '',
                                uid: userInfo.uid,
                                channels: []
                            })
                        }
                    })
                
            }
        });
    }, []);

    useEffect( async () => {
        if (usersId) {
            for (let i = 0; i < usersId.length; i++) {
               await db.collection('users').doc(usersId[i]).get()
                    .then((snapshot) => {
                        const data = snapshot.data();
                        console.log(data);
                        if (data) {
                            setUserInformation((preve) => {
                            return [
                                ...preve,
                                {
                                    name: snapshot.data().name,
                                    photo: snapshot.data().photo
                                }
                            ]
                        })
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                })
            }
        }
    }, [usersId]);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNameThere(true)
        setUserChannelInput((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const createTextIcon = (string) => {
        const words = string.trim().split(' ');
        if (words.length > 1) {
            return (words[0][0] + words[1][0])
        } else {
            return words[0][0]
        }
    };
    const SaveChannel = async () => {
        const id = uuid();
        const date = new Date();
        if (userChannelInput.title.length != 0) {
            console.log(date.toLocaleTimeString());
            console.log(date.toLocaleDateString());
            await auth.onAuthStateChanged((userInfo) => {
                if (userInfo) {
                    db.collection('users').doc(userInfo.uid).update({
                        channels: firebase.firestore.FieldValue.arrayUnion(id)
                    })
                    db.collection('channels').doc(id).set({
                        ...userChannelInput,
                        time: date.toLocaleTimeString(),
                        date: date.toLocaleDateString(),
                        activeUser: [userInfo.uid],
                        chat: []
                    });
                    setchannels((preve) => {
                        return[
                            ...preve,
                            {
                                id: id,
                                title: userChannelInput.title
                            }
                        ]
                    })
                }
            });
        } else {
            setNameThere(false)
        }
    }
    const checkChannel = async () => {
        
        if (channelsID) {
            await db.collection('channels').doc(channelsID).get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setchannels((preve) => {
                        return[
                            ...preve,
                            {
                                id: channelsID,
                                title: snapshot.data().title
                            }
                        ]
                    })
                        console.log(snapshot.data());
                        auth.onAuthStateChanged((userInfo) => {
                            if (userInfo) {
                                db.collection('users').doc(userInfo.uid).update({
                                    channels: firebase.firestore.FieldValue.arrayUnion(channelsID)
                                })
                                db.collection('channels').doc(channelsID).update({
                                activeUser: firebase.firestore.FieldValue.arrayUnion(userInfo.uid)
                                });
                                socket.emit('new-users-entered', {
                                    chatId:channelsID,
                                    photo: userInfo.photoURL,
                                    name: userInfo.displayName
                                });
                            }
                        })
                        setChannelPresent(false);
                        setShowChannel(false);
                    } else {
                        setChannelPresent(true)
                    }
                })
        }
    };
    const getChannelsData = async (channelid) => {
        // console.log(channelid)
        await db.collection('channels').doc(channelid).get()
            .then((snapshot) => {
                const data = snapshot.data();
                console.log(snapshot)
                setChannelsData({
                    id: snapshot.id,
                    title: data.title,
                    description: data.description,
                    time: data.time,
                    date: data.date
                })
            })
    };
    return (
        <div className='Chat-SideBar'>
            {
                showChannel ? (
                    <div style={{ marginBottom: '60px'}}>
                        <div className='back' onClick={() => { setShowChannel(false) }} style={{ marginLeft: window.innerWidth <= 400 ? '45px' : '0px' }}>
                            <IoIosArrowBack /> Back
                        </div>
                        
                        {ChannelsData ? (
                            <div className='channels-information'>
                                <div className='channels-title'>
                                    {ChannelsData.title}
                                </div>
                                <div className='channels-description'>
                                    {ChannelsData.description}
                                </div>
                                <div className='channels-date-and-time'>
                                    <div className='channels-date'>
                                        {ChannelsData.date}
                                    </div>
                                    <div className='channels-time'>
                                        {ChannelsData.time}
                                    </div>
                                </div>
                                <div>Add others using <br/> {ChannelsData.id}</div>
                            </div>
                        ) : (
                            console.log('it is null')
                        )}
                        {
                            userInformation.map((user) => {
                                return (
                                    <div className="user-info-label">
                                        <div className="user-profile-image">
                                            <img src={user.photo} alt={user.name} height='100%' />
                                        </div>
                                        <div className="user-name">
                                            {user.name + 'ismdismdsidmsdmskdmksd'}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                ) : (
                    <div className='channels-show'>
                        {/* Channels title and add channels */}
                        <div>
                            <div className='side-bar-title'>
                                <div className='title' style={{ marginLeft: window.innerWidth <= 400 ? '35px' : '0px' }}> Channels</div>
                                {console.log(window.innerWidth)}
                                <div className='add-icon' data-bs-toggle="modal" data-bs-target="#staticBackdrop"><IoMdAdd /></div>
                            </div>
                            {/* search bar */}
                            <div className='search-bar'>
                                <BiSearchAlt2 style={{ fontSize: '25px' }} />
                                <input type="text" placeholder='Search' />
                            </div>
                            {/* Channels list */}
                            {
                                channels ? (
                        
                                    channels.map((channel) => {
                                        return (
                                            <div className='channels' onClick={() => { setCurrentChannel(channel.id); getChannelsData(channel.id); setShowChannel(true) }}>
                                                <div className='channels-icon'>{createTextIcon(channel.title)}</div>
                                                <span className="d-inline-block text-truncate" style={{ maxWidth: '80%' }}>
                                                    {channel.title}
                                                </span>
                                                <div></div>
                                            </div>
                                        )
                                    })
                        
                                ) : (
                                    null
                                )
                            }
                        </div>
                    </div>
                )
            }
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    {/* {console.log(channels)} */}
                    <div class="modal-content">
                        <div className='title'>New Channel</div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="floatingInput" placeholder="abc...." onChange={handleChange} name='title' value={userChannelInput.title} />
                            <label for="floatingInput">Channel name</label>
                        </div>
                        <div style={{ color: 'red', margin: '-10px 20px', display: nameThere ? 'none' : '' }}>Please Provide a Channel Name</div>
                        <div class="form-floating">
                            <textarea class="form-control" placeholder="Leave a description here" id="floatingTextarea2" style={{ height: "100px" }} name='description' onChange={handleChange} value={userChannelInput.description}></textarea>
                            <label for="floatingTextarea2">Channel Description</label>
                        </div>
                        <div className='buts'>
                            <div class="close" data-bs-dismiss="modal" onClick={() => { setUserChannelInput({ title: '', description: '' }) }}>Close</div>
                            <div class="save" data-bs-dismiss="modal" onClick={() => { setUserChannelInput({ title: '', description: '' }); SaveChannel() }}>Save</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div className='title'>Join Channel</div>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="floatingInput" placeholder="abc-2ff...." name='id' onChange={(e)=>{setChannelsID(e.target.value)}} value={channelsID} />
                            <label for="floatingInput">Channel ID</label>
                        </div>
                        <div style={{ color: 'red', margin: '-10px 20px', display: channelPresent ? '' : 'none' }}>Invalid Channel ID</div>
                        <div className='buts'>
                            <div class="close" data-bs-dismiss="modal">Close</div>
                            <div class="Add" style={{ cursor: 'pointer' }} data-bs-dismiss={channelPresent?"":"modal"} onClick={() => { checkChannel()}}>Save</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='join' data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                <AiOutlineWechat/>
            </div>
        </div>
    );
}

export default Sidebar