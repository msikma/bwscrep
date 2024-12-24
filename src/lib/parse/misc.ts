// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import orderBy from 'lodash.orderby'
import type {ScrepComputed} from '@dada78641/screp-ts'
import type {ReplayMiscInfo, PlayerApmById} from '../../types.ts'

/**
 * Returns basic information about a given replay.
 */
export function getReplayMiscInfo(computed: ScrepComputed, playerApm: PlayerApmById): ReplayMiscInfo {
  // todo: has switchable colors
  const apm = playerApm.entries().map(([id, apmInfo]) => {
    return {
      playerId: id,
      // Don't include cumulative apm here since it's already in the players object.
      apmPerSecond: apmInfo.apmPerSecond,
      eapmPerSecond: apmInfo.eapmPerSecond,
    }
  })
  const replaySaverSlotId = computed.RepSaverPlayerID
  return {
    replaySaverSlotId: replaySaverSlotId == null ? null : replaySaverSlotId,
    apmStatistics: orderBy([...apm], 'playerId', 'asc'),
  }
}
