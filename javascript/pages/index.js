//--Import the API Function Login --> api.js--//
import { loginUser } from '../modules/api.js'; 

//addeventlistner and fucntion handle for login api
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const result = await loginUser(email, password);
    console.log(result); 
    localStorage.setItem('accessToken', result.accessToken); 
    window.location.href = `/html/my-profile.html`;
  } catch (error) {
    console.error(error.message); 
    // error code here
  }
});