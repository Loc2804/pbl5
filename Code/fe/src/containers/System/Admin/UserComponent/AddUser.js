import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';

import './UserComponent.scss';
import { FormattedMessage } from 'react-intl';

class AddUser extends Component {
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

    closeModal = () =>{
        this.props.closeModal();
    }
    render() {     
        let isShow = this.props.isShow;
        return (
            isShow === true ? 
            <Fragment> 
                <div className={`add-container ${this.props.isShow ? 'show' : ''}`}>
                    <div className="modal-content">
                        <div className='add-title'>
                            <h3 className='center'>Add new user</h3>
                            <button className='btn-close' onClick={this.closeModal}></button>
                        </div>
                        <div className='add-body'>
                        </div>
                    </div>
                </div>
            </Fragment>
            :
            ''
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
