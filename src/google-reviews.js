// Avis Google de l'atelier (fournis par l'utilisateur depuis la fiche Google), cités tels quels.
// Écartés : avis sans texte, avis d'un seul mot, avis hors sujet.
import gsap from 'gsap'
import { siGoogle } from 'simple-icons'
import { tr } from './i18n.js'

export const GOOGLE_URL = 'https://share.google/LqZYZ5JYPHfEs9HVP'

const REVIEWS = [
  { name: 'Soufiane M.', meta: { fr: 'Local Guide · il y a 8 mois', en: 'Local Guide · 8 months ago', nl: 'Local Guide · 8 maanden geleden' }, text: 'Très bon garage depuis lesx nouveau propriétaires ! Réparation carrosserie et mécanique impec\'! Anciens avis à revoir !!' },
  { name: 'ADNAM BT', meta: { fr: 'Local Guide · il y a 2 ans', en: 'Local Guide · 2 years ago', nl: 'Local Guide · 2 jaar geleden' }, text: 'ils font un travail magnifique. Rapide/ résultat IMPECCABLE !!! Mon pare choc est comme neuf ! Et en + très respectueux et à l’écoute du client. Merci les frères !!!' },
  { name: 'se nabil', meta: { fr: 'Local Guide · il y a 2 ans', en: 'Local Guide · 2 years ago', nl: 'Local Guide · 2 jaar geleden' }, text: 'Bon accueil, très bon conseils de divers professionnels intra muros. Ce garage abrite diverses fonctions: la mécanique sous toutes ses coutures, la carrosserie avec son propre four à peinture en passant par le polissage fait par un professionnel hors pair en la matière pour les amoureux de leurs voitures. Un garage avec une équipe de professionnels aux résultats époustouflants. A recommander …' },
  { name: 'Arnaud Kerremans', meta: { fr: 'Local Guide · il y a 7 ans', en: 'Local Guide · 7 years ago', nl: 'Local Guide · 7 jaar geleden' }, text: 'Le travail sur la carrosserie était parfait, et le prix hyper compétitif.' },
  { name: 'Philippe Donni', meta: { fr: 'Local Guide · il y a un an', en: 'Local Guide · a year ago', nl: 'Local Guide · een jaar geleden' }, text: 'A l écoute des clients et propose des solutions' },
  { name: 'Didier Rader', meta: { fr: 'Local Guide · il y a 7 ans', en: 'Local Guide · 7 years ago', nl: 'Local Guide · 7 jaar geleden' }, text: 'Du travail de pro et avec le sourire. Excellent à tous points de vue. Je recommande' },
  { name: 'Ciprian', meta: { fr: 'Local Guide · il y a un an', en: 'Local Guide · a year ago', nl: 'Local Guide · een jaar geleden' }, text: 'Super prix et bonne qualité' },
  { name: 'lahcen abik', meta: { fr: 'il y a 6 ans · traduit du néerlandais', en: '6 years ago · translated from Dutch', nl: '6 jaar geleden · vertaald uit het Nederlands' }, text: 'Service rapide, prix bas' },
  { name: 'Marwan Melloul', meta: { fr: 'il y a 3 ans · réparation de carrosseries', en: '3 years ago · bodywork repair', nl: '3 jaar geleden · carrosserieherstelling' }, text: 'Top travail' },
]

const READ = { fr: 'Lire sur Google', en: 'Read on Google', nl: 'Lezen op Google' }
const initials = (n) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
const HUES = ['#2e6cff', '#111110', '#1238d6', '#3a3a35', '#19a3e0']
const escape = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const cell = (r, i, hidden) => `
  <figure class="greview"${hidden ? ' aria-hidden="true"' : ''}>
    <blockquote class="greview__text">“${escape(r.text)}”</blockquote>
    <figcaption class="greview__who">
      <span class="greview__avatar" style="background:${HUES[i % HUES.length]}">${initials(r.name)}</span>
      <span class="greview__id"><b>${escape(r.name)}</b><small data-meta="${i}">${tr(r.meta)}</small></span>
    </figcaption>
    <a class="greview__btn" href="${GOOGLE_URL}" target="_blank" rel="noopener"${hidden ? ' tabindex="-1"' : ''}>${tr(READ)}</a>
  </figure>`

export function initGoogleReviews(section, { lenis, reduced }) {
  const track = section.querySelector('.greviews__track')
  const view = section.querySelector('.greviews__viewport')
  section.querySelector('.greviews__g').innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${siGoogle.path}" fill="#${siGoogle.hex}"/></svg>`

  // Deux jeux identiques : la boucle se referme sans raccord visible
  track.innerHTML = REVIEWS.map((r, i) => cell(r, i, false)).join('') + REVIEWS.map((r, i) => cell(r, i, true)).join('')

  let x = 0, setW = 0, cellW = 0, paused = false, visible = false, nudge = 0
  const measure = () => {
    const cells = track.children
    cellW = cells[1].getBoundingClientRect().left - cells[0].getBoundingClientRect().left
    setW = cellW * REVIEWS.length
  }
  measure()
  window.addEventListener('resize', measure)

  new IntersectionObserver(([e]) => { visible = e.isIntersecting }).observe(section)
  view.addEventListener('mouseenter', () => { paused = true })
  view.addEventListener('mouseleave', () => { paused = false })
  view.addEventListener('focusin', () => { paused = true })
  view.addEventListener('focusout', () => { paused = false })

  // Flèches : décalage d'une carte, lissé (s'ajoute au défilement continu)
  const shift = { v: 0 }
  const go = (dir) => {
    gsap.to(shift, { v: shift.v - dir * cellW, duration: 0.9, ease: 'power3.inOut', onUpdate: () => { nudge = shift.v } })
  }
  section.querySelector('[data-greviews-prev]').addEventListener('click', () => go(-1))
  section.querySelector('[data-greviews-next]').addEventListener('click', () => go(1))

  gsap.ticker.add((_, dt) => {
    if (!visible || !setW) return
    const boost = lenis ? Math.min(Math.abs(lenis.velocity), 40) * 0.12 : 0
    if (!paused && !reduced) x -= (0.55 + boost) * (dt / 16.7)
    track.style.transform = `translate3d(${gsap.utils.wrap(-setW, 0, x + nudge).toFixed(2)}px,0,0)`
  })

  // Changement de langue : libellés réécrits sur place (les avis restent cités dans leur langue d'origine)
  return {
    setLang: () => {
      track.querySelectorAll('[data-meta]').forEach((el) => { el.textContent = tr(REVIEWS[+el.dataset.meta].meta) })
      track.querySelectorAll('.greview__btn').forEach((el) => { el.textContent = tr(READ) })
      requestAnimationFrame(measure)
    },
  }
}
