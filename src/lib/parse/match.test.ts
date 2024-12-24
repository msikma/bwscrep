// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getReplayMapInfo} from './map.ts'
import {getPlayersBySlotId} from './players.ts'
import {getReplayTeamsInfo} from './teams.ts'
import {getReplayMatchInfo} from './match.ts'
import {calculateApmById} from './apm.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

type MatchInfoTestCase = {
  file: [string, string]
  data: {
    matchup: string
    is1v1: boolean
    isCloseSpawns: boolean | null
    isCrossSpawns: boolean | null
    winningTeamId: number | null
    hasKnownWinner: boolean
  }
}

const matchInfoTestCases: MatchInfoTestCase[] = [
  {
    file: ['1v1', '241215_202156'],
    data: {
      matchup: 'ZvP',
      is1v1: true,
      isCloseSpawns: false,
      isCrossSpawns: true,
      winningTeamId: 2,
      hasKnownWinner: true
    },
  },
  {
    file: ['ctf', '190104_184730'],
    data: {
      matchup: 'PTZ',
      is1v1: false,
      isCloseSpawns: null,
      isCrossSpawns: null,
      winningTeamId: null,
      hasKnownWinner: false
    },
  },
  {
    file: ['ffa', '230101_032730'],
    data: {
      matchup: 'PvPvPvPvTvTvTvT',
      is1v1: false,
      isCloseSpawns: null,
      isCrossSpawns: null,
      winningTeamId: 4,
      hasKnownWinner: true
    },
  },
  {
    file: ['melee', '230101_143053'],
    data: {
      matchup: 'TvZ',
      is1v1: true,
      isCloseSpawns: false,
      isCrossSpawns: true,
      winningTeamId: 1,
      hasKnownWinner: true
    },
  },
  {
    file: ['tvb', '241216_073941'],
    data: {
      matchup: 'ZvP',
      is1v1: true,
      isCloseSpawns: false,
      isCrossSpawns: true,
      winningTeamId: 1,
      hasKnownWinner: true
    },
  },
]

/**
 * Returns the match info for a single test case.
 * 
 * A bunch of prerequisites are needed to get match data.
 */
async function getTestCaseData(file: [string, string]) {
  const res = await getSingleTestRawData(...file)
  const data = res.resultData!

  // Get all the prerequisite data.
  const apmById = calculateApmById(data)
  const map = getReplayMapInfo(data.MapData!, data.Header!)
  const playersBySlotId = getPlayersBySlotId(data.Header!, data.MapData!, data.Computed!, apmById)
  const teams = getReplayTeamsInfo(playersBySlotId)

  // Fetch the match info.
  return getReplayMatchInfo(data.Computed!, map, teams, playersBySlotId)
}

describe('@dada78641/bwscrep', () => {
  describe('getReplayMapInfo()', async () => {
    it('returns map data in the expected format', async () => {
      for (const testCase of matchInfoTestCases) {
        const match = await getTestCaseData(testCase.file)
        expect(match).toStrictEqual(testCase.data)
      }
    })
  })
})
