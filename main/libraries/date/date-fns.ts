import { addDays, format } from 'date-fns'
import { addDays as fpAddDays, format as fpFormat } from 'date-fns/fp'
import { describe, it, expect } from 'vitest'

describe('date-fns', () => {
  it('should format a date correctly', () => {
    const date = new Date(2023, 0, 1) // January 1, 2023
    const formatted = format(date, 'yyyy-MM-dd')
    expect(formatted).toBe('2023-01-01')
  })

  it('should add days correctly', () => {
    const date = new Date(2023, 0, 1)
    const newDate = addDays(date, 5)
    const formatted = format(newDate, 'yyyy-MM-dd')
    expect(formatted).toBe('2023-01-06')
  })

  it('should add days and format date correctly using fp functions', () => {
    const add5Days = fpAddDays(5)
    const formatDate = fpFormat('yyyy-MM-dd')
    const result = formatDate(add5Days(new Date(2023, 0, 1)))
    expect(result).toBe('2023-01-06')
  })
})
