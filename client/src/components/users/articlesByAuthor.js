import React, { Component } from 'react';
import ArticleByAuthor from './articleByAuthor';
import './articlesByAuthor.css';

class articlesByAuthor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            articles: [],
            allArticles: [],
            username: this.props.username,
            isAdmin: ''
        };
        this.showArticles = this.showArticles.bind(this);
        this.loading = this.loading.bind(this);
    }

    async componentDidMount() {
        await fetch('/server/users/'+sessionStorage.getItem('user')+'/articles')
        .then(response => response.json())
        .then((data) => this.setState({articles: data, loaded: true}))
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

    showArticles() {
            if(this.state.articles.length === 0 && this.state.loaded === true) {
                return(
                    <div className="NoArticles">
                        <div className="alert alert-danger" role="alert">
                            Non hai ancora pubblicato articoli!
                        </div>
                    </div>
                );
            }
            else{
                let listOfArticles = [];
                for (let article of this.state.articles){
                    listOfArticles.push(<ArticleByAuthor 
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

        render() {
            return(
                <div className="ArticlesByAuthor">
                    {this.loading()}
                    <h4 className="titleLabel">I tuoi articoli</h4>
                    {this.showArticles()}
                </div>
            );
        }
    }

    export default articlesByAuthor;
    