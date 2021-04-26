import './loading.css';

const Loading = () => {
    return (
        <div className="loading">
            <lottie-player className="loading" src="https://assets9.lottiefiles.com/packages/lf20_x62chJ.json" background="transparent" speed="1" style={{ width: "300px", height: "300px", color: "white" }} loop autoplay></lottie-player>
            <div>Loading...</div>
        </div>
    )
};

export default Loading;