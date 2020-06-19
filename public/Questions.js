import apiRequest from "./api.js";

/* Project */
export default class Question {
  /* Returns a User object, creating the user if necessary */
  static async loadOrCreate(id) {
    /* Load Project form Database */
    let res = await apiRequest("GET", "/projects/" + id);
    let project = new Project(res[1]);
    return project;
  }

  static async getQuestions() {
    let res = await apiRequest("GET", "/questions");
    return res[1];
  }

  constructor(data) {
    this.id = data.id;
    this.question = data.question;
    this.textarea = data.textarea;
    this.list = data.list;
  }
}
