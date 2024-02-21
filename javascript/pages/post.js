//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch single post with comments reactions and author --> api.js
import { fetchSinglePost } from "../modules/api.js";
//-- Api for fetch to update a post --> api.js
import { updatePost } from "../modules/api.js";
//-- Api for fetch to delete a post --> api.js
import { deletePost } from "../modules/api.js";
//-- Api for comment on post --> api.js
import { postComment } from "../modules/api.js";
//-- API for reaction on post --> api.js
import { reactToPost } from "../modules/api.js";
//- Function when authorname or avatar is clicked directs to my-profile.html for the logged in user's own post, else directs to profile.html
import { navigateToUserProfile } from "../modules/utility.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";

//userName from local storage used to check if user has liked a post(change color of the heart), and nav to my-profile if its in the local storage
//and for edit and delete post.
const currentUser = localStorage.getItem("userName");

//-- Load the specific post based on the id from the URL --//
async function loadPostData() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  if (!postId) {
    console.error("Post ID not found.");
    return;
  }

  try {
    const postData = await fetchSinglePost(postId);
    displayPostDetails(postData);
    attachCommentListener(postId);
    attachReactionListener(postId);
    setupPostOptions(postData);
  } catch (error) {
    console.error("Error fetching post details:", error);
  }
}
// LoadPostData in DOM
document.addEventListener("DOMContentLoaded", loadPostData);

//-------------------------Display-------------------------//
//-- Displays post details: Title, body, author info, media image, tag, comment and reaction count --//
function displayPostDetails(postData) {
  //displaying post title, body reactions count and comments count
  document.querySelector(".post-title").textContent = postData.title;
  document.querySelector(".post-body").textContent = postData.body;
  document.querySelector(".reactions-count").textContent = formatCount(
    postData._count.reactions
  );
  document.querySelector(".comments-count").textContent = formatCount(
    postData._count.comments
  );
  // Set image of the post if available, otherwise to a default image and alt text
  const postImageElement = document.querySelector(".post-image");
  if (postData.media && postData.media.url) {
    postImageElement.src = postData.media.url;
    postImageElement.alt = postData.media.alt || "Post image";
    postImageElement.style.display = "";
  } else {
    postImageElement.src = "/images/no-image.png";
    postImageElement.alt = "Post image";
  }
  //Display the tag/Continent
  if (postData.tags && postData.tags.length > 0) {
    document.querySelector(".tags-container").textContent = postData.tags[0];
  } else {
    document.querySelector(".tags-container").textContent = "Not Specified";
  }
  // Display author name and avatar
  const profileNameElement = document.querySelector(".profile-name");
  const profileAvatarElement = document.querySelector(".post-profile-image");
  profileNameElement.textContent = postData.author.name;
  profileAvatarElement.src = postData.author.avatar.url;

  // Check if the userName has liked the post and change heart on btn if userName has liked the post
  const userHasLiked = postData.reactions.some((reaction) =>
    reaction.reactors.includes(currentUser)
  );
  const likeButtonIcon = document.querySelector(".like-button i");

  if (userHasLiked) {
    likeButtonIcon.classList.add("fa-solid", "text-danger");
  } else {
    likeButtonIcon.classList.remove("fa-solid", "text-danger");
  }

  // Click event listeners to author name and avatar for navigating to user's profile
  profileNameElement.addEventListener("click", () =>
    navigateToUserProfile(postData.author.name)
  );
  profileAvatarElement.addEventListener("click", () =>
    navigateToUserProfile(postData.author.name)
  );

  // Calling function to display comments
  displayComments(postData.comments);
}

//-- Function to display comments for the post --//
function displayComments(comments) {
  const commentsContainer = document.querySelector(".comments-container");
  commentsContainer.innerHTML = "";

  if (comments && comments.length > 0) {
    comments.forEach((comment) => {
      const commentHtml = `
                <div class="container border bg-white my-3">
                    <div class="posting-user-details gap-3 d-flex flex-column flex-wrap px-4 pb-4 pt-4 justify-content-sm-start">
                        <div class="d-flex align-items-center gap-2">
                            <img src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" class="comments-img rounded-circle">
                            <p class="fw-medium mb-0">${comment.author.name}</p>
                        </div>
                        <div class="d-flex flex-column text-md-0 comment">
                            <p class="fw-light">${comment.body}</p>
                        </div>
                    </div>
                </div>
            `;
      commentsContainer.innerHTML += commentHtml;
    });
  } else {
    commentsContainer.innerHTML =
      '<p class="text-center">Be the first to leave a comment!</p>';
  }
}
//-------------------------Add Comment-------------------------//
//--  This function is for comment on the post it takes the postId  --//
function attachCommentListener(postId) {
  document
    .getElementById("sendComment")
    .addEventListener("click", async (event) => {
      event.preventDefault();

      const commentTextElement = document.getElementById("commentText");
      if (!commentTextElement) {
        console.error("Comment text area not found");
        return;
      }

      const commentText = commentTextElement.value.trim();
      if (!commentText) {
        return;
      }

      try {
        await postComment(postId, commentText);
        commentTextElement.value = "";

        window.location.reload();
      } catch (error) {
        console.error("Error posting comment:", error);
        alert("Failed to post comment.");
        //Fix error message
      }
    });
}
//-------------------------Add Reaction-------------------------//
//--  This function is for Reaction on the post it takes the postId  --//
function attachReactionListener(postId) {
  const likeButton = document.querySelector(".like-button");

  likeButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      await reactToPost(postId, "👍");

      window.location.reload();
    } catch (error) {
      console.error("Error reacting to post:", error);
      alert("Failed to react to the post.");
      //Fix error message
    }
  });
}
//-------------------------Edit post-------------------------//
//target and eventlister click to edit post button, save post button, and delete post button
//Called in loadPostData at the top
function setupPostOptions(postData) {
  const isCurrentUserPost = postData.author.name === currentUser;
  
  // Select your elements
  const optionsButton = document.querySelector("#postOptionsBtn");
  const deleteButton = document.querySelector("#deletePostButton");

  if (isCurrentUserPost) {
    // Remove 'd-none' to make the buttons visible for the current user's posts
    optionsButton.classList.remove('d-none');
    deleteButton.classList.remove('d-none');

    // Attach event listeners
    optionsButton.addEventListener("click", () => populateEditModal(postData));
    document.querySelector("#savePostChanges").addEventListener("click", () => savePostChanges(postData.id));
    deleteButton.addEventListener("click", () => attemptDeletePost(postData.id));
  } else {
    // Ensure buttons remain hidden for other users' posts
    optionsButton.classList.add('d-none');
    deleteButton.classList.add('d-none');
  }
}

//Set the value that is allready on the post in editPost modal and set character count. function for character at the bottom of this file
function populateEditModal(postData) {
  document.querySelector("#editPostTitle").value = postData.title;
  document.querySelector("#editPostBody").value = postData.body;
  document.querySelector("#editPostTags").value = postData.tags
    ? postData.tags.join(", ")
    : "";
  document.querySelector("#editPostMediaUrl").value =
    postData.media && postData.media.url ? postData.media.url : "";
  document.querySelector("#editPostMediaAlt").value =
    postData.media && postData.media.alt ? postData.media.alt : "";

  // Attaches input event listeners to title and body fields for real-time character count
  document
    .querySelector("#editPostTitle")
    .addEventListener("input", updateTitleCharacterCount);
  document
    .querySelector("#editPostBody")
    .addEventListener("input", updateCaptionCharacterCount);
  updateTitleCharacterCount();
  updateCaptionCharacterCount();

  const editModal = new bootstrap.Modal(
    document.getElementById("editPostModal")
  );
  editModal.show();
}
//take the value from each input in editPost modal and store it in updateData and then updatePost sets the new values to the post(id)
function savePostChanges(postId) {
  const title = document.querySelector("#editPostTitle").value;
  const body = document.querySelector("#editPostBody").value;
  const tags = document
    .querySelector("#editPostTags")
    .value.split(",")
    .map((tag) => tag.trim());
  const mediaUrl = document.querySelector("#editPostMediaUrl").value;
  const mediaAlt = document.querySelector("#editPostMediaAlt").value;

  //Stores the new data for updatePost under
  const updatedData = {
    title,
    body,
    tags,
    media: mediaUrl ? { url: mediaUrl, alt: mediaAlt } : undefined,
  };
  updatePost(postId, updatedData)
    .then((response) => {
      alert("Post updated successfully.");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Failed to update post:", error);
      alert("Failed to update the post.");
    });
}

//Delete a post
function attemptDeletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    deletePost(postId)
      .then(() => {
        alert("Post deleted successfully.");
        window.location.href = "my-profile.html";
      })
      .catch((error) => {
        console.error("Failed to delete post:", error);
        alert("Failed to delete the post.");
      });
  }
}

//--Functions to updates and displays character counts for title and body, highlighting over-limit text with a warning
// called in populateEditModal
//Title
function updateTitleCharacterCount() {
  const title = document.getElementById("editPostTitle").value;
  const feedback = document.getElementById("editTitleFeedback");
  feedback.textContent = `${title.length}/280 characters`;

  if (title.length > 280) {
    feedback.classList.add("text-danger");
    feedback.textContent += " - The title cannot exceed 280 characters.";
  } else {
    feedback.classList.remove("text-danger");
  }
}
// Caption
function updateCaptionCharacterCount() {
  const caption = document.getElementById("editPostBody").value;
  const feedback = document.getElementById("editCaptionFeedback");
  feedback.textContent = `${caption.length}/280 characters`;

  if (caption.length > 280) {
    feedback.classList.add("text-danger");
    feedback.textContent += " - The caption cannot exceed 280 characters.";
  } else {
    feedback.classList.remove("text-danger");
  }
}
