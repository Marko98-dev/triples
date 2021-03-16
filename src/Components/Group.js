import React from 'react';

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.handleGroups = this.handleGroups.bind(this);
  }

  handleGroups(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('GroupName', this.GroupName.value);

    fetch('http://localhost:5000/api/groups', {
      method: 'POST',
      body: data,
      GroupName: this.GroupName
    }).then((response) => {
        console.log(response);
    });
  }

  render() {
    return (
      <form onSubmit={this.handleGroups}>
        <div>
          <input ref={(ref) => { this.GroupName = ref; }} type="text" placeholder="Enter the desired name of Group" name="GroupName"/>
        </div>
        <br />
          <button>Upload</button>
      </form>
    );
  }
}

export default Group;