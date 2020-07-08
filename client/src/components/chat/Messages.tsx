import React, { Component } from "react";
import moment from 'moment';
import styles from './styles/MessagesStyles';
import { IMessage } from '../../interfaces/IMessage';

interface IMessagesProps {
  messages: Array<IMessage>
};

interface IMessagesState {};

class Messages extends Component<IMessagesProps,IMessagesState > {
  componentDidUpdate() {
    // scroll to bottom
    // window.scrollTo(0, this.refs.chat.scrollHeight);
  }

  render() {
    const { messages } = this.props;

    const chatMessages = messages.map((chat, key) =>
      <li style={styles.li} key={key}>
        <p style={styles.timestampText}>
          {moment(chat.timestamp).format('D.M.YYYY HH:mm:ss')}
        </p>

        <p style={styles.messageText}>
          <b>{chat.sender}</b>: {chat.message}
        </p>
      </li>
    );

    return (
      <ul style={styles.ul} ref='chat'>
        {chatMessages}
      </ul>
    );
  }
}

export default Messages;