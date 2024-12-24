// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import type {ScrepComputed} from '@dada78641/screp-ts'
import {sortRaces} from '@dada78641/bwtoolsdata'
import type {
  ReplayMapInfo,
  ReplayTeam,
  ReplayTeamsInfo,
  ReplayMatchInfo,
  PlayersBySlotId,
  SpawnType,
} from '../../types.ts'

/**
 * Returns the active (non-observer) players for a given team.
 * 
 * todo: typing
 */
function getTeamActivePlayers(team: ReplayTeam, players: PlayersBySlotId) {
  return team.playerSlotIds
    .map(slotId => players.get(slotId))
    .filter(player => !player?.isObserver)
}

/**
 * Returns a list of active players per team.
 */
function getAllTeamsActivePlayers(teams: ReplayTeamsInfo, players: PlayersBySlotId) {
  const teamsWithPlayers = teams.filter(team => team.playerSlotIds.length > 0)
  return teamsWithPlayers.map(team => getTeamActivePlayers(team, players))
}

/**
 * Returns in which quadrant of the map a spawn location is.
 */
function getSpawnQuadrant(spawnDirection: number | null | undefined): number | null {
  if (spawnDirection == null) {
    return null
  }
  return Math.floor(((spawnDirection - 1) / 12) * 4)
}

/**
 * Returns whether a given match was cross spawns or close spawns.
 * 
 * If the map is not a 4 player map, or it isn't a 1v1, this returns null.
 * Null in this instance means cross/close spawns is indeterminate or not applicable.
 */
function getReplaySpawnType(teams: ReplayTeamsInfo, players: PlayersBySlotId, map: ReplayMapInfo): SpawnType | null {
  // The concept of close or cross spawns is only valid for 4 player maps,
  // and only when this is a 1v1 match.
  if (map.playerCount !== 4 || !getReplay1v1(teams, players)) {
    return null
  }
  const [playerA, playerB] = getAllTeamsActivePlayers(teams, players)
  const spawnA = getSpawnQuadrant(playerA[0]?.startDirection)
  const spawnB = getSpawnQuadrant(playerB[0]?.startDirection)
  if (spawnA == null || spawnB == null) {
    return null
  }
  const spawns = [spawnA, spawnB].sort()
  if (spawns[0] === 0 && spawns[1] === 3) {
    return 'close_spawns'
  }
  if (spawns[1] - spawns[0] >= 2) {
    return 'cross_spawns'
  }
  return 'close_spawns'
}

/**
 * Returns whether a given teams setup represents a 1v1.
 */
function getReplay1v1(teams: ReplayTeamsInfo, players: PlayersBySlotId): boolean {
  const teamPlayers = getAllTeamsActivePlayers(teams, players)
  
  // Must have exactly two active teams.
  if (teamPlayers.length !== 2) {
    return false
  }

  // Must have exactly one player per team that isn't an observer.
  const [teamPlayersA, teamPlayersB] = teamPlayers
  if ((teamPlayersA.length !== teamPlayersB.length) || teamPlayersA.length !== 1) {
    return false
  }

  return true
}

/**
 * Returns what matchup this is (e.g. TvZ, PvP).
 */
function getMatchupString(teams: ReplayTeamsInfo): string {
  // TODO: properly sort these, diff sort function
  const teamSummaries = teams.map(team => team.teamSummary.split('').sort(sortRaces).join(''))
  return teamSummaries.sort(sortRaces).join('v')
}

/**
 * Returns information about the matchup.
 */
export function getReplayMatchInfo(
  computed: ScrepComputed,
  map: ReplayMapInfo,
  teams: ReplayTeamsInfo,
  players: PlayersBySlotId,
): ReplayMatchInfo {
  const matchup = getMatchupString(teams)
  const winningTeamId = computed.WinnerTeam
  const is1v1 = getReplay1v1(teams, players)
  const spawnType = getReplaySpawnType(teams, players, map)
  return {
    matchup,
    is1v1,
    isCloseSpawns: spawnType == null ? null : spawnType === 'close_spawns',
    isCrossSpawns: spawnType == null ? null : spawnType === 'cross_spawns',
    winningTeamId: winningTeamId === 0 ? null : winningTeamId,
    hasKnownWinner: winningTeamId > 0,
  }
}
