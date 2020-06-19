import User from "./User.js";
import Project from "./Project.js";
import apiRequest from "./api.js";
import GoogleSignin from "./GoogleSignin.js";

const CLIENT_ID =
  "692072543428-b6tg06q1dl44e62ogj7qp6b2gsaoam41.apps.googleusercontent.com";

class App {
  constructor() {
    this._user = null;
    this._gs = null;
    this._userUser = null;
    this._project = null;
    this._category = null;
    this._loginForm = null;
    this._biology = null;
    this._computerScience = null;
    this._chemistry = null;
    this._physics = null;

    this._onLogin = this._onLogin.bind(this);
    this._loadProjectsEvent = this._loadProjectsEvent.bind(this);
    this._followProject = this._followProject.bind(this);
    this._unfollowProject = this._unfollowProject.bind(this);
    this._loadProjectList = this._loadProjectList.bind(this);
    this._displayModal = this._displayModal.bind(this);
    this._applyProject = this._applyProject.bind(this);
  }

  async setup() {
    this._gs = await GoogleSignin.init(CLIENT_ID);
    console.log(this._gs.getProfile());

    // Global event listener for modal
    window.addEventListener("click", (e) => {
      let modal = document.querySelector(".proj-modal");
      if (e.target == modal) {
        modal.style.display = "none";
        this._loadProjectList();
      }
    });

    this._user = JSON.parse(localStorage.getItem("user"));
    this._user = await User.loadOrCreate(this._user);
    // Check URL path if there is a specific category
    let path = location.pathname;
    this._category = path.slice(path.lastIndexOf("/") + 1);
    // If the URL path is /projects/biology for example. load that project
    if (this._category !== "projects") {
      // Change padding of project-Categories
      document.querySelector("#projects").style.padding = "1vh 12vw 5vh 12vw";
      this._loadProjectsEvent();
    }
    if (this._user) {
      // Change login in top-right to a profile image
      let login = document.querySelector("#loginForm");
      login.remove();
      let iconAnchor = document.createElement("a");
      iconAnchor.classList.add("item", "last-item");
      iconAnchor.id = "icon";
      iconAnchor.href = "profile.html";
      let iconIcon = document.createElement("i");
      iconIcon.classList.add("far", "fa-user-circle", "fa-2x");
      iconAnchor.appendChild(iconIcon);

      let navbar = document.querySelector(".navbar");
      navbar.appendChild(iconAnchor);
    } else {
      // Add event listener to login button
      this._loginForm = document.querySelector("#loginForm");
      this._loginForm.login.addEventListener("click", this._onLogin);
    }

    // Add event listeners for each category
    this._userUser = new User(this._user);
    this._biology = document.querySelector("#biology");
    this._biology.addEventListener("click", this._changePathname);

    this._computerScience = document.querySelector("#computer-science");
    this._computerScience.addEventListener("click", this._changePathname);

    this._chemistry = document.querySelector("#chemistry");
    this._chemistry.addEventListener("click", this._changePathname);

    this._physics = document.querySelector("#physics");
    this._physics.addEventListener("click", this._changePathname);
  }

  async _onLogin(event) {
    // Replace label bar with profile Icon
    event.preventDefault();
    let name = this._loginForm.querySelector('input[name="userid"]').value;
    // Replaces login label with profile icon
    let loginForm = document.querySelector("#loginForm");
    loginForm.classList.add("hidden");
    let profileIcon = document.querySelector("#icon");
    profileIcon.classList.remove("hidden");

    this._user = await User.loadOrCreate(name);
    localStorage.setItem("user", JSON.stringify(this._user));
  }

  _changePathname(event) {
    location.pathname = "/projects/" + event.target.id;
  }

  _loadProjectsEvent() {
    // Hide the Category blocks
    let projectCategories = document.querySelector(".project-categories");
    let categArray = projectCategories.querySelectorAll(".categ");
    for (let j = 0; j < categArray.length; j++) {
      categArray[j].classList.add("hidden");
    }

    // Load side bar with project categories
    let categCol = document.querySelector("#categ-col");
    categCol.classList.remove("hidden");
    // Load the project list of clicked category
    this._loadProjectList();
  }

