
import './noChatActive.css'
const NoChatActive = () => {
    return (
        <div className='noChatActive'>
            <div className="animation-icon">
                <img className="noChat-svg" src={`${process.env.PUBLIC_URL}/images/noChat.svg`} height="100%" />
            </div>
            <div style={{fontSize:'1.875rem'}}>
                No Chat is Selected
            </div>
        </div>
    )
}
export default NoChatActive;