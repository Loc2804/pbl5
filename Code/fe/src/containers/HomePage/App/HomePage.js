import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './App.scss';
import { FormattedMessage } from 'react-intl';
import Header from '../Section/Header';
import Menu from '../Section/Menu';
import Footer from '../Section/Footer';

class HomePage extends Component {
    render() {
        const { userInfo } = this.props;

        return (
            <Fragment>
                <Header />
                {userInfo && <Menu />}
                <div className="homepage-container">
                    <div className="main-content flex-grow-1 px-4 py-3">
                        <h2 className="mb-4 text-primary fw-bold title-app">Chào mừng đến với VOCA AI</h2>
                        <p className="mb-4 des-app">Cùng khám phá các phương pháp học tiếng Anh hiện đại và thú vị với VOCA AI!</p>

                        <div className="intro-images row">
                            <div className="col-md-4 mb-4 text-center img img-learning">
                                <img src="https://www.voca.vn/assets/images/home-logo.png" alt="Học tập" className="img-fluid rounded shadow-sm" />
                                <h5 className="mt-4">Học tập trực tuyến</h5>
                            </div>
                            <div className="col-md-4 mb-4 text-center img img-speaking">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj7kJ9yR9EPQYFrnBZxwZFChWJXm4yS79UrA&s" alt="Luyện nói" className="img-fluid rounded shadow-sm" />
                                <h5 className="mt-4">Luyện nói cùng Voca AI</h5>
                            </div>
                            <div className="col-md-4 mb-4 text-center img img-learning-camera">
                                <img src="https://glotcms.sgp1.cdn.digitaloceanspaces.com/epic/wordpress/2018/10/image.png" alt="Camera" className="img-fluid rounded shadow-sm" />
                                <h5 className="mt-4">Học từ vựng bằng camera</h5>
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

export default connect(mapStateToProps)(HomePage);
