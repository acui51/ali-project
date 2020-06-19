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
    this._gsSignedIn = null;

    this._onLogin = this._onLogin.bind(this);
    this._onError = this._onError.bind(this);
    this._onSignOut = this._onSignOut.bind(this);
  }

  async setup() {
    // this._user = JSON.parse(localStorage.getItem("user"));
    this._gs = await GoogleSignin.init(CLIENT_ID);
    this._gsSignedIn = this._gs.getProfile();

    // If user is Google Signed In
    if (this._gsSignedIn) {
      // Change login in top-right to a profile image
      let login = document.querySelector("#loginForm");
      login.classList.add("hidden");
      let navbar = document.querySelector(".navbar");
      let icon = navbar.querySelector("#icon");
      icon.classList.remove("hidden");

      // Show Sign out button
      let signOutBtn = document.querySelector("#sign-out");
      signOutBtn.classList.remove("hidden");
      signOutBtn.addEventListener("click", this._onSignOut);
    } else {
      // Load Google Login
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
    signOutBtn.classList.remove("hidden");

    // Load or Create User in DB
    this._user = await User.loadOrCreate(this._gs.getProfile());
    console.log(this._user);

    // Set user in localStorage for cross-page retrieval
    // localStorage.setItem("user", JSON.stringify(this._user));

    // Goto the profile section of the user
    this._loadProfile();
  }

  _onError() {
    alert("Error loggin in");
  }

  async _onSignOut() {
    await this._gs.signOut();
    document.querySelector("#icon").classList.add("hidden");
    document.querySelector("#sign-out").classList.add("hidden");

    this._loginForm = document.querySelector("#loginForm");
    this._gs.renderSignIn(this._loginForm, {
      longtitle: true,
      theme: "dark",
      onsuccess: this._onLogin,
      onfailure: this._onError,
    });
    this._loginForm.classList.remove("hidden");

    // Go Back to Homepage (index.js)
  }
}

let app = new App();
app.setup();
