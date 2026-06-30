'use strict'

const {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRegistrationForm,
} = require('../src/validator')

// ── validateEmail ─────────────────────────────────────────────────────────────

describe('validateEmail', () => {
  test.each([
    ['user@example.com',    true],
    ['jose.angel@gmail.com', true],
    ['user+tag@domain.org', true],
  ])('accepts valid email: %s', (email, expected) => {
    expect(validateEmail(email).valid).toBe(expected)
  })

  test.each([
    ['not-an-email'],
    ['missing@domain'],
    ['@nodomain.com'],
    ['spaces @email.com'],
    [''],
    [null],
    [undefined],
  ])('rejects invalid email: %s', (email) => {
    const result = validateEmail(email)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  test('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ').valid).toBe(true)
  })
})

// ── validatePassword ──────────────────────────────────────────────────────────

describe('validatePassword', () => {
  test('accepts a strong password', () => {
    const result = validatePassword('SecurePass1!')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('classifies short-but-valid password as medium strength', () => {
    const result = validatePassword('Secure1!')
    expect(result.valid).toBe(true)
    expect(result.strength).toBe('medium')
  })

  test('classifies long password as strong', () => {
    const result = validatePassword('VerySecurePassword1!')
    expect(result.valid).toBe(true)
    expect(result.strength).toBe('strong')
  })

  test('rejects password shorter than 8 chars', () => {
    const result = validatePassword('Abc1!')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Minimum 8 characters')
  })

  test('rejects password without uppercase', () => {
    const result = validatePassword('lowercase1!')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least one uppercase letter')
  })

  test('rejects password without digit', () => {
    const result = validatePassword('NoDigits!')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least one digit')
  })

  test('rejects password without special character', () => {
    const result = validatePassword('NoSpecial1')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least one special character')
  })

  test('returns multiple errors for very weak password', () => {
    const result = validatePassword('abc')
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })

  test('rejects null password', () => {
    expect(validatePassword(null).valid).toBe(false)
  })
})

// ── validatePhone ─────────────────────────────────────────────────────────────

describe('validatePhone', () => {
  test.each([
    ['612345678'],
    ['712345678'],
    ['+34612345678'],
    ['612 345 678'],
    ['612-345-678'],
  ])('accepts valid Spanish phone: %s', (phone) => {
    expect(validatePhone(phone).valid).toBe(true)
  })

  test('normalizes phone to +34 format', () => {
    expect(validatePhone('612345678').normalized).toBe('+34612345678')
    expect(validatePhone('+34612345678').normalized).toBe('+34612345678')
  })

  test.each([
    ['123456789'],   // starts with 1 — invalid
    ['12345'],       // too short
    [''],
    [null],
  ])('rejects invalid phone: %s', (phone) => {
    const result = validatePhone(phone)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })
})

// ── validateRegistrationForm ──────────────────────────────────────────────────

describe('validateRegistrationForm', () => {
  const validForm = {
    email:    'jose@example.com',
    password: 'SecurePass1!',
    phone:    '612345678',
  }

  test('accepts a valid complete form', () => {
    const result = validateRegistrationForm(validForm)
    expect(result.valid).toBe(true)
    expect(result.fields.email.valid).toBe(true)
    expect(result.fields.password.valid).toBe(true)
    expect(result.fields.phone.valid).toBe(true)
  })

  test('rejects form with invalid email', () => {
    const result = validateRegistrationForm({ ...validForm, email: 'bad-email' })
    expect(result.valid).toBe(false)
    expect(result.fields.email.valid).toBe(false)
  })

  test('rejects form with weak password', () => {
    const result = validateRegistrationForm({ ...validForm, password: '1234' })
    expect(result.valid).toBe(false)
    expect(result.fields.password.valid).toBe(false)
  })

  test('rejects null form gracefully', () => {
    const result = validateRegistrationForm(null)
    expect(result.valid).toBe(false)
  })
})
