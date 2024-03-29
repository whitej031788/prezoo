import React, { Component } from "react";
import { connect } from 'react-redux';
import Redux from 'redux';
import { receiveUser } from '../../actions/userActions';
import styles from './styles/AddUserStyles';

interface IAddUserProps {
  dispatch: Redux.Dispatch
};

interface IAddUserState {
  userName: string
};

class AddUser extends Component<IAddUserProps, IAddUserState> {
    constructor(props: IAddUserProps) {
      super(props);
      this.state = {
        userName: ''
      };
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
      this.props.dispatch(receiveUser(this.state.userName));
    }

    render() {
      return (
        <form style={styles.form} onSubmit={(event) => this.handleClick(event)}>
          <p style={styles.title}>Username</p>

          <input style={styles.input}
            name='userName'
            type='text'
            placeholder='Who are you?'
            value={this.state.userName}
            onChange={this.handleChange.bind(this)}
            autoFocus />

          <button style={styles.button}
            type='submit'
            className='btn btn-primary'>
            Join presentation
          </button>
        </form>
      );
    }
}

export default connect()(AddUser);