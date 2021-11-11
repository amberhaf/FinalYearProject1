import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signin } from '../helpers/auth';
import Header from "../components/Header";
export default class Login extends Component {

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
      await signin(this.state.email, this.state.password);
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
            Capsule Selector Online
          </h1>
          {/* Login to your account */}
          <p className="lead">Sign in</p>
          <div className="form-group">
            <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
          </div>
          <div className="form-group">
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <button className="btn btn-primary rounded-pill px-5">Login</button>
            <p className = "forgot-password text-right">
              {/* Link to forgot password */}
              <Link to={'/Forgot'}>Forgot Password</Link>
            </p>
          </div>
          <hr></hr>
          <p>Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
        </div>
        </header>
      </div>
    )
  }
}
