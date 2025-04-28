import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom'; // Sửa lại import Link
import './UserInfo.scss';
import Header from '../../../HomePage/Section/Header';
import Footer from '../../../HomePage/Section/Footer';

class AccountUser extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            
        }
    }
    
    async componentDidMount() {
     
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    render() {     
        
        return (
            <Fragment> 
                <Header />
                <div className='account-container'>
                    <div className="account-content">
                        <h2 className="account-title">Thông tin tài khoản</h2>
                        {this.props.userInfo ? (
                            <div className="info-section">
                                <div className="info-item">
                                    <span className="label">Tên đăng nhập:</span>
                                    <span className="value">{this.props.userInfo.username}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Họ và tên:</span>
                                    <span className="value">{this.props.userInfo.full_name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Địa chỉ:</span>
                                    <span className="value">{this.props.userInfo.address}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Số điện thoại:</span>
                                    <span className="value">{this.props.userInfo.phone}</span>
                                </div>

                                {/* Thêm 2 Link bên dưới */}
                                <div className="link-section">
                                    <Link to="/app/history" className="account-link">
                                        Xem lịch sử làm bài kiểm tra
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <p>Không tìm thấy thông tin người dùng.</p>
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
        language : state.app.language,
        userInfo: state.user.userInfo,
    };
};

export default connect(mapStateToProps)(AccountUser);
