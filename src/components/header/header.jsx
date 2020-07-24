import React, {Component} from 'react'

import './header.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            user: sessionStorage.getItem('user')
        }
        this.goToProfile = this.goToProfile.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        if(sessionStorage.user) {
            this.setState({isAuthenticated: true});
        }
    }

    componentWillUnmount() {
        this.setState({isAuthenticated: false});
    }

    goToProfile() {
        window.location.replace('/users/' + this.state.user);
    }

    logout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.clear();
        window.location.replace('/articles');
    }

    render() {
        return(
            <div className="Header">
                <nav className="navbar navbar-expand-lg navbar-dark bg-warning fixed-top">
                    <a className="navbar-brand" href="/">Eco di Bugliano</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="/articles?page=1">Ultime notizie</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/category/Cronaca?page=1">Cronaca</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/category/Politica?page=1">Politica</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/category/Economia?page=1">Economia</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/category/Tecnologia?page=1">Tecnologia</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/category/Sport?page=1">Sport</a>
                        </li>
                        <li className="nav-item" hidden={this.state.isAuthenticated}>
                            <a className="nav-link" href="/login">Area riservata</a>
                        </li>
                        <li className="nav-item" hidden={!this.state.isAuthenticated}>
                            <a className="nav-link" href="#" onClick={this.goToProfile}>Profilo utente</a>
                        </li>
                        <li className="nav.item" hidden={!this.state.isAuthenticated}>
                            <a className="nav-link" onClick={this.logout}>Logout</a>
                        </li>
                        </ul>
                    </div>
                    </nav>
            </div>
        );
    }
}

export default Header;