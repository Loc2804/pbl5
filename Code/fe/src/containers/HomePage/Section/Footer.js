import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './Section.scss';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faYoutube, faGithub } from '@fortawesome/free-brands-svg-icons';

class Footer extends Component {
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
            <footer className="app-footer bg-light text-dark pt-5 pb-3 px-4">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-4 mb-4">
                            <h5 className="fw-bold">VOCA AI</h5>
                            <p>
                                Nền tảng học tiếng Anh thông minh giúp bạn luyện phát âm, từ vựng và giao tiếp một cách hiệu quả.
                            </p>
                        </div>
                        <div className="col-md-4 mb-4">
                            <h6 className="fw-bold">Liên kết nhanh</h6>
                            <ul className="list-unstyled">
                                <li><Link to="/" className="footer-link">Trang chủ</Link></li>
                                <li><Link to="/courses" className="footer-link">Khóa học</Link></li>
                                <li><Link to="/about" className="footer-link">Giới thiệu</Link></li>
                                <li><Link to="/contact" className="footer-link">Liên hệ</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-4 mb-4">
                            <h6 className="fw-bold">Kết nối với chúng tôi</h6>
                            <div className="d-flex gap-3">
                                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-icon">
                                    <FontAwesomeIcon icon={faFacebookF} />
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-icon">
                                    <FontAwesomeIcon icon={faYoutube} />
                                </a>
                                <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-social-icon">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                            </div>
                        </div>
                    </div>
    
                    <hr />
                    <div className="text-center small text-muted mt-3">
                        © {new Date().getFullYear()} VOCA AI. All rights reserved.
                    </div>
                </div>
            </footer>
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

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
