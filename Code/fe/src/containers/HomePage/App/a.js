import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';
import { speakingTest } from '../../../services/userService';
import * as actions from "../../../store/actions";
import Recorder from 'recorder-js';

class Speaking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false,
            audioURL: null,
            audioBlob: null,
            listVoc: [],
            selectedExample: '',
        };
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.recorder = null;
        this.stream = null;
    }

    async componentDidMount() {
        this.props.getAllVoc();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.listVoc !== prevProps.listVoc) {
            this.setState({
                listVoc: this.props.listVoc,
            });
        }
    }

    startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.stream = stream;
            this.recorder = new Recorder(this.audioContext);
            await this.recorder.init(stream);
            this.recorder.start();
            this.setState({ isRecording: true });
        } catch (err) {
            toast.error("Không thể truy cập micro: " + err.message);
        }
    };

    stopRecording = async () => {
        try {
            const { blob } = await this.recorder.stop();
            const audioURL = URL.createObjectURL(blob);
            this.setState({ isRecording: false, audioBlob: blob, audioURL });
        } catch (err) {
            toast.error("Lỗi khi dừng ghi âm: " + err.message);
        }
    };

    clearAudio = () => {
        const { audioURL } = this.state;
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.setState({
            audioURL: null,
            audioBlob: null,
            isRecording: false
        });
    };

    handleSubmit = async () => {
        const { selectedExample, audioBlob } = this.state;

        if (!selectedExample) {
            toast.error("Vui lòng chọn câu ví dụ để luyện nói!");
            return;
        }

        if (!audioBlob) {
            toast.error("Bạn chưa ghi âm nội dung!");
            return;
        }

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recorded_audio.wav');
        formData.append('text', selectedExample);

        try {
            const response = await speakingTest(formData);
            if (response && response.errCode === 0) {
                toast.success(response.message);
            } else {
                toast.error(response.message || "Đã xảy ra lỗi.");
            }
        } catch (error) {
            toast.error("Lỗi gửi file: " + error.message);
        }
    };

    handleExampleChange = (event) => {
        this.setState({ selectedExample: event.target.value });
    };

    render() {
        const { isRecording, audioURL, listVoc, selectedExample } = this.state;
        const arrVoc = listVoc || [];

        return (
            <Fragment>
                <Header />
                {this.props.userInfo && <Menu />}
                <div className="speaking-container mt-4">
                    <div className="main-content">
                        <h2 className="mb-4 text-primary fw-bold title-app">Luyện nói cùng Voca AI</h2>
                        <label className="form-label fw-bold">🗣️ Chọn câu để luyện nói:</label>
                        <select className="form-select select-sentence" value={selectedExample} onChange={this.handleExampleChange}>
                            <option value="">-- Chọn một câu ví dụ --</option>
                            {arrVoc.map((voc, index) => (
                                <option key={index} value={voc.example}>{voc.example}</option>
                            ))}
                        </select>
                        {selectedExample && (
                            <p className="mt-3">📌 Bạn cần phát âm câu: <strong>{selectedExample}</strong></p>
                        )}
                    </div>

                    <div className="recorder-controls mb-4">
                        {!isRecording ? (
                            <button className="btn btn-success me-3" onClick={this.startRecording}>🎤 Bắt đầu ghi âm</button>
                        ) : (
                            <button className="btn btn-danger me-3" onClick={this.stopRecording}>🛑 Dừng ghi âm</button>
                        )}
                    </div>

                    {audioURL && (
                        <div>
                            <h5>🔊 Bản ghi:</h5>
                            <audio controls src={audioURL}></audio>
                            <div className="mt-2">
                                <button className="btn btn-secondary" onClick={this.clearAudio}>🗑️ Xóa bản ghi</button>
                            </div>
                            <div className="mt-4">
                                <button className="btn btn-primary" onClick={this.handleSubmit}>✅ Kiểm tra</button>
                            </div>
                        </div>
                    )}
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
    listVoc: state.admin.listVoc,
});

