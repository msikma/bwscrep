// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import keyBy from 'lodash.keyby'
import {gameSpeed, framesToMs} from '@dada78641/bwtoolsdata'
import type {BwGameSpeed} from '@dada78641/bwtoolsdata'
import type {BwChatCmd} from '@dada78641/screp-ts'
import type {Observer, ChatCommand, ReplayChatInfo, ReplayObserversInfo} from '../../types.ts'

/**
 * Returns in-game observers detected by chat messages.
 * 
 * These are modern Remastered style observers without a starting location.
 * 
 * These will only be visible if the person who saved the replay was an observer.
 */
function getObserversFromChat(chatCmds: ChatCommand[]): Observer[] {
  // Get all slot ids from the chat messages.
  const allIds = Object.keys(keyBy(chatCmds, 'slotId')).map(id => Number(id))
  // Filter out all the ids below 128.
  const obsIds = allIds.filter(id => id >= 128)
  return obsIds.map(obsId => ({id: obsId}))
}

/**
 * Returns a chat command in our format.
 */
function getChatCommand(rawChatCmd: BwChatCmd, speed: BwGameSpeed): ChatCommand {
  const slotId = rawChatCmd.SenderSlotID
  const isObserver = slotId >= 128
  const ms = framesToMs(rawChatCmd.Frame, speed.data.msPerFrame)
  return {
    slotId,
    time: ms,
    message: rawChatCmd.Message,
    isObserver,
  }
}

/**
 * Returns chat messages and observers.
 * 
 * There's a bunch of caveats about chat messages. One is that player id refers to
 * the player *receiving* the message; it's essentially useless and we don't include
 * it in the output. It's always equal to the person who saved the replay.
 * 
 * If a slot id is 128 or above, the player is an observer.
 */
export function getReplayChatInfo(rawChatCmds: BwChatCmd[] | null | undefined, repSpeed: string): [ReplayChatInfo, ReplayObserversInfo] {
  if (rawChatCmds == null) {
    return [[], []]
  }
  const speed = gameSpeed.bySlug(repSpeed)!
  const chatCmds = rawChatCmds.map(rawChatCmd => getChatCommand(rawChatCmd, speed))

  // Get observers: this is all determined from chat commands where the slot id is 128 or above.
  const observers = getObserversFromChat(chatCmds)

  return [chatCmds, observers]
}
