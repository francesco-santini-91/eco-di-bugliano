import React, { Component } from 'react';
import axios from 'axios';
import './editArticle.css';

class editArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
                id: '',
                title: '',
                subtitle: '',
                imageURL: '',
                imageCaption: '',
                content: '',
                author: '',
                category: '',
                pubblication: '',
                likes: '',
                unhautorized: false
            };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubtitleChange = this.handleSubtitleChange.bind(this);
        this.handleImageURLChange = this.handleImageURLChange.bind(this);
        this.handleImageCaptionChange = this.handleImageCaptionChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleLikesChange = this.handleLikesChange.bind(this);
        this.abort = this.abort.bind(this);
        this.save = this.save.bind(this);
    }

    async componentDidMount() {
        await fetch('/server/articles/' + this.props.match.params.title)
        .then(response => response.json())
        .then((data) => this.setState(data))
        .catch(console.log);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleIdChange(event) {
        this.setState({id: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value});
    }

    handleSubtitleChange(event) {
        this.setState({subtitle: event.target.value});
    }

    handleImageURLChange(event) {
        this.setState({imageURL: event.target.value});
    }

    handleImageCaptionChange(event) {
        this.setState({imageCaption: event.target.value});
    }

    handleContentChange(event) {
        this.setState({content: event.target.value});
    }

    handleCategoryChange(event) {
        this.setState({category: event.target.value});
    }

    handleLikesChange(event) {
        this.setState({likes: event.target.value});
    }

    abort() {
        window.location.replace('/users/' + this.props.username + '/articles');
    }

    async save() {
        var _unhautorized = false;
        await axios.put('/server/articles/' + this.state.title, {
            token: sessionStorage.getItem('token'),
            id: this.state.id,
            title: this.state.title,
            subtitle: this.state.subtitle,
            imageURL: this.state.imageURL,
            imageCaption: this.state.imageCaption,
            content: this.state.content,
            author: this.state.author,
            category: this.state.category,
            likes: this.state.likes
        })
        .then(function (response) {
            if(response.data.unhautorized) {
                _unhautorized = true;
            }
            if(response.data.edited) {
                window.location.replace('/articles');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
        if (_unhautorized === true) {
            this.setState({unhautorized: _unhautorized});
        }
    }

    render() {
        return(
            <div className="editArticle">
                <h4 className="titleLabel">Modifica articolo</h4>
                <form onSubmit={this.handleSubmit}>
                    <input type="number" className="form-control _id" disabled={true} onChange={this.handleIdChange} value={this.state.id} />
                    <input type="text" className="form-control _title" disabled={true} onChange={this.handleTitleChange} value={this.state.title} />
                    <input type="text" className="form-control _subtitle" onChange={this.handleSubtitleChange} value={this.state.subtitle} />
                    <input type="text" className="form-control _author" disabled={true} value={this.state.username} />
                    <input type="text" className="form-control _imageURL" onChange={this.handleImageURLChange} value={this.state.imageURL} />
                    <input type="text" className="form-control _imageCaption" onChange={this.handleImageCaptionChange} value={this.state.imageCaption} />
                    <textarea className="form-control __textarea" rows="10" onChange={this.handleContentChange} value={this.state.content} />
                    <select className="form-control" id="category" onChange={this.handleCategoryChange} value={this.state.category}>
                        <option>Cronaca</option>
                        <option>Politica</option>
                        <option>Economia</option>
                        <option>Sport</option>
                    </select>
                    <input type="number" className="form-control _likes" disabled ={true} onChange={this.handleLikesChange} value={this.state.likes} />
                    <div className="alert alert-danger alertLabel" role="alert" hidden={!this.state.unhautorized}>Utente non autorizzato!</div>
                    <button type="submit" className="btn btn-lg btn-block btn-dark abortButton" onClick={this.abort}>Annulla</button>
                    <button type="submit" className="btn btn-lg btn-block btn-primary saveButton" onClick={this.save}>Salva modifiche</button>
                </form>
            </div>
        );
    }
}

export default editArticle;