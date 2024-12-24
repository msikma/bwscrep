// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {playerColor} from '@dada78641/bwtoolsdata'
import type {BwPlayer, BwStartLocation, BwPlayerDesc, ScrepHeader, ScrepMapData, ScrepComputed} from '@dada78641/screp-ts'
import type {PlayerRace, PlayerApm, PlayerApmById, ReplayPlayer, PlayersBySlotId, ReplayPlayersInfo} from '../../types.ts'

/**
 * Returns the player's race as a single uppercase letter.
 */
function getPlayerRace(raceName: string): PlayerRace {
  if (typeof raceName !== 'string' || raceName.length === 0) {
    throw new Error(`Invalid race name: ${raceName}`)
  }
  const letter = raceName.slice(0, 1).toUpperCase()
  if (!['T', 'P', 'Z'].includes(letter)) {
    throw new Error(`Invalid race name: ${raceName}`)
  }
  return letter as PlayerRace
}

/**
 * Returns the player description from the screp data by searching by start location.
 * 
 * The computed data does not contain a slot id, which we would normally use for matching.
 * So instead we'll find the start direction by matching by start location coordinates.
 */
function getStartDirectionFromLocation(playerDescs: BwPlayerDesc[], startLocation: BwStartLocation | undefined): number | null {
  if (startLocation == null) {
    // If we don't have a start location for this player, we can't have a direction either.
    return null
  }
  const location = playerDescs.find(desc => {
    if (desc.StartLocation == null) {
      return false
    }
    return desc.StartLocation.X === startLocation.X && desc.StartLocation.Y === startLocation.Y
  })
  return location ? location.StartDirection : null
}

/**
 * Returns a data object for a single player in the replay.
 */
function getReplayPlayer(
  player: BwPlayer,
  playerDescs: BwPlayerDesc[],
  playerApm: PlayerApm | undefined,
  startLocations: BwStartLocation[],
): ReplayPlayer {
  const race = getPlayerRace(player.Race.Name)
  const color = playerColor.byId(player.Color.ID)!
  // Get the player's location by matching slot id.
  const location = startLocations.find(loc => loc.SlotID === player.SlotID)
  // Unfortunately, the computed data does not contain a slot id.
  // This means we need to find the start direction (which is in there) by matching the starting location X/Y.
  const startDirection = getStartDirectionFromLocation(playerDescs, location)

  return {
    id: player.ID,
    slotId: player.SlotID,
    teamId: player.Team,
    name: player.Name,
    race,
    color: color.slug,
    apm: playerApm?.apm ?? null,
    eapm: playerApm?.eapm ?? null,
    startLocation: location ? [location.X, location.Y] : null,
    startDirection,
    isObserver: !!player.Observer,
    isCpuPlayer: player.ID === 255,
  }
}

/**
 * Converts a list of players to a map by slot id.
 */
function playerListToMap(players: ReplayPlayer[]): PlayersBySlotId {
  return new Map(players.map(player => [player.slotId, player]))
}

/**
 * Returns players grouped by whether they were active participants or observers.
 * 
 * Each group is returned as a map by slot id.
 */
export function getPlayersBySlotId(header: ScrepHeader, mapData: ScrepMapData, computed: ScrepComputed, playerApm: PlayerApmById): PlayersBySlotId {
  const allPlayers = []
  for (const player of header.Players) {
    const apm = playerApm.get(player.ID)
    const playerInfo = getReplayPlayer(player, computed.PlayerDescs, apm, mapData.StartLocations)
    allPlayers.push(playerInfo)
  }
  return playerListToMap(allPlayers)
}

/**
 * Returns a list of players from a PlayersBySlotId map.
 * 
 * Doesn't actually do anything except convert the values to an array.
 */
export function getReplayPlayersInfo(players: PlayersBySlotId): ReplayPlayersInfo {
  return [...players.values()]
}
