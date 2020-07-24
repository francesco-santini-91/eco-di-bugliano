import React, { Component } from 'react';
import Article from './article';
import './articlesByAuthor.css';

class allArticles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            articles: [],
            allArticles: [],
            isAdmin: ''
        };
        this.showArticles = this.showArticles.bind(this);
    }

    async componentDidMount() {
        await fetch('/server/articles')
        .then(response => response.json())
        .then((data) => this.setState({articles: data}))
        .catch(console.log);
        this.setState({loaded: true});
    }

    showArticles() {
            if(this.state.articles.length === 0) {
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
                                            title={article.title} 
                                            subtitle={article.subtitle} 
                                            imageURL={article.imageURL} 
                                            author={article.author}  
                                        />);
                }
                return listOfArticles;
            }
        }

        loading() {
            return(
                <div className="spinner-border text-info" hidden={this.state.loaded} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            );
        }

        render() {
            return(
                <div className="ArticlesByAuthor">
                    <div className="authorized" hidden={!this.props.isSuperUser}>
                        <h4 className="titleLabel">Tutti gli articoli</h4>
                        {this.loading()}
                        {this.showArticles()}
                    </div>
                    <div className="unhautorized" hidden={this.props.isSuperUser}>
                    <div className="alert alert-danger alertLabel" role="alert">Utente non autorizzato!</div>
                    </div>
                </div>
            );
        }
    }

    export default allArticles;
    