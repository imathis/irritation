import { describe, expect, test } from 'bun:test'
import { dealForRound } from './roundRules'

describe('dealForRound', () => {
  test('uses the 8-round contract schedule', () => {
    expect(dealForRound(1)).toEqual({ deal: 7, books: 2, runs: 0 })
    expect(dealForRound(2)).toEqual({ deal: 8, books: 1, runs: 1 })
    expect(dealForRound(3)).toEqual({ deal: 9, books: 0, runs: 2 })
    expect(dealForRound(4)).toEqual({ deal: 10, books: 3, runs: 0 })
    expect(dealForRound(5)).toEqual({ deal: 11, books: 2, runs: 1 })
    expect(dealForRound(6)).toEqual({ deal: 12, books: 1, runs: 2 })
    expect(dealForRound(7)).toEqual({ deal: 13, runs: 3 })
    expect(dealForRound(8)).toEqual({ deal: 13, books: 4, runs: 3 })
  })
})
