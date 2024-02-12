//------ Import --------/

//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch spesific user info --> api.js
import { fetchUserProfile } from "../modules/api.js";
//-- Api for fetch post by spesific user --> api.js
import { fetchPostsByUserName } from "../modules/api.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Parse the username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('username');

    if (!userName) {
        console.error("User name not found in URL. Redirecting...");
        // Redirect logic here, e.g., to a default page or showing an error message
        return;
    }

    try {
        // Fetch and display user profile information for the username from URL
        const profile = await fetchUserProfile(userName);
        document.getElementById("userName").textContent = profile.name;
        const bannerImageElement = document.getElementById("bannerImage");
        bannerImageElement.src = profile.banner ? profile.banner : "/images/defaultBanner.jpg";
        document.getElementById("profileImage").src = profile.avatar ? profile.avatar : "/images/defaultAvatar.jpg";
        document.getElementById("allPosts").textContent = profile._count.posts;
        document.getElementById("followers").textContent = profile._count.followers;
        document.getElementById("following").textContent = profile._count.following;

        // Fetch and display posts made by this user
        const posts = await fetchPostsByUserName(userName);
        displayPosts(posts, profile);
    } catch (error) {
        console.error("Failed to load user profile or posts:", error);
        // Handle error, e.g., by showing an error message to the user
    }

    // Note: Remove or adapt any code related to editing profile media, as it may not apply here
});

function displayPosts(posts, profile) {
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = "";

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "col-lg-4 col-sm-6 mb-5";
        postElement.innerHTML = `
            <div class="card">
                <div class="card-img-top-container w-100 position-relative h-0">
                    <img src="${post.media}" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="Post image">
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${profile.avatar || "/images/defaultAvatar.jpg"}" class="post-profile-image rounded-circle me-3" alt="Profile image">
                        <div class="d-flex flex-column">
                            <p class="mb-0 fs-6 fw-light">Posted by <span class="post-user-name fw-normal">${profile.name}</span></p>
                            <p class="card-text fw-light"><i class="fa-solid fa-heart text-primary"></i> <span class="mx-2">|</span> <span class="post-likes mx-1">${post._count.comments || 0}</span> comments</p>
                        </div>
                    </div>
                </div>
            </div>`;
        postContainer.appendChild(postElement);
    });
}