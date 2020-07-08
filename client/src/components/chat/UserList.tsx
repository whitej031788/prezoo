import React, { Component } from "react";
import styles from './styles/UserListStyles';

interface IMessagesProps {
  userList: Array<{userName: string}>
};

interface IMessagesState {};

class UserList extends Component<IMessagesProps, IMessagesState> {
  render() {
    const { userList } = this.props;

    const users = userList.map((user: any, key: any) =>
      <li style={styles.li} key={key}>
        <p style={styles.online}>
            .
        </p>

        {user.userName}
      </li>
    );

      return (
        <div style={styles.container}>
          <p style={styles.title}>
            Users in chat
          </p>

          <ul style={styles.ul}>
            {users}
          </ul>
        </div>
      );
  }
}

export default UserList;