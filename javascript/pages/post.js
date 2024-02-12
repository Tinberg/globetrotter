//-- Redirect function --> auth.js --//
import { checkAuthAndRedirect } from "../modules/auth.js";
checkAuthAndRedirect();
//-- Api for fetch single post with comments reactions and author --> api.js
import { fetchSinglePost } from "../modules/api.js";


async function loadPostData() {
    // Get post id from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        console.error("Post ID not found.");
        return;
    }

    try {
        const postData = await fetchSinglePost(postId);
        displayPostDetails(postData);
    } catch (error) {
        console.error("Error fetching post details:", error);
        // Optionally, show an error message to the user
    }
}

function displayPostDetails(postData) {
    document.querySelector('.post-title').textContent = postData.title;
    document.querySelector('.post-body').textContent = postData.body;
    document.querySelector('.reactions-count').textContent = postData._count.reactions;
    document.querySelector('.comments-count').textContent = postData._count.comments;

    // Set image source to post's media URL if available, otherwise to a default image and alt text
    const postImageElement = document.querySelector('.post-image');
    if (postData.media && postData.media.url) {
        postImageElement.src = postData.media.url;
        postImageElement.alt = postData.media.alt || 'Post image';
        postImageElement.style.display = ''; 
    } else {
        // Default img and alt if no image is present
        postImageElement.src = '/images/no-image.png'; 
        postImageElement.alt = 'Post image';
    }

    // Display author information
    document.querySelector('.profile-name').textContent = postData.author.name;
    document.querySelector('.post-profile-image').src = postData.author.avatar.url;

    // Display comments
    const commentsContainer = document.querySelector('.comments-container');
    postData._comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.textContent = comment.body; // Simplified, adjust based on actual comment structure
        commentsContainer.appendChild(commentElement);
    });

}

// Call loadPostData when the page is loaded
document.addEventListener("DOMContentLoaded", loadPostData);
