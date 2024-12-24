// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import * as fs from 'fs/promises'
import {describe, expect, it} from 'vitest'
import {gameType} from '@dada78641/bwtoolsdata'
import {parseBwReplay} from './index.ts'
import {getTestFilePaths, getSingleTestResult, getTestTypes} from '../test/index.ts'

describe('@dada78641/bwscrep', () => {
  describe('parseBwReplay()', () => {
    for (const type of getTestTypes()) {
      const typeObject = gameType.bySlug(type)!
      it(`parses ${typeObject.name} type replays correctly`, async () => {
        const files = getTestFilePaths(type)
        for (const file of files) {
          // From file path.
          const {replayData} = await parseBwReplay(file)
          expect(replayData.base.type).toBe(type)
        }
        for (const file of files) {
          // From buffer.
          const buffer = await fs.readFile(file)
          const {replayData} = await parseBwReplay(buffer)
          expect(replayData.base.type).toBe(type)
        }
      })
    }
    it(`includes an error count for buggy replays`, async () => {
      const {parseErrorCount} = await getSingleTestResult('unk')
      expect(parseErrorCount).toBeGreaterThan(0)
    })
    it(`does not report an error count for valid replays`, async () => {
      const res1 = await getSingleTestResult('tvb', '241216_073941')
      expect(res1.parseErrorCount).toBe(0)
      const res2 = await getSingleTestResult('team_melee', '231004_203010')
      expect(res2.parseErrorCount).toBe(0)
      const res3 = await getSingleTestResult('sudden_death', '230617_181759')
      expect(res3.parseErrorCount).toBe(0)
      const res4 = await getSingleTestResult('ffa', '230101_032730')
      expect(res4.parseErrorCount).toBe(0)
    })
  })
})
