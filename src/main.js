import '@fontsource/michroma'
import '@fontsource-variable/sora'
import '@fontsource/monaspace-neon/400.css'
import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { renderBrands } from './brands.js'
import { initFaq } from './faq.js'
import { initPrestations } from './prestations.js'
import { initGoogleReviews } from './google-reviews.js'

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
  if (id.startsWith('#presta-') && typeof presta !== 'undefined') {
    const i = presta.indexOf(id.slice(1))
    if (i >= 0) { e.preventDefault(); presta.scrollToIndex(i); return }
  }
  const el = id === '#top' ? 0 : document.querySelector(id)
  if (el === null) return
  e.preventDefault()
  lenis ? lenis.scrollTo(el, { offset: id === '#top' ? 0 : -70, duration: 1.4 }) : window.scrollTo(0, el ? el.offsetTop - 70 : 0)
})

/* ---------- Vidéo hero : lecture en boucle (relance si le navigateur la met en pause) ---------- */
const video = document.querySelector('.hero__video')
video.play().catch(() => {})
document.addEventListener('visibilitychange', () => { if (!document.hidden) video.play().catch(() => {}) })

/* ---------- Statut d'ouverture en direct (heure de Bruxelles) ---------- */
{
  const HOURS = { 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 14] } // dimanche fermé
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  const card = document.querySelector('.hero-call')
  const label = card?.querySelector('[data-open-status]')
  const update = () => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Brussels', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
      .formatToParts(new Date()).map((p) => [p.type, p.value]))
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday)
    const now = +parts.hour % 24 + +parts.minute / 60
    const today = HOURS[day]
    const open = today && now >= today[0] && now < today[1]
    let text
    if (open) text = `Ouvert · jusqu’à ${today[1]}:00`
    else {
      // prochaine ouverture : plus tard aujourd'hui ou jour suivant
      let d = day, first = true
      while (!(HOURS[d] && (!first || now < HOURS[d][0]))) { d = (d + 1) % 7; first = false }
      const when = d === day ? 'aujourd’hui' : d === (day + 1) % 7 ? 'demain' : DAYS[d]
      text = `Fermé · ouvre ${when} à ${HOURS[d][0]}:00`
    }
    label.textContent = text
    card.classList.toggle('is-open', !!open)
    card.classList.toggle('is-closed', !open)
  }
  if (card) { update(); setInterval(update, 60000) }
}

/* ---------- Nav : largeur pleine au repos, recadrée sur la grille dès qu'on défile ---------- */
const nav = document.getElementById('nav')
const setNav = (y) => nav.classList.toggle('is-scrolled', y > 8)
setNav(window.scrollY)
lenis ? lenis.on('scroll', ({ scroll }) => setNav(scroll)) : window.addEventListener('scroll', () => setNav(window.scrollY), { passive: true })

/* ---------- Bande des marques ---------- */
renderBrands(document.querySelector('.brands__track'))

/* ---------- Fenêtres légales (dialog natif) ---------- */
document.querySelectorAll('[data-dialog]').forEach((btn) => {
  const dlg = document.getElementById(btn.dataset.dialog)
  btn.addEventListener('click', () => { dlg.showModal(); lenis?.stop() })
  dlg.addEventListener('close', () => lenis?.start())
  dlg.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) return dlg.close()
    // Clic sur le fond assombri (hors du cadre de la fenêtre) : fermeture
    const r = dlg.getBoundingClientRect()
    if (e.target === dlg && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dlg.close()
  })
})

/* ---------- Catalogue : carrousel 3D ---------- */
const presta = initPrestations(document.getElementById('prestations'), { lenis, reduced })

/* ---------- Avis Google en boucle ---------- */
initGoogleReviews(document.getElementById('avis-google'), { lenis, reduced })

