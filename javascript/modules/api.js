//------ Import --------/

//-- Import the JWT to to confirm user is logged in --> auth.js --//
import { getToken } from "./auth.js";
//-- Import the API key to access API--> auth.js --//
import { apiKey } from "./auth.js";

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
//-- For fetch all posts --> explore.js
export { fetchAllPosts };
//-- For fetching a single post with comments reactions and author info --> post.js
export { fetchSinglePost };
//-- For
export { fetchAllProfiles };

//-- This is the Base URL --//
const API_BASE_URL = "https://v2.api.noroff.dev";

//-- Utility --//
//Headers for "Get", "Post", "Put", and "Delete" requests
function getHeaders() {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Noroff-API-Key": apiKey,
  };
}

//-- API Calls --//
/**
 * register user profile
 * @param {Object} userData
 * @returns {Promise}
 */
async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const result = await response.json();
  return result.data;
}
/**
 * login user profile
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const result = await response.json();
  return result.data;
}
/**
 * fetch users profile information
 * @param {string} userName
 * @returns {Promise}
 */
async function fetchUserProfile(userName) {
  const response = await fetch(`${API_BASE_URL}/social/profiles/${userName}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile information");
  }
  const result = await response.json();
  return result.data;
}

/**
 * Fetch post by user
 * @param {string} userName
 * @returns {Promise}
 */
async function fetchPostsByUserName(userName) {
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${userName}/posts`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const result = await response.json();
  return result.data;
}
/**
 *  Edit profile media
 * @param {string} userName -  The username of the profile to update.
 * @param {string|undefined} bannerUrl
 * @param {string|undefined} avatarUrl
 * @param {boolean} isResetBanner
 * @param {boolean} isResetAvatar
 * @returns {promise}
 */
async function updateProfileMedia(
  userName,
  bannerUrl,
  avatarUrl,
  isResetBanner,
  isResetAvatar
) {
  const placeholderUrl =
    "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";
  const bodyData = {};

  if (bannerUrl !== undefined || isResetBanner) {
    bodyData.banner = isResetBanner
      ? { url: placeholderUrl, alt: "Default Banner" }
      : { url: bannerUrl, alt: "Personal Banner" };
  }

  if (avatarUrl !== undefined || isResetAvatar) {
    bodyData.avatar = isResetAvatar
      ? { url: placeholderUrl, alt: "Default Avatar" }
      : { url: avatarUrl, alt: "Personal Avatar" };
  }

  const response = await fetch(`${API_BASE_URL}/social/profiles/${userName}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update profile media`);
  }

  return await response.json();
}

/**
 * Creates a new post.
 * @param {Object} postData
 * @returns {Promise}
 */
async function createPost(postData) {
  const response = await fetch(`${API_BASE_URL}/social/posts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create post: ${errorData.message}`);
  }
  const result = await response.json();
  return result.data;
}

/**
 * Fetches all posts.
 * @returns {Promise}
 */
async function fetchAllPosts() {
  const response = await fetch(`${API_BASE_URL}/social/posts?_author=true`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch all posts");
  }
  const result = await response.json();
  return result.data;
}
/**
 * Fetch a single post by its id including author, comments, and reactions.
 * @param {number|string} postId 
 * @returns {Promise<Object>} 
 */
async function fetchSinglePost(postId) {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}?_author=true&_comments=true&_reactions=true`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch the post");
  }
  const result = await response.json();
  return result.data;
}

/**
 * Fetches all user profiles.
 * @returns {Promise}
 */
async function fetchAllProfiles() {
  const response = await fetch(`${API_BASE_URL}/social/profiles`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profiles");
  }
  const result = await response.json();
  return result.data;
}


