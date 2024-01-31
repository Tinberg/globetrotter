//---JWT Token---//

//StoreToken is for index.html
function storeToken(token) {
  localStorage.setItem("accessToken", token);
}
//getToken is for every page for API authentication requests
function getToken() {
  return localStorage.getItem("accessToken");
}
//Used when user click logg out
function clearToken() {
  localStorage.removeItem("accessToken");
}

export { storeToken, getToken, clearToken };