/* ---------- FAQ ---------- */
initFaq(document.getElementById('faq'), { reduced })

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
  // Arrivée : titre ligne par ligne, puis informations, actions et badges d'avis
  gsap.fromTo('.hero__title .mask__line', { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.09, delay: 0.15 })
  gsap.fromTo('.hero__sub .mask__line', { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.09, delay: 0.5 })
  gsap.fromTo('.hero__eyebrow', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.7 })
  gsap.fromTo(['.hero-btn', '.hero-call'], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.85 })
  gsap.fromTo('.hero-badge', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.9 })

  // Séquence au défilement : le titre se disperse, les chiffres montent et comptent
  const nums = gsap.utils.toArray('.hero-num')
  gsap.set(nums, { opacity: 0, y: 70 })
  const htl = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
  htl.to('.hero__scroll', { opacity: 0, duration: 0.1 }, 0)
    .to(heroChars, { y: () => -gsap.utils.random(80, 340), rotate: () => gsap.utils.random(-18, 18), opacity: 0, ease: 'power1.in', stagger: { each: 0.004, from: 'random' }, duration: 0.45 }, 0.05)
    .to(['.hero__eyebrow', '.hero__sub', '.hero__actions'], { opacity: 0, y: -50, ease: 'power1.in', duration: 0.3 }, 0.05)
    .to(nums, { opacity: 1, y: 0, ease: 'power3.out', stagger: 0.08, duration: 0.4 }, 0.45)
  nums.forEach((n, i) => {
    const b = n.querySelector('b'), to = +b.dataset.count, o = { v: 0 }
    htl.to(o, { v: to, ease: 'power2.out', duration: 0.45, onUpdate: () => { b.textContent = Math.round(o.v) } }, 0.5 + i * 0.08)
  })
  htl.to({}, { duration: 0.15 })

  // Fin de séquence : la scène est recouverte par « savoir-faire » (hero à ~50 % de la vitesse)
  gsap.to('.hero__stage', { yPercent: 48, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'bottom bottom', end: 'bottom top', scrub: true } })

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
    scale: 1, letterSpacing: '0.035em', opacity: 1, ease: 'power2.out',
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
    gsap.fromTo(imgs[i], { opacity: 0 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 80%', end: 'top 38%', scrub: true },
    })
  })
  // Chaque photo zoome lentement pendant qu'elle est à l'écran (effet Ken Burns lié au défilement)
  imgs.forEach((fig, i) => {
    const cards = gsap.utils.toArray('.panel-card')
    gsap.fromTo(fig.querySelector('img'), { scale: 1.14, xPercent: 2 }, {
      scale: 1, xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: cards[i], start: 'top 90%', endTrigger: cards[i + 1] || '.panels__hold', end: 'top 20%', scrub: true },
    })
    gsap.fromTo(fig.querySelector('.panels__cap'), { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, ease: 'power2.out',
      scrollTrigger: { trigger: cards[i], start: 'top 60%', end: 'top 35%', scrub: true },
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

  /* ================= CATALOGUE ================= */
  const prestaNum = document.querySelector('[data-presta-count]')
  const prestaObj = { v: 0 }
  gsap.to(prestaObj, {
    v: () => +prestaNum.dataset.to, ease: 'power2.out',
    onUpdate: () => { prestaNum.textContent = Math.round(prestaObj.v) },
    scrollTrigger: { trigger: '.presta', start: 'top 85%', end: 'top 15%', scrub },
  })

  /* ================= AVIS GOOGLE ================= */
  // La bande s'ouvre de haut en bas à son arrivée, les flèches suivent (réversible)
  gsap.fromTo('.greviews__strip', { clipPath: 'inset(0% 0% 100% 0% round 16px)', y: 70 }, {
    clipPath: 'inset(0% 0% 0% 0% round 16px)', y: 0, ease: 'power2.out',
    scrollTrigger: { trigger: '.greviews__strip', start: 'top 95%', end: 'top 55%', scrub },
  })
  gsap.fromTo('.greviews__arrow', { y: 30, opacity: 0 }, {
    y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.greviews__nav', start: 'top 100%', end: 'top 80%', scrub },
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
  const reviewCards = gsap.utils.toArray('.review')
  reviewCards.forEach((card) => {
    // Entrée liée au défilement : la carte arrive inclinée et basse, se redresse en glissant
    gsap.fromTo(card, { rotate: 5, y: 90 }, {
      rotate: 0, y: 0, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 100%', end: 'left 58%', scrub },
    })
    gsap.fromTo(splitWords(card.querySelector('blockquote')), { yPercent: 115 }, {
      yPercent: 0, ease: 'power2.out', stagger: 0.04,
      scrollTrigger: { trigger: card, containerAnimation: hScroll, start: 'left 94%', end: 'left 55%', scrub },
    })
  })

  // Carte active = survolée (ordinateur) ; sinon celle qui passe au centre de l'écran (ordinateur et mobile)
  const rail = document.querySelector('.reviews__rail')
  const canHover = window.matchMedia('(hover: hover)').matches
  let hovered = null
  const setActive = (active) => reviewCards.forEach((c) => c.classList.toggle('is-active', c === active))
  const activateCentered = () => {
    if (hovered) return
    const mid = window.innerWidth / 2
    let best = null, bestD = Infinity
    reviewCards.forEach((c) => {
      const r = c.getBoundingClientRect()
      const d = Math.abs(r.left + r.width / 2 - mid)
      if (d < bestD) { bestD = d, best = c }
    })
    // Seuil lié à la largeur de carte : toujours une carte active quand le rail est à l'écran
    setActive(best && bestD < Math.max(window.innerWidth * 0.3, best.offsetWidth * 0.62) ? best : null)
  }
  ScrollTrigger.create({ trigger: '.reviews', start: 'top top', end: 'bottom bottom', onUpdate: activateCentered, onLeave: () => setActive(null), onLeaveBack: () => setActive(null) })
  if (canHover) {
    reviewCards.forEach((c) => {
      c.addEventListener('mouseenter', () => { hovered = c; setActive(c) })
      c.addEventListener('mouseleave', () => { hovered = null; activateCentered() })
    })
    rail.addEventListener('mouseleave', () => { hovered = null; activateCentered() })
  }
  const score = document.querySelector('.reviews__num')
  const scoreObj = { v: 0 }
  gsap.to(scoreObj, {
    v: +score.dataset.to, ease: 'power2.out',
    onUpdate: () => { score.textContent = scoreObj.v.toFixed(1).replace('.', ',') },
    scrollTrigger: { trigger: '.reviews', start: 'top 85%', end: 'top 10%', scrub },
  })
}

window.addEventListener('load', () => ScrollTrigger.refresh())
