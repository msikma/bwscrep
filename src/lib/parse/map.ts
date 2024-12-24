// @dada78641/bwscrep <https://github.com/msikma/bwscrep>
// © MIT license

import orderBy from 'lodash.orderby'
import {getCleanMapName, mapTileset} from '@dada78641/bwtoolsdata'
import type {ScrepHeader, ScrepMapData} from '@dada78641/screp-ts'
import type {ReplayMapInfo, StartLocation} from '../../types.ts'

/**
 * Returns all starting locations for this map.
 * 
 * Items are ordered by slot id.
 */
function getStartLocations(mapData: ScrepMapData): StartLocation[] {
  const locations = mapData.StartLocations.map(loc => ({
    x: loc.X,
    y: loc.Y,
    slotId: loc.SlotID,
  }))
  return orderBy(locations, 'slotId', 'asc')
}

/**
 * Returns basic information about a given replay.
 */
export function getReplayMapInfo(mapData: ScrepMapData, header: ScrepHeader): ReplayMapInfo {
  const tileset = mapTileset.byId(mapData.TileSet.ID)!
  const cleanName = getCleanMapName(mapData.Name)
  const startLocations = getStartLocations(mapData)

  return {
    name: cleanName.cleanName,
    size: [header.MapWidth, header.MapHeight],
    tileset: tileset.slug,
    raw: {
      name: mapData.Name,
      description: mapData.Description,
    },
    playerCount: startLocations.length,
    startLocations,
  }
}
