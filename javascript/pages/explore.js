//------ Import --------/
//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch all posts--> api.js
import { fetchAllPosts } from "../modules/api.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const posts = await fetchAllPosts();
    displayPosts(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
});
//-- Display All post: username, useravatar, comments, and reactions to the post --//
function displayPosts(posts) {
  const postContainer = document.querySelector("#allPosts");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postImageAltText = post.media?.alt || "Post image";
    const reactionsFormatted = formatCount(post._count.reactions || 0);
    const commentsFormatted = formatCount(post._count.comments || 0);
    

    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5";
    postElement.style.cursor = "pointer";

    postElement.innerHTML = `
          <div class="card">
              <div class="card-img-top-container w-100 position-relative h-0">
              <img src="${
                post.media?.url || "/images/no-image.png"
              }" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="${postImageAltText}">
              </div>
              <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                      <img src="${
                        post.author?.avatar?.url || "/images/profileimage.jpg"
                      }" class="post-profile-image rounded-circle me-3" alt="Profile image">
                      <div class="d-flex flex-column text-truncate">
                          <p class="mb-0 fs-6 fw-light max-width text-truncate">
                              Posted by <span class="post-user-name fw-normal">${
                                post.author?.name || "Unknown"
                              }</span>
                          </p>
                          <p class="card-text fw-light text-truncate">
                              <i class="fa-solid fa-heart text-primary"></i>
                              <span class="mx-1">${reactionsFormatted}</span> | <span class="mx-1">${commentsFormatted}</span> comments
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      `;
    postElement.addEventListener("click", () => {
      window.location.href = `post.html?id=${post.id}`;
    });

    postContainer.appendChild(postElement);
  });
}
