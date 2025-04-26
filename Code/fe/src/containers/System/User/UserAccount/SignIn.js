import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './UserAccount.scss';
import { toast } from 'react-toastify';
import { handleLoginApi } from '../../../../services/userService';
import * as actions from "../../../../store/actions";
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            isRegister: false,
            fullName: '',     // thêm
            address: '',      // thêm
            phone: '',        // thêm
            password_again: '', // thêm
        };
    }

    handleOnChangeInput = (event, id) => {
        this.setState({ [id]: event.target.value });
    };

    handleSubmit = async() => {
        if(this.state.isRegister) {
            if (!this.state.username || !this.state.password || !this.state.fullName || !this.state.address || !this.state.phone) {
                toast.error('Vui lòng điền đầy đủ thông tin đăng ký!');
                return;
            }
            if (this.state.password !== this.state.password_again) {
                toast.error('Mật khẩu không khớp!');
                return;
            }
            toast.success('Đăng ký thành công!');
        } else {
            if (!this.state.username || !this.state.password) {
                toast.error('Vui lòng điền đầy đủ thông tin đăng nhập!');
                return;
            }
            let { username, password } = this.state;
            this.props.userLogin(username, password);
            let res = await handleLoginApi(username, password);
            if (res && res.errCode === 0) {
                this.props.history.push('/app/home');
            }
            else{
                toast.error("Đăng nhập thất bại!");
                this.props.history.push('/pages/logon');
            }
                
        }
        console.log(this.state);
    };

    toggleShowPassword = () => {
        this.setState(prevState => ({ showPassword: !prevState.showPassword }));
    };

    toggleForm = () => {
        this.setState(prevState => ({ isRegister: !prevState.isRegister }));
    };

    render() {
        const { showPassword, isRegister } = this.state;

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
                                {isRegister ? 'Chào mừng bạn đến với VOCA AI - Đăng ký' : 'Chào mừng bạn đến với VOCA AI - Đăng nhập'}
                            </h5>
                            <div className="d-flex justify-content-center mb-4">
                                <button
                                    className={`btn me-2 ${!isRegister ? 'btn-info text-white' : 'btn-light border'}`}
                                    style={{ borderRadius: '50px', width: '120px' }}
                                    onClick={() => this.setState({ isRegister: false })}
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    className={`btn ${isRegister ? 'btn-info text-white' : 'btn-light border'}`}
                                    style={{ borderRadius: '50px', width: '120px' }}
                                    onClick={() => this.setState({ isRegister: true })}
                                >
                                    Đăng ký
                                </button>
                            </div>
                            <p className="text-center text-muted mb-4">
                                Hãy thử nghiệm VOCA AI để trải nghiệm các khóa học hay nhất nhé!
                            </p>

                            {/* Username */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    placeholder="Hãy nhập Tên tài khoản"
                                    value={this.state.username}
                                    onChange={(e) => this.handleOnChangeInput(e, 'username')}
                                />
                            </div>

                            {/* Họ và tên (chỉ hiển thị khi đăng ký) */}
                            {isRegister && (
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        placeholder="Họ và tên"
                                        value={this.state.fullName}
                                        onChange={(e) => this.handleOnChangeInput(e, 'fullName')}
                                    />
                                </div>
                            )}

                            {/* Địa chỉ (chỉ hiển thị khi đăng ký) */}
                            {isRegister && (
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        placeholder="Địa chỉ"
                                        value={this.state.address}
                                        onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                    />
                                </div>
                            )}

                            {/* Số điện thoại (chỉ hiển thị khi đăng ký) */}
                            {isRegister && (
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        placeholder="Số điện thoại"
                                        value={this.state.phone}
                                        onChange={(e) => this.handleOnChangeInput(e, 'phone')}
                                    />
                                </div>
                            )}

                            {/* Password */}
                            <div className="mb-3 position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control rounded-pill"
                                    placeholder="Hãy nhập Mật khẩu"
                                    value={this.state.password}
                                    onChange={(e) => this.handleOnChangeInput(e, 'password')}
                                />
                                <span
                                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={this.toggleShowPassword}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </span>
                            </div>

                            {/* Confirm Password (chỉ khi đăng ký) */}
                            {isRegister && (
                                <div className="mb-3 position-relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control rounded-pill"
                                        placeholder="Xác nhận Mật khẩu"
                                        value={this.state.password_again}
                                        onChange={(e) => this.handleOnChangeInput(e, 'password_again')}
                                    />
                                </div>
                            )}

                            {/* Remember me + Quên mật khẩu (chỉ khi đăng nhập) */}
                            {!isRegister && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <input type="checkbox" id="rememberMe" className="me-2" />
                                        <label htmlFor="rememberMe">Nhớ Mật khẩu</label>
                                    </div>
                                    <a href="/pages/forgot-password" className="text-decoration-none">Quên mật khẩu?</a>
                                </div>
                            )}

                            {/* Submit */}
                            <button className="btn btn-info text-white w-100 rounded-pill" onClick={this.handleSubmit}>
                                {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                            </button>
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

const mapDispatchToProps = dispatch => {
    return {
        userLogin : (username, password) => dispatch(actions.userLogin(username, password)),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

