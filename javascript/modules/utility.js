//------ Export --------/

//-- For showing 1k 1m and 1b on number of reations and comments --> Explore.js
export { formatCount, formatWithSuffix };
//-- For shorten the text on overlay text for posts --> explore.js, home.js, profile.js, and my-profile.js
export { trimText };
//-- For redirect to right profile page --> post.js and profile.js
export { navigateToUserProfile };

//------ Format number function for comments and reactions to fit the layout --------/

/**
 * Formats a number into a readable string(For the layout) with a suffix ('K', 'M', 'B') based on its value.
 * For values under 1,000, it returns the number as a string.
 * For values 1,000 and above, it adds the right suffix.
 *
 * @param {number} number
 * @returns {string}
 */
function formatCount(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return formatWithSuffix(number, 1000, "K");
  } else if (number < 1000000000) {
    return formatWithSuffix(number, 1000000, "M");
  } else {
    return formatWithSuffix(number, 1000000000, "B");
  }
}

/**
 * Helper function to format a number with a specified divisor and suffix.
 * It formats the number to one decimal place if not a whole number after division, unless it's an integer.
 *
 * @param {number} number
 * @param {number} divisor
 * @param {string} suffix
 * @returns {string}
 */
function formatWithSuffix(number, divisor, suffix) {
  const quotient = number / divisor;
  return (
    (quotient % 1 === 0 ? quotient.toString() : quotient.toFixed(1)) + suffix
  );
}

//------ Trim text on overlay for posts to fit layout --------/

/**
 * Function to trim text to show only the first maxChars characters followed by '...' in post body overylay
 * @param {string} text
 * @param {number} maxChars
 * @returns {string} Trimmed text
 */
function trimText(text, maxChars) {
  if (!text || text.length > maxChars) {
    return (
      (text || "").substring(0, maxChars) +
      (text && text.length > maxChars ? "..." : "")
    );
  }
  return text;
}
/**
 * Function when authorname or avatar is clicked directs to my-profile.html for the logged in user's own post, else directs to profile.html for other users' posts
 * @param {string} userName
 */
//-------------------------Redirect-------------------------//

function navigateToUserProfile(userName) {
  const currentUser = localStorage.getItem("userName");
  const profileUrl =
    userName === currentUser
      ? "my-profile.html"
      : `profile.html?username=${encodeURIComponent(userName)}`;
  window.location.href = profileUrl;
}
