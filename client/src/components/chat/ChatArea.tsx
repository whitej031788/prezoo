import React, { Component } from "react";
import { connect } from 'react-redux';
import AddUser from './AddUser';
import Chat from './Chat';
import { RootState } from "../../reducers";
import { IUser } from '../../interfaces/IUser';

interface IChatAreaProps {
  user: IUser,
  projectGuid: string,
  socket?: SocketIOClient.Socket
};

interface IChatAreaState {};

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

const mapStateToProps = (state: RootState) => ({
    user: state.user
});

export default connect(mapStateToProps)(ChatArea);