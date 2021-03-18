import React from 'react';

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.handleUsers = this.handleUsers.bind(this);
  }

  handleUsers(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('username', this.username.value)
    data.append('password', this.password.value)
    data.append('roles', this.roles.value)

    fetch('http://localhost:5000/api/create', {
      method: 'POST',
      username: this.username,
      password: this.password,
      roles: this.roles
    }).then((response) => {
        response.json();
      });
}
  render() {
    return (
      <form onSubmit={this.handleUsers}>
        <div>
          <input ref={(ref) => { this.username = ref; }} type="text" placeholder="Username" name="username"/>
        </div>
        <br />
        <div>
          <input ref={(ref) => { this.password = ref; }} type="text" placeholder="Password" name="password"/>
        </div>
        <div>
          <input ref={(ref) => { this.roles = ref; }} type="text" placeholder="Roles" name="roles"/>
        </div>
        <div>
        <br />
          <button>Upload</button>
        </div>
      </form>
    );
  }
}

export default Admin;