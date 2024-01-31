//--This is the Base URL--//
const API_BASE_URL = "https://api.noroff.dev/api/v1";

//--This is for register user --> register.js--//
async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/social/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return await response.json();
}

export { registerUser };

//--This is for login user --> index.js--//
async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/social/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}

export { loginUser };
