import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils/constant';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { adminMenu } from './menuApp';
class Header extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            menuApp : [],
        }
    }
    handleChangeLanguage = (language) =>{
        this.props.changeLanguageAppRedux(language);
    }
    componentDidMount(){
        let {userInfo} = this.props;
        let menu = adminMenu;

            this.setState({
                menuApp: menu,
            })
        
    }
    render() {
        const { processLogout, language , userInfo } = this.props;
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>
                <div className='languages '>
                    <span className='welcome'>Xin chào, {userInfo && userInfo.fullName ? userInfo.fullName : ''} !</span>
                    <span className={language === LANGUAGES.VI ? 'language-vi active':'language-vi'}
                        onClick={() => {this.handleChangeLanguage(LANGUAGES.VI)}}>VN
                    </span>
                    <span className={language === LANGUAGES.EN ? 'language-en active':'language-en'}
                        onClick={() => {this.handleChangeLanguage(LANGUAGES.EN)}}>EN
                    </span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>  
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
