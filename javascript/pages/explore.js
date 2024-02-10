//------ Import --------/

//-- Api for fetch all posts--> api.js
import { fetchAllPosts } from '../modules/api.js';

//-- runs the displaypost in this DOM
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const posts = await fetchAllPosts();
        displayPosts(posts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
       
    }
});

function displayPosts(posts) {
    const postContainer = document.querySelector('#allPosts');
    postContainer.innerHTML = ''; 

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = "col-lg-4 col-sm-6 mb-5";
        
        postElement.innerHTML = `
            <div class="card">
                <div class="card-img-top-container w-100 position-relative h-0">
                    <img src="${post.media?.url || '/images/no-image.png'}" class="post-image card-img-top position-absolute w-100 h-100 top-0 start-0" alt="Post image">
                </div>
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${post.author?.avatar?.url || '/images/profileimage.jpg'}" class="post-profile-image rounded-circle me-3" alt="Profile image">
                        <div class="d-flex flex-column">
                            <p class="mb-0 fs-6 fw-light">
                                Posted by <span class="post-user-name fw-normal">${post.author?.name || 'Unknown'}</span>
                            </p>
                            <p class="card-text fw-light">
                                <i class="fa-solid fa-heart text-primary"></i>
                                <span class="mx-1">${post._count.reactions || 0}</span> | <span class="post-comments mx-1">${post._count.comments || 0}</span> comments
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        postContainer.appendChild(postElement);
    });
}
