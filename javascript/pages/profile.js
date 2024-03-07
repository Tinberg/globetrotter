//------ Import --------/

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch spesific user info --> api.js
import { fetchUserProfile } from "../modules/api.js";
//-- Api for fetch post by spesific user --> api.js
import { fetchPostsByUserName } from "../modules/api.js";
//-- Infinite scroll, triggering a callback when the user reaches the bottom of the page
import { addInfiniteScroll } from "../modules/utility.js";
//-- Api for to set status for follow -- api.js
import { followUser } from "../modules/api.js";
//-- Api for to set status for unfollow -- api.js
import { unfollowUser } from "../modules/api.js";
//-- Trim the text for overlay text title and body text for post --> utility.js --//
import { trimText } from "../modules/utility.js";
//- Function when authorname or avatar is clicked directs to my-profile.html for the logged in user's own post, else directs to profile.html --> utility.js
import { navigateToUserProfile } from "../modules/utility.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";
//-- format date as relative time or DD/MM/YYYY
import { formatRelativeTime } from "../modules/utility.js";

//Global state for user profile and pagination
let globalUserProfile = null;
let globalFilter = {
  page: 1,
  limit: 6,
  allPostsFetched: false,
};
//------------------------- User Info -------------------------//
//-- Initializes the page by fetching and displaying user profile and posts based on the username from URL, and sets up follow/unfollow functionality --//
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");

  if (!userName) {
    console.error("User name not found in URL. Redirecting...");
    return;
  }

  try {
    // Fetches and displays the user profile and posts.
    globalUserProfile = await fetchUserProfile(userName);
    displayFollowers(globalUserProfile);
    displayFollowing(globalUserProfile);
    updateProfileUI(globalUserProfile);
    updateFollowButton(globalUserProfile);

    const posts = await fetchPostsByUserName(userName);
    displayPosts(posts, globalUserProfile);
    // Function to handle infinite scrolling
    function handleInfiniteScroll() {
      if (!globalFilter.allPostsFetched) {
        globalFilter.page++;
        fetchAndDisplayPosts(userName);
      }
    }
    addInfiniteScroll(handleInfiniteScroll);
    //Event listener for follow/unfollow.
    document
      .getElementById("followOrUnfollow")
      .addEventListener("click", () => toggleFollow(userName));
  } catch (error) {
    console.error("Failed to load user profile or posts:", error);
    document.querySelector(".error-message").textContent =
      "Failed to load user information. Please refresh the page or try again later.";
  }
});

//------------------------- Updates the UI with user profile information -------------------------//
function updateProfileUI(globalUserProfile) {
  // Sets users name
  document.getElementById("userName").textContent = globalUserProfile.name;
  // Sets users banner and alt text
  const bannerImageElement = document.getElementById("bannerImage");
  bannerImageElement.src =
    globalUserProfile.banner?.url || "/images/background.jpg";
  bannerImageElement.alt = globalUserProfile.banner?.alt || "Personal Banner";
  bannerImageElement.style.display = globalUserProfile.banner?.url
    ? "block"
    : "none";
  // Sets users avatar and alt text
  const profileImageElement = document.getElementById("profileImage");
  profileImageElement.src =
    globalUserProfile.avatar?.url || "/images/profileImage.jpg";
  profileImageElement.alt = globalUserProfile.avatar?.alt || "Personal Avatar";
  profileImageElement.style.display = globalUserProfile.avatar?.url
    ? "block"
    : "none";
  // Set bio text hide if empty
  const bioParagraph = document.querySelector(".bio-text");
  if (globalUserProfile.bio && globalUserProfile.bio.trim()) {
    bioParagraph.textContent = globalUserProfile.bio;
    bioParagraph.style.display = "";
  } else {
    bioParagraph.textContent = "";
    bioParagraph.style.display = "none";
  }
  // Updates counts for posts, followers, and following.
  document.getElementById("allPosts").textContent = formatCount(
    globalUserProfile._count.posts
  );
  document.getElementById("followers").textContent = formatCount(
    globalUserProfile._count.followers
  );
  document.getElementById("following").textContent = formatCount(
    globalUserProfile._count.following
  );
}

//------------------------- Update Follow/Following -------------------------//
// Toggles the follow/unfollow status of the profile based on the current button text and then performs api call --//
async function toggleFollow(userName) {
  const followButton = document.getElementById("followOrUnfollow");

  try {
    if (followButton.textContent.trim() === "Follow") {
      await followUser(userName);
      followButton.textContent = "Unfollow";
    } else {
      await unfollowUser(userName);
      followButton.textContent = "Follow";
    }
    const updatedProfile = await fetchUserProfile(userName);
    updateProfileUI(updatedProfile);
  } catch (error) {
    console.error("Error toggling follow status:", error);
    document.querySelector(".error-message").textContent =
      "Could not update follow status. Please try again.";
  }
}