  async _loadProjectList() {
    // Blank the project listings
    document.querySelector("#proj-col").textContent = "";
    let projectsArray = await Project.getProjects();
    let applyArray = await this._userUser.getApplied();
    // Load Clicked Category
    for (let i = 0; i < projectsArray.length; i++) {
      if (projectsArray[i].category === this._category) {
        let node = document.querySelector("#template").cloneNode(true);
        node.id = "";

        // Get correct matching icon for category
        let icon = document.createElement("i");
        if (this._category === "biology") {
          icon.classList.add("fas", "fa-dna");
        } else if (this._category === "chemistry") {
          icon.classList.add("fas", "fa-atom");
        } else if (this._category === "computer-science") {
          icon.classList.add("fab", "fa-python");
        } else if (this._category === "physics") {
          icon.classList.add("fas", "fa-wave-square");
        }

        // Load text
        let titleText = document.createTextNode(projectsArray[i].title);
        node.querySelector(".fa-li").appendChild(icon);
        let titleElem = node.querySelector(".title");
        titleElem.addEventListener("click", this._displayModal);
        titleElem.appendChild(titleText);
        node.querySelector(".dept").textContent = projectsArray[i].department;
        let preview = this._previewText(projectsArray[i].desc);
        node.querySelector(".preview").textContent = preview + " . . . ";
        node.querySelector(".desc").textContent = projectsArray[i].desc;

        // Add event listener to Follow button
        let followButton = node.querySelector("#follow-btn");
        followButton.classList.add(projectsArray[i].id);
        if (
          this._user.following.some(
            (follow) => follow.id === projectsArray[i].id
          )
        ) {
          followButton.textContent = "Unfollow";
          followButton.addEventListener("click", this._unfollowProject);
        } else {
          followButton.addEventListener("click", this._followProject);
        }

        // Alter the Apply button if already applied
        let applyButton = node.querySelector("#continue-apply");
        applyButton.classList.add(projectsArray[i].id);
        if (applyArray.some((apply) => apply.id === projectsArray[i].id)) {
          applyButton.textContent = "Applied";
          applyButton.disabled = true;
          applyButton.style.backgroundColor = "#2b3da1";
        }
        // Add event listener to Apply button
        applyButton = node.querySelector("#continue-apply");
        applyButton.classList.add(projectsArray[i].id);
        applyButton.addEventListener("click", this._applyProject);

        document.querySelector("#proj-col").appendChild(node);
      }
    }
  }

  async _followProject(event) {
    event.preventDefault();
    let projectID = event.target.classList[0];
    this._project = await Project.loadOrCreate(projectID);
    this._userUser.addFollow(this._project);

    // Change follow button to unfollow
    event.target.textContent = "Unfollow";
    event.target.removeEventListener("click", this._followProject);
    event.target.addEventListener("click", this._unfollowProject);
  }

  async _unfollowProject(event) {
    event.preventDefault();
    let projectID = event.target.classList[0];
    this._project = await Project.loadOrCreate(projectID);
    await this._userUser.deleteFollow(this._project);

    // Change unfollow button to follow
    event.target.textContent = "Follow";
    event.target.removeEventListener("click", this._unfollowProject);
    event.target.addEventListener("click", this._followProject);
  }

  _displayModal(event) {
    let modal = document.querySelector(".proj-modal");
    let modalContent = document.querySelector(".proj-modal-content");
    let projModal;
    // Clear modal
    modalContent.textContent = "";
    modal.style.display = "block";
    projModal = event.target.closest(".proj");

    projModal.querySelector(".preview").style.display = "none";
    projModal.querySelector(".desc").style.display = "block";

    // Remove follow button
    projModal.querySelector(".proj-follow").remove();
    projModal.querySelector(".open-proj").style.width = "100%";
    modalContent.appendChild(projModal);
  }

  async _applyProject(event) {
    event.preventDefault();
    let projectID = event.target.classList[0];
    let project = await Project.loadOrCreate(projectID);
    await this._userUser.addApply(project);

    // Disable button and change text textContent
    event.target.textContent = "Applied";
    event.target.style.backgroundColor = "#2b3da1";
    event.target.disabled = true;
    // track of the projects they've applied (grey out)
    // Grab user's qna, projectID, userID -> application object
    // put in applications collection
  }

  _previewText(description) {
    return description.split(" ").slice(0, 19).join(" ");
  }
}

let app = new App();
app.setup();
