//------ Import --------/

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch spesific user info --> api.js
import { fetchUserProfile } from "../modules/api.js";
//-- Api for fetch post by spesific user --> api.js
import { fetchPostsByUserName } from "../modules/api.js";
//-- Api for fetch edit profile media --> api.js
import { updateProfileMedia } from "../modules/api.js";
//-- Trim the text for overlay text title and body text for post --> utility.js --//
import { trimText } from "../modules/utility.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";
//-- format date as relative time or DD/MM/YYYY
import { formatRelativeTime } from "../modules/utility.js";

//-------------------------User Info-------------------------//
//-- For Displaying user info and posts, changing profile media, and it also calls the display post function--//
document.addEventListener("DOMContentLoaded", async () => {
  const userName = localStorage.getItem("userName");
  if (userName) {
    try {
      // Fetch and display user profile information
      const profile = await fetchUserProfile(userName);
      //Display Followers and following - functions for this Line: 110 and 133
      displayFollowers(profile);
      displayFollowing(profile);
      document.getElementById("userName").textContent = profile.name;
      // Banner Image
      const bannerImageElement = document.getElementById("bannerImage");
      if (profile.banner) {
        bannerImageElement.src = profile.banner.url;
        bannerImageElement.alt = profile.banner?.alt || "Personal Banner";
        bannerImageElement.style.display = "";
      } else {
        bannerImageElement.style.display = "none";
      }
      // Avatar Image
      const avatarImageElement = document.getElementById("profileImage");
      avatarImageElement.src = profile.avatar?.url || "/images/profileImage.jpg";
      avatarImageElement.alt = profile.avatar?.alt || "Personal Avatar";
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
      // Fetch and display posts made by the user and avatar and userName from profile
      const posts = await fetchPostsByUserName(userName);
      displayPosts(posts, profile);
    } catch (error) {
      console.error("Failed to load profile information or posts:", error);
      document.querySelector(".user-info-error").textContent =
        "Failed to load profile information. Please try again later.";
    }
  } else {
    console.error("User name not found. Redirecting to login page.");
  }

  //-- Fetch the profile media for changing banner and avatar --//
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const errorFeedback = document.getElementById("profileEditError");

      const resetBanner = document.getElementById(
        "resetBannerCheckbox"
      ).checked;
      const resetAvatar = document.getElementById(
        "resetAvatarCheckbox"
      ).checked;

      let bannerUrl = resetBanner
        ? undefined
        : document.getElementById("bannerImageInput").value || undefined;
      let avatarUrl = resetAvatar
        ? undefined
        : document.getElementById("profileImageInput").value || undefined;
      if (
        !resetBanner &&
        !resetAvatar &&
        bannerUrl === undefined &&
        avatarUrl === undefined
      ) {
        errorFeedback.textContent =
          "Profile unchanged, no new updates submitted";
        errorFeedback.style.display = "block";
        return;
      }
      try {
        await updateProfileMedia(
          userName,
          bannerUrl,
          avatarUrl,
          resetBanner,
          resetAvatar
        );
        window.location.reload();
      } catch (error) {
        console.error("Error updating profile media:", error);
        errorFeedback.textContent =
          "Failed to update profile media. Please check your inputs and try again.";
        errorFeedback.style.display = "block";
      }
    });
});
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

    listItem.addEventListener("click", () => {
      window.location.href = `profile.html?username=${encodeURIComponent(
        follower.name
      )}`;
    });
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

    listItem.addEventListener("click", () => {
      window.location.href = `profile.html?username=${encodeURIComponent(
        following.name
      )}`;
    });
  });
}

//-------------------------User Posts-------------------------//
/**
 *
 * @param {Array} posts
 */
//-- For display users posts. Function called in DOMContentLoaded!--//
function displayPosts(posts, profile) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5 cursor-pointer";

    const postMediaUrl = post.media?.url || "/images/no-image.png";
    const postMediaAlt = post.media?.alt || "Post image";
    const postDate = formatRelativeTime(
      post.created || new Date().toISOString()
    );
    const reactionsFormatted = formatCount(post._count.reactions || 0);
    const commentsFormatted = formatCount(post._count.comments || 0);

    // Trim title and body with imported function from trimText utility.js
    const trimmedTitle = trimText(post.title, 25);
    const trimmedBody = trimText(post.body, 50);

    postElement.innerHTML = `
      <div class="card card-container">
          <div class="card-img-top-container w-100 position-relative h-0 border-bottom">
              <img src="${postMediaUrl}" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="${postMediaAlt}"><div class="overlay-content position-absolute top-0 start-0 end-0 bottom-0 overflow-hidden w-100 h-100 d-flex justify-content-center align-items-center p-2">
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
                          <span class="mx-1">|</span>
                          <span class="post-comments mx-1">${commentsFormatted}</span> comments
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
