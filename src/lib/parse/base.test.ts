// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getReplayBaseInfo} from './base.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

describe('@dada78641/bwscrep', () => {
  describe('getReplayBaseInfo()', async () => {
    it('returns base info in the expected format', async () => {
      const res = await getSingleTestRawData('tvb', '241216_073941')
      const base = getReplayBaseInfo(res.resultData!.Header!)

      expect(base.startTime).toStrictEqual(new Date('2024-12-16T07:39:41.000Z'))
      expect(base.endTime).toStrictEqual(new Date('2024-12-16T07:43:46.658Z'))
      expect(base.duration).toBe(245658)
      expect(base.speed).toBe('fastest')
      expect(base.type).toBe('tvb')
      expect(base.engine.name).toBe('Brood War')
      expect(base.lobby.title).toBe('INXAvAkdVYBB')
    })
  })
})
