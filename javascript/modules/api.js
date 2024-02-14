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
//-- For fetch spesific user info --> my-profile.js
export { fetchUserProfile };
//-- For fetch posts by spesific user --> my-profile.js and profile.js
export { fetchPostsByUserName };
//-- For fetch edit profile media --> my-profile.js
export { updateProfileMedia };
//-- For fetch create post --> new-post.js
export { createPost };
//-- For fetch all posts --> explore.js
export { fetchAllPosts };
//-- For fetching a single post with comments reactions and author info --> post.js
export { fetchSinglePost };
//-- For fetching all post that the user is following --> home.js
export { fetchPostsFromFollowing };
//-- For follow a user by their username --> profile.js 
export { followUser };
//-- For unfollow a user by their username --> profile.js
export { unfollowUser };
//-- For
export { fetchAllProfiles };

//-- This is the Base URL --//
const API_BASE_URL = "https://v2.api.noroff.dev";

//-- Utility --//
// Headers and content-type for "Get", "Post", "Put", and "Delete" requests getHeaders(false) will exclude the ContentType
function getHeaders(includeContentType = true) {
  const headers = {
    Authorization: `Bearer ${getToken()}`,
    "X-Noroff-API-Key": apiKey,
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
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
  const response = await fetch(`${API_BASE_URL}/social/profiles/${userName}?_followers=true&_following=true&_posts=true`, {
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
  const response = await fetch(
    `${API_BASE_URL}/social/posts/${postId}?_author=true&_comments=true&_reactions=true`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch the post");
  }
  const result = await response.json();
  return result.data;
}
/**
 * fetch post all post from the users is following
 * @returns  {Promise}
 */
async function fetchPostsFromFollowing() {
  const response = await fetch(
    `${API_BASE_URL}/social/posts/following?_author=true&_comments=true&_reactions=true`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts from following");
  }
  const result = await response.json();
  return result.data;
}
/**
 * Follow a user profile
 * @param {string} username
 * @returns {Promise}
 */
async function followUser(username) {
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${username}/follow`,
    {
      method: "PUT",
      headers: getHeaders(false),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to follow the user");
  }
  return response.json();
}

/**
 * Unfollow a user profile
 * @param {string} username
 * @returns {Promise}
 */
async function unfollowUser(username) {
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${username}/unfollow`,
    {
      method: "PUT",
      headers: getHeaders(false),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to unfollow the user");
  }
  return response.json();
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

