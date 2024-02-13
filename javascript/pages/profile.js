//------ Import --------/

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch spesific user info --> api.js
import { fetchUserProfile } from "../modules/api.js";
//-- Api for fetch post by spesific user --> api.js
import { fetchPostsByUserName } from "../modules/api.js";
//-- For formatting reaction and comment numbers to fit the layout --> utility.js --//
import { formatCount, formatWithSuffix } from "../modules/utility.js";

//-- Display profile info
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");

  if (!userName) {
    console.error("User name not found in URL. Redirecting...");
    return;
  }

  try {
    // Fetch and display user profile information for the username from URL
    const profile = await fetchUserProfile(userName);
    document.getElementById("userName").textContent = profile.name;
    // Handle banner image
    const bannerImageElement = document.getElementById("bannerImage");
    if (profile.banner && profile.banner.url) {
      bannerImageElement.src = profile.banner.url;
      bannerImageElement.alt = profile.banner.alt || "Personal Banner";
    } else {
        bannerImageElement.style.display = "none";
    }
    // Handle profile image
    const profileImageElement = document.getElementById("profileImage");
    if (profile.avatar && profile.avatar.url) {
      profileImageElement.src = profile.avatar.url;
      profileImageElement.alt = profile.avatar.alt || "Personal Avatar";
    } else {
        profileImageElement.style.display = "none";
    }
    //Set postCount followers and following 
    document.getElementById("allPosts").textContent = profile._count.posts;
    document.getElementById("followers").textContent = profile._count.followers;
    document.getElementById("following").textContent = profile._count.following;

    // Calls the fetch post by username function
    const posts = await fetchPostsByUserName(userName);
    displayPosts(posts, profile);
  } catch (error) {
    console.error("Failed to load user profile or posts:", error);
    
  }

});
//-- Display Posts from the profile user
function displayPosts(posts, profile) {
  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "col-lg-4 col-sm-6 mb-5";
    postElement.style.cursor = "pointer";

    const postMediaUrl = post.media?.url || "/images/no-image.png";
    const postMediaAlt = post.media?.alt || "Post image";
    const reactionsFormatted = formatCount(post._count.reactions || 0);
    const commentsFormatted = formatCount(post._count.comments || 0);

    postElement.innerHTML = `
        <div class="card">
            <div class="card-img-top-container w-100 position-relative h-0">
                <img src="${postMediaUrl}" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="${postMediaAlt}">
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center mb-3 text-truncate">
                    <img src="${
                      profile.avatar.url || "/images/defaultProfileImage.jpg"
                    }" class="post-profile-image rounded-circle me-3" alt="${
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
