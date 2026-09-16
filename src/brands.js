// Logos des marques prises en charge — Simple Icons (CC0), couleur officielle de chaque marque.
// Import nommé : Vite n'embarque que ces icônes.
import {
  siAudi, siBmw, siVolkswagen, siToyota, siPeugeot, siRenault, siCitroen, siOpel, siFord, siSkoda,
  siSeat, siVolvo, siMini, siHonda, siSuzuki, siSubaru, siFiat, siKia, siHyundai, siNissan,
  siTesla, siDacia, siMazda, siJeep,
} from 'simple-icons'

const BRANDS = [
  siVolkswagen, siAudi, siBmw, siToyota, siPeugeot, siRenault, siCitroen, siOpel, siFord, siSkoda,
  siSeat, siVolvo, siMini, siHonda, siSuzuki, siSubaru, siFiat, siKia, siHyundai, siNissan,
  siTesla, siDacia, siMazda, siJeep,
]

// Couleurs trop claires pour un fond blanc (jaunes) : fine bordure sombre pour rester lisibles
const isLight = (hex) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6
}

const logo = ({ title, hex, path }) =>
  `<li class="brand" title="${title}">` +
  `<svg viewBox="0 0 24 24" role="img" aria-label="${title}">` +
  `<path d="${path}" fill="#${hex}"${isLight(hex) ? ' stroke="#1a1a18" stroke-width=".35" paint-order="stroke"' : ''}/>` +
  `</svg></li>`

// Deux jeux identiques : l'animation CSS translate de -50 % boucle sans raccord
export function renderBrands(track) {
  const set = BRANDS.map(logo).join('')
  track.innerHTML =
    `<ul class="brands__set">${set}</ul>` +
    `<ul class="brands__set" aria-hidden="true">${set}</ul>`
}
