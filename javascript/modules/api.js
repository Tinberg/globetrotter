//------ Import --------/

//-- Import the JWT to to confirm user is logged in --> auth.js --//
import { getToken } from "./auth.js";
//-- Import the API key to access API--> auth.js --//
import { apiKey } from "./auth.js";

//------ Export --------/

//-- For fetch register user --> register.js
export { registerUser }; //------------------------------------------------------------------- Line: 67
//-- For fetch login user --> index.js
export { loginUser }; //---------------------------------------------------------------------- Line: 83
//-- For fetch spesific user info --> my-profile.js
export { fetchUserProfile }; //--------------------------------------------------------------- Line: 105
//-- For fetch posts by spesific user --> my-profile.js and profile.js
export { fetchPostsByUserName }; //----------------------------------------------------------- Line: 123
//-- For fetch edit profile media --> my-profile.js
export { updateProfileMedia }; //------------------------------------------------------------- Line: 141
//-- For fetch create post --> new-post.js
export { createPost }; //--------------------------------------------------------------------- Line: 192
//-- For fetch all posts --> explore.js
export { fetchAllPosts }; //------------------------------------------------------------------ Line: 210
//-- For fetching all post that the user is following --> home.js
export { fetchPostsFromFollowing }; //-------------------------------------------------------- Line: 231
//-- For fetching a single post with comments reactions and author info --> post.js
export { fetchSinglePost }; //---------------------------------------------------------------- Line: 248
//-- For fetching to edit a post --> post.js
export { updatePost }; //--------------------------------------------------------------------- Line: 266
//-- For fetching to delete a post --> post.js
export { deletePost }; //--------------------------------------------------------------------- Line: 287
//-- For fetch comment --> post.js
export { postComment }; //-------------------------------------------------------------------- Line: 302
//-- For delete comment --> post.js
export { deleteComment }; //------------------------------------------------------------------ Line: 329
//-- For fetch reaction -->post.js
export { reactToPost }; //-------------------------------------------------------------------- Line: 349
//-- For follow a user by their username --> profile.js
export { followUser }; //--------------------------------------------------------------------- Line: 370
//-- For unfollow a user by their username --> profile.js
export { unfollowUser }; //------------------------------------------------------------------- Line: 388
//-- For fetch all profiles search --> explore.js
export { fetchProfilesSearch }; //------------------------------------------------------------ Line: 406
//-- For fetch all posts search --> explore.js
export { fetchPostsSearch }; //--------------------------------------------------------------- Line: 424

//---------- Utility ----------//
//-- This is the Base URL --//
const API_BASE_URL = "https://v2.api.noroff.dev";

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

//---------- API Calls ----------//
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
 return response;
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
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/${userName}?_followers=true&_following=true&_posts=true`,
    {
      headers: getHeaders(),
    }
  );
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
    `${API_BASE_URL}/social/profiles/${userName}/posts?_author=true&_reactions=true`,
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
 *  update profile media
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
      ? {
          url: placeholderUrl,
          alt: "A blurry multi-colored rainbow background",
        }
      : { url: bannerUrl, alt: "Personal Banner" };
  }

  if (avatarUrl !== undefined || isResetAvatar) {
    bodyData.avatar = isResetAvatar
      ? {
          url: placeholderUrl,
          alt: "A blurry multi-colored rainbow background",
        }
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
 * Fetches all posts optionally filtered by a tag.
 * @param {string} [tag]
 * @returns {Promise}
 */
async function fetchAllPosts(tag) {
  const url = tag
    ? `${API_BASE_URL}/social/posts?_author=true&_reactions=true&_tag=${encodeURIComponent(
        tag
      )}`
    : `${API_BASE_URL}/social/posts?_author=true&_reactions=true`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch all posts");
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
 * Updates an existing post.
 * @param {number|string} postId
 * @param {Object} updateData
 * @returns {Promise}
 */
async function updatePost(postId, updateData) {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update post: ${errorData.message}`);
  }

  const result = await response.json();
  return result.data;
}
/**
 * Deletes a post based on its ID.
 * @param {number|string} postId
 * @returns {Promise} the return promis is voide
 */
async function deletePost(postId) {
  const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
    method: "DELETE",
    headers: getHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Failed to delete the post");
  }
}
/**
 * Posts a comment on a specific post.
 * @param {number|string} postId
 * @param {string} body
 * @param {number|string|null} replyToId
 * @returns {Promise<Object>}
 */
async function postComment(postId, body, replyToId = null) {
  const payload = { body };
  if (replyToId) payload.replyToId = replyToId;

  const response = await fetch(
    `${API_BASE_URL}/social/posts/${postId}/comment`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to post comment: ${errorData.message}`);
  }

  return await response.json();
}
/**
 * Deletes a comment from a post.
 * @param {number|string} postId
 * @param {number|string} commentId
 * @returns {Promise}
 */
async function deleteComment(postId, commentId) {
  const response = await fetch(
    `${API_BASE_URL}/social/posts/${postId}/comment/${commentId}`,
    {
      method: "DELETE",
      headers: getHeaders(false),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to delete comment: ${errorData.message}`);
  }
}
/**
 * React to a post
 * @param {number|string} postId
 * @param {string} symbol
 */
async function reactToPost(postId, symbol) {
  const response = await fetch(
    `${API_BASE_URL}/social/posts/${postId}/react/${encodeURIComponent(
      symbol
    )}`,
    {
      method: "PUT",
      headers: getHeaders(false),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to react to post: ${errorData.message}`);
  }
  return await response.json();
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
 * Searches for profiles based on a query.
 * @param {string} query
 * @returns {Promise}
 */
async function fetchProfilesSearch(query) {
  const response = await fetch(
    `${API_BASE_URL}/social/profiles/search?q=${encodeURIComponent(query)}`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search profiles");
  }
  const result = await response.json();
  return result.data;
}
/**
 * Searches for posts based on a query.
 * @param {string} query
 * @returns {Promise}
 */
async function fetchPostsSearch(query) {
  const response = await fetch(
    `${API_BASE_URL}/social/posts/search?q=${encodeURIComponent(
      query
    )}&_author=true`,
    {
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search posts");
  }
  const result = await response.json();
  return result.data;
}
