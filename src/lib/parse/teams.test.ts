// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {describe, expect, it} from 'vitest'
import {getReplayTeamsInfo} from './teams.ts'
import {getPlayersBySlotId} from './players.ts'
import {calculateApmById} from './apm.ts'
import {getSingleTestRawData} from '../../../test/index.ts'

type TeamsInfoTestCase = {
  file: [string, string]
  data: {
    teamId: number
    teamSummary: string
    playerSlotIds: number[]
  }[]
}

const teamsInfoTestCases: TeamsInfoTestCase[] = [
  {
    file: ['1v1', '241215_202156'],
    data: [
      {teamId: 1, teamSummary: 'P', playerSlotIds: [1]},
      {teamId: 2, teamSummary: 'Z', playerSlotIds: [3]}
    ],
  },
  {
    file: ['ctf', '190104_184730'],
    data: [
      {teamId: 0, teamSummary: 'ZTP', playerSlotIds: [0, 1, 2]}
    ],
  },
  {
    file: ['ffa', '230101_032730'],
    data: [
      {teamId: 1, teamSummary: 'P', playerSlotIds: [0]},
      {teamId: 2, teamSummary: 'P', playerSlotIds: [1]},
      {teamId: 3, teamSummary: 'T', playerSlotIds: [2]},
      {teamId: 4, teamSummary: 'P', playerSlotIds: [3]},
      {teamId: 5, teamSummary: 'T', playerSlotIds: [4]},
      {teamId: 6, teamSummary: 'P', playerSlotIds: [5]},
      {teamId: 7, teamSummary: 'T', playerSlotIds: [6]},
      {teamId: 8, teamSummary: 'T', playerSlotIds: [7]}
    ],
  },
  {
    file: ['melee', '230101_143053'],
    data: [
      {teamId: 1, teamSummary: 'Z', playerSlotIds: [0]},
      {teamId: 2, teamSummary: 'T', playerSlotIds: [2]}
    ],
  },
  {
    file: ['team_ffa', '221217_032704'],
    data: [
      {teamId: 1, teamSummary: 'PZ', playerSlotIds: [3, 4]},
      {teamId: 2, teamSummary: 'ZZ', playerSlotIds: [1, 5]},
      {teamId: 3, teamSummary: 'TT', playerSlotIds: [2, 6]},
      {teamId: 4, teamSummary: 'TP', playerSlotIds: [0, 7]}
    ],
  },
  {
    file: ['tvb', '241216_073941'],
    data: [
      {teamId: 1, teamSummary: 'Z', playerSlotIds: [3]},
      {teamId: 2, teamSummary: 'P', playerSlotIds: [1]}
    ],
  },
  {
    file: ['ums', '241215_025200'],
    data: [
      {teamId: 1, teamSummary: 'TZPTZP', playerSlotIds: [0, 1, 2, 3, 4, 5]},
      {teamId: 2, teamSummary: 'Z', playerSlotIds: [7]},
      {teamId: 3, teamSummary: 'T', playerSlotIds: [6]}
    ],
  },
]

/**
 * Returns the teams info for a single test case.
 */
async function getTestCaseData(file: [string, string]) {
  const res = await getSingleTestRawData(...file)
  const data = res.resultData!
  const apmById = calculateApmById(data)
  const playersBySlotId = getPlayersBySlotId(data.Header!, data.MapData!, data.Computed!, apmById)
  const teams = getReplayTeamsInfo(playersBySlotId)
  return teams
}

describe('@dada78641/bwscrep', () => {
  describe('getPlayersBySlotId()', async () => {
    it('returns the teams in the proper format', async () => {
      for (const testCase of teamsInfoTestCases) {
        const match = await getTestCaseData(testCase.file)
        expect(match).toStrictEqual(testCase.data)
      }
    })
  })
})
