//------ Export --------/

//-- For redirect to right profile page --> post.js and profile.js
export { navigateToUserProfile }; //---------------------------------------------------------------------------------------------------------> Line: 18
//-- For showing 1k 1m and 1b on number of reations and comments --> Explore.js
export { formatCount, formatWithSuffix }; //-------------------------------------------------------------------------------------------------> Line: 32 and 52
//-- For shorten the text on overlay text for posts --> explore.js, home.js, profile.js, and my-profile.js
export { trimText }; //----------------------------------------------------------------------------------------------------------------------> Line: 69
//-- Function to show date as relative time or DD/MM/YYYY --> All pages with posts
export { formatRelativeTime }; //------------------------------------------------------------------------------------------------------------> Line: 85
//-- For removing error message and element after a duration -->
export { clearElementAfterDuration }; //-----------------------------------------------------------------------------------------------------> Line: 110
//-- For reaction number count only display one pr user reguardless of how many emojis(times) they have reacted --> All pages with posts
export { uniqueReactorsCount }; //-----------------------------------------------------------------------------------------------------------> Line: 124

//-------------------------Redirect-------------------------//
/**
 * Function when authorname or avatar is clicked directs to my-profile.html for the logged in user's own post, else directs to profile.html for other users' posts
 * @param {string} userName
 */
function navigateToUserProfile(userName) {
  const currentUser = localStorage.getItem("userName");
  const profileUrl =
    userName === currentUser
      ? "my-profile.html"
      : `profile.html?username=${encodeURIComponent(userName)}`;
  window.location.href = profileUrl;
}

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
//------ formatRealtiveTime to make dates more readable and fit layout--------/
/**
 *  Formats a given date string as a relative time up to 6 days ago ("1 minute ago", "1 hour ago", "1 day ago"), and as a date in DD/MM/YYYY format for older dates
 * @param {string}
 * @returns {string}
 */
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.round((now - date) / 1000);
  const minutesAgo = Math.round(secondsAgo / 60);
  const hoursAgo = Math.round(minutesAgo / 60);
  const daysAgo = Math.round(hoursAgo / 24);

  if (daysAgo < 1) {
    if (hoursAgo < 1) {
      return minutesAgo === 1 ? "1 minute ago" : `${minutesAgo} minutes ago`;
    }
    return hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`;
  } else if (daysAgo < 7) {
    return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
  } else {
    return date.toLocaleDateString("en-GB");
  }
}
//------ clears a error message after a short duration --------/
/**
 * Clears the text content of the given element after a specified duration.
 *
 * @param {HTMLElement}
 * @param {number}
 */
function clearElementAfterDuration(element, duration = 7000) {
  setTimeout(() => {
    if (element && element.remove) {
      element.remove();
    }
  }, duration);
}
//------ unique reaction count to make the website look better regardless of all the students that use the api --------/
/**
 * This function counts the total number of unique users who reacted to a post.regardless of how many emojis(reactions)they have made to the post
 * @param {array} reactions
 * @returns {number}
 */
function uniqueReactorsCount(reactions) {
  const uniqueReactors = new Set();
  reactions.forEach((reaction) => {
    reaction.reactors.forEach((reactor) => {
      uniqueReactors.add(reactor);
    });
  });
  return uniqueReactors.size;
}
