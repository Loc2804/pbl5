import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './App.scss';
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';
import * as actions from "../../../store/actions";
import { updateProgress } from '../../../services/userService';
import { toast } from 'react-toastify';

class Learning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLearning: false,
            currentWordIndex: 0,
            listVoc: [],
            listLearnedVoc: [],
            progress: 0,  // Tiến độ học
            listAllVoc: [],
        };
    }

    async componentDidMount() {
        this.props.getAllVoc();
        this.props.getAllLearnedVoc(this.props.userInfo.id);
    }

    async componentDidUpdate(prevProps,prevState) {
        if (prevProps.listVoc !== this.props.listVoc) {
            if (this.props.listVoc && this.props.listVoc.length > 0) {
                const learnedVocIds = this.props.learnedListVoc;
                const filteredVoc = this.props.listVoc.filter(voc => voc.id && !learnedVocIds.includes(voc.id));
                if (filteredVoc.length !== this.state.listVoc.length) {
                    this.setState({ 
                        listVoc: filteredVoc,
                        listAllVoc: this.props.listVoc, // lưu tất cả từ gốc
                    });
                }
            }
        }
    
        if (prevProps.learnedListVoc !== this.props.learnedListVoc) {
            if (this.props.learnedListVoc && this.props.learnedListVoc.length > 0) {
                this.setState({ listLearnedVoc: this.props.learnedListVoc });
            }
        }
    
        if (prevState.listLearnedVoc !== this.state.listLearnedVoc || 
            prevState.listAllVoc !== this.state.listAllVoc) {
            const progress = (this.state.listLearnedVoc.length / this.state.listAllVoc.length) * 100;
            this.setState({ progress });
        }
    }
    

    handleStartLearning = () => {
        this.setState({
            isLearning: true,
            currentWordIndex: 0,
        });
    }

    handleNextWord = async () => {
        const currentVocabId = this.state.listVoc[this.state.currentWordIndex].id;
        let res = await updateProgress({
            "vocab_id": this.state.listVoc[this.state.currentWordIndex].id,
            "user_id": this.props.userInfo.id,
        });
        
        if (res && res.errCode === 0) {
            toast.success(`Bạn đã học xong từ ${this.state.listVoc[this.state.currentWordIndex].word}`);
            this.setState(prevState => {
                const updatedLearnedList = [...prevState.listLearnedVoc, currentVocabId];
                const updatedProgress = (updatedLearnedList.length / prevState.listVoc.length) * 100;
                if (prevState.currentWordIndex + 1 < prevState.listVoc.length) {
                    return {
                        currentWordIndex: prevState.currentWordIndex + 1,
                        listLearnedVoc: updatedLearnedList,
                        progress: updatedProgress,
                    };
                } else {
                    return {
                        isLearning: false,
                        listLearnedVoc: updatedLearnedList,
                        progress: updatedProgress,
                    };
                }
            });
        } else {
            toast.error('Cập nhật tiến độ thất bại!');
        }

        this.setState(prevState => {
            if (prevState.currentWordIndex + 1 < prevState.listVoc.length) {
                return { currentWordIndex: prevState.currentWordIndex + 1 };
            } else {
                return { isLearning: false };
            }
        });
    }

    handleEndLearning = () => {
        this.setState({
            isLearning: false,
            currentWordIndex: 0,
        });
    }

    render() {
        const { isLearning, currentWordIndex, listVoc, progress } = this.state;

        // Kiểm tra nếu listVoc có giá trị và có phần tử
        if (!listVoc || listVoc.length === 0) {
            return <div>Loading...</div>;  // Hoặc thông báo rằng chưa có dữ liệu
        }

        const currentWord = listVoc[currentWordIndex];
        
        return (
            <Fragment>
                <Header />
                {this.props.userInfo ? <Menu /> : ''}
                <div className="test-container">
                    <div className="main-content">
                        <h2 className="mb-4 text-primary fw-bold title-app">Học bài trực tuyến với Voca AI</h2>

                        {!isLearning ? (
                            <div>
                                <div className="progress-container">
                                    <div className="progress-background">
                                        <div className="progress-bar" style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="progress-text">
                                        {`${this.state.listLearnedVoc.length} / ${this.state.listAllVoc.length} từ đã học`}
                                    </div>
                                </div>
                                <button className="btn btn-primary mt-3 btn-test" onClick={this.handleStartLearning}>
                                    Bắt đầu học
                                </button>
                            </div>
                        ) : (
                            <>
                                {currentWord && (
                                    <div className="mt-4 text-center">
                                        <h4 className="text-info">Từ vựng hiện tại:</h4>

                                        {/* Kiểm tra nếu image_path tồn tại trước khi render */}
                                        {currentWord.image_path && (
                                            <img
                                                src={`http://localhost:8000/media/Image/${currentWord.image_path}`}
                                                alt={currentWord.word}
                                                style={{ width: '200px', height: 'auto', marginTop: '20px' }}
                                            />
                                        )}

                                        <p className="fw-bold fs-4 mt-2"> 
                                            <span className="text-primary"> {currentWord.word} </span>
                                            <span className="text-primary">{currentWord.pronunciation}:</span>
                                            <span className="text-primary"> {currentWord.meaning}</span>
                                        </p>

                                        {/* Kiểm tra nếu audio_path tồn tại trước khi render audio */}
                                        {currentWord.audio_path && (
                                            <div style={{ marginTop: '20px' }}>
                                                <audio key={currentWord.audio_path} controls>
                                                    <source src={`http://localhost:8000/media/Audio/${currentWord.audio_path}`} type="audio/mpeg" />
                                                    Trình duyệt của bạn không hỗ trợ audio.
                                                </audio>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <button
                                                className="btn btn-secondary me-3"
                                                onClick={this.handleNextWord}
                                            >
                                                Tiếp theo
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={this.handleEndLearning}
                                            >
                                                Kết thúc
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <Footer />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
        listVoc: state.admin.listVoc,
        learnedListVoc: state.admin.learnedListVoc,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllVoc: () => dispatch(actions.getAllVocStart()),
        getAllLearnedVoc: (id) => dispatch(actions.getAllLearnedVocStart(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Learning);
