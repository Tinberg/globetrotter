//------ Import --------/
import { createPost } from "../modules/api.js";

// Handle the submission for the new post form
document
  .getElementById("newPostForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("postTitle").value;
    const body = document.getElementById("postCaption").value;
    const media = document.getElementById("postImage").value;
    const tags = [document.getElementById("continentSelect").value];

    if (title.length > 280) {
      alert("The title cannot be greater than 280 characters."); // Change alert to smt else
      return;
    }

    if (body.length > 280) {
      alert("The post caption cannot be greater than 280 characters."); // Change alert to smt else
      return;
    }

    try {
      const postData = { title, body, tags, media };
      const result = await createPost(postData);
      console.log("Post created successfully:", result);
      document.getElementById("newPostForm").reset();
      updateCaptionFeedback();
      updateTitleFeedback();
      alert("Post created successfully!"); // Change alert to smt else
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again."); // Change alert to smt else
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
