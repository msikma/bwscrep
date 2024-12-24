// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import type {ScrepData} from '@dada78641/screp-ts'

// The result returned by the main parseBwReplay() function.
export interface BwScrepResult {
  replayData: BwReplay
  parseErrorCount: number
}

// Full replay data object returned by this library, created from the screp-ts output.
export interface BwReplay {
  base: ReplayBaseInfo
  map: ReplayMapInfo
  match: ReplayMatchInfo
  players: ReplayPlayersInfo
  observers: ReplayObserversInfo
  teams: ReplayTeamsInfo
  chat: ReplayChatInfo
  miscellaneous: ReplayMiscInfo
}

// Basic, primary information about the replay itself.
export interface ReplayBaseInfo {
  startTime: Date
  endTime: Date
  duration: number
  speed: string
  type: string
  engine: {
    name: string
    version: string
  }
  lobby: {
    title: string
    hostPlayerId: number | null
  }
}
// Information about the map.
export interface ReplayMapInfo {
  name: string
  raw: {
    name: string
    description: string
  }
  size: [number, number]
  tileset: string,
  playerCount: number
  startLocations: StartLocation[]
}
// Chat messages.
export type ReplayChatInfo = ChatCommand[]
// Observers.
export type ReplayObserversInfo = Observer[]
// Miscellaneous info. This is the catchall for various other types of data.
export interface ReplayMiscInfo {
  replaySaverSlotId: number | null
  apmStatistics: {
    playerId: number
    apmPerSecond: number[],
    eapmPerSecond: number[],
  }[]
}
// All players in the replay.
export type ReplayPlayersInfo = ReplayPlayer[]
// Info about the matchup and who won the game.
export interface ReplayMatchInfo {
  matchup: string,
  is1v1: boolean,
  isCloseSpawns: boolean | null
  isCrossSpawns: boolean | null
  winningTeamId: number | null
  hasKnownWinner: boolean
}
// Info about the teams that participated in the game.
export type ReplayTeamsInfo = ReplayTeam[]

// A single team, containing various players.
export interface ReplayTeam {
  teamId: number
  teamSummary: string
  playerSlotIds: number[]
}

// A single player who participated in the game.
export interface ReplayPlayer {
  id: number
  slotId: number
  teamId: number
  // Battle.net username. If played on LAN or local, this can have Unicode characters.
  name: string
  // Either T, P or Z.
  race: PlayerRace
  // Color slug (e.g. "red", "blue", "bluish_gray").
  color: string
  apm: number | null
  eapm: number | null
  // Start x/y coordinates on the map.
  startLocation: [number, number] | null
  // Start direction (e.g. numbers 1-12). Null if the user is an observer.
  startDirection: number | null
  // Whether the player was an observer in the match.
  // Note that this does not refer to new style observers like in Remastered,
  // but to people who are "real" players in the game but have no buildings.
  isObserver: boolean
  // Whether this was a cpu.
  isCpuPlayer: boolean
}

// Type of spawning setup for 4 player maps.
export type SpawnType = 'cross_spawns' | 'close_spawns'

// A player's starting location.
export interface StartLocation {
  x: number
  y: number
  slotId: number
}

// A player's calculated apm values.
export interface PlayerApm {
  apm: number
  eapm: number
  apmPerSecond: number[]
  eapmPerSecond: number[]
}

// A chat command during the game.
export interface ChatCommand {
  slotId: number
  time: number
  message: string
  isObserver: boolean
}

// An observer who watched the game live.
export interface Observer {
  id: number
}

// Various utility maps.
export type PlayerApmById = Map<number, PlayerApm>
export type PlayersBySlotId = Map<number, ReplayPlayer>

// A replay player's race as a single uppercase letter.
export type PlayerRace = 'T' | 'P' | 'Z'

// The result and some metadata returned by screp-ts when calling getScrepData().
export interface ParsedScrepResult {
  resultData: ScrepData
  parseErrors: string | null
  hasValidResult: boolean
}
