
//-- This is the Base URL --//
const API_BASE_URL = "https://api.noroff.dev/api/v1";

//------ Import --------/

//-- Import the JWT to to confirm user is logged in --> moduals/utility.js --//
import { getToken } from "./auth.js";

//------ Export --------/

//-- For fetch register user --> register.js
export { registerUser };
//-- For fetch login user --> index.js 
export { loginUser };
//-- For fetch spesific user info --> my-profile.js MAYBE profile.js as well??????
export { fetchUserProfile };
//-- For fetch posts by spesific user --> my-profile.js MAYBE profile.js as well??????
export { fetchPostsByUserName };
//-- For fetch edit profile media --> my-profile.js
export { updateProfileMedia };
//-- For fetch create post --> new-post.js
export { createPost };

/**
 *
 * @param {Object} userData
 * @returns {Promise}
 */
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
/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
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
/**
 *
 * @param {string} userName
 * @returns {Promise}
 */
async function fetchUserProfile(userName) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}/social/profiles/${userName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile information");
  }
  return await response.json();
}
/**
 *
 * @param {string} userName
 * @returns {Promise}
 */
async function fetchPostsByUserName(userName) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${userName}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return await response.json();
}
/**
 *
 * @param {string} userName
 * @param {string} bannerUrl
 * @param {string} avatarUrl
 * @returns {Promise}
 */
async function updateProfileMedia(userName, bannerUrl, avatarUrl) {
  const token = getToken();
  const bodyData = JSON.stringify({
    banner: bannerUrl,
    avatar: avatarUrl,
  });

  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${userName}/media`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: bodyData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update profile media: ${errorData.message}`);
  }

  return await response.json();
}

/**
 * Creates a new post.
 * @param {Object} postData - The data for the new post.
 * @returns {Promise}
 */
async function createPost(postData) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/social/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Assuming getToken() retrieves the stored JWT.
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create post: ${errorData.message}`);
  }

  return await response.json();
}