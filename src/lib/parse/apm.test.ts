// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {calculateApmById} from './apm.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

describe('@dada78641/bwscrep', () => {
  describe('calculateApmById()', async () => {
    it('calculates apm per second', async () => {
      const res = await getSingleTestRawData('tvb', '241216_073941')
      const apmById = calculateApmById(res.resultData!)

      const player0 = apmById.get(0)!
      const apmStart = player0.apmPerSecond.slice(0, 10)
      const apmEnd = player0.apmPerSecond.slice(-10)
      const eapmStart = player0.eapmPerSecond.slice(0, 10)
      const eapmEnd = player0.eapmPerSecond.slice(-10)
      
      expect(apmStart).toStrictEqual([340, 254, 117, 117, 132, 99, 99, 99, 114, 98])
      expect(apmEnd).toStrictEqual([190, 189, 189, 188, 187, 190, 194, 192, 192, 191])
      expect(eapmStart).toStrictEqual([272, 222, 104, 104, 120, 91, 91, 91, 107, 93])
      expect(eapmEnd).toStrictEqual([177, 176, 176, 175, 174, 177, 179, 177, 178, 179])
    })
    it('calculates the cumulative apm', async () => {
      const res = await getSingleTestRawData('tvb', '241216_073941')
      const apmById = calculateApmById(res.resultData!)

      const player0 = apmById.get(0)!
      expect(player0.apm).toBe(159)
      expect(player0.eapm).toBe(133)
    })
  })
})
