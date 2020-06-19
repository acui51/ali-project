import User from "./User.js";
/* GoogleSignin component from Michael Chang - CS193X Stanford */
import GoogleSignin from "./GoogleSignin.js";

const CLIENT_ID =
  "692072543428-b6tg06q1dl44e62ogj7qp6b2gsaoam41.apps.googleusercontent.com";

class App {
  constructor() {
    this._user = null;
    this._project = null;
    this._loginForm = null;
    this._gs = null;

    this._onLogin = this._onLogin.bind(this);
    this._onError = this._onError.bind(this);
    this._onSignOut = this._onSignOut.bind(this);
  }

  async setup() {
    this._user = JSON.parse(localStorage.getItem("user"));
    this._gs = await GoogleSignin.init(CLIENT_ID);
    console.log(this._gs.getProfile());

    if (this._user) {
      // Change login in top-right to a profile image
      let login = document.querySelector("#loginForm");
      login.remove();
      let navbar = document.querySelector(".navbar");
      navbar.querySelector("#icon").classList.remove("hidden");

      // Show Sign out button
      let signOutBtn = document.querySelector("#sign-out");
      signOutBtn.style.display = "block";
      signOutBtn.addEventListener("click", this._onSignOut);
    } else {
      // Google login
      this._gs = await GoogleSignin.init(CLIENT_ID);

      document
        .querySelector("#sign-out")
        .addEventListener("click", this._onSignOut);
      this._loginForm = document.querySelector("#loginForm");
      this._gs.renderSignIn(this._loginForm, {
        longtitle: true,
        theme: "dark",
        onsuccess: this._onLogin,
        onfailure: this._onError,
      });
    }
  }

  async _loadProfile() {
    // window.location.href = "profile.html";
  }

  async _onLogin() {
    // Replaces login label with profile icon + Sign Out Button
    let loginForm = document.querySelector("#loginForm");
    loginForm.classList.add("hidden");
    let profileIcon = document.querySelector("#icon");
    profileIcon.classList.remove("hidden");
    let signOutBtn = document.querySelector("#sign-out");
    signOutBtn.style.display = "block";

    // Load or Create User in DB
    this._user = await User.loadOrCreate(this._gs.getProfile());
    // Set user in localStorage for cross-page retrieval
    localStorage.setItem("user", JSON.stringify(this._user));

    // Goto the profile section of the user
    this._loadProfile();
  }

  _onError() {
    alert("Error loggin in");
  }

  async _onSignOut() {
    await this._gs.signOut();
    localStorage.clear();
    document.querySelector("#loginForm").classList.remove("hidden");
    document.querySelector("#icon").classList.add("hidden");
    document.querySelector("#sign-out").classList.add("hidden");
    // Go back to home page
    window.location.href = "index.html";
  }
}

let app = new App();
app.setup();
