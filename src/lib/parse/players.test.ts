// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getPlayersBySlotId} from './players.ts'
import {calculateApmById} from './apm.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

/**
 * Returns the players info for a single test case.
 */
async function getTestCaseData(file: [string, string]) {
  const res = await getSingleTestRawData(...file)
  const data = res.resultData!
  const apmById = calculateApmById(data)
  const playersBySlotId = getPlayersBySlotId(data.Header!, data.MapData!, data.Computed!, apmById)
  return playersBySlotId
}

describe('@dada78641/bwscrep', () => {
  describe('getPlayersBySlotId()', async () => {
    it('returns the players as a map', async () => {
      const players = await getTestCaseData(['tvb', '241216_073941'])
      expect(String(players)).toBe('[object Map]')
      const p1 = players.get(1)!
      expect(p1.id).toBe(1)
      expect(p1.slotId).toBe(1)
      expect(p1.teamId).toBe(2)
      expect(p1.name).toBe('NG105T')
      expect(p1.race).toBe('P')
      expect(p1.color).toBe('teal')
      expect(p1.isObserver).toBe(false)
      expect(p1.isCpuPlayer).toBe(false)
      for (const [key, value] of players.entries()) {
        expect(key).toBe(value.slotId)
      }
    })
  })
})
