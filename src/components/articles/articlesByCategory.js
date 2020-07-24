import React, { Component } from 'react';
import Article from './article/article';

import './articles.css';


class ArticlesByCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            articles: []
        };
    }

    async componentDidMount() {
        await fetch('/server/articles/category/' + this.props.match.params.category + this.props.location.search)
        .then(response => response.json())
        .then((data) => this.setState({articles: data}))
        .catch(console.log);
        this.setState({loaded: true});
    }

    loading() {
        return(
            <div className="spinner-border text-info" hidden={this.state.loaded} role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    showContent() {
        if(this.state.articles.length === 0 && this.state.loaded === true) {
            return(
                <div className="NoArticles">
                    <div className="alert alert-danger" role="alert">
                        Non ci sono articoli!
                    </div>
                </div>
            );
        }
        else{
            let listOfArticles = [];
            for (let article of this.state.articles){
                listOfArticles.push(<Article 
                                        key={article._id} 
                                        id={article.id} 
                                        title={article.title} 
                                        subtitle={article.subtitle} 
                                        imageURL={article.imageURL} 
                                        content={article.content} 
                                    />);
            }
            return listOfArticles;
        }
    }
        
    render() {
        
            return(
            <div className="ArticlesByCategory">
                {this.loading()}
                {this.showContent()}
            </div>
        );
    }
}

export default ArticlesByCategory;