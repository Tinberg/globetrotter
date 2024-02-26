//--Import the API Function Login --> modules/api.js --//
import { loginUser } from "../modules/api.js";

//--Import the JTW Function --> modules/utility.js --//
import { storeToken } from "../modules/auth.js";

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const result = await loginUser(email, password);
      // Store JWT token in local storage
      storeToken(result.accessToken);
      // Store the username in local storage
      localStorage.setItem("userName", result.name);
      // Store the user's avatar URL in local storage
      localStorage.setItem("userAvatar", result.avatar.url);
  
      window.location.href = `/html/my-profile.html`;
    } catch (error) {
      console.error(error.message);
      // Error handling code
    }
  });
