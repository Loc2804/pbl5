import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './App.scss';
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';
import * as actions from "../../../store/actions";
import { updateProgress } from '../../../services/userService';
import { toast } from 'react-toastify';

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReview: false,
            currentWordIndex: 0,
            listVoc: [], // Chứa từ đã học
            listLearnedVoc: [], // Danh sách các từ đã học
            progress: 0, // Tiến độ học
        };
    }

    async componentDidMount() {
        this.props.getAllVoc();
        this.props.getAllLearnedVoc(this.props.userInfo.id);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.listVoc !== this.props.listVoc) {
            if (this.props.listVoc && this.props.listVoc.length > 0 && this.props.learnedListVoc && this.props.learnedListVoc.length > 0) {
                const learnedVocIds = this.props.learnedListVoc;  // Danh sách id của các từ đã học
                const reviewVoc = this.props.listVoc.filter(voc => voc.id && learnedVocIds.includes(voc.id)); // Lọc các từ đã học
                
                // Cập nhật lại state nếu danh sách đã thay đổi
                if (reviewVoc.length !== this.state.listVoc.length) {
                    this.setState({ listVoc: reviewVoc });
                }
            }
        }
        if (prevProps.learnedListVoc !== this.props.learnedListVoc) {
            if (this.props.learnedListVoc && this.props.learnedListVoc.length > 0) {
                this.setState({ listLearnedVoc: this.props.learnedListVoc });
            }
        }
    }

    handleStartReview = () => {
        this.setState({
            isReview: true,
            currentWordIndex: 0,
            progress: 0, // Đặt lại tiến độ khi bắt đầu ôn tập
        });
    }

    handleNextWord = async () => {
        // Nếu đã duyệt hết các từ trong listVoc, hiển thị thông báo hoàn thành
        if (this.state.currentWordIndex + 1 === this.state.listVoc.length) {
            this.setState({ isReview: false });
            toast.success('Hoàn thành ôn tập!');
        } else {
            this.setState(prevState => ({
                currentWordIndex: prevState.currentWordIndex + 1,
            }));
        }
    }

    handleEndReview = () => {
        this.setState({
            isReview: false,
            currentWordIndex: 0,
            progress: 0, // Đặt lại tiến độ khi kết thúc ôn tập
        });
    }

    render() {
        const { isReview, currentWordIndex, listVoc, progress } = this.state;

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
                        <h2 className="mb-4 text-primary fw-bold title-app">Ôn tập từ vựng với Voca AI</h2>

                        {!isReview ? (
                            <button className="btn btn-primary mt-3 btn-test" onClick={this.handleStartReview}>
                                Bắt đầu ôn tập
                            </button>
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

                                        {/* Hiển thị thông báo hoàn thành khi ôn tập hết các từ */}
                                        {currentWordIndex === listVoc.length && (
                                            <div className="mt-4 text-center text-success" style={{ fontSize: '1.5rem' }}>
                                                Hoàn thành ôn tập!
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
                                                onClick={this.handleEndReview}
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

export default connect(mapStateToProps, mapDispatchToProps)(Review);
