import { safe } from 'sf-chain'

describe('sf-chain', () => {
  test('sync function', () => {
    const result = safe(10)
      .map(v => v + 10)
      .unwrap()

    expect(result).toBe(20)
  })
})
