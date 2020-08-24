import React, { Component } from "react";
import moment from 'moment';
import styles from './styles/MessagesStyles';
import { IMessage } from '../../interfaces/IMessage';

interface IMessagesProps {
  messages: Array<IMessage>
};

interface IMessagesState {};

class Messages extends Component<IMessagesProps,IMessagesState > {
  render() {
    const { messages } = this.props;

    const chatMessages = messages.map((chat, key) =>
      <li style={styles.li} key={key}>
        <div style={styles.div} className="prez-box">
          <div style={styles.subHead} className="sub-head">{chat.sender} - {moment(chat.timestamp).format('D.M.YYYY HH:mm:ss')}</div> <div style={{display: 'inline', position: 'relative', top: '-10px'}}>{chat.message}</div>
        </div>
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