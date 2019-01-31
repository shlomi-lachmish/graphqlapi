import React, { Component } from "react";
import AutheContext from "./../context/auth-context";
import("./Auth.css");

class AuthPage extends Component {
  static contextType = AutheContext;
  constructor(props) {
    super(props);
    this.state = {
      loginMode: true,
      token: null,
      userId: null,
      tokenExpieration: null
    };
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.handleLoginToggle = this.handleLoginToggle.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  handleLoginToggle = event => {
    let submitBtn = event.currentTarget.previousElementSibling;
    if (this.state.loginMode) {
      event.currentTarget.textContent = "Switch to Login";
      submitBtn.textContent = "Signup";
      this.setState({ ...this.state, loginMode: false });
    } else {
      event.currentTarget.textContent = "Switch to Signup";
      submitBtn.textContent = "Login";
      this.setState({ ...this.state, loginMode: true });
    }
    debugger;
  };
  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let query = {};
    if (!this.state.loginMode) {
      query = {
        query: `
          mutation{
            createUser(userInput: {email: "${email}", password: "${password}"}){
              _id
              email
            }
          }
        `
      };
    } else {
      query = {
        query: `query{login(email: "${email}" password: "${password}"){userId token tokenExpieration}}`
      };
    }
    console.log(`query is: ${JSON.stringify(query)}`);
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Can't fatch data from the backend");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.tokenExpieration,
            resData.data.login.userId
          );
        }
        console.log(resData);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="forms-actions">
          <button type="submit" id="submitBtn">
            Login
          </button>
          <button type="button" onClick={this.handleLoginToggle}>
            Switch to Signup
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
