// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getReplayMiscInfo} from './misc.ts'
import {calculateApmById} from './apm.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

/**
 * Returns the misc info for a single test case.
 */
async function getTestCaseData(file: [string, string]) {
  const res = await getSingleTestRawData(...file)
  const data = res.resultData!
  const apmById = calculateApmById(data)
  return getReplayMiscInfo(data.Computed!, apmById)
}

describe('@dada78641/bwscrep', () => {
  describe('getReplayMapInfo()', async () => {
    it('returns map data in the expected format', async () => {
      const misc1 = await getTestCaseData(['tvb', '241216_073941'])
      expect(Object.keys(misc1)).toStrictEqual(['replaySaverSlotId', 'apmStatistics'])
      expect(String(misc1.replaySaverSlotId)).toBe('null')
      expect(misc1.apmStatistics[0].playerId).toBe(0)
    })
  })
})
