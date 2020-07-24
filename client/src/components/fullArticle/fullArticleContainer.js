import React, { Component } from 'react';
import FullArticle from './fullArticle';

class fullArticleContainer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            articleNotFound: false,
            article: {}
        };
    }

    async componentDidMount() {
        await fetch('/server/articles/' + this.props.match.params.id)
        .then(response => response.json())
        .then((data) => this.setState({article: data}))
        .catch(console.log);
        if(!this.state.article.title) {
            this.setState({articleNotFound: true});
        }
    }

    render() {
        return(
            <div className="fullArticleContainer">
                <div className="articleFound" hidden={this.state.articleNotFound}>
                    <FullArticle 
                        title={this.state.article.title} 
                        subtitle={this.state.article.subtitle} 
                        content={this.state.article.content} 
                        imageURL={this.state.article.imageURL}
                        imageCaption={this.state.article.imageCaption}
                        author={this.state.article.author}
                        pubblication={this.state.article.pubblication}
                        category={this.state.article.category}
                        likes={this.state.article.likes}
                    />
                </div>
                <div className="articleNotFound" hidden={!this.state.articleNotFound}>
                    <br />
                    <div className="alert alert-danger" role="alert">Articolo non trovato!</div>
                </div>
            </div>
        );
    }
}

export default fullArticleContainer;