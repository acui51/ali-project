import User from "./User.js";
import Project from "./Project.js";
import Question from "./Questions.js";
import EditableText from "./EditableText.js";

class App {
  constructor() {
    this._user = null;
    this._userUser = null; // clas User from User.js

    this._updatePage = this._updatePage.bind(this);
    this._loadProfile = this._loadProfile.bind(this);
    this._deleteFollow = this._deleteFollow.bind(this);
    this._updateQna = this._updateQna.bind(this);
    this._applyProject = this._applyProject.bind(this);

    this._displayName = new EditableText("name");
    this._displaySchool = new EditableText("school");
  }

  async setup() {
    this._user = JSON.parse(localStorage.getItem("user"));
    // Editable Text for School and name
    let parentName = document.querySelector("#nameContainer");
    this._displayName.addToDOM(parentName, this._updatePage);
    let parentSchool = document.querySelector("#schoolContainer");
    this._displaySchool.addToDOM(parentSchool, this._updatePage);

    // Editable Text for questions
    let questions = await Question.getQuestions();
    let questionsSec = document.querySelector(".questions");
    for (let question of questions) {
      let node = questionsSec.querySelector("#template").cloneNode(true);
      node.id = "";
      node.querySelector("h3").textContent = question.question;
      let questionDiv = node.querySelector(".question");
      let questionNode = new EditableText(question.id);
      questionNode.addToDOM(questionDiv, this._updateQna);
      questionsSec.appendChild(node);
    }

    this._userUser = new User(this._user);
    this._loadProfile();
  }

  async _loadProfile() {
    // Set qna
    let qna = await this._userUser.getQna();
    for (let question in qna) {
      let questionInput = document.querySelector("#" + question);
      questionInput.querySelector("span").textContent = qna[question];
    }

    // Set Name and School
    this._displayName.setValue(this._user.name);
    this._displaySchool.setValue(this._user.school);

    let following = await this._userUser.getFollowing();
    // Reset following projects
    document.querySelector("#follow").textContent = "";

    // Load following projects
    for (let i = 0; i < following.length; i++) {
      let followingDiv = document.querySelector(".following");
      let node = followingDiv.querySelector("#template").cloneNode(true);
      node.id = "";

      let icon = document.createElement("i");
      if (following[i].category === "biology") {
        icon.classList.add("fas", "fa-dna");
      } else if (following[i].category === "chemistry") {
        icon.classList.add("fas", "fa-atom");
      } else if (following[i].category === "computer-science") {
        icon.classList.add("fab", "fa-python");
      } else if (following[i].category === "physics") {
        icon.classList.add("fas", "fa-wave-square");
      }

      let closeIcon = document.createElement("i");
      closeIcon.classList.add("fas", "fa-times", "close-icon");
      closeIcon.id = following[i].id;
      closeIcon.addEventListener("click", this._deleteFollow);

      let titleText = document.createTextNode(following[i].title);
      node.querySelector(".fa-li").appendChild(icon);
      node.querySelector(".title").appendChild(titleText);
      node.querySelector(".title").appendChild(closeIcon);
      node.querySelector(".dept").textContent = following[i].department;

      // Alter the Apply button if already applied
      let applyArray = await this._userUser.getApplied();
      let applyButton = node.querySelector("#continue-apply");
      applyButton.classList.add(following[i].id);
      if (applyArray.some((apply) => apply.id === following[i].id)) {
        applyButton.textContent = "Applied";
        applyButton.disabled = true;
        applyButton.style.backgroundColor = "#2b3da1";
      }
      // Add event listener to Apply button
      applyButton = node.querySelector("#continue-apply");
      applyButton.classList.add(following[i].id);
      applyButton.addEventListener("click", this._applyProject);

      document.querySelector("#follow").appendChild(node);
    }
  }

  async _updatePage() {
    this._user.name = this._displayName.value;
    this._user.school = this._displaySchool.value;
    Object.assign(this._userUser, this._user);
    await this._userUser.save();
    localStorage.setItem("user", JSON.stringify(this._user));
    this._loadProfile();
  }

  async _deleteFollow(event) {
    this._project = await Project.loadOrCreate(event.target.id);
    await this._userUser.deleteFollow(this._project);
    this._loadProfile();
  }

  async _updateQna(input) {
    let questionID = input.id;
    let answer = input.value;
    this._user.qna[questionID] = answer;
    Object.assign(this._userUser, this._user);
    await this._userUser.save();
    localStorage.setItem("user", JSON.stringify(this._user));
    this._loadProfile();
  }

  async _applyProject(event) {
    event.preventDefault();
    let userID = this._user.id;
    let projectID = event.target.classList[0];
    let project = await Project.loadOrCreate(projectID);
    await this._userUser.addApply(project);

    // Disable button and change text textContent
    event.target.textContent = "Applied";
    event.target.style.backgroundColor = "#2b3da1";
    event.target.disabled = true;
    // Grab user's qna, projectID, userID -> application object

    // put in applications collection
  }
}

let app = new App();
app.setup();
