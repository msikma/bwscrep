// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import * as path from 'path'
import type {ScrepResult} from '@dada78641/screp-ts'
import {getRawScrepData} from '../src/lib/screp.ts'
import {parseBwReplay} from '../src/index.ts'
import {replayFiles} from './replays.ts'

// This file contains helper functions used by the unit tests.
// It's not included in the build as it's only imported by test files.

// Directory containing the test replays.
const TEST_REP_DIR = path.join(import.meta.dirname, '..', 'test', 'replays')

/**
 * Resolves the full path name of a test case.
 */
function resolveTestFile(type: string, filename: string) {
  return path.join(TEST_REP_DIR, type, `${filename}.rep`)
}

/**
 * Returns a list of all test types.
 */
export function getTestTypes(): string[] {
  return Object.keys(replayFiles)
}

/**
 * Returns all test files for a given type.
 */
export function getTestFilesForType(type: string): string[] {
  const testFiles: string[] = replayFiles[type]
  if (!testFiles || !testFiles.length) {
    throw new Error('Could not find any replays by this type')
  }
  return testFiles
}

/**
 * Returns a single test file for a given type.
 * 
 * This returns either a specific file in the test case or the first file.
 */
export function getSingleTestFilePath(type: string, file?: string | undefined) {
  const testFiles = getTestFilesForType(type)
  const testFile = file ? testFiles.find(f => f === file) : testFiles[0]
  if (!testFile) {
    throw new Error('Could not find requested replay for this type')
  }
  return resolveTestFile(type, testFile)
}

/**
 * Returns all test files for a given type as fully resolved paths.
 */
export function getTestFilePaths(type: string): string[] {
  const testFiles: string[] = getTestFilesForType(type)
  return testFiles.map(file => resolveTestFile(type, file))
}

/**
 * Parses a single test file and returns the result.
 */
export async function getSingleTestResult(type: string, file?: string | undefined) {
  const filepath = getSingleTestFilePath(type, file)
  const res = await parseBwReplay(filepath)
  return res
}

/**
 * Parses a single test file returns the raw screp data, without any further processing.
 */
export async function getSingleTestRawData(type: string, file?: string | undefined): Promise<ScrepResult> {
  const filepath = getSingleTestFilePath(type, file)
  const res = await getRawScrepData(filepath)
  return res
}
