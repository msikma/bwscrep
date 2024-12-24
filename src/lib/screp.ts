// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {runScrep, type ScrepResult} from '@dada78641/screp-ts'
import type {ScrepOptions} from '@dada78641/screp-ts'
import type {ParsedScrepResult} from '../types.ts'

// Options needed to get all the information we need.
// Basically everything except map geometry data.
const screpRequiredOptions: ScrepOptions = {
  includeCommands: true,
  includeComputedData: true,
  includeReplayHeader: true,
  includeMapData: true,
  includeMapDataHash: true,
  includeMapGraphics: false,
  includeMapResourceLocations: false,
  includeMapTiles: false,
  mapDataHashAlgorithm: 'md5',
}

/**
 * Runs screp-ts and returns its return value unmodified.
 */
export async function getRawScrepData(file: string | Buffer): Promise<ScrepResult> {
  const res = await runScrep(file, screpRequiredOptions)
  return res
}

/**
 * Runs screp and returns the result data.
 */
export async function getScrepData(file: string | Buffer): Promise<ParsedScrepResult> {
  const res = await getRawScrepData(file)
  const {resultData, exitCode, abortSignal, hasValidResult, parseErrors} = res
  if (!hasValidResult || resultData == null) {
    throw new Error(`Could not run screp: ${JSON.stringify({exitCode, abortSignal})}`)
  }
  return {
    resultData,
    hasValidResult,
    parseErrors
  }
}
