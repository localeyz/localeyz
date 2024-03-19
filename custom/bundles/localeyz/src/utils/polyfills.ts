import crypto from 'crypto'

// Polyfill for the global crypto object if not already defined
if (typeof global.crypto !== 'object') {
  global.crypto = crypto
}

// Polyfill for the getRandomValues function if not already defined
if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = getRandomValues
}

/**
 * Polyfill implementation for the getRandomValues function using Node.js crypto module.
 * @param {Uint32Array} array - The array to fill with random values.
 * @returns {Uint32Array} - The array filled with random values.
 */
function getRandomValues(array) {
  // Use Node.js crypto module to generate random values
  return crypto.webcrypto.getRandomValues(array)
}
