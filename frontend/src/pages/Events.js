import React, { Component } from "react";
import "./Events.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

class EventsPage extends Component {
  state = { creating: false };
  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };
  onCancelHandler = () => {
    this.setState({ creating: false });
  };
  onConfirmHandler = () => {
    this.setState({ creating: false });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onCancel={this.onCancelHandler}
              onConfirm={this.onConfirmHandler}
            >
              <p>Modal Content</p>
            </Modal>
          </React.Fragment>
        )}
        <div className="events-control">
          <p>Create your events:</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
