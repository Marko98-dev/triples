import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);
    data.append('imageGroup', this.imageGroup.value);

    fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: data,
      filename: this.fileName,
      imageGroup: this.imageGroup
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ imageURL: `http://localhost:5000/api/${body.file}` });
      });
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
        <div>
          <input ref={(ref) => { this.imageGroup = ref; }} type="text" placeholder="Enter the name of Group" name="imageGroup"/>
        </div>
        <br />
          <button>Upload</button>
        </div>
        <img src={this.state.imageURL} alt="img" />
      </form>
    );
  }
}

export default Main;