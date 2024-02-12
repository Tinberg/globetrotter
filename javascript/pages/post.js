

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch single post with comments reactions and author --> api.js
import { fetchSinglePost } from "../modules/api.js";

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
  } catch (error) {
    console.error("Error fetching post details:", error);
    // Make error message here!!
  }
}

//-- Displays post details including title, body, author, and media --//
function displayPostDetails(postData) {
  //displaying post title, body reactions count and comments count
  document.querySelector(".post-title").textContent = postData.title;
  document.querySelector(".post-body").textContent = postData.body;
  document.querySelector(".reactions-count").textContent =
    postData._count.reactions;
  document.querySelector(".comments-count").textContent =
    postData._count.comments;
  // Set image of the post if available, otherwise to a default image and alt text
  const postImageElement = document.querySelector(".post-image");
  if (postData.media && postData.media.url) {
    postImageElement.src = postData.media.url;
    postImageElement.alt = postData.media.alt || "Post image";
    postImageElement.style.display = "";
  } else {
    // Default img and alt if no image is present
    postImageElement.src = "/images/no-image.png";
    postImageElement.alt = "Post image";
  }

  // Display author name and avatar
  document.querySelector(".profile-name").textContent = postData.author.name;
  document.querySelector(".post-profile-image").src =
    postData.author.avatar.url;

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
                            <img src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" class="comments-img rounded-circle" style="width: 50px; height: 50px;">
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
    commentsContainer.innerHTML = '<p class="text-center">Be the first to leave a comment!</p>';
  }
}
// Call loadPostData when the page is loaded
document.addEventListener("DOMContentLoaded", loadPostData);
