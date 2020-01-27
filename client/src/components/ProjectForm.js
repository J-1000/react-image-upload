import React, { Component } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import service from "../services/upload.js";

class ProjectForm extends Component {

  state = {
    title: "",
    description: "",
    imageURL: "",
    publicID: "",
    submitted: false,
    imageSelected: false,
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFileUpload = e => {
    console.log("The file to be uploaded is: ", e.target.files[0]);
    this.setState({
      imageSelected: true
    });
    const uploadData = new FormData();
    uploadData.append("imageURL", e.target.files[0]);

    service.handleUpload(uploadData)
      .then(response => {
        const imageURL = response.secure_url;
        const publicID = response.public_id;
        console.log('res from handleupload: ', response.secure_url);
        this.setState({ imageURL: imageURL, publicID: publicID });
        console.log('new state: ', this.state.imageURL);
        // check if the form already got submitted and only waits for the image upload
        if (this.state.submitted === true) {
          this.handleSubmit();
        }
      })
      .catch(err => {
        this.setState({
          imageSelected: false
        });
        console.log("Error while uploading the file: ", err);
      });
  }

  handleSubmit = event => {
    if (event) {
      event.preventDefault();
    }
    console.log("SUBMIT");
    // check if the image is already uploaded to the cloud or no image was selected
    if (this.state.imageURL || !this.state.imageSelected) {
      // axios.post('http://localhost:5555/api/projects')
      axios
        .post("/api/projects", {
          title: this.state.title,
          description: this.state.description,
          imageURL: this.state.imageURL,
          imagePublicID: this.state.publicID
        })
        .then(response => {
          this.props.refreshData();
          this.setState({
            title: "",
            description: "",
            imageURL: "",
            publicID: ""
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      // set a flag that the project got submitted
      this.setState({
        submitted: true
      })
    }
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
          <Form.Label htmlFor="imageURL">Image: </Form.Label>
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