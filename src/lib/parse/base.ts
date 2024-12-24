// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import {gameSpeed, gameType, framesToMs, type BwGameType as BwGameTypeObject} from '@dada78641/bwtoolsdata'
import type {ScrepHeader, BwGameType} from '@dada78641/screp-ts'
import type {ReplayBaseInfo} from '../../types.ts'

/**
 * Converts a screp style ShortName to a bwtoolsdata slug.
 */
function convertShortNameToSlug(screpShortName: string): string {
  return screpShortName.replace(/ /g, '_').toLowerCase()
}

/**
 * Returns the replay type from the screp Header.Type object.
 * 
 * Normally we should get an id match, except for unknown replay types, which will have an arbitrary number.
 * In that case we expect to see "Unk" as the slug.
 */
function getReplayTypeId(type: BwGameType): BwGameTypeObject {
  const byId = gameType.byId(type.ID)
  if (byId == null) {
    // If this is null, we expect this to be some type of unknown replay.
    const bySlug = gameType.bySlug(convertShortNameToSlug(type.ShortName))
    if (bySlug == null) {
      // We should *never* get here, unless they somehow add a whole new
      // game type to Brood War and I never ever update the code.
      throw new Error(`Unknown replay type: ${type.ShortName}`)
    }
    return bySlug
  }
  return byId
}

/**
 * Returns basic information about a given replay.
 */
export function getReplayBaseInfo(header: ScrepHeader): ReplayBaseInfo {
  const speed = gameSpeed.byId(header.Speed.ID)!
  const type = getReplayTypeId(header.Type)
  const duration = framesToMs(header.Frames, speed.data.msPerFrame)
  const startTime = new Date(header.StartTime)
  const endTime = new Date(Number(startTime) + duration)

  const host = header.Players.find(player => player.Name === header.Host)

  return {
    startTime,
    endTime,
    duration,
    speed: speed.slug,
    type: type.slug,
    engine: {
      name: header.Engine.Name,
      version: header.Version,
    },
    lobby: {
      title: header.Title,
      hostPlayerId: host ? host.ID : null,
    },
  }
}
