// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import type {ScrepData} from '@dada78641/screp-ts'
import {getScrepData} from './lib/screp.ts'
import {
  calculateApmById,
  getPlayersBySlotId,
  getReplayBaseInfo,
  getReplayMapInfo,
  getReplayTeamsInfo,
  getReplayPlayersInfo,
  getReplayChatInfo,
  getReplayMiscInfo,
  getReplayMatchInfo,
} from './lib/parse/index.ts'
import type {BwReplay, BwScrepResult, ParsedScrepResult} from './types.ts'

// Export all our types.
export type * from './types.ts'

/**
 * Generates structured Brood War replay data using the raw data parsed by screp.
 * 
 * This includes all the crucial information about a replay file, with a lot of
 * more obscure and niche information left out for simplicity.
 * 
 * The output is serializable to JSON.
 */
export function getBwReplayFromRawData(screpData: ScrepData): BwReplay {
  // Apm is mapped by player id, as commands do not contain a slot id value.
  const apmById = calculateApmById(screpData)
  // Players are mapped by slot id, which is fully disambiguous.
  const playersBySlotId = getPlayersBySlotId(screpData.Header!, screpData.MapData!, screpData.Computed!, apmById)

  // Extract and calculate information from the replay.
  const base = getReplayBaseInfo(screpData.Header!)
  const map = getReplayMapInfo(screpData.MapData!, screpData.Header!)
  const teams = getReplayTeamsInfo(playersBySlotId)
  const players = getReplayPlayersInfo(playersBySlotId)
  const [chat, observers] = getReplayChatInfo(screpData.Computed?.ChatCmds, base.speed)
  const miscellaneous = getReplayMiscInfo(screpData.Computed!, apmById)
  const match = getReplayMatchInfo(screpData.Computed!, map, teams, playersBySlotId)

  return {
    base,
    map,
    match,
    players,
    observers,
    teams,
    chat,
    miscellaneous,
  }
}

/**
 * Returns the number of parse errors we had for this file.
 * 
 * We don't return the full parse errors because when a replay is buggy it's usually *very* buggy,
 * and we honestly can't make any use of the error log anyway. So instead we just return the count,
 * so we at least know something went wrong for potentially manually inspecting the file later.
 */
function countParseErrors(parseErrors: string | null) {
  // Parse errors are formatted as a string with newlines.
  const errors = parseErrors == null ? '' : parseErrors.trim()
  if (errors === '') {
    return 0
  }
  return errors.split('\n').length
}

/**
 * Utility function that loads a Brood War replay from disk and runs the parsing code.
 */
export async function parseBwReplay(file: string | Buffer): Promise<BwScrepResult> {
  const screpResult: ParsedScrepResult = await getScrepData(file)
  const replayData: BwReplay = getBwReplayFromRawData(screpResult.resultData)
  const parseErrorCount = countParseErrors(screpResult.parseErrors)
  return {
    replayData,
    parseErrorCount
  }
}
