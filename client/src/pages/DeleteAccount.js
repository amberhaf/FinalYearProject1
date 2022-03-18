import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import { signin } from '../helpers/auth';
import { datab, auth } from "../services/firebase";

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
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  //delete all paths linked to that user
  async handleDeleteAllPaths(userId) {
    var query = datab.collection('path').where('user', '==', userId);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    })
  }
  //delete account entirely
  async handleDeleteAccount(user) {
    user.delete().then(function () {
      window.alert("Account Deleted");
    }).catch(function (error) {
      window.alert("Error occurred. Account not deleted" + error);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    var user = auth().currentUser;
    var userId = user.uid;
    try {
      await signin(this.state.email, this.state.password);
      //delete user Account
      await this.handleDeleteAccount(user);
      //then delete all paths matching this user
      await this.handleDeleteAllPaths(userId)
    } catch (error) {
      window.alert("Error occurred" + error.message);
    }
  }



  render() {
    return (
      <div>
        <Header />
        <header className="masthead">
          <div className="container h-100">
            <form className="mt-5 py-5 px-5" autoComplete="off" onSubmit={this.handleSubmit}>
              <h1>
                Path Mapper Online
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