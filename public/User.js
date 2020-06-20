import apiRequest from "./api.js";

/* Project */
export class Project {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.department = data.department;
    this.desc = data.desc;
    this.category = data.category;
  }
}

export default class User {
  /* Returns a User object, creating the user if necessary */
  static async loadOrCreate(user) {
    let res = await apiRequest("GET", "/users", null);
    if (!res[1].users.includes(user.id)) {
      // Create person
      let res_create = await apiRequest("POST", "/users", {
        id: user.id,
        name: user.givenName,
      });
      return new User(res_create[1]);
    } else {
      // Load the user
      let res = await apiRequest("GET", "/users/" + user.id, null);
      return new User(res[1]);
    }
  }

  constructor(data) {
    // Object assign
    this.id = data.id;
    this.name = data.name;
    this.school = data.school;
    this.following = data.following;
    this.applied = data.applied;
    this.qna = data.qna;
    this.user_path = "/users/" + this.id;
  }

  async save() {
    await apiRequest("PATCH", this.user_path, {
      name: this.name,
      school: this.school,
      qna: this.qna,
    });
  }

  async getQuestions() {
    let res = await apiRequest("GET", "/users/" + this.id + "/feed");
    return res[1].posts;
  }

  async getFollowing() {
    let res = await apiRequest("GET", "/users/" + this.id, null);
    return res[1].following;
  }

  async getApplied() {
    let res = await apiRequest("GET", "/users/" + this.id, null);
    return res[1].applied;
  }

  async addApply(id) {
    id = JSON.stringify(id);
    let res = await apiRequest(
      "POST",
      "/users/" + this.id + "/apply?target=" + id
    );
    return res[0];
  }

  async addFollow(id) {
    id = JSON.stringify(id);
    let res = await apiRequest(
      "POST",
      "/users/" + this.id + "/follow?target=" + id
    );
    return res[0];
  }

  async deleteFollow(id) {
    id = JSON.stringify(id);
    await apiRequest("DELETE", "/users/" + this.id + "/follow?target=" + id);
  }

  async getQna() {
    let res = await apiRequest("GET", "/users/" + this.id, null);
    return res[1].qna;
  }
}
