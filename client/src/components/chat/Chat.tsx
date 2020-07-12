import React, { Component } from "react";
import { connect } from 'react-redux';
import { receiveUserList } from '../../actions/userListActions';
import { receiveMessage } from '../../actions/chatActions';
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
  projectGuid: string,
  socket: SocketIOClient.Socket
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

  

  componentDidMount() {
    this.socket();
  }

  socket() {
    const username = this.props.user.userName;

    // receive userlist
    this.props.socket.on('chatUsers', (msg: any) => {
      this.props.dispatch(receiveUserList(msg));
    });

    // send join message
    this.props.socket.emit('chatJoin', { timestamp: new Date(), sender: username, message: 'joined' });

    // receive join message
    this.props.socket.on('chatJoin', (msg: any) => {
      this.props.dispatch(receiveMessage(msg));
    });

    // receive leave message
    this.props.socket.on('chatLeave', (msg: any) => {
      this.props.dispatch(receiveMessage(msg));
    });

    // receive message
    this.props.socket.on('chatMessage', (msg: any) => {
      this.props.dispatch(receiveMessage(msg));
      // Scroll to the bottom after an add
      var elem = document.getElementById('chat-box');
      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
    });

    // send leave message when user leaves the page
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();

      this.props.socket.emit('chatLeave', { timestamp: new Date(), sender: username, message: 'left' });
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
    this.props.socket.emit('chatMessage', { timestamp: new Date(), sender: username, message: this.state.message });

    this.setState({
      message: ''
    });
  }

  render() {
    return (
      <div>
        <UserList userList={this.props.userList.userList} />
        <div className="scrollable-chat-box" id="chat-box" style={styles.chatBox}>
          <Messages messages={this.props.chat.messages} />
        </div>
        <div>
        <Form onSubmit={(event: React.FormEvent) => this.handleClick(event)}>
          <Form.Control style={styles.input}
            type='text'
            name='message'
            value={this.state.message}
            onChange={this.handleChange.bind(this)}
            autoFocus />

          <Button type='submit' className="mt-2 mb-2">
            Send
          </Button>
        </Form>
      </div>
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