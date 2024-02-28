//-- Import --//

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- function to fetch all post that the user are following --> api.js --//
import { fetchPostsFromFollowing } from "../modules/api.js";
//-- Trim the text for overlay text title and body text for post --> utility.js --//
import { trimText } from "../modules/utility.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";
//-- format date as relative time or DD/MM/YYYY
import { formatRelativeTime } from "../modules/utility.js";

//-- Calls the fetchPostsFromFollowing and uses displayPosts to render the fetched posts --//
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const posts = await fetchPostsFromFollowing();
    displayPosts(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
});
//-- Render the posts: Create and add post elements from users the logged-in user is following, including Post image, username, useravatar, comments, and reactions  --//
function displayPosts(posts) {
  const postContainer = document.querySelector("#allPosts");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postImageAltText = post.media?.alt || "Post image";
    const postDate = formatRelativeTime(post.created || new Date().toISOString());
    const reactionsFormatted = formatCount(post._count.reactions || 0);
    const commentsFormatted = formatCount(post._count.comments || 0);

    // Trim title and body with imported function from trimText utility.js
    const trimmedTitle = trimText(post.title, 25);
    const trimmedBody = trimText(post.body, 50);

    const postElement = document.createElement("div");
    postElement.className = "col-md-5 col-lg-4  mb-5  ";
    postElement.style.cursor = "pointer";

    postElement.innerHTML = `
            <div class="card card-container">
                <div class="card-img-top-container w-100 position-relative h-0 border-bottom">
                <img src="${
                  post.media?.url || "/images/no-image.png"
                }" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="${postImageAltText}">
                <div class="overlay-content position-absolute top-0 start-0 end-0 bottom-0 overflow-hidden w-100 h-100 d-flex justify-content-center align-items-center p-2">
              <div class="text-white text-center">
                  <p class="fs-5 fw-bolder">${trimmedTitle}</p>
                  <p>${trimmedBody}</p>
                  <p class="fw-bold">Read more</p>
              </div>
          </div>
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
                            <p class="my-1 fw-light">${postDate}</p>
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
