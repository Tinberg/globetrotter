//------ Import --------/
//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch all posts--> api.js
import { fetchAllPosts } from "../modules/api.js";
//-- Api for fetch all profiels for search --> api.js
import { fetchProfilesSearch } from "../modules/api.js";
//-- Api for fetch all posts for search --> api.js
import { fetchPostsSearch } from "../modules/api.js";
//-- Trim the text for overlay text title and body text for post --> utility.js --//
import { trimText } from "../modules/utility.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";

// Global state for filters and sorting
let globalFilter = {
  continentTag: "",
  sortOption: "",
};
//-- Sets up event listeners for post filtering and sorting, then fetches and displays posts --//
document.addEventListener("DOMContentLoaded", async () => {
  fetchAndDisplayPosts();

  // Continent filter change event listener
  document
    .getElementById("filterContinent")
    .addEventListener("change", async () => {
      const selectedContinent = document.querySelector(
        'input[name="continent"]:checked'
      )?.value;
      globalFilter.continentTag = selectedContinent;
      fetchAndDisplayPosts(globalFilter.continentTag, globalFilter.sortOption);
    });

  // Sort by change event listener
  document
    .getElementById("sortBy")
    .addEventListener("change", async (event) => {
      const sortOption = event.target.value;
      globalFilter.sortOption = sortOption;
      fetchAndDisplayPosts(globalFilter.continentTag, globalFilter.sortOption);
    });
  // Search button event listner
  document
    .getElementById("searchForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent form submission
      handleSearch();
    });
});

//-- Function to sort posts --//
function sortPosts(posts, sortOption) {
  switch (sortOption) {
    case "desc":
      return posts.sort((a, b) => new Date(b.created) - new Date(a.created));
    case "asc":
      return posts.sort((a, b) => new Date(a.created) - new Date(b.created));
    case "alpha-asc":
      return posts.sort((a, b) => a.title.localeCompare(b.title));
    case "alpha-desc":
      return posts.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return posts;
  }
}
//-- Call the fetchAllPosts and use the displayPosts to render the fetched posts. Sorts, and displays posts based on the specified filters --//
async function fetchAndDisplayPosts(continentTag = "", sortOption = "") {
  try {
    let posts = await fetchAllPosts(continentTag);
    posts = sortPosts(posts, sortOption);
    displayPosts(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}
//-- For Searchbar --//

// Initiates a search based on user input, fetching matching profiles and posts
async function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  try {
    const profiles = await fetchProfilesSearch(query);
    const posts = await fetchPostsSearch(query);
    displaySearchResults(profiles, posts);
  } catch (error) {
    console.error("Error during search:", error);
  }
}

// Utility function to create list items for search results
function createSearchListItem({
  imageUrl,
  imageAlt,
  primaryText,
  secondaryText,
  onClick,
  isProfile = false,
}) {
  const listItem = document.createElement("li");
  listItem.className =
    "py-2 d-flex align-items-center cursor-pointer search-item list-group-item";

  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = imageAlt;
  image.className = isProfile
    ? "rounded-circle search-image me-2"
    : "rounded search-image me-2";

  const contentDiv = document.createElement("div");
  const primaryContent = document.createElement("strong");
  primaryContent.textContent = primaryText;

  const secondaryContent = document.createElement("p");
  secondaryContent.className = "text-muted mb-0";
  secondaryContent.textContent = secondaryText;

  contentDiv.appendChild(primaryContent);
  if (secondaryText) {
    contentDiv.appendChild(secondaryContent);
  }

  listItem.appendChild(image);
  listItem.appendChild(contentDiv);
  listItem.addEventListener("click", onClick);

  return listItem;
}
// Function to display search results
function displaySearchResults(profiles, posts) {
  const profilesContainer = document.getElementById("profiles");
  const postsContainer = document.getElementById("posts");
  profilesContainer.innerHTML = "";
  postsContainer.innerHTML = "";

  // Create and append profiles list
  const profilesList = document.createElement("ul");
  profilesList.className = "list-group";
  profiles.forEach((profile) => {
    const listItem = createSearchListItem({
      imageUrl: profile.avatar?.url || "/images/profileImage.jpg",
      imageAlt: profile.avatar?.alt || "Profile avatar",
      primaryText: profile.name,
      onClick: () =>
        (window.location.href = `profile.html?username=${encodeURIComponent(
          profile.name
        )}`),
      isProfile: true,
    });
    profilesList.appendChild(listItem);
  });

  // Create and append posts list
  const postsList = document.createElement("ul");
  postsList.className = "list-group";
  posts.forEach((post) => {
    const listItem = createSearchListItem({
      imageUrl: post.media?.url || "/images/no-image.png",
      imageAlt: post.media?.alt || "Post image",
      primaryText: post.title,
      secondaryText: `- By: ${
        post.author && post.author.name ? post.author.name : "Unknown"
      }`,
      onClick: () =>
        (window.location.href = `post.html?id=${encodeURIComponent(post.id)}`),
    });
    postsList.appendChild(listItem);
  });

  profilesContainer.appendChild(profilesList);
  postsContainer.appendChild(postsList);

  // Show the search results modal
  const searchModal = new bootstrap.Modal(
    document.getElementById("searchResultsModal")
  );
  searchModal.show();
}

//-- Render the posts: Create and add post elements including Post image, username, useravatar, comments, and reactions to the post  --//
function displayPosts(posts) {
  const postContainer = document.querySelector("#allPosts");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postImageAltText = post.media?.alt || "Post image";
    const reactionsFormatted = formatCount(post._count.reactions || 0);
    const commentsFormatted = formatCount(post._count.comments || 0);

    // Trim title and body with imported function from trimText utility.js
    const trimmedTitle = trimText(post.title, 25);
    const trimmedBody = trimText(post.body, 50);

    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5";
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
