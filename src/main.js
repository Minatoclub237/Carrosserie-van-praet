import '@fontsource-variable/inter'
import '@fontsource/monaspace-neon/400.css'
import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { MAP_D, MAP_W, MAP_H, PIN } from './map-path.js'

gsap.registerPlugin(ScrollTrigger)
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- Défilement fluide (scroll natif conservé, barre visible) ---------- */
const lenis = reduced ? null : new Lenis({ lerp: 0.09, smoothWheel: true })
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const id = a.getAttribute('href')
  const el = id === '#top' ? 0 : document.querySelector(id)
  if (el === null) return
  e.preventDefault()
  lenis ? lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70, duration: 1.4 }) : window.scrollTo(0, el ? el.offsetTop - 70 : 0)
})

/* ---------- Vidéo hero : source selon la largeur ---------- */
const video = document.querySelector('.hero__video')
video.src = window.matchMedia('(max-width: 767px)').matches ? video.dataset.srcMobile : video.dataset.srcDesktop
video.play().catch(() => {})

/* ---------- Nav : largeur pleine au repos, recadrée sur la grille dès qu'on défile ---------- */
const nav = document.getElementById('nav')
const setNav = (y) => nav.classList.toggle('is-scrolled', y > 8)
setNav(window.scrollY)
lenis ? lenis.on('scroll', ({ scroll }) => setNav(scroll)) : window.addEventListener('scroll', () => setNav(window.scrollY), { passive: true })

/* ---------- Découpe en mots masqués (conserve <br> et espaces insécables) ---------- */
function splitWords(el) {
  const inners = []
  const walk = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === 1) return walk(child)
      if (child.nodeType !== 3 || !child.textContent.trim()) return
      const frag = document.createDocumentFragment()
      child.textContent.split(/( +)/).forEach((part) => {
        if (!part) return
        if (/^ +$/.test(part)) return frag.append(' ')
        const w = document.createElement('span')
        w.className = 'w'
        const i = document.createElement('span')
        i.className = 'w__i'
        i.textContent = part
        w.append(i)
        frag.append(w)
        inners.push(i)
      })
      child.replaceWith(frag)
    })
  }
  walk(el)
  return inners
}

/* ---------- Révélations de lignes masquées ---------- */
const lineReveal = (lines, opts = {}) =>
  gsap.fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.09, ...opts })

if (!reduced) {
  // Chargement : titre puis sous-titre, ligne par ligne
  lineReveal('.hero__title .mask__line', { delay: 0.15 })
  lineReveal('.hero__sub .mask__line', { delay: 0.5, duration: 0.9 })

  /* ---------- Textes liés au défilement : les mots montent en descendant,
     redescendent en remontant (scrub, donc réversible) ---------- */
  gsap.utils.toArray('[data-scroll-text]').forEach((el) => {
    const words = splitWords(el)
    const long = el.dataset.scrollText === 'long'
    gsap.fromTo(words, { yPercent: 118 }, {
      yPercent: 0,
      ease: 'power2.out',
      stagger: long ? 0.035 : 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 94%',
        end: long ? 'bottom 62%' : 'top 58%',
        scrub: 0.6,
      },
    })
  })

  /* ---------- Hero : recouvert par la section suivante ----------
     Mesuré sur la vidéo : le hero défile à ~50 % de la vitesse pendant que
     « savoir-faire » (fond opaque, au-dessus) glisse par-dessus. */
  gsap.to('.hero', {
    yPercent: 48,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })
  gsap.to('.hero__shade', {
    backgroundColor: 'rgba(0,0,0,.45)',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  })

  /* ---------- Panneaux : fondu enchaîné des photos, piloté par l'arrivée de chaque carte ---------- */
  const imgs = gsap.utils.toArray('.panels__img')
  const cards = gsap.utils.toArray('.panel-card')
  cards.forEach((card, i) => {
    if (i === 0) return
    gsap.fromTo(imgs[i], { opacity: 0, scale: 1.06 }, {
      opacity: 1, scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 38%', scrub: true },
    })
  })
}

/* ---------- Carte ---------- */
const map = document.getElementById('map')
map.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`)
const pinSize = 58
map.innerHTML =
  `<path class="borders" d="${MAP_D}"/>` +
  `<g class="location__pin" transform="translate(${PIN[0] - pinSize / 2} ${PIN[1] - pinSize / 2})">` +
  `<use href="#mark" width="${pinSize}" height="${pinSize}"/></g>`

/* ---------- Fil de fer 3D des clientèles ---------- */
// Three.js n'est chargé qu'à l'approche de la section : le hero reste léger
const arts = document.querySelectorAll('.ind-card__art')
const wireIO = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return
  wireIO.disconnect()
  import('./wireframes.js').then((m) => m.initWireframes(arts, { reduced }))
}, { rootMargin: '150% 0px' })
wireIO.observe(document.querySelector('.industries'))

window.addEventListener('load', () => ScrollTrigger.refresh())
