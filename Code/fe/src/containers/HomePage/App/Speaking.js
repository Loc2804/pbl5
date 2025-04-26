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
            audioChunks: [],
            mediaRecorder: null,
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
            this.setState({ listVoc: this.props.listVoc });
        }
    }

    startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.stream = stream;

            // Recorder.js cho backend
            this.recorder = new Recorder(this.audioContext);
            await this.recorder.init(stream);
            this.recorder.start();

            // MediaRecorder cho playback
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlobForPlayback = new Blob(audioChunks, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlobForPlayback);
                this.setState({ audioURL });
            };

            mediaRecorder.start();

            this.setState({
                isRecording: true,
                mediaRecorder,
                audioChunks
            });

        } catch (err) {
            toast.error("Không thể truy cập micro: " + err.message);
        }
    };

    stopRecording = async () => {
        try {
            const { mediaRecorder } = this.state;

            if (mediaRecorder) {
                mediaRecorder.stop();
            }

            const { blob } = await this.recorder.stop(); // Blob dùng để gửi backend
            this.setState({
                isRecording: false,
                audioBlob: blob,
            });

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
            mediaRecorder: null,
            audioChunks: [],
            isRecording: false,
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
            if (response?.errCode === 0) {
                toast.success(response.message);
                this.clearAudio();
            } else {
                toast.error(response.message || "Có lỗi xảy ra.");
                this.clearAudio();
            }
        } catch (err) {
            toast.error("Lỗi gửi file: " + err.message);
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
