//-- Import --//

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- function to fetch all post that the user are following --> api.js --//
import { fetchPostsFromFollowing } from "../modules/api.js";
//-- Infinite scroll, triggering a callback when the user reaches the bottom of the page
import { addInfiniteScroll } from "../modules/utility.js";
//-- Trim the text for overlay text title and body text for post --> utility.js --//
import { trimText } from "../modules/utility.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";
//-- format date as relative time or DD/MM/YYYY
import { formatRelativeTime } from "../modules/utility.js";
//-- reaction number count only display one pr user reguardless of how many emojis(times) they have reacted
import { uniqueReactorsCount } from "../modules/utility.js";

//Global stat for pagination
let globalFilter = {
  page: 1,
  limit: 20,
  allPostsFetched: false,
};
//----------------- Calls the fetchPostsFromFollowing and uses displayPosts to render the fetched posts on page load -----------------//
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const posts = await fetchPostsFromFollowing(globalFilter.page, globalFilter.limit);
    if (posts.length > 0) {
      displayPosts(posts);
    } else {
      globalFilter.allPostsFetched = true;
      console.log("No more posts to fetch.");
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    document.querySelector(".home-error").textContent = "We encountered an issue loading the posts. Please try again later.";
  }
});
//Function from utility.js to load on scroll
function handleInfiniteScroll() {
  if (!globalFilter.allPostsFetched) {
    globalFilter.page++;
    fetchAndDisplayPosts();
  }
}
addInfiniteScroll(handleInfiniteScroll);
//----------------- Fetch more posts from followed users and display them, considering pagination. -----------------//
async function fetchAndDisplayPosts() {
  if (!globalFilter.allPostsFetched) {
    try {
      const posts = await fetchPostsFromFollowing(globalFilter.page, globalFilter.limit);
      if (posts.length < globalFilter.limit) {
        globalFilter.allPostsFetched = true; 
        document.querySelector(".home-message").textContent = "You've reached the end of the follwing feed. Keep exploring!";
      }
      displayPosts(posts, true); 
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
    }
  }
  else{

  }
}
//-- Render the posts: Create and add post elements from users the logged-in user is following, including Post image, username, useravatar, comments, and reactions  --//
function displayPosts(posts, append = false) {
  console.log(posts)
  const postContainer = document.querySelector("#allPosts");
  if (!append) {
    postContainer.innerHTML = "";}

  posts.forEach((post) => {
    const postImageAltText = post.media?.alt || "Post image";
    const postDate = formatRelativeTime(
      post.created || new Date().toISOString()
    );
    const uniqueReactionCount = uniqueReactorsCount(post.reactions);
    const reactionsFormatted = formatCount(uniqueReactionCount);
    const commentsFormatted = formatCount(post._count.comments);

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
                    <div class="d-flex align-items-center mb-2">
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
                                <span class="mx-1">${reactionsFormatted}</span> <span class="mx-1">|</span> <span class="mx-1">${commentsFormatted}</span> comments
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
