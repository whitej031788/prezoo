import React, { Component } from "react";
import { connect } from 'react-redux';
import { receiveUserList } from '../../actions/userListActions';
import { receiveMessage } from '../../actions/chatActions';
import styles from './styles/ChatStyles';
import UserList from './UserList';
import Redux from 'redux';
import Messages from './Messages';
import { IChat } from '../../interfaces/IChat';
import { IUserList } from '../../interfaces/IUserList';
import { IUser } from '../../interfaces/IUser';
import { Button, Form } from 'react-bootstrap';
import { RootState } from "../../reducers";

interface IChatProps {
  dispatch: Redux.Dispatch,
  user: IUser,
  userList: IUserList,
  chat: IChat,
  projectGuid: string,
  socket: SocketIOClient.Socket
};

interface IChatState {
  message?: string
};

class Chat extends Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);
    this.state = {
      message: undefined
    };
  }

  componentDidMount() {
    this.socket();
  }

  socket() {
    const username = this.props.user.userName;

    // receive userlist
    this.props.socket.on('chatUsers', (msg: string) => {
      this.props.dispatch(receiveUserList(msg));
    });

    // send join message
    this.props.socket.emit('chatJoin', { timestamp: new Date(), sender: username, message: 'joined' });

    // receive join message
    this.props.socket.on('chatJoin', (msg: string) => {
      this.props.dispatch(receiveMessage(msg));
    });

    // receive leave message
    this.props.socket.on('chatLeave', (msg: string) => {
      this.props.dispatch(receiveMessage(msg));
    });

    // receive message
    this.props.socket.on('chatMessage', (msg: string) => {
      this.props.dispatch(receiveMessage(msg));
      // Scroll to the bottom after an add
      var elem = document.getElementById('chat-box');
      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
    });

    // send leave message when user leaves the page
    window.addEventListener('beforeunload', (ev: Event) => {
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
        <UserList userList={this.props.userList} />
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

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  userList: state.userList,
  chat: state.chat
});

export default connect(mapStateToProps)(Chat);