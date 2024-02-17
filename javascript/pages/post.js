//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch single post with comments reactions and author --> api.js
import { fetchSinglePost } from "../modules/api.js";
//-- Api for comment on post --> api.js
import { postComment } from "../modules/api.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";

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
      }
    });
}
//-------------------------Redirect-------------------------//
// Function when authorname or avatar is clicked directs to my-profile.html for the logged in user's own post, else directs to profile.html for other users' posts
//Used in DisplayPostDetails function
function navigateToUserProfile(userName) {
  const loggedInUser = localStorage.getItem("userName");
  const profileUrl =
    userName === loggedInUser
      ? "my-profile.html"
      : `profile.html?username=${encodeURIComponent(userName)}`;
  window.location.href = profileUrl;
}
