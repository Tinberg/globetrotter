//------ Export --------/

//-- For showing 1k 1m and 1b on number of reations and comments --> Explore.js
export { formatCount, formatWithSuffix };

//------ Format number function for comments and reactions to fit the layout --------/

//-- Function below is for reaction and comments number --//
/**
 * Formats a number into a readable string(For the layout) with a suffix ('K', 'M', 'B') based on its value.
 * For values under 1,000, it returns the number as a string.
 * For values 1,000 and above, it adds the appropriate suffix.
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


//------  --------/