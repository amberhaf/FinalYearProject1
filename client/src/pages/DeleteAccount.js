import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import firebase from 'firebase';
export class Delete extends Component {

    constructor() {
        super();
        this.state = {
            error: null,
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async handleSubmit(event){
        event.preventDefault();
        var user = firebase.auth().currentUser;

        user.delete().then(function() {
        // User deleted.
        window.alert("Account Deleted");
        }).catch(function(error) {
        window.alert("Error occurred. Account not deleted");
        });
    }

    render(){
        return(
        <div>
        <Header />
        <header class="masthead">
          <div class="container h-100">
            <form className="mt-5 py-5 px-5" autoComplete="off" onSubmit={this.handleSubmit}>
          <h1>
            Capsule Selector Online
          </h1>
          {/* Delete Account Section */}
          <p className="lead">Delete Your Account</p>
          <div className="form-group">
            <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="Password" name="password" type="password" onChange={this.handleChange} value={this.state.password}></input>
          </div>
          <div className="form-group">
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <button className="btn btn-primary rounded-pill px-5">Delete</button>
            <br></br>
            <Link to={'/Login'}>Return to Login</Link>
            </div>
            </form>
          </div>
        </header>
        </div>
        )
    }
}