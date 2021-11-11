import React, {Component} from 'react';
import { resetPassword } from '../helpers/auth';
import { Link } from 'react-router-dom';
import Header from "../components/Header";

export class Forgot extends Component {

    constructor() {
        super();
        this.state = {
            error: null,
            email: '',
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
        this.setState({ error: '' });
        try {
            await resetPassword(this.state.email);
            window.alert("Password reset email sent");
        } catch(error) {
            this.setState({ error: error.message });
        }
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
            {/* Reset password here*/}
          <p className="lead">Reset Your Password</p>
          <div className="form-group">
            <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
          </div>
          <div className="form-group">
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <button className="btn btn-primary rounded-pill px-5">Submit</button>
            <br></br>
            <Link to={'/Login'}>Return to Sign in</Link>
            </div>
            </form>
            </div>
        </header>
            </div>
        )
    }
}