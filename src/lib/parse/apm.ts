// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {gameSpeed, framesToMs} from '@dada78641/bwtoolsdata'
import type {BwGameSpeed} from '@dada78641/bwtoolsdata'
import type {BwPlayer, BwCommand, ScrepData} from '@dada78641/screp-ts'
import type {PlayerApmById} from '../../types.ts'

// APM gets grouped into regular apm and eapm (minus ineffective commands).
type ApmGroups = {apmCmds: number[], eapmCmds: number[]}

/**
 * Returns all player ids for which we should have commands.
 */
function getPlayersWithCommands(players: BwPlayer[]) {
  return players
    .filter(player => player.Type.Name === 'Human')
    .map(player => player.ID)
}

/**
 * Commands are linked to players by slot id.
 */
function getPlayerCommands(id: number, commands: BwCommand[]) {
  return commands
    .filter(cmd => cmd.PlayerID === id)
}

/**
 * Groups player commands into apm and eapm groups, based on whether they were effective commands or not.
 * 
 * Each command has an "IneffKind" value. If the value is 0, it was an effective command;
 * if it's above 0, it was an ineffective command and should not get counted towards the eapm total.
 */
function getApmGroups(cmds: BwCommand[], speed: BwGameSpeed): ApmGroups {
  // Sort commands into two groups: apm and eapm. eapm does not include "ineffective" commands.
  const apmGroups: ApmGroups = {
    apmCmds: [],
    eapmCmds: [],
  }
  for (const cmd of cmds) {
    const ms = framesToMs(cmd.Frame, speed.data.msPerFrame)
    const isEffective = (cmd.IneffKind || 0) === 0
    apmGroups.apmCmds.push(ms)
    if (isEffective) {
      apmGroups.eapmCmds.push(ms)
    }
  }
  return apmGroups
}

/**
 * Returns an array of apm values for every second in the replay.
 * 
 * This grabs the average apm of the last 60 seconds, for every second of the replay.
 */
function getApmPerMinute(apmCmds: number[]): number[] {
  // This is when the replay ends for the given player.
  const lastActionMs = apmCmds[apmCmds.length - 1]

  // Calculate average apm of the last 60 seconds.
  const avgDuration = 60000
  // Size of our steps in milliseconds.
  const stepGranularity = 1000

  // The player's apm every second of the match.
  const apmSeconds: number[] = []

  for (let offsetMs = stepGranularity; offsetMs < lastActionMs; offsetMs += stepGranularity) {
    // Find two commands: nearest to 60 seconds ago, and nearest to now.
    const startIdx = apmCmds.findIndex(c => c > offsetMs - avgDuration)
    const endIdx = apmCmds.findIndex(c => c > offsetMs)
    const startMs = apmCmds[startIdx]
    const endMs = apmCmds[endIdx]

    // Duration between this start and end command, and number of actions in total.
    const periodDuration = endMs - startMs
    const periodActions = (endIdx - startIdx)

    if (periodDuration === 0 || periodActions === 0) {
      apmSeconds.push(0)
      continue
    }
    const apm = ((periodActions / periodDuration) * avgDuration)
    apmSeconds.push(Math.round(apm))
  }

  return apmSeconds
}

/**
 * Returns the total average apm for the whole replay.
 */
function getCumulativeApm(apmCmds: number[]): number {
  const lastActionMs = apmCmds[apmCmds.length - 1]
  return Math.round((apmCmds.length / lastActionMs) * 60000)
}

/**
 * Calculates apm values from the replay data for each player.
 * 
 * This calculates both the cumulative apm/eapm (for the entire replay), and the per-second apm/eapm.
 */
export function calculateApmById(screpData: ScrepData): PlayerApmById {
  // This replay's speed setting (probably "fastest").
  const speed = gameSpeed.byId(screpData.Header!.Speed.ID!)!
  
  // Human player ids.
  const playerIds = getPlayersWithCommands(screpData.Header!.Players!)

  // Collect player APM.
  const playerApm = new Map()

  for (const id of playerIds) {
    const playerCmds = getPlayerCommands(id, screpData.Commands!.Cmds!)
    const apmGroups = getApmGroups(playerCmds, speed)
    const apmPerSecond = getApmPerMinute(apmGroups.apmCmds)
    const eapmPerSecond = getApmPerMinute(apmGroups.eapmCmds)
    const apm = getCumulativeApm(apmGroups.apmCmds)
    const eapm = getCumulativeApm(apmGroups.eapmCmds)

    playerApm.set(id, {
      apm,
      eapm,
      apmPerSecond,
      eapmPerSecond,
    })
  }

  return playerApm
}
