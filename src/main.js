import '@fontsource-variable/inter'
import '@fontsource/monaspace-neon/400.css'
import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { MAP_W, MAP_H, PIN, MAJOR, MINOR, RAIL, PARK } from './streets.js'

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

/* ---------- Horaires : jour courant à Bruxelles ---------- */
const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  .indexOf(new Date().toLocaleString('en-US', { timeZone: 'Europe/Brussels', weekday: 'short' }))
document.querySelector(`.hours tr[data-day="${today}"]`)?.classList.add('is-today')

/* ---------- Carte réelle (OpenStreetMap) ---------- */
const map = document.getElementById('map')
map.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`)
map.innerHTML =
  `<path class="st-park" d="${PARK}"/>` +
  `<path class="st-rail" d="${RAIL}"/>` +
  `<path class="st-minor" d="${MINOR}" pathLength="1"/>` +
  `<path class="st-major" d="${MAJOR}" pathLength="1"/>` +
  `<g class="location__pin" transform="translate(${PIN[0]} ${PIN[1]})">` +
  `<circle class="location__pulse" r="34"/><g class="location__drop"><use href="#mark" x="-26" y="-58" width="52" height="52"/></g></g>`

/* ---------- Découpes ---------- */
// Mots masqués (conserve <br> et espaces insécables)
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

// Lettres, regroupées par mot pour que les retours à la ligne restent naturels
function splitChars(el) {
  const chars = []
  const walk = (node) => {
    ;[...node.childNodes].forEach((child) => {
      if (child.nodeType === 1) return walk(child)
      if (child.nodeType !== 3 || !child.textContent.trim()) return
      const frag = document.createDocumentFragment()
      child.textContent.split(/( +)/).forEach((part) => {
        if (!part) return
        if (/^ +$/.test(part)) return frag.append(' ')
        const w = document.createElement('span')
        w.className = 'fw'
        ;[...part].forEach((c) => {
          const s = document.createElement('span')
          s.className = 'char'
          s.textContent = c
          w.append(s)
          chars.push(s)
        })
        frag.append(w)
      })
      child.replaceWith(frag)
    })
  }
  walk(el)
  return chars
}

/* ---------- Fil de fer 3D : Three.js chargé à l'approche de la section ---------- */
const arts = document.querySelectorAll('.ind-card__art')
const wireIO = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return
  wireIO.disconnect()
  import('./wireframes.js').then((m) => m.initWireframes(arts, { reduced }))
}, { rootMargin: '150% 0px' })
wireIO.observe(document.querySelector('.industries'))

if (!reduced) {
  const scrub = 0.6

  /* ================= HERO ================= */
  const heroChars = gsap.utils.toArray('.hero__title [data-chars]').flatMap(splitChars)
  gsap.fromTo('.hero__title .mask__line', { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.09, delay: 0.15 })
  gsap.fromTo('.hero__sub .mask__line', { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.09, delay: 0.5 })
  gsap.fromTo('.hero__meta .label', { opacity: 0, y: 12 }, { opacity: 0.8, y: 0, duration: 1, delay: 0.7, stagger: 0.1 })

  // Recouvert par « savoir-faire » (hero à ~50 % de la vitesse, mesuré sur la vidéo)
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  gsap.to('.hero', { yPercent: 48, ease: 'none', scrollTrigger: heroST })
  gsap.to('.hero__shade', { backgroundColor: 'rgba(0,0,0,.55)', ease: 'none', scrollTrigger: heroST })
  // Les lettres du titre se dispersent en s'envolant à des vitesses différentes
  gsap.to(heroChars, {
    y: () => -gsap.utils.random(60, 320),
    rotate: () => gsap.utils.random(-18, 18),
    opacity: 0,
    ease: 'power1.in',
    stagger: { each: 0.012, from: 'random' },
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '55% top', scrub },
  })
  gsap.to(['.hero__sub', '.hero__cta', '.hero__meta'], { opacity: 0, y: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '35% top', scrub } })

  /* ================= TEXTES ================= */
  // Mots qui montent (réversible)
  gsap.utils.toArray('[data-scroll-text]').forEach((el) => {
    gsap.fromTo(splitWords(el), { yPercent: 118 }, {
      yPercent: 0, ease: 'power2.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 94%', end: 'top 60%', scrub },
    })
  })
  // Lecture : les mots s'allument un à un
  gsap.utils.toArray('[data-scroll-read]').forEach((el) => {
    gsap.fromTo(splitWords(el), { opacity: 0.12, yPercent: 30 }, {
      opacity: 1, yPercent: 0, ease: 'none', stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub },
    })
  })
  // Titres : les lettres basculent en 3D
  gsap.utils.toArray('[data-flip]').forEach((el) => {
    gsap.fromTo(splitChars(el), { rotateX: -100, yPercent: 40, opacity: 0 }, {
      rotateX: 0, yPercent: 0, opacity: 1, ease: 'power3.out', stagger: 0.025,
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 52%', scrub },
    })
  })
  // « Un devis en 24 h ? » : arrive énorme et très espacé, se resserre à sa place
  gsap.fromTo('[data-zoom-title]', { scale: 2.1, letterSpacing: '0.18em', opacity: 0.2, transformOrigin: '0% 100%' }, {
    scale: 1, letterSpacing: '-0.015em', opacity: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.quote__box', start: 'top bottom', end: 'top 30%', scrub },
  })
  // Nom géant du pied de page : les lettres remontent du sol
  gsap.fromTo(splitChars(document.querySelector('[data-footer-mark]')), { yPercent: 105, opacity: 0 }, {
    yPercent: 0, opacity: 1, ease: 'power3.out', stagger: 0.03,
    scrollTrigger: { trigger: '.footer', start: 'top 95%', end: 'bottom bottom', scrub },
  })

  /* ================= PARALLAXES ================= */
  // Cartes services : chaque colonne arrive à sa propre vitesse
  gsap.utils.toArray('.cap-card').forEach((card, i) => {
    gsap.fromTo(card, { y: [90, 170, 60, 140][i] }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '.capabilities__grid', start: 'top bottom', end: 'top 35%', scrub },
    })
  })
  gsap.utils.toArray('.ind-card').forEach((card, i) => {
    gsap.fromTo(card, { y: [120, 40, 160, 80][i] }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '.industries__grid', start: 'top bottom', end: 'top 30%', scrub },
    })
  })
  // Photo des panneaux : s'ouvre depuis la grille jusqu'au plein écran
  gsap.fromTo('.panels__media', { clipPath: 'inset(14% 5.49vw 0% 5.49vw)' }, {
    clipPath: 'inset(0% 0vw 0% 0vw)', ease: 'none',
    scrollTrigger: { trigger: '.panels', start: 'top bottom', end: 'top top', scrub: true },
  })
  // Fondu enchaîné des photos, piloté par l'arrivée de chaque carte
  const imgs = gsap.utils.toArray('.panels__img')
  gsap.utils.toArray('.panel-card').forEach((card, i) => {
    if (i === 0) return
    gsap.fromTo(imgs[i], { opacity: 0, scale: 1.08 }, {
      opacity: 1, scale: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 38%', scrub: true },
    })
  })

  /* ================= BANDEAU CINÉTIQUE ================= */
  const rows = gsap.utils.toArray('.kinetic__row').map((row) => {
    const track = row.querySelector('.kinetic__track')
    row.append(track.cloneNode(true), track.cloneNode(true))
    return { row, track, dir: +row.dataset.dir, x: 0 }
  })
  let kineticOn = false, scrollDir = 1
  new IntersectionObserver(([e]) => { kineticOn = e.isIntersecting }).observe(document.querySelector('.kinetic'))
  const skewTo = rows.map(({ row }) => gsap.quickTo(row, 'skewX', { duration: 0.5, ease: 'power3.out' }))
  gsap.ticker.add((_, dt) => {
    if (!kineticOn) return
    const v = lenis ? lenis.velocity : 0
    if (Math.abs(v) > 0.1) scrollDir = Math.sign(v)
    const speed = (0.9 + Math.min(Math.abs(v), 60) * 0.55) * (dt / 16.7)
    rows.forEach((r, i) => {
      const w = r.track.offsetWidth
      r.x = gsap.utils.wrap(-w, 0, r.x - speed * r.dir * scrollDir)
      gsap.set(r.row, { x: r.x })
      skewTo[i](gsap.utils.clamp(-12, 12, -v * 0.35 * r.dir))
    })
  })

  /* ================= ÉTAPES ================= */
  const steps = gsap.utils.toArray('.step').map((step) => splitWords(step))
  const counter = document.querySelector('.process__current')
  gsap.set(steps.flat(), { yPercent: 115 })
  const ptl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    scrollTrigger: {
      trigger: '.process', start: 'top 65%', end: 'bottom bottom', scrub,
      onUpdate: (self) => {
        const n = Math.min(4, Math.max(1, Math.floor(ptl.time() - 0.5) + 1))
        counter.textContent = `0${n}`
      },
    },
  })
  ptl.to(steps[0], { yPercent: 0, stagger: 0.02, duration: 0.5 }, 0)
  ptl.fromTo('.process__digits-track', { yPercent: 25 }, { yPercent: 0, duration: 0.5 }, 0)
  ;[1, 2, 3].forEach((i) => {
    const t = 0.5 + i
    ptl.to(steps[i - 1], { yPercent: -115, stagger: 0.015, duration: 0.45 }, t)
    ptl.to(steps[i], { yPercent: 0, stagger: 0.02, duration: 0.5 }, t + 0.15)
    ptl.to('.process__digits-track', { yPercent: -25 * i, duration: 0.6 }, t)
  })
  ptl.fromTo('.process__fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 4.2 }, 0)
  ptl.set({}, {}, 4.5)

  /* ================= AVIS ================= */
  const track = document.querySelector('.reviews__track')
  const hScroll = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: { trigger: '.reviews', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
  })
  gsap.utils.toArray('.review').forEach((card) => {
    gsap.fromTo(splitWords(card.querySelector('blockquote')), { yPercent: 115 }, {
      yPercent: 0, ease: 'power2.out', stagger: 0.04,
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 96%', end: 'left 60%', scrub },
    })
    gsap.fromTo(card, { rotate: 4, y: 60 }, {
      rotate: 0, y: 0, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 100%', end: 'left 55%', scrub },
    })
  })
  const score = document.querySelector('.reviews__num')
  const scoreObj = { v: 0 }
  gsap.to(scoreObj, {
    v: +score.dataset.to, ease: 'power2.out',
    onUpdate: () => { score.textContent = scoreObj.v.toFixed(1).replace('.', ',') },
    scrollTrigger: { trigger: '.reviews', start: 'top 85%', end: 'top 10%', scrub },
  })

  /* ================= CARTE ================= */
  const mapST = { trigger: '.location', start: 'top bottom', end: 'center 45%', scrub }
  gsap.fromTo('.st-minor', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: mapST })
  gsap.fromTo('.st-major', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'power1.inOut', scrollTrigger: mapST })
  gsap.fromTo(['.st-rail', '.st-park'], { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: mapST })
  gsap.fromTo('.location__drop', { y: -260, opacity: 0 }, {
    y: 0, opacity: 1, ease: 'bounce.out',
    scrollTrigger: { trigger: '.location', start: 'top 55%', end: 'top 15%', scrub },
  })
  gsap.fromTo('.location__map', { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.location', start: 'top bottom', end: 'bottom top', scrub: true } })
}

window.addEventListener('load', () => ScrollTrigger.refresh())
