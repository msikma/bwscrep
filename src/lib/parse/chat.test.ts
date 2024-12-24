// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getReplayChatInfo} from './chat.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

describe('@dada78641/bwscrep', () => {
  describe('getReplayBaseInfo()', async () => {
    it('returns chat messages in the expected format', async () => {
      const res = await getSingleTestRawData('1v1', '241215_202156')
      const [chat] = getReplayChatInfo(res.resultData!.Computed?.ChatCmds, 'fastest')
      expect(chat.every(item => typeof item.slotId === 'number')).toBe(true)
      expect(chat.every(item => typeof item.time === 'number')).toBe(true)
      expect(chat.every(item => typeof item.message === 'string')).toBe(true)
      expect(chat.every(item => typeof item.isObserver === 'boolean')).toBe(true)
    })
    it('returns all observers with chat messages', async () => {
      const res = await getSingleTestRawData('slaughter', '230828_022319')
      const [, observers] = getReplayChatInfo(res.resultData!.Computed?.ChatCmds, 'fastest')
      expect(observers.length).toBe(2)
      expect(observers.every(item => typeof item.id === 'number')).toBe(true)
    })
  })
})
