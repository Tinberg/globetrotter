//------ Import --------/
import { createPost } from "../modules/api.js";

//------------------------- New post -------------------------//
// --Handle the submission for the new post form --//
document
  .getElementById("newPostForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    // values from the form
    const title = document.getElementById("postTitle").value;
    const body = document.getElementById("postCaption").value;
    const mediaUrl = document.getElementById("postImage").value;
    const altText = document.getElementById("altText").value;
    const errorFeedback = document.getElementById("postErrorFeedback");

    // Check if "Not Specified" is selected, and if so, set tags as an empty array(no tag)
    const selectedContinent = document.getElementById("continentSelect").value;
    const tags =
      selectedContinent !== "Not Specified" ? [selectedContinent] : [];

    try {
      const postData = {
        title,
        body,
        tags,
        media: mediaUrl ? { url: mediaUrl, alt: altText } : undefined,
      };
      const result = await createPost(postData);
      console.log("Post created successfully:", result);
      document.getElementById("newPostForm").reset();
      updateCaptionFeedback();
      updateTitleFeedback();
      window.location.href = "my-profile.html";
    } catch (error) {
      console.error("Failed to create post:", error);
      errorFeedback.textContent =
        "Failed to create post. Please ensure a valid title is provided. If including an image, ensure the URL starts with 'http://' or 'https://'. Captions, if added, must be under 280 characters. Please try again.";
      errorFeedback.style.display = "block";
    }
  });

// Function to update Caption feedback
function updateCaptionFeedback() {
  const caption = document.getElementById("postCaption").value;
  const feedback = document.getElementById("captionFeedback");
  feedback.textContent = `${caption.length}/280 characters`;

  if (caption.length > 280) {
    feedback.classList.add("text-danger");
    feedback.textContent += " - The caption cannot exceed 280 characters.";
  } else {
    feedback.classList.remove("text-danger");
  }
}
document
  .getElementById("postCaption")
  .addEventListener("input", updateCaptionFeedback);

// Function to update Title feedback
function updateTitleFeedback() {
  const title = document.getElementById("postTitle").value;
  const feedback = document.getElementById("titleFeedback");
  feedback.textContent = `${title.length}/280 characters`;

  if (title.length > 280) {
    feedback.classList.add("text-danger");
    feedback.textContent += " - The title cannot exceed 280 characters.";
  } else {
    feedback.classList.remove("text-danger");
  }
}
document
  .getElementById("postTitle")
  .addEventListener("input", updateTitleFeedback);

//------------------------- My Profile -------------------------//
//Click event listeners from modal
document.addEventListener("DOMContentLoaded", function () {
  // Go to Profile
  document
    .querySelector(".profile-option")
    .addEventListener("click", function () {
      window.location.href = "/html/my-profile.html";
    });

  // Log Out
  document
    .querySelector(".logout-option")
    .addEventListener("click", function () {
      const isConfirmed = confirm("Are you sure you want to log out?");
      if (isConfirmed) {
        localStorage.removeItem("userName");
        localStorage.removeItem("accessToken");
        window.location.href = "../index.html";
      }
    });
});
