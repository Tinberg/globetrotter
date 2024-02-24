//------ Import --------/

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch spesific user info --> api.js
import { fetchUserProfile } from "../modules/api.js";
//-- Api for fetch post by spesific user --> api.js
import { fetchPostsByUserName } from "../modules/api.js";
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
    const profile = await fetchUserProfile(userName);
    displayFollowers(profile);
    displayFollowing(profile);
    updateProfileUI(profile);
    updateFollowButton(profile);

    const posts = await fetchPostsByUserName(userName);
    displayPosts(posts, profile);
    //Event listener for follow/unfollow.
    document
      .getElementById("followOrUnfollow")
      .addEventListener("click", () => toggleFollow(userName));
  } catch (error) {
    console.error("Failed to load user profile or posts:", error);
  }
});

//-- Updates the UI with user profile information --//
function updateProfileUI(profile) {
  // Sets users name
  document.getElementById("userName").textContent = profile.name;
  // Sets users banner and alt text
  const bannerImageElement = document.getElementById("bannerImage");
  bannerImageElement.src = profile.banner?.url || "path/to/default/banner.jpg";
  bannerImageElement.alt = profile.banner?.alt || "Personal Banner";
  bannerImageElement.style.display = profile.banner?.url ? "block" : "none";
  // Sets users avatar and alt text
  const profileImageElement = document.getElementById("profileImage");
  profileImageElement.src = profile.avatar?.url || "path/to/default/avatar.jpg";
  profileImageElement.alt = profile.avatar?.alt || "Personal Avatar";
  profileImageElement.style.display = profile.avatar?.url ? "block" : "none";
  // Updates counts for posts, followers, and following.
  document.getElementById("allPosts").textContent = formatCount(
    profile._count.posts
  );
  document.getElementById("followers").textContent = formatCount(
    profile._count.followers
  );
  document.getElementById("following").textContent = formatCount(
    profile._count.following
  );
}

//-- Display Posts from the profile user --//
function displayPosts(posts, profile) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5 cursor-pointer";

    const postMediaUrl = post.media?.url || "/images/no-image.png";
    const postMediaAlt = post.media?.alt || "Post image";
    const reactionsFormatted = formatCount(post._count.reactions || 0);
    const commentsFormatted = formatCount(post._count.comments || 0);

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
                <div class="d-flex align-items-center mb-3 text-truncate">
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
                        <p class="card-text fw-light">
                            <i class="fa-solid fa-heart text-primary"></i>
                            <span class="post-reactions mx-1">${reactionsFormatted}</span>
                            | <span class="post-comments mx-1">${commentsFormatted}</span> comments
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

//-- Follow/Following button --//
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
  }
}

//-- Updates the follow/unfollow button based on current user's follow status --//
function updateFollowButton(profile) {
  const currentUser = localStorage.getItem("userName");
  const followButton = document.getElementById("followOrUnfollow");

  const isFollowing = profile.followers.some(
    (follower) => follower.name === currentUser
  );
  followButton.textContent = isFollowing ? "Unfollow" : "Follow";
}

//-- Follow/Following display --//
//-- Function to display followers --//
function displayFollowers(profile) {
  const followersList = document.getElementById("followersList");
  followersList.innerHTML = "";

  profile.followers.forEach((follower) => {
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
function displayFollowing(profile) {
  const followingList = document.getElementById("followingList");
  followingList.innerHTML = "";

  profile.following.forEach((following) => {
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