const mapDispatchToProps = dispatch => ({
    getAllVoc: () => dispatch(actions.getAllVocStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Speaking);

// import React, { Component, Fragment } from 'react';
// import { connect } from "react-redux";
// import { Redirect, Route, Switch } from 'react-router-dom';

// import './App.scss';
// import { FormattedMessage } from 'react-intl';
// import Header from '../Section/Header';
// import Menu from '../Section/Menu';
// import Footer from '../Section/Footer';
// import { get } from 'lodash';
// import * as actions from "../../../store/actions";
// import { toast } from 'react-toastify';
// import { speakingTest } from '../../../services/userService';

// class Speaking extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isRecording: false,
//             mediaRecorder: null,
//             audioChunks: [],
//             audioURL: null,

//             listVoc: [],
//             selectedExample: '',
//         };
//     }

//     async componentDidMount() {
//         this.props.getAllVoc();
//     }

//     async componentDidUpdate(prevProps) {
//         if (this.props.listVoc !== prevProps.listVoc) {
//             this.setState({
//                 listVoc: this.props.listVoc,
//             });
//         }
//     }
//     startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mediaRecorder = new MediaRecorder(stream);
//         const audioChunks = [];

//         mediaRecorder.ondataavailable = event => {
//             audioChunks.push(event.data);
//         };

//         mediaRecorder.onstop = () => {
//             const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//             const audioURL = URL.createObjectURL(audioBlob);
//             this.setState({ audioURL });

//         };

//         mediaRecorder.start();
//         this.setState({ isRecording: true, mediaRecorder, audioChunks });
//     };

//     stopRecording = () => {
//         const { mediaRecorder } = this.state;
//         if (mediaRecorder) {
//             mediaRecorder.stop();
//         }
//         this.setState({ isRecording: false });
//     };

//     uploadAudio = async (audioBlob) => {
//         const formData = new FormData();
//         formData.append('file', audioBlob, 'recorded_audio.wav');

//         try {
//             const response = await fetch('http://localhost:5000/api/speaking', {
//                 method: 'POST',
//                 body: formData
//             });

//             const result = await response.json();
//             console.log("Kết quả server:", result);
//             // bạn có thể hiển thị phản hồi ở đây
//         } catch (error) {
//             console.error("Lỗi khi gửi âm thanh:", error);
//         }
//     };
//     clearAudio = () => {
//         const { audioURL } = this.state;
//         if (audioURL) {
//             URL.revokeObjectURL(audioURL); // Giải phóng blob URL
//         }
//         this.setState({
//             audioURL: null,
//             audioChunks: [],
//             mediaRecorder: null,
//             isRecording: false
//         });
//     };
//     handleSubmit = async () => {
//         const { selectedExample, audioChunks } = this.state;
//         if (!selectedExample) {
//             toast.error("Vui lòng chọn câu ví dụ để luyện nói!");
//             return;
//         }
    
//         if (audioChunks.length === 0) {
//             toast.error("Bạn chưa ghi âm nội dung!");
//             return;
//         }
    
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const formData = new FormData();
//         formData.append('audio', audioBlob, 'recorded_audio.wav');
//         formData.append('text', selectedExample);
//         let response = await speakingTest(formData);
//         if (response && response.errCode === 0) {
//             toast.success(response.message);
//         }
//         else {
//             toast.error(response.message);
//         }
//     }
    
//     handleExampleChange = (event) => {
//         this.setState({ selectedExample: event.target.value });
//     };
//     render() {
//         const { isRecording, audioURL } = this.state;
//         let arrVoc = this.state.listVoc ? this.state.listVoc : [];
//         return (
//             <Fragment>
//                 <Header />
//                 {this.props.userInfo ? <Menu /> : ''}
//                 <div className="speaking-container mt-4">
//                     <div className="main-content">
//                         <h2 className="mb-4 text-primary fw-bold title-app">Luyện nói cùng Voca AI</h2>
//                         <label className="form-label fw-bold">🗣️ Chọn câu để luyện nói:</label>
//                         <select className="form-select select-sentence" value={this.state.selectedExample} onChange={this.handleExampleChange}>
//                             <option value="">-- Chọn một câu ví dụ --</option>
//                             {arrVoc.map((voc, index) => (
//                                 <option key={index} value={voc.example}>{voc.example}</option>
//                             ))}
//                         </select>
//                         {this.state.selectedExample && (
//                             <p className="mt-3">📌 Bạn cần phát âm câu: <strong>{this.state.selectedExample}</strong></p>
//                         )}

//                     </div>
//                     <div className="recorder-controls mb-4">
//                             {!isRecording ? (
//                                 <button className="btn btn-success me-3" onClick={this.startRecording}>🎤 Bắt đầu ghi âm</button>
//                             ) : (
//                                 <button className="btn btn-danger me-3" onClick={this.stopRecording}>🛑 Dừng ghi âm</button>
//                             )}
//                         </div>

//                         {audioURL && (
//                             <div>
//                                 <h5>🔊 Bản ghi:</h5>
//                                 <audio controls src={audioURL}></audio>
//                                 <div className="mt-2">
//                                     <button className="btn btn-secondary" onClick={this.clearAudio}>🗑️ Xóa bản ghi</button>
//                                 </div>
//                                 <div className="mt-4">
//                                     <button className="btn btn-primary" onClick={this.handleSubmit}>Kiểm tra</button>
//                                 </div>
//                             </div>        
//                         )}
//                 </div>
//                 <Footer />
//             </Fragment>
//         );
//     }
// }


// const mapStateToProps = state => {
//     return {
//         systemMenuPath: state.app.systemMenuPath,
//         isLoggedIn: state.user.isLoggedIn,
//         language : state.app.language,
//         userInfo: state.user.userInfo,

//         listVoc: state.admin.listVoc,
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//          getAllVoc : () => dispatch(actions.getAllVocStart()),
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Speaking);