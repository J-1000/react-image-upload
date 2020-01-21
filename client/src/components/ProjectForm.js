import React, { Component } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

class ProjectForm extends Component {
  state = {
    title: "",
    description: "",
    imageURL: ""
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // this method handles just the file upload
  handleFileUpload = e => {
    console.log("The file to be uploaded is: ", e.target.files[0]);

    const uploadData = new FormData();
    // imageUrl => this name has to be the same as in the model since we pass
    // req.body to .create() method when creating a new thing in '/api/things/create' POST route
    uploadData.append("imageUrl", e.target.files[0]);

    service.handleUpload(uploadData)
      .then(response => {
        // console.log('response is: ', response);
        // after the console.log we can see that response carries 'secure_url' which we can use to update the state 
        this.setState({ imageUrl: response.secure_url });
      })
      .catch(err => {
        console.log("Error while uploading the file: ", err);
      });
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log("SUBMIT");

    // axios.post('http://localhost:5555/api/projects')
    axios
      .post("/api/projects", {
        title: this.state.title,
        description: this.state.description,
        imageURL: this.state.imageURL
      })
      .then(response => {
        this.props.refreshData();
        this.setState({
          title: "",
          description: "",
          imageURL: ""
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Label htmlFor="title">Title: </Form.Label>
          <Form.Control
            type="text"
            name="title"
            id="title"
            onChange={this.handleChange}
            value={this.state.title}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="description">Description: </Form.Label>
          <Form.Control
            type="text"
            name="description"
            id="description"
            onChange={this.handleChange}
            value={this.state.description}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="description">Image: </Form.Label>
          <Form.Control
            type="file"
            name="image"
            id="image"
            onChange={this.handleFileUpload}
          />
        </Form.Group>

        <Button type="submit">Create a project</Button>
      </Form>
    );
  }
}

export default ProjectForm;
