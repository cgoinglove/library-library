import dayjs from 'dayjs'

describe('dayjs', () => {
  it('should format a date correctly', () => {
    const date = dayjs(new Date(2023, 0, 1))
    const formatted = date.format('YYYY-MM-DD')
    expect(formatted).toBe('2023-01-01')
  })

  it('should add days correctly', () => {
    const date = dayjs(new Date(2023, 0, 1))
    const newDate = date.add(5, 'day')
    const formatted = newDate.format('YYYY-MM-DD')
    expect(formatted).toBe('2023-01-06')
  })
})
