//-------- Export --------//
//-- StoreToken is for index.html
export { storeToken };
//-- getToken is for every page for API authentication requests
export { getToken };
//-- Used when user click logg out
export { clearToken };
//Redirect function - If user is not logged in
export { checkAuthAndRedirect };

//-------- JWT Token --------//

function storeToken(token) {
  localStorage.setItem("accessToken", token);
}

function getToken() {
  return localStorage.getItem("accessToken");
}

function clearToken() {
  localStorage.removeItem("accessToken");
}

//-------- Check authentication, if not present redirect --------//

/**
 * Checks if the user is authenticated by verifying the presence of a JWT token.
 * If no token is present, redirects the user to the index page.
 */
function checkAuthAndRedirect() {
  const token = getToken();
  if (!token) {
    window.location.href = "/index.html";
  }
}
