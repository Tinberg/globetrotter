//--Import the API Function Register --> api.js--//
import { registerUser } from '../modules/api.js';

//addeventlistner and fucntion handle for register api
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const userData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value
    };

    try {
        const result = await registerUser(userData);

        if (result && result.status !== 'Bad Request') {
            console.log(result);
            window.location.href = '/html/my-profile.html'; 
        } else {
            console.error('Registration failed: ', result.errors);
            // show error message bad request likt brukernavn epost eller feil epost
        }

    } catch (error) {
        console.error('Registration failed:', error);
        // Show error message to the user networkerror
    }
});
