// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getReplayMapInfo} from './map.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

describe('@dada78641/bwscrep', () => {
  describe('getReplayMapInfo()', async () => {
    it('returns map data in the expected format', async () => {
      const res = await getSingleTestRawData('1v1', '241215_202156')
      const map = getReplayMapInfo(res.resultData!.MapData!, res.resultData!.Header!)

      expect(map.name).toBe('Polypoid')
      expect(map.size).toStrictEqual([128, 128])
      expect(map.tileset).toBe('jungle')
      expect(map.raw.name).toBe('\x07Polyp\x06oid \x061\x03.65')
      expect(map.playerCount).toBe(4)
      expect(map.startLocations).toStrictEqual([
        {x: 3808, y: 336, slotId: 0},
        {x: 3808, y: 3760, slotId: 1},
        {x: 288, y: 3760, slotId: 2},
        {x: 288, y: 272, slotId: 3},
      ])
    })
  })
})
