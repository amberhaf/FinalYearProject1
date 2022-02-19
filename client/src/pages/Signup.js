import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../helpers/auth';
import Header from "../components/Header";

export default class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
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
                Sign Up to
                <Link className="title" to="/"> Path Mapper</Link>
              </h1>
              {/* Create an account */}
              <p className="lead">Fill in the form below to create an account.</p>
              <div className="form-group">
                <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
              </div>
              <div className="form-group">
                <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
              </div>
              <div className="form-group">
                {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
                <button className="btn btn-primary rounded-pill px-5">Sign up</button>
              </div>
              <hr></hr>
              {/* Switch to Login page */}
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
          </div>
        </header>
      </div>
    )
  }
}
