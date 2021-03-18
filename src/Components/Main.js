import React from 'react';
import DropGroups from './DropGroups';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group_id: []
    }

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) { 
    ev.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);

    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: data,
      filename: this.fileName
    }).then((response) => {
        console.log(response)
      });
}
  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <div>
          <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" name="filename"/>
        </div>
        <br />
        <div>
          <DropGroups />
        <br />
          <button>Upload</button>
        </div>
      </form>
    );
  }
}

export default Main;
