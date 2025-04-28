import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';  // thêm withRouter
import './App.scss';
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';
import * as actions from "../../../store/actions";
import { toast } from 'react-toastify';

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReview: false,
            currentWordIndex: 0,
            listVoc: [],
            listLearnedVoc: [],
            progress: 0,
        };
    }

    async componentDidMount() {
        if (!this.props.userInfo) {
            this.props.history.push('/app/home');
            return;
        }
        this.props.getAllVoc();
        this.props.getAllLearnedVoc(this.props.userInfo.id);
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!this.props.userInfo) {
            this.props.history.push('/app/home');
            return;
        }
        if (prevProps.listVoc !== this.props.listVoc || prevProps.learnedListVoc !== this.props.learnedListVoc) {
            if (this.props.listVoc && this.props.learnedListVoc) {
                const learnedVocIds = this.props.learnedListVoc;
                const reviewVoc = this.props.listVoc.filter(voc => voc.id && learnedVocIds.includes(voc.id));
                this.setState({ listVoc: reviewVoc });
            }
        }
    }

    handleStartReview = () => {
        this.setState({
            isReview: true,
            currentWordIndex: 0,
            progress: 0,
        });
    }

    handleNextWord = () => {
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
            progress: 0,
        });
    }

    render() {
        const { isReview, currentWordIndex, listVoc } = this.state;
        const hasWordsToReview = listVoc && listVoc.length > 0;
        const currentWord = listVoc[currentWordIndex];

        return (
            <Fragment>
                <Header />
                {this.props.userInfo && <Menu />}
                <div className="test-container">
                    <div className="main-content">
                        <h2 className="mb-4 text-primary fw-bold title-app">Ôn tập từ vựng với Voca AI</h2>

                        {!isReview ? (
                            hasWordsToReview ? (
                                <button className="btn btn-primary mt-3 btn-test" onClick={this.handleStartReview}>
                                    Bắt đầu ôn tập
                                </button>
                            ) : (
                                <div className="alert alert-warning mt-3" role="alert" style={{ width: '50%' }}>
                                    Bạn chưa học từ nào để ôn tập.
                                </div>
                            )
                        ) : (
                            currentWord && (
                                <div className="mt-4 text-center">
                                    <h4 className="text-info">Từ vựng hiện tại:</h4>

                                    {currentWord.image_path && (
                                        <img
                                            src={`http://localhost:8000/media/Image/${currentWord.image_path}`}
                                            alt={currentWord.word}
                                            style={{ width: '200px', height: 'auto', marginTop: '20px' }}
                                        />
                                    )}

                                    <p className="fw-bold fs-4 mt-2">
                                        <span className="text-primary">{currentWord.word}</span> - 
                                        <span className="text-primary ms-2">{currentWord.pronunciation}</span> : 
                                        <span className="text-primary ms-2">{currentWord.meaning}</span>
                                    </p>

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
                                            onClick={this.handleEndReview}
                                        >
                                            Kết thúc
                                        </button>
                                    </div>
                                </div>
                            )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));
