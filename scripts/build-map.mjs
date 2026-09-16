// Génère src/map-path.js : frontières (Natural Earth via world-atlas, domaine public)
// projetées autour de Bruxelles, en un seul tracé SVG statique.
import { readFileSync, writeFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'
import { feature, mesh } from 'topojson-client'

const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-10m.json', 'utf8'))
const W = 1600, H = 900
const BRUSSELS = [4.3517, 50.8503]

// Bruxelles placé à ~33 % / 62 % du cadre, comme l'épingle de la référence
const projection = geoMercator().center(BRUSSELS).scale(3200).translate([W * 0.33, H * 0.62]).clipExtent([[-10, -10], [W + 10, H + 10]])
const path = geoPath(projection)

const borders = path(mesh(topo, topo.objects.countries, (a, b) => a !== b))
const coasts = path(mesh(topo, topo.objects.countries, (a, b) => a === b))
const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => Math.round(+n))
const [px, py] = projection(BRUSSELS)

writeFileSync('src/map-path.js',
  `export const MAP_W = ${W}\nexport const MAP_H = ${H}\n` +
  `export const PIN = [${px.toFixed(1)}, ${py.toFixed(1)}]\n` +
  `export const MAP_D = ${JSON.stringify(round(borders + coasts))}\n`)
console.log('map ok', (round(borders + coasts).length / 1024).toFixed(0) + ' KB')
