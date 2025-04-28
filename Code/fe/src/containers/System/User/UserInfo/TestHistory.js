import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import './UserInfo.scss';
import Header from '../../../HomePage/Section/Header';
import Footer from '../../../HomePage/Section/Footer';
import { getListHistoryTest } from '../../../../services/userService'; // Import hàm lấy lịch sử

class TestHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listHistory: []
        }
    }

    async componentDidMount() {
        if (this.props.userInfo) {
            await this.fetchHistory(this.props.userInfo.id);
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo && this.props.userInfo) {
            await this.fetchHistory(this.props.userInfo.id);
        }
    }

    fetchHistory = async (userId) => {
        try {
            let res = await getListHistoryTest(userId);
            if (res && res.errCode === 0) {
                this.setState({ listHistory: res.data });
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }

    render() {
        const { listHistory } = this.state;

        return (
            <Fragment>
                <Header />
                <div className='account-container'>
                    <div className="account-content">
                        <h2 className="account-title">Lịch sử làm bài kiểm tra</h2>
                        
                        <div className="history-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Lần kiểm tra</th>
                                        <th>Số điểm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listHistory && listHistory.length > 0 ? (
                                        listHistory.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.score}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">Chưa có lịch sử làm bài.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Link quay lại tài khoản */}
                        <div className="link-section">
                            <Link to="/app/account" className="account-link">
                                Quay về tài khoản
                            </Link>
                        </div>

                    </div>
                </div>
                <Footer />
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TestHistory);
