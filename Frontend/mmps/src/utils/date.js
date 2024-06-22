// src/utils/date.js

/**
 * Formats a date string to a more readable format.
 * @param {string} dateString - The date string to format.
 * @param {Object} [options] - Optional formatting options.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateString, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, options)
}
