import React, { Component } from "react";
import { connect } from 'react-redux';
import AddUser from './AddUser';
import Chat from './Chat';

interface IChatAreaProps {
  user?: any
};

interface IChatAreaState {
  user?: any
};

class ChatArea extends Component<IChatAreaProps, IChatAreaState> {
  render() {
    const username = this.props.user.userName;

    const addUser = !username ? <AddUser /> : null;
    const chat = username ? <Chat /> : null;

    return (
      <div>
          {addUser}
          {chat}
      </div>
    );
  }
}

const mapStateToProps = (state: IChatAreaState) => ({
    user: state.user
});

export default connect(mapStateToProps)(ChatArea);