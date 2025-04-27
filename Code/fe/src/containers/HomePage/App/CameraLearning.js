import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';
import { getPredictionImage } from '../../../services/userService';

class CameraLearning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: '',
            confidence: 0,
            isCameraOn: false,
        };
        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
        this.captureInterval = null;
    }

    startCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.videoRef.current.srcObject = stream;
                this.startRealtimePrediction();
                this.setState({ isCameraOn: true });
            } catch (error) {
                console.error("Không mở được camera:", error);
            }
        }
    }

    stopCamera = () => {
        clearInterval(this.captureInterval);

        if (this.videoRef.current && this.videoRef.current.srcObject) {
            this.videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            this.videoRef.current.srcObject = null;
        }

        this.setState({ label: '', confidence: 0, isCameraOn: false });
    }

    startRealtimePrediction = () => {
        this.captureInterval = setInterval(this.captureAndSend, 500); // Mỗi 0.5 giây gửi 1 lần
    }

    captureAndSend = async () => {
        if (!this.state.isCameraOn) return;  // Nếu camera đã tắt thì không làm gì
        
        const video = this.videoRef.current;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(video, 0, 0, 224, 224); // Resize về đúng input model
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
        
        const formData = new FormData();
        formData.append('file', blob, 'frame.jpg');
        
        try {
            const response = await getPredictionImage(formData);
    
            if (response && response.errCode === 0) {
                const label = response.data.label;
                if (label !== "Không có trái cây" && response.data.confidence > 0.8) {
                    this.setState({ 
                        label:label, 
                        confidence:response.data.confidence
                     });
                } else {
                    this.setState({ label: '', confidence: 0 });
                }
            } else {
                console.error('Dự đoán thất bại:', response.message);
            }
        } catch (error) {
            console.error('Lỗi gửi ảnh:', error);
        }
    }
    
    

    componentWillUnmount() {
        this.stopCamera(); // Ngưng camera khi thoát component
    }

    render() {
        return (
            <Fragment>
                <Header />
                {this.props.userInfo ? <Menu /> : ''}
    
                <div className="camera-learning-container">
                    <div className="main-content">
                        <h2 className="mb-4 text-primary fw-bold title-app">Học bài bằng camera với Voca AI</h2>
    
                        <div style={{ textAlign: 'center', marginTop: '20px', position: 'relative' }}>
                            <video
                                ref={this.videoRef}
                                width="500"
                                height="450"
                                autoPlay
                                muted
                                style={{
                                    border: '1px solid black',
                                    transform: 'scaleX(-1)', // Xử lý ngược camera
                                    objectFit: 'cover',
                                }}
                            ></video>
    
                            {/* Vùng hiển thị label */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 5px rgba(0,0,0,0.7)',
                            }}>
                                {this.state.label ? (
                                    <h2 style={{ color: 'green' }}>
                                        {this.state.label} <br />
                                        (Độ tin cậy: {(this.state.confidence * 100).toFixed(2)}%)
                                    </h2>
                                ) : (
                                    <h3 style={{ color: '#fff' }}>Đang nhận diện...</h3>
                                )}
                            </div>
    
                            <canvas ref={this.canvasRef} width="224" height="224" style={{ display: 'none' }}></canvas>
    
                            <div style={{ marginTop: '20px' }}>
                                {!this.state.isCameraOn ? (
                                    <button onClick={this.startCamera} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: 'blue', color: 'white' }}>
                                        Bật Camera
                                    </button>
                                ) : (
                                    <button onClick={this.stopCamera} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>
                                        Tắt Camera
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
    
                <Footer />
            </Fragment>
        );
    }
    
}

const mapStateToProps = state => ({
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(CameraLearning);
