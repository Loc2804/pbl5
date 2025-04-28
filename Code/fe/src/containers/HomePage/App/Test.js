import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './App.scss';
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';
import * as actions from "../../../store/actions";
import { saveUserResult } from '../../../services/userService';
import { withRouter } from 'react-router-dom'; 

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueTest: '',
            listVoc: [],
            listCategory: [],
            currentVocList: [],
            currentQuestionIndex: 0,
            userAnswer: '',
            feedback: '',
            isTestStarted: false,
            correctAnswers: 0,
            isTestFinished: false,
        };
        this.answerInputRef = React.createRef();
    }

    async componentDidMount() {
        if (!this.props.userInfo) {
            this.props.history.push('/app/home');
            return;
        }
        this.props.getAllVoc();
        this.props.getAllCategory();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!this.props.userInfo) {
            this.props.history.push('/app/home');
            return;
        }
        if (this.props.listCategory !== prevProps.listCategory) {
            this.setState({ listCategory: this.props.listCategory });
        }

        if (this.props.listVoc !== prevProps.listVoc) {
            this.setState({ listVoc: this.props.listVoc });
        }
        if (this.state.currentQuestionIndex !== prevState.currentQuestionIndex && this.answerInputRef.current) {
            this.answerInputRef.current.focus();
        }
    }

    handleTestChange = (event) => {
        const selectedValue = event.target.value;
        this.setState({ valueTest: selectedValue });
    }

    handleSubmitTest = () => {
        const { valueTest, listVoc } = this.state;

        let filteredList = [];
        if (valueTest === "entire") {
            filteredList = listVoc;
        } else {
            filteredList = listVoc.filter(item => item.category.category_value === valueTest);
        }

        this.setState({
            currentVocList: filteredList,
            currentQuestionIndex: 0,
            userAnswer: '',
            feedback: '',
            isTestStarted: true,
            correctAnswers: 0,
            isTestFinished: false,
        });
    }

    handleAnswerSubmit = () => {
        const { userAnswer, currentVocList, currentQuestionIndex, correctAnswers } = this.state;
        const correctAnswer = currentVocList[currentQuestionIndex]?.word?.toLowerCase().trim();
        const userAns = userAnswer.toLowerCase().trim();

        const isCorrect = userAns === correctAnswer;
        let feedback = isCorrect ? 'Đúng!' : `Sai! Đáp án đúng là: ${correctAnswer}`;

        this.setState({
            feedback,
            correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
        });

        setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < currentVocList.length) {
                this.setState({
                    currentQuestionIndex: nextIndex,
                    userAnswer: '',
                    feedback: '',
                });
            } else {
                this.setState({ isTestFinished: true });
            }
        }, 500);
    }

    handleFinishTest = async() => {
        let data = {
            user_id: this.props.userInfo.id,
            score: this.state.correctAnswers,
        }
        await saveUserResult(data);
        this.setState({
            isTestStarted: false,
            valueTest: '',
            currentVocList: [],
            userAnswer: '',
            feedback: '',
            isTestFinished: false,
        });
    }

    render() {
        const {
            valueTest,
            currentVocList,
            currentQuestionIndex,
            userAnswer,
            feedback,
            isTestStarted,
            isTestFinished,
            correctAnswers
        } = this.state;

        const currentVoc = currentVocList[currentQuestionIndex];

        return (
            <Fragment>
                <Header />
                {this.props.userInfo ? <Menu /> : ''}
                <div className="test-container">
                    <div className="main-content">
                        <h2 className="mb-4 text-primary fw-bold title-app">Làm bài TEST với Voca AI</h2>

                        {/* Test Selection */}
                        {!isTestStarted && (
                            <>
                                <label className="form-label fw-bold lb-test">Chọn loại bài test</label>
                                <select className="form-select test-select" onChange={this.handleTestChange} value={valueTest}>
                                    <option value="">-- Chọn một loại bài test --</option>
                                    <option value="entire">Bài test tổng hợp</option>
                                    <option value="vegetable">Bài test về rau</option>
                                    <option value="root">Bài test về củ</option>
                                    <option value="fruit">Bài test về quả</option>
                                </select>
                                <button
                                    className="btn btn-primary mt-3 btn-test"
                                    onClick={this.handleSubmitTest}
                                    disabled={!valueTest}
                                >
                                    Làm bài test
                                </button>
                            </>
                        )}

                        {/* Test Interface */}
                        {isTestStarted && !isTestFinished && currentVoc && (
                            <div className="test-question mt-4">
                                <div className="text-voc mb-2">
                                    <b>Câu {currentQuestionIndex + 1}/{currentVocList.length}:</b>&nbsp;
                                    Dịch từ sau sang tiếng Anh: <span className="text-primary ">{currentVoc.meaning}</span>
                                </div>
                                <input
                                    ref={this.answerInputRef}
                                    type="text"
                                    className="form-control form-voc"
                                    value={userAnswer}
                                    onChange={(e) => this.setState({ userAnswer: e.target.value })}
                                    disabled={!!feedback}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !feedback && userAnswer !== '') {
                                            this.handleAnswerSubmit();
                                        }
                                    }}
                                />
                                <button
                                    className="btn btn-primary mt-2 btn-voc"
                                    onClick={this.handleAnswerSubmit}
                                    disabled={!!feedback || userAnswer === ''}
                                >
                                    Trả lời
                                </button>
                                {feedback && (
                                    <div className={`text-voc mt-2 ${feedback === 'Đúng!' ? 'text-primary' : 'text-danger'}`}>
                                        {feedback}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Test Finished */}
                        {isTestFinished && (
                            <div className="mt-4 text-center">
                                <h4 className="text-info">Hoàn thành bài kiểm tra!</h4>
                                <p className="fw-bold">Bạn đã trả lời đúng <span className="text-success">{correctAnswers}</span> trên tổng số {currentVocList.length} câu hỏi.</p>
                                <button className="btn btn-secondary" onClick={this.handleFinishTest}>Làm lại từ đầu</button>
                            </div>
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
        listCategory: state.admin.listCategory,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllVoc: () => dispatch(actions.getAllVocStart()),
        getAllCategory: () => dispatch(actions.getAllCategoryStart()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Test));
