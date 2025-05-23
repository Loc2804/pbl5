import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './UserAccount.scss';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../../../services/userService'

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            phone: '',
        };
    }

    componentDidMount = () =>{

    }
    handleOnChangeInput = (event, id) => {
        this.setState({ [id]: event.target.value });
    };

    handleSubmit =  async() => {
        // Handle form submission logic here
        if (!this.state.username || !this.state.phone) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        let res = await forgotPassword({
            username: this.state.username,
            phone: this.state.phone,
        })
        if(res && res.response.errCode === 0){
            toast.success(res.response.message);
        }
        else{
            toast.error(res.response.error);
        }
    };

    render() {
        return (
            <Fragment>
                <div className="d-flex vh-100">
                    {/* Left Image Section */}
                    <div className="w-50 d-flex align-items-center justify-content-center bg-light">
                        <div className="position-relative w-100 h-100">
                            <img
                                src="https://www.voca.vn/assets/images/course-logo.svg"
                                alt="Classroom"
                                className="img-fluid w-100 h-100"
                                style={{ objectFit: 'contain', borderRadius: '30px 0 0 30px' }}
                            />
                            <div className="position-absolute bottom-0 start-0 p-4 text-black">
                                <h4 className="fw-bold">Voca AI</h4>
                                <p>Learning English with Voca AI</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Section */}
                    <div className="w-50 d-flex align-items-center justify-content-center bg-white">
                        <div style={{ width: '70%', maxWidth: '400px' }}>
                            <h5 className="mb-4 text-center">
                                Quên mật khẩu
                            </h5>

                            <p className="text-center text-muted mb-4">
                                Vui lòng nhập tên tài khoản và số điện thoại để lấy lại mật khẩu.
                            </p>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="Hãy nhập Tên tài khoản"
                                    value={this.state.username}
                                    onChange={(e) => this.handleOnChangeInput(e, 'username')}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="Hãy nhập Số điện thoại"
                                    value={this.state.phone}
                                    onChange={(e) => this.handleOnChangeInput(e, 'phone')}
                                />
                            </div>

                            <button className="btn btn-info text-white w-100 rounded-pill" onClick={() => this.handleSubmit()}>
                                Tìm lại mật khẩu
                            </button>

                            <div className="text-center mt-3">
                                <p>
                                    Đã nhớ mật khẩu?{' '}
                                    <a href="/pages/logon" className="text-decoration-none text-primary">
                                        Đăng nhập
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
});

export default connect(mapStateToProps)(ForgotPassword);
