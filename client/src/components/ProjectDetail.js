import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import service from "../services/upload.js";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

class ProjectDetail extends Component {
  state = {
    project: null,
    error: "",
    editForm: false,
    taskForm: false,
    title: "",
    description: "",
    submitted: false,
    imageSelected: false,
    imageURL: "",
    publicID: ""
  };

  getData = () => {
    // get the data from the API
    // update the state accordingly

    const id = this.props.match.params.id;
    // console.log("/api/projects/" + id);

    axios
      .get(`/api/projects/${id}`)
      .then(response => {
        this.setState({
          project: response.data,
          title: response.data.title,
          description: response.data.description,
          imageURL: response.data.imageURL
        });
      })
      .catch(err => {
        if (err.response.status === 404) {
          this.setState({
            error: err.response.data.message
          });
        }
      });
  };

  componentDidMount() {
    this.getData();
  }

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

  deleteProject = () => {
    const id = this.state.project._id;
    axios
      .delete(`/api/projects/${id}`)
      .then(response => {
        // redirect to '/projects'
        console.log(this.props.history);
        this.props.history.push("/projects"); // `/projects` is our client side route
        // this.props.history comes from react-router-dom <Route>
      })
      .catch(err => {
        console.log(err);
      });
  };

  toggleEdit = () => {
    this.setState({
      editForm: !this.state.editForm
    });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    // const id = this.state.project._id

    const id = this.props.match.params.id;
    axios
      .put(`/api/projects/${id}`, {
        title: this.state.title,
        description: this.state.description,
        imageURL: this.state.imageURL,
        imagePublicID: this.state.publicID
      })
      .then(response => {
        this.setState({
          project: response.data,
          // title: response.data.title,
          // description: response.data.description,
          editForm: false
        });
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    console.log(this.state, this.props);
    if (this.state.error) {
      return <p>{this.state.error}</p>;
    } else if (this.state.project === null) {
      return <div></div>;
    }

    let canUpdate = false;

    if (this.state.project.owner === this.props.user._id) {
      canUpdate = true;
    }
    console.log(canUpdate);
    return (
      <div>
        <h1>{this.state.project.title}</h1>
        <p>{this.state.project.description}</p>
        <img style={{ width: "200px", height: "200px" }} src={this.state.imageURL} alt={this.state.title} />

        {canUpdate && (
          <>
            <Button onClick={this.toggleEdit}>Show Edit Form</Button>
            <Button
              onClick={() => this.setState({ taskForm: !this.state.taskForm })}
            >
              Show Task form
            </Button>
            <Button variant="danger" onClick={this.deleteProject}>
              Delete Project
            </Button>
          </>
        )}

        {this.state.editForm && (
          <Form onSubmit={this.handleSubmit}>
            <h2>Edit form</h2>
            <Form.Group>
              <Form.Label htmlFor="title">Title: </Form.Label>
              <Form.Control
                type="text"
                name="title"
                id="title"
                value={this.state.title}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="description">Description: </Form.Label>
              <Form.Control
                type="text"
                name="description"
                id="description"
                value={this.state.description}
                onChange={this.handleChange}
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
            <Button type="submit">Edit</Button>
          </Form>
        )}

        {this.state.taskForm && (
          <TaskForm
            projectId={this.state.project._id}
            getData={this.getData}
            hideForm={() => this.setState({ taskForm: false })}
          />
        )}

        <TaskList tasks={this.state.project.tasks} />
      </div>
    );
  }
}

export default ProjectDetail;
