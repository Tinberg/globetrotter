//-------------------------  Import ------------------------- /
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
      document.getElementById("newPostForm").reset();
      updateCaptionFeedback();
      updateTitleFeedback();
      updateAltTextFeedback();
      window.location.href = "my-profile.html";
    } catch (error) {
      console.error("Failed to create post:", error);
      errorFeedback.textContent =
        "Failed to create post. Include a title and ensure it, along with captions, are under 280 characters. If adding an image, descriptions should be under 120 characters and URLs must start with 'http://' or 'https://'. Adjust and retry.";
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

//Function to update altTextFeedback
function updateAltTextFeedback() {
  const altText = document.getElementById("altText").value;
  const feedback = document.getElementById("altTextFeedback");
  feedback.textContent = `${altText.length}/120 characters`;

  if (altText.length > 120) {
    feedback.classList.add("text-danger");
    feedback.textContent += " - The alt text cannot exceed 120 characters.";
  } else {
    feedback.classList.remove("text-danger");
  }
}
document
  .getElementById("altText")
  .addEventListener("input", updateAltTextFeedback);

//------------------------- My Profile (Navbar)-------------------------//
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

//------------------------- LOADER!-------------------------//
window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('d-none');
  }
});