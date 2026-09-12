import { describe, expect, test } from 'bun:test'
import { getDealerForRound, getNextRoundNumber } from './helpers'

const players = (names, inactive = []) => names.map((name, index) => ({
  id: `id${index}`,
  name,
  active: !inactive.includes(name),
}))

const rotation = (seats, rounds = 8) => Array.from(
  { length: rounds },
  (_, index) => getDealerForRound(seats, index + 1)?.name
)

describe('getDealerForRound', () => {
  test('rotates through active players by round number', () => {
    expect(rotation(players(['A', 'B', 'C']))).toEqual(['A', 'B', 'C', 'A', 'B', 'C', 'A', 'B'])
    expect(rotation(players(['A', 'B', 'C', 'D']))).toEqual(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'])
    expect(rotation(players(['A', 'B', 'C', 'D', 'E']))).toEqual(['A', 'B', 'C', 'D', 'E', 'A', 'B', 'C'])
  })

  test('keeps a dealer when the round is a multiple of the player count', () => {
    const three = players(['A', 'B', 'C'])
    const four = players(['A', 'B', 'C', 'D'])

    expect(getDealerForRound(three, 3)?.name).toBe('C')
    expect(getDealerForRound(three, 6)?.name).toBe('C')
    expect(getDealerForRound(four, 4)?.name).toBe('D')
    expect(getDealerForRound(four, 8)?.name).toBe('D')
  })

  test('rotates among remaining active players', () => {
    const seats = players(['A', 'B', 'C', 'D'], ['C'])

    expect(rotation(seats)).toEqual(['A', 'B', 'D', 'A', 'B', 'D', 'A', 'B'])
  })

  test('falls back to the first active player for invalid rounds', () => {
    const seats = players(['A', 'B', 'C'])

    expect(getDealerForRound([], 1)).toBeNull()
    expect(getDealerForRound(seats, NaN)?.name).toBe('A')
    expect(getDealerForRound(seats, 0)?.name).toBe('A')
    expect(getDealerForRound(seats, 1.5)?.name).toBe('A')
  })
})

describe('getNextRoundNumber', () => {
  test('returns the next unskipped round', () => {
    expect(getNextRoundNumber(1, 8, [])).toBe(1)
    expect(getNextRoundNumber(2, 8, [2, 3])).toBe(4)
    expect(getNextRoundNumber(8, 8, [])).toBe(8)
  })

  test('returns null when nothing remains', () => {
    expect(getNextRoundNumber(9, 8, [])).toBeNull()
    expect(getNextRoundNumber(1, 8, [1, 2, 3, 4, 5, 6, 7, 8])).toBeNull()
  })
})
