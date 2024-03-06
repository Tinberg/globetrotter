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

// Global state for filters, sorting, and pagination
let globalFilter = {
  continentTag: "",
  sortOption: "created",
  sortOrder: "desc",
  page: 1,
  limit: 20,
  allPostsFetched: false,
};

// Fetches and displays posts based on the current global filter settings.
async function fetchAndDisplayPosts() {
  if (globalFilter.allPostsFetched) {
    console.log("All posts have been fetched.");
    return;
  }
  try {
    const posts = await fetchAllPosts(
      globalFilter.continentTag,
      globalFilter.sortOption,
      globalFilter.sortOrder,
      globalFilter.page,
      globalFilter.limit
    );
    if (posts.length < globalFilter.limit) {
      globalFilter.allPostsFetched = true;
      document.querySelector(".explore-message").textContent = "No more posts. Back to Top";
    }
    else {
      document.querySelector(".explore-message").textContent = "";
    }
    displayPosts(posts, globalFilter.page > 1);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    document.querySelector(".explore-error").textContent =
      "We encountered an issue loading the posts. Please try again later.";
  }
}
//Function from utility.js to load on scroll
addInfiniteScroll(async () => {
  if (!globalFilter.allPostsFetched) {
    globalFilter.page++;
    await fetchAndDisplayPosts(
      globalFilter.continentTag,
      globalFilter.sortOption,
      globalFilter.sortOrder,
      globalFilter.page,
      globalFilter.limit
    );
  }
});

// Sets up initial event listeners when the DOM is loaded.
document.addEventListener("DOMContentLoaded", async () => {
  // Load saved filters from sessionStorage
  const savedContinent = sessionStorage.getItem("selectedContinent");
  if (savedContinent !== null) {
    document.querySelector(
      `input[name="continent"][value="${savedContinent}"]`
    ).checked = true;
    globalFilter.continentTag = savedContinent;
  }

  const savedSortOption = sessionStorage.getItem("sortOption");
  const savedSortOrder = sessionStorage.getItem("sortOrder");
  if (savedSortOption && savedSortOrder) {
    globalFilter.sortOption = savedSortOption;
    globalFilter.sortOrder = savedSortOrder;
    document.getElementById("sortBy").value = savedSortOrder;
  }

  await fetchAndDisplayPosts();

  // Handles changes to the continent filter, updating the global filter and fetching posts.
  document
    .getElementById("filterContinent")
    .addEventListener("change", async () => {
      const selectedContinent = document.querySelector(
        'input[name="continent"]:checked'
      )?.value;
      globalFilter.continentTag = selectedContinent;
      globalFilter.page = 1;
      globalFilter.allPostsFetched = false;
      sessionStorage.setItem("selectedContinent", selectedContinent);
      await fetchAndDisplayPosts();
    });

  // Adjusts sorting options based on user selection and fetches posts.
  document
    .getElementById("sortBy")
    .addEventListener("change", async (event) => {
      const { value } = event.target;
      adjustSortAndOrder(value);
      globalFilter.page = 1;
      globalFilter.allPostsFetched = false;
      await fetchAndDisplayPosts();
    });

  // Search form submission handler
  document
    .getElementById("searchForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      handleSearch();
    });
});

// Adjusts global filter settings based on sort selection
function adjustSortAndOrder(value) {
  switch (value) {
    case "desc":
      globalFilter.sortOption = "created";
      globalFilter.sortOrder = "desc";
      break;
    case "asc":
      globalFilter.sortOption = "created";
      globalFilter.sortOrder = "asc";
      break;
    case "alpha-asc":
      globalFilter.sortOption = "title";
      globalFilter.sortOrder = "asc";
      break;
    case "alpha-desc":
      globalFilter.sortOption = "title";
      globalFilter.sortOrder = "desc";
      break;
    default:
      globalFilter.sortOption = "created";
      globalFilter.sortOrder = "desc";
  }
  globalFilter.page = 1;
  globalFilter.allPostsFetched = false;
  // Save the current sort settings to sessionStorage
  sessionStorage.setItem("sortOption", globalFilter.sortOption);
  sessionStorage.setItem("sortOrder", globalFilter.sortOrder);
}

//------------------------ For Searchbar ------------------------ //

// Initiates a search based on user input, fetching matching profiles and posts.
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

// Creates a search result list item for profiles and posts.
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
  if (profiles.length === 0) {
    const noProfilesMsg = document.createElement("li");
    noProfilesMsg.className = "list-group-item";
    noProfilesMsg.textContent = "No profiles found";
    profilesList.appendChild(noProfilesMsg);
  } else {
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
  }

  // Create and append posts list
  const postsList = document.createElement("ul");
  postsList.className = "list-group";
  if (posts.length === 0) {
    const noPostsMsg = document.createElement("li");
    noPostsMsg.className = "list-group-item";
    noPostsMsg.textContent = "No posts found";
    postsList.appendChild(noPostsMsg);
  } else {
    posts.forEach((post) => {
      const listItem = createSearchListItem({
        imageUrl: post.media?.url || "/images/no-image.png",
        imageAlt: post.media?.alt || "Post image",
        primaryText: post.title,
        secondaryText: `- By: ${
          post.author && post.author.name ? post.author.name : "Unknown"
        }`,
        onClick: () =>
          (window.location.href = `post.html?id=${encodeURIComponent(
            post.id
          )}`),
      });
      postsList.appendChild(listItem);
    });
  }

  profilesContainer.appendChild(profilesList);
  postsContainer.appendChild(postsList);

  const searchModal = new bootstrap.Modal(
    document.getElementById("searchResultsModal")
  );
  searchModal.show();
}

//------------------------  Render the posts: Create and add post elements including Post image, username, useravatar, comments, and reactions to the post  ------------------------ //
// Renders posts on the page, appending new posts for infinite scroll.
function displayPosts(posts, append = false) {
  console.log(posts);
  const postContainer = document.querySelector("#allPosts");
  if (!append) {
    postContainer.innerHTML = "";
  }

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
