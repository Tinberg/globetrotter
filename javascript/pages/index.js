//--Import the API Function Login --> modules/api.js Line 19--//
import { loginUser } from '../modules/api.js'; 

//--Import the JTW Function --> modules/utility.js Line 1--//
import { storeToken } from '../modules/utility.js'; 

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await loginUser(email, password);
    console.log(result); 
    storeToken(result.accessToken); 
    window.location.href = `/html/my-profile.html`;
  } catch (error) {
    console.error(error.message); 
    // error code here
  }
});