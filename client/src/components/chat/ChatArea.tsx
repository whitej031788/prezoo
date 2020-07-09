import React, { Component } from "react";
import { connect } from 'react-redux';
import AddUser from './AddUser';
import Chat from './Chat';

interface IChatAreaProps {
  user?: any,
  projectGuid: string,
  socket: SocketIOClient.Socket
};

interface IChatAreaState {
  user?: any
};

class ChatArea extends Component<IChatAreaProps, IChatAreaState> {
  render() {
    const username = this.props.user.userName;

    const addUser = !username ? <AddUser /> : null;
    const chat = username ? <Chat socket={this.props.socket} projectGuid={this.props.projectGuid} /> : null;

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