import React, { Component } from "react";
import { connect } from 'react-redux';
import { receiveUserList } from '../../actions/userListActions';
import { receiveMessage } from '../../actions/chatActions';
import io from 'socket.io-client';
import styles from './styles/ChatStyles';
import UserList from './UserList';
import Messages from './Messages';
import { IChat } from '../../interfaces/IChat';
import { IUserList } from '../../interfaces/IUserList';
import { Button, Form } from 'react-bootstrap';

interface IChatProps {
  dispatch: any,
  user: any,
  userList: IUserList,
  chat: IChat,
  projectGuid: string
};

interface IChatState {
  userList: IUserList,
  chat: IChat,
  message?: string,
  user: any
};

class Chat extends Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);
    this.state = {
      message: undefined,
      userList: {userList: []},
      chat: {messages: []},
      user: this.props.user
    };
  }

  socketIO = io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.projectGuid) as string);

  componentDidMount() {
    this.socket();
  }

  socket() {
    const username = this.props.user.userName;

    // receive userlist
    this.socketIO.on('chatUsers', (msg: any) => {
      this.props.dispatch(receiveUserList(msg));
    });

    // send join message
    this.socketIO.emit('chatJoin', { timestamp: new Date(), sender: username, message: 'joined' });

    // receive join message
    this.socketIO.on('chatJoin', (msg: any) => {
      console.log(msg);
      this.props.dispatch(receiveMessage(msg));
    });

    // receive leave message
    this.socketIO.on('chatLeave', (msg: any) => {
      console.log(msg);
      this.props.dispatch(receiveMessage(msg));
    });

    // receive message
    this.socketIO.on('chatMessage', (msg: any) => {
      console.log(msg);
      this.props.dispatch(receiveMessage(msg));
    });

    // send leave message when user leaves the page
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();

      this.socketIO.emit('chatLeave', { timestamp: new Date(), sender: username, message: 'left' });
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  handleClick(event: React.FormEvent) {
    event.preventDefault();

    const username = this.props.user.userName;

    // send message
    this.socketIO.emit('chatMessage', { timestamp: new Date(), sender: username, message: this.state.message });

    this.setState({
      message: ''
    });
  }

  render() {
    const { userList, chat } = this.props;

    return (
      <div>
        <Messages messages={chat.messages} />

        <Form onSubmit={(event: React.FormEvent) => this.handleClick(event)}>
          <Form.Control style={styles.input}
            type='text'
            name='message'
            value={this.state.message}
            onChange={this.handleChange.bind(this)}
            autoFocus />

          <Button type='submit' className="mt-2">
            Send
          </Button>
        </Form>

        <UserList userList={userList.userList} />
      </div>
    );
  }
}

const mapStateToProps = (state: IChatState) => ({
  user: state.user,
  userList: state.userList,
  chat: state.chat
});

export default connect(mapStateToProps)(Chat);