import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email({ message: 'Invalid email format' }),
  name: z.string().min(1, { message: 'Name must not be empty' }),
})

type User = z.infer<typeof UserSchema>

describe('zod UserSchema', () => {
  it('should validate a valid user object', () => {
    const validUser: User = { id: 1, email: 'alice@example.com', name: 'Alice' }
    expect(() => UserSchema.parse(validUser)).not.toThrow()
  })

  it('should throw an error for an invalid user object', () => {
    const invalidUser = { id: 'not a number', email: 'invalid-email', name: '' }
    expect(() => UserSchema.parse(invalidUser)).toThrow()
  })

  it('should provide custom error messages for invalid inputs', () => {
    try {
      UserSchema.parse({ id: 1, email: 'notanemail', name: '' })
    } catch (error: any) {
      const issues = error.issues
      const emailIssue = issues.find((issue: any) => issue.path.includes('email'))
      const nameIssue = issues.find((issue: any) => issue.path.includes('name'))
      expect(emailIssue?.message).toBe('Invalid email format')
      expect(nameIssue?.message).toBe('Name must not be empty')
    }
  })
})
