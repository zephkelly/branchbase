import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  sanitizeEmail,
  isValidLength,
  truncateInput,
  stripHtmlTags,
  escapeHtml
} from '@@/utils/inputSanitisation'

describe('String Utility Functions', () => {
    describe('isValidEmail', () => {
        it('should return true for valid email addresses', () => {
            expect(isValidEmail('test@example.com')).toBe(true)
            expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true)
        })

        it('should return false for invalid email addresses', () => {
            expect(isValidEmail('invalid-email')).toBe(false)
            expect(isValidEmail('missing@tld')).toBe(false)
            expect(isValidEmail('@missingusername.com')).toBe(false)
        })
    })

    describe('sanitiseEmail', () => {
        it('should trim whitespace and convert to lowercase', () => {
            expect(sanitizeEmail(' Test@Example.com ')).toBe('test@example.com')
            expect(sanitizeEmail('USER@DOMAIN.COM')).toBe('user@domain.com')
        })
    })

    describe('isValidLength', () => {
        it('should return true for strings within the specified length range', () => {
            expect(isValidLength('test', 3, 5)).toBe(true)
            expect(isValidLength('  hello  ', 1, 10)).toBe(true)
        })

        it('should return false for strings outside the specified length range', () => {
            expect(isValidLength('too long', 1, 5)).toBe(false)
            expect(isValidLength('short', 10, 20)).toBe(false)
        })
    })

    describe('truncateInput', () => {
        it('should truncate strings longer than the specified length', () => {
            expect(truncateInput('This is a long string', 10)).toBe('This is a ')
        })

        it('should not modify strings shorter than or equal to the specified length', () => {
            expect(truncateInput('Short', 10)).toBe('Short')
        })

        it('should trim the input before truncating', () => {
            expect(truncateInput('  Padded  ', 6)).toBe('Padded')
        })
    })

    describe('stripHtmlTags', () => {
        it('should remove HTML tags from the input string', () => {
            expect(stripHtmlTags('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
            expect(stripHtmlTags('No tags here')).toBe('No tags here')
        })
    })

    describe('escapeHtml', () => {
        it('should escape special characters', () => {
            expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;')
            expect(escapeHtml('&<>"\'\`=/')).toBe('&amp;&lt;&gt;&quot;&#39;&#x60;&#x3D;&#x2F;')
          })

        it('should not modify strings without special characters', () => {
            expect(escapeHtml('Normal text')).toBe('Normal text')
        })
    })
})