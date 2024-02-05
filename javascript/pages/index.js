//--Import the API Function Login --> modules/api.js --//
import { loginUser } from '../modules/api.js'; 

//--Import the JTW Function --> modules/utility.js --//
import { storeToken } from '../modules/auth.js'; 

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await loginUser(email, password);
    console.log(result); 
    //Store JWT token to local storage --> utility.js
    storeToken(result.accessToken); 
    //Store the username to localstorage
    localStorage.setItem('userName', result.name);
    window.location.href = `/html/my-profile.html`;
  } catch (error) {
    console.error(error.message); 
    // error code here
  }
});