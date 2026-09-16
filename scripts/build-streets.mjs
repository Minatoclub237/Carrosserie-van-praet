// Génère src/streets.js : rues réelles autour de la carrosserie (© contributeurs OpenStreetMap, ODbL).
// Données : scripts/data/osm-schaerbeek.json (requête Overpass, rayon 1,6 km autour de la rue Navez).
import { readFileSync, writeFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'

const osm = JSON.parse(readFileSync('scripts/data/osm-schaerbeek.json', 'utf8'))
const W = 1600, H = 900
const SHOP = [4.3733313, 50.8725256] // Rue François-Joseph Navez 103 (fiche Google)
const pxPerMeter = 0.68
const projection = geoMercator()
  .center(SHOP)
  .scale(pxPerMeter * 6371000 * Math.cos((SHOP[1] * Math.PI) / 180))
  .translate([W * 0.32, H * 0.56])
  .clipExtent([[-20, -20], [W + 20, H + 20]])
const path = geoPath(projection)
const round = (d) => (d || '').replace(/-?\d+\.\d+/g, (n) => Math.round(+n))

const groups = { major: [], minor: [], rail: [], park: [] }
for (const el of osm.elements) {
  if (!el.geometry) continue
  const coords = el.geometry.map((p) => [p.lon, p.lat])
  const t = el.tags || {}
  let g
  if (t.leisure === 'park') g = 'park'
  else if (t.railway) g = 'rail'
  else if (/^(motorway|trunk|primary|secondary|tertiary)$/.test(t.highway)) g = 'major'
  else g = 'minor'
  const geom = g === 'park' && coords.length > 3
    ? { type: 'Polygon', coordinates: [coords] }
    : { type: 'LineString', coordinates: coords }
  const d = round(path(geom))
  if (d) groups[g].push(d)
}
const [px, py] = projection(SHOP)
writeFileSync('src/streets.js',
  `// © contributeurs OpenStreetMap (ODbL) — généré par scripts/build-streets.mjs\n` +
  `export const MAP_W = ${W}\nexport const MAP_H = ${H}\n` +
  `export const PIN = [${Math.round(px)}, ${Math.round(py)}]\n` +
  Object.entries(groups).map(([k, v]) => `export const ${k.toUpperCase()} = ${JSON.stringify(v.join(''))}`).join('\n') + '\n')
console.log('streets ok', Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])), (readFileSync('src/streets.js').length / 1024).toFixed(0) + ' KB')
