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


//-- For Displaying user info and posts, changing profile media, and it also calls the display post function--//
document.addEventListener("DOMContentLoaded", async () => {
  const userName = localStorage.getItem("userName");
  if (userName) {
    try {
      // Fetch and display user profile information
      const profile = await fetchUserProfile(userName);
      document.getElementById("userName").textContent = profile.name;
      const bannerImageElement = document.getElementById("bannerImage");
      if (profile.banner) {
        bannerImageElement.src = profile.banner;
        bannerImageElement.style.display = "";
      } else {
        bannerImageElement.style.display = "none";
      }
      document.getElementById("profileImage").src =
        profile.avatar || "/images/profileImage.jpg";
      document.getElementById("allPosts").textContent = profile._count.posts;
      document.getElementById("followers").textContent =
        profile._count.followers;
      document.getElementById("following").textContent =
        profile._count.following;

      // Fetch and display posts made by the user
      const posts = await fetchPostsByUserName(userName);
      displayPosts(posts);
    } catch (error) {
      console.error("Failed to load profile information or posts:", error);
    }
  } else {
    console.error("User name not found. Redirecting to login page.");
  }
  //Fetch the profile media for changing banner and avatar
  document
    .getElementById("editProfileForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const resetBanner = document.getElementById(
        "resetBannerCheckbox"
      ).checked;
      const resetAvatar = document.getElementById(
        "resetAvatarCheckbox"
      ).checked;

      const currentProfile = await fetchUserProfile(userName);

      let bannerUrl = resetBanner
        ? null
        : document.getElementById("bannerImageInput").value;
      let avatarUrl = resetAvatar
        ? null
        : document.getElementById("profileImageInput").value;

      bannerUrl = bannerUrl || (resetBanner ? null : currentProfile.banner);
      avatarUrl = avatarUrl || (resetAvatar ? null : currentProfile.avatar);

      try {
        await updateProfileMedia(userName, bannerUrl, avatarUrl);
        alert("Profile media updated successfully.");
        window.location.reload();
      } catch (error) {
        console.error("Error updating profile media:", error);
        alert("Failed to update profile media. Please try again.");
      }
    });
});

/**
 * 
 * @param {Array} posts 
 */
//-- For display users posts function called in DOMContentLoaded!--//
function displayPosts(posts) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5";
    postElement.innerHTML = `
    <div class="card">
        <div class="card-img-top-container w-100 position-relative h-0">
            <img src="${post.media}" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="Post image">
        </div>
        <div class="card-body">
            <div class="d-flex align-items-center mb-3">
                <img src="${post.author.avatar}" class="post-profile-image rounded-circle me-3" alt="Profile image">
                <div class="d-flex flex-column">
                    <p class="mb-0 fs-6 fw-light">
                        Posted by <span class="post-user-name fw-normal">${post.author.name}</span>
                    </p>
                    <p class="card-text fw-light">
                        <i class="fa-solid fa-heart text-primary"></i>
                        <span class="post-likes mx-1"><i class="fa-solid fa-heart text-primary"></i></span>|<span class="post-comments mx-1">${post._count.comments}</span> comments
                    </p>
                </div>
            </div>
        </div>

      `;
    postContainer.appendChild(postElement);
  });
}


//Try this in profile.js

// document.addEventListener("DOMContentLoaded", async () => {
//     // Attempt to get a username from the URL parameters
//     const urlParams = new URLSearchParams(window.location.search);
//     const userNameFromURL = urlParams.get('username');
  
//     // Fallback to the logged-in user's username if no URL parameter is provided
//     const userName = userNameFromURL || localStorage.getItem("userName");
  
//     if (userName) {
//       // Existing code to fetch and display the profile and posts...
//     } else {
//       console.error("User name not found. Redirecting to login page.");
//       // Redirect logic here...
//     }
//   });