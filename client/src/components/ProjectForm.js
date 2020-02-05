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
    file: ""
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFile = event => {
    const file = event.target.files[0];
    this.setState({
      file: file
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    console.log('handleSubmit: ', this.state.file);

    const uploadData = new FormData();
    uploadData.append("imageURL", this.state.file);

    try {
      const cloudinaryResponse = await service.handleUpload(uploadData);
      const imageURL = cloudinaryResponse.secure_url;
      const publicID = cloudinaryResponse.public_id;
      this.setState({ imageURL: imageURL, publicID: publicID });
    } catch (err) {
      this.setState({
        error: err
      })
    }

    try {
      const response = await axios.post("/api/projects", {
        title: this.state.title,
        description: this.state.description,
        imageURL: this.state.imageURL,
        imagePublicID: this.state.publicID
      })
    } catch (err) {
      this.setState({
        error: err
      })
    }

    this.props.refreshData();
    this.setState({
      title: "",
      description: "",
      imageURL: "",
      publicID: ""
    });
  }




  // service.handleUpload(uploadData)
  //   .then(response => {
  //     const imageURL = response.secure_url;
  //     const publicID = response.public_id;
  //     this.setState({ imageURL: imageURL, publicID: publicID });
  //     console.log('new state: ', this.state);
  //   })
  //   .catch(err => {
  //     this.setState({
  //       imageSelected: false
  //     });
  //     console.log("Error while uploading the file: ", err);
  //     this.setState({
  //       error: err
  //     })
  //   });
  // console.log('before axios: ', this.state.imageURL);
  // axios
  //   .post("/api/projects", {
  //     title: this.state.title,
  //     description: this.state.description,
  //     imageURL: this.state.imageURL,
  //     imagePublicID: this.state.publicID
  //   })
  //   .then(response => {
  //     this.props.refreshData();
  //     this.setState({
  //       title: "",
  //       description: "",
  //       imageURL: "",
  //       publicID: ""
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // };

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
            onChange={this.handleFile}
          />
        </Form.Group>

        <Button type="submit">Create a project</Button>
      </Form>
    );
  }
}

export default ProjectForm;