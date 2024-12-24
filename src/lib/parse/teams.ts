// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import orderBy from 'lodash.orderby'
import groupBy from 'lodash.groupby'
import type {PlayersBySlotId, ReplayTeamsInfo} from '../../types.ts'

/**
 * Returns a list of teams for a given list of players.
 * 
 * In a Brood War replay, players are always sorted into "teams" (even in a 1v1).
 * In reality there's never a winning player so much as a winning team, even if every team
 * has only one player in it.
 */
export function getReplayTeamsInfo(players: PlayersBySlotId): ReplayTeamsInfo {
  const playersByTeam = groupBy([...players.values()], 'teamId')
  const teams = Object.entries(playersByTeam).map(([teamId, players]) => {
    const playerRaces = players.map(player => player.race).join('')
    const playerSlotIds = players.map(player => player.slotId)
    return {
      teamId: Number(teamId),
      teamSummary: playerRaces,
      playerSlotIds,
    }
  })
  return orderBy(teams, 'teamId', 'asc')
}
