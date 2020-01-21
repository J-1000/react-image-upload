import React, { Component } from "react";
import axios from "axios";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";

class Projects extends Component {
  state = {
    projects: []
  };

  // componentWillUnmount() {
  //   console.log("PROJECTS UNMOUNT");
  // }

  getData = () => {
    // axios
    //   .get("http://localhost:5555/api/projects")
    axios
      .get("/api/projects")
      .then(response => {
        this.setState({
          projects: response.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div className="projects-container">
        <ProjectList projects={this.state.projects} />
        <ProjectForm refreshData={this.getData} />
      </div>
    );
  }
}

export default Projects;