//-- Updates the follow/unfollow button based on current user's follow status --//
function updateFollowButton(globalUserProfile) {
  const currentUser = localStorage.getItem("userName");
  const followButton = document.getElementById("followOrUnfollow");

  const isFollowing = globalUserProfile.followers.some(
    (follower) => follower.name === currentUser
  );
  followButton.textContent = isFollowing ? "Unfollow" : "Follow";
}

//-------------------------- Follow/Following display -------------------------//
//-- Function to display followers --//
function displayFollowers(globalUserProfile) {
  const followersList = document.getElementById("followersList");
  followersList.innerHTML = "";

  globalUserProfile.followers.forEach((follower) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item hover-background cursor-pointer";
    listItem.innerHTML = `
      <div class="d-flex align-items-center my-2">
        <img src="${follower.avatar.url}" alt="${follower.avatar.alt}" class="small-profile-image rounded-circle me-2">
        <strong>${follower.name}</strong>
      </div>
    `;
    followersList.appendChild(listItem);

    listItem.addEventListener("click", () =>
      navigateToUserProfile(follower.name)
    );
  });
}
//-- Function to display following --//
function displayFollowing(globalUserProfile) {
  const followingList = document.getElementById("followingList");
  followingList.innerHTML = "";

  globalUserProfile.following.forEach((following) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item hover-background cursor-pointer";
    listItem.innerHTML = `
      <div class="d-flex align-items-center my-2">
        <img src="${following.avatar.url}" alt="${following.avatar.alt}" class="small-profile-image rounded-circle me-2">
        <strong>${following.name}</strong>
      </div>
    `;
    followingList.appendChild(listItem);

    listItem.addEventListener("click", () =>
      navigateToUserProfile(following.name)
    );
  });
}

//-------------------------User Posts-------------------------//
//Fetches and displays posts with pagination support, and updates the global state to reflect fetching status
async function fetchAndDisplayPosts(userName) {
  if (!globalFilter.allPostsFetched) {
    try {
      const posts = await fetchPostsByUserName(
        userName,
        globalFilter.page,
        globalFilter.limit
      );
      if (posts.length < globalFilter.limit) {
        globalFilter.allPostsFetched = true;
        document.querySelector(".profile-message").textContent =
          "You've reached the end of your posts. Back to Top";
      }
      displayPosts(posts, true);
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
    }
  }
}

//-- Displays posts, appending to existing ones if 'append' is true, or clears container first--//
function displayPosts(posts, append = false) {
  console.log(posts);
  const profile = globalUserProfile;
  const postContainer = document.getElementById("postContainer");
  if (!append) postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5 cursor-pointer";

    const postMediaUrl = post.media?.url || "/images/no-image.png";
    const postMediaAlt = post.media?.alt || "Post image";
    const postDate = formatRelativeTime(
      post.created || new Date().toISOString()
    );
    const reactionsFormatted = formatCount(post._count.reactions);
    const commentsFormatted = formatCount(post._count.comments);

    // Trim title and body with imported function from trimText utility.js
    const trimmedTitle = trimText(post.title, 25);
    const trimmedBody = trimText(post.body, 50);

    postElement.innerHTML = `
        <div class="card card-container">
            <div class="card-img-top-container w-100 position-relative h-0 border-bottom">
                <img src="${postMediaUrl}" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="${postMediaAlt}">
                <div class="overlay-content position-absolute top-0 start-0 end-0 bottom-0 overflow-hidden w-100 h-100 d-flex justify-content-center align-items-center p-2">
              <div class="text-white text-center">
                  <p class="fs-5 fw-bolder">${trimmedTitle}</p>
                  <p>${trimmedBody}</p>
                  <p class="fw-bold">Read more</p>
              </div>
          </div>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center mb-2 text-truncate">
                    <img src="${
                      profile.avatar.url || "/images/defaultProfileImage.jpg"
                    }" class="small-profile-image rounded-circle me-3" alt="${
      profile.avatar?.alt || "Profile avatar"
    }">
                    <div class="d-flex flex-column">
                        <p class="mb-0 fs-6 fw-light">
                            Posted by <span class="post-user-name fw-normal">${
                              profile.name
                            }</span>
                        </p>
                        <p class="my-1 fw-light">${postDate}</p>
                        <p class="card-text fw-light">
                            <i class="fa-solid fa-heart text-primary"></i>
                            <span class="post-reactions mx-1">${reactionsFormatted}</span>
                            <span class="mx-1">|</span> <span class="post-comments mx-1">${commentsFormatted}</span> comments
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
