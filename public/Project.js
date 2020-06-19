import apiRequest from "./api.js";

/* Project */
export default class Project {
  /* Returns a User object, creating the user if necessary */
  static async loadOrCreate(id) {
    /* Load Project from Database */
    let res = await apiRequest("GET", "/projects/" + id);
    let project = new Project(res[1]);
    return project;
  }

  static async getProjects() {
    let res = await apiRequest("GET", "/projects");
    return res[1];
  }

  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.department = data.department;
    this.desc = data.desc;
    this.category = data.category;
  }
}
