import React, { Component } from 'react';
import axios from 'axios';
import './newArticle.css';

class newArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            id: '',
            title: '',
            subtitle: '',
            imageURL: '',
            imageCaption: '',
            content: '',
            author: '',
            category: 'Cronaca',
            likes: ''
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
        this.publish = this.publish.bind(this);
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

    async componentDidMount() {
        await fetch('/server/articles/count')
        .then(response => response.json())
        .then((data) => this.setState({total: data.totalArticles}))
        .catch(console.log);
    }

    async publish() {
        await axios.post('/server/articles/newArticle', {
            id: this.state.total,
            title: this.state.title,
            subtitle: this.state.subtitle,
            imageURL: this.state.imageURL,
            imageCaption: this.state.imageCaption,
            content: this.state.content,
            author: this.props.username,
            category: this.state.category,
            likes: this.state.likes
        })
        .then(function (response) {
            if(response.data.published) {
                window.location.replace('/articles/');
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return(
            <div className="newArticle">
                <h4 className="labelTitle">Nuovo articolo</h4>
                <form onSubmit={this.handleSubmit}>
                    <input type="number" className="form-control _id" disabled={true} placeholder={this.state.total} />
                    <input type="text" className="form-control _title" onChange={this.handleTitleChange} placeholder="Titolo" />
                    <input type="text" className="form-control _subtitle" rows="2" onChange={this.handleSubtitleChange} placeholder="Sottotitolo" />
                    <input type="text" className="form-control _author" disabled={true} placeholder={this.props.username} />
                    <input type="text" className="form-control _imageURL" onChange={this.handleImageURLChange} placeholder="URL immagine" />
                    <input type="text" className="form-control _imageCaption" onChange={this.handleImageCaptionChange} placeholder="Didascalia immagine" />
                    <textarea className="form-control __textarea" rows="10" onChange={this.handleContentChange} placeholder="Corpo articolo" />
                    <select className="form-control" id="category" onChange={this.handleCategoryChange}>
                        <option>Cronaca</option>
                        <option>Politica</option>
                        <option>Economia</option>
                        <option>Tecnologia</option>
                        <option>Sport</option>
                    </select>
                    <input type="number" className="form-control _likes" disabled={true} onChange={this.handleLikesChange} value="0" placeholder="Mi Piace" />
                    <button type="submit" className="btn btn-lg btn-block btn-primary publishButton" onClick={this.publish}>Pubblica</button>
                </form>
            </div>
        );
    }
}

export default newArticle;