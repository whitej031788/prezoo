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
        <span style={styles.online}>
          &#x25cf;
        </span>

        {user.userName}
      </li>
    );

      return (
        <div style={styles.container} className="mt-2">
          <ul style={styles.ul}>
            {users}
          </ul>
        </div>
      );
  }
}

export default UserList;