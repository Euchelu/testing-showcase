'use strict'

/**
 * Form validation utilities.
 * Pure functions — no side effects, easy to test.
 */

/**
 * Validates an email address format.
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  const trimmed = email.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email cannot be empty' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' }
  }
  return { valid: true }
}

/**
 * Validates password strength.
 * Rules: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.
 * @param {string} password
 * @returns {{ valid: boolean, strength: 'weak'|'medium'|'strong', errors: string[] }}
 */
function validatePassword(password) {
  const errors = []

  if (!password || typeof password !== 'string') {
    return { valid: false, strength: 'weak', errors: ['Password is required'] }
  }

  if (password.length < 8)          errors.push('Minimum 8 characters')
  if (!/[A-Z]/.test(password))      errors.push('At least one uppercase letter')
  if (!/[a-z]/.test(password))      errors.push('At least one lowercase letter')
  if (!/[0-9]/.test(password))      errors.push('At least one digit')
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('At least one special character')

  if (errors.length > 0) {
    return { valid: false, strength: 'weak', errors }
  }

  const strength = password.length >= 16 ? 'strong' : 'medium'
  return { valid: true, strength, errors: [] }
}

/**
 * Validates a Spanish phone number.
 * Accepts: +34 prefix (optional), 9 digits starting with 6, 7, 8 or 9.
 * @param {string} phone
 * @returns {{ valid: boolean, normalized?: string, error?: string }}
 */
function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone is required' }
  }

  const cleaned = phone.replace(/[\s\-().]/g, '')
  const spanishPhone = /^(\+34)?([6789]\d{8})$/
  const match = cleaned.match(spanishPhone)

  if (!match) {
    return { valid: false, error: 'Invalid Spanish phone number' }
  }

  return { valid: true, normalized: `+34${match[2]}` }
}

/**
 * Validates a complete registration form.
 * @param {{ email: string, password: string, phone: string }} form
 * @returns {{ valid: boolean, fields: object }}
 */
function validateRegistrationForm(form) {
  const fields = {
    email:    validateEmail(form?.email),
    password: validatePassword(form?.password),
    phone:    validatePhone(form?.phone),
  }

  const valid = Object.values(fields).every(f => f.valid)
  return { valid, fields }
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRegistrationForm,
}
