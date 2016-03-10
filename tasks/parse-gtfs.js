const csv = require('csv')
const fs = require('fs')
const _ = require('lodash')
const GeoJSON = require('geojson')
const co = require('co')

function parseGtfsFile (filename) {
  return new Promise((resolve, reject) => {
    const file = fs.readFileSync(`./data/king-county-gtfs/${filename}.txt`, 'utf8')
    csv.parse(file, { columns: true }, (err, data) => {
      if (err) { reject(err) }
      resolve(data)
    })
  })
}


// const loadRoute = shortName => parseGtfsFile('routes').then(data => _.find(data, { route_short_name: shortName }))
// const loadTripsForRoute = routeId => parseGtfsFile('trips').then(data => _.filter(data, { route_id: routeId }))
// const loadTripsForBlock = blockId => parseGtfsFile('trips').then(data => _.filter(data, { block_id: blockId }))
// const loadShape = shapeId => parseGtfsFile('shapes').then(data => _.filter(data, { shape_id: shapeId }))

// co(function *() {
//   const route = yield loadRoute('26')
//   const trips = yield loadTripsForRoute(route.route_id)
//   const blockIds = _.chain(trips).map('block_id').uniq().value()
//   const blockTrips = yield loadTripsForBlock(blockIds[0])
//   const shapeIds = _.chain(blockTrips).filter({ direction_id: '1' }).map('shape_id').uniq().value()
//   const shape = yield loadShape(shapeIds[0])
//   const points = _.reduce(shape, (acc, v) => acc.concat([[v.shape_pt_lon, v.shape_pt_lat]]), [])
//   const geojson = GeoJSON.parse([{ line: points }], { LineString: 'line' })
//   console.log(JSON.stringify(geojson))
// })

const extractShapes = function *(cb) {
  const shapes = yield parseGtfsFile('shapes')
  const uniqueShapeIds = _.chain(shapes).map('shape_id').uniq().value()

  uniqueShapeIds.slice(0,3).forEach(shapeId => {
    const shape = _.filter(shapes, { shape_id: shapeId })
    const points = _.reduce(shape, (acc, v) => acc.concat([[v.shape_pt_lon, v.shape_pt_lat]]), [])
    const geojson = GeoJSON.parse([{ line: points }], { LineString: 'line' })
    cb(shapeId, geojson)
  })
}

const shapesForRouteId = function *(routeId) {
  const trips = yield parseGtfsFile('trips')
  const shapeIdsForRoute = _.chain(trips).filter({ route_id: routeId }).map('shape_id').uniq().value()
  console.log(shapeIdsForRoute.map(id => `./shapes/${id}.geojson`).join(' '))
}

co(extractShapes((shapeId, geojson) => {
  fs.writeFileSync(`./shapes/${shapeId}.geojson`, JSON.stringify(geojson), 'utf8')
}))

// co(shapesForRouteId('100151'))

