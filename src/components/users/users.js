import React, { Component } from 'react';
import './users.css';
import User from './user';

class users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    async componentDidMount() {
        await fetch('/server/users')
        .then(response => response.json())
        .then((data) => this.setState({users: data}))
        .catch(console.log);
    }

    showUsers() {
        if(this.props.isSuperUser === true) {
            if(this.state.users.length === 0) {
                return(
                    <div className="NoUsers">
                        <div className="alert alert-danger" role="alert">
                            Non ci sono utenti!
                        </div>
                    </div>
                );
            }
            else{
                let listOfUsers = [];
                for (let user of this.state.users){
                    listOfUsers.push(<User 
                                            key={user._id} 
                                            username={user.username} 
                                            isAdmin={user.isAdmin} 
                                            isSuperUser={user.isSuperUser} 
                                        />);
                }
                return listOfUsers;
            }
        }

        }

    render() {
        return(
            <div className="users">
                <div className="authorized" hidden={!this.props.isSuperUser}>
                    <h4 className="titleLabel">Lista utenti</h4>
                    {this.showUsers()}
                </div>
            <div className="unhautorized" hidden={this.props.isSuperUser}>
            <div className="alert alert-danger alertLabel" role="alert">Utente non autorizzato!</div>
            </div>
            </div>
        );
    }
}

export default users;