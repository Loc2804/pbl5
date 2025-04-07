import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ModalVoc.scss';
import axios from 'axios';

class ModalVoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            id: '',
            word: '',
            pronunciation: '',
            meaning: '',
            image_path: '',
            audio_path: '',
            example: '',
            category: '',
            categories: [],
        };
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps) {
        if (this.props.categoryList !== prevProps.categoryList) {
            this.setState({
                categories: this.props.categoryList,
            });
        }
        if (this.props.vocabEdit !== prevProps.vocabEdit) {
            if (this.props.vocabEdit && this.props.vocabEdit.id) {
                this.setState({
                    edit: true,
                    id: this.props.vocabEdit.id,
                    word: this.props.vocabEdit.word || '',
                    pronunciation: this.props.vocabEdit.pronunciation || '',
                    meaning: this.props.vocabEdit.meaning || '',
                    image_path: this.props.vocabEdit.image_path || '',
                    audio_path: this.props.vocabEdit.audio_path || '',
                    example: this.props.vocabEdit.example || '',
                    category: this.props.vocabEdit.category ? this.props.vocabEdit.category.id : '',
                });
            } else {
                this.clearForm();
            }
        }
    }


    handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ [field]: file.name });  // Save only the file name
        }
    };

    handleChange = (event, field) => {
        this.setState({ [field]: event.target.value });
    };

    handleSubmit = async () => {
        const data = {
            word: this.state.word,
            pronunciation: this.state.pronunciation,
            meaning: this.state.meaning,
            image_path: this.state.image_path,
            audio_path: this.state.audio_path,
            example: this.state.example,
            category: this.state.category,
        };

        if (this.state.edit && this.props.vocabEdit) {
            // Edit existing vocabulary
            this.props.handleEditVocabulary({ id: this.state.id, ...data });
        } else {
            // Create new vocabulary
            this.props.handleCreateVocabulary(data);
        }

        this.clearForm();
    };

    clearForm = () => {
        this.setState({
            edit: false,
            id: '',
            word: '',
            pronunciation: '',
            meaning: '',
            image_path: '',
            audio_path: '',
            example: '',
            category: '',
        });
    };

    closeModal = () => {
        this.props.closeModal();
        this.clearForm();
    };

    render() {
        const { isShow } = this.props;
        const { categories } = this.state;
        return isShow ? (
            <Fragment>
                <div className={`add-container ${isShow ? 'show' : ''}`}>
                    <div className="modal-content">
                        <div className="add-title">
                            <h3 className="center">{this.state.edit ? 'Edit Vocabulary' : 'Add Vocabulary'}</h3>
                            <span className="btn-x" onClick={this.closeModal}>X</span>
                        </div>
                        <div className="add-body row">
                            {[
                                { label: 'Word', field: 'word' },
                                { label: 'Pronunciation', field: 'pronunciation' },
                                { label: 'Meaning', field: 'meaning' },
                                { label: 'Example', field: 'example' },
                            ].map(item => (
                                <div className="form-group col-6" key={item.field}>
                                    <label>{item.label}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state[item.field]}
                                        onChange={(e) => this.handleChange(e, item.field)}
                                    />
                                </div>
                            ))}

                            <div className="form-group col-6">
                                <label>Image Path</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => this.handleFileChange(e, 'image_path')}
                                />
                                <span>{this.state.image_path}</span> {/* Show selected file name */}
                            </div>

                            <div className="form-group col-6">
                                <label>Audio Path</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => this.handleFileChange(e, 'audio_path')}
                                />
                                <span>{this.state.audio_path}</span> {/* Show selected file name */}
                            </div>

                            <div className="form-group col-6">
                                <label>Category</label>
                                <select
                                    className="form-control"
                                    value={this.state.category}
                                    onChange={(e) => this.handleChange(e, 'category')}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category_value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button className="btn btn-primary btn-submit" onClick={this.handleSubmit}>
                                {this.state.edit ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment>
        ) : null;
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(ModalVoc);