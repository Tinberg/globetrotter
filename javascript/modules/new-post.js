import { createPost } from '../modules/api.js';

document.getElementById('newPostForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('postTitle').value;
  const body = document.getElementById('postCaption').value;
  const media = document.querySelector('#newPostForm [type="text"]').value; // Ensure this selector matches your image URL input.
  const tags = [document.getElementById('continentSelect').value]; // Wrap the continent in an array for tags.

  try {
    const postData = { title, body, tags, media };
    const result = await createPost(postData);
    console.log('Post created successfully:', result);
    // Handle success (e.g., clear the form, show a success message)
  } catch (error) {
    console.error('Failed to create post:', error);
    // Handle error (e.g., show an error message)
  }
});