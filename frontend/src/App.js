import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Bookins";
import EventsPage from "./pages/Events";
import "./App.css";
import MainNavigation from "./components/Navigation/MainNavigation";

import AuthContext from "./context/auth-context";

class App extends Component {
  state = {
    token: null,
    userId: null,
    tokenExpieration: null
  };
  login = (token, userId, tokenExpieration) => {
    this.setState({
      token: token,
      userId: userId,
      tokenExpieration: tokenExpieration
    });
  };
  logout = () => {
    this.setState({ token: null, userId: null, tokenExpieration: null });
  };
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && (
                  <Redirect from="/auth" to="/events" exact />
                )}
                <Route path="/auth" component={AuthPage} />
                <Route path="/events" component={EventsPage} />
                {this.state.token && (
                  <Route path="/bookings" component={BookingPage} />
                )}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
