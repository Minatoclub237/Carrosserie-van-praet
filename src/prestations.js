// Catalogue des prestations — liste relevée sur la fiche Bolid de l'atelier (13 domaines, 51 prestations).
// ⚠ À faire confirmer par le client avant mise en ligne (fiche d'annuaire possiblement générique).
// Présentation : carrousel 3D piloté par le défilement (scène sticky, pas de pin).
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tr } from './i18n.js'

const CATALOGUE = [
  { title: { fr: 'Carrosserie', en: 'Bodywork', nl: 'Carrosserie' }, items: [{ fr: 'Réparation de carrosserie (choc important, accident)', en: 'Bodywork repair (major impact, accident)', nl: 'Carrosserieherstelling (zware aanrijding, ongeval)' }, { fr: 'Rénovation de carrosserie (peinture, rayures, bosses)', en: 'Bodywork renovation (paint, scratches, dents)', nl: 'Carrosserierenovatie (lak, krassen, deuken)' }, { fr: 'Changement de rétroviseur', en: 'Mirror replacement', nl: 'Buitenspiegel vervangen' }, { fr: 'Réparation de rétroviseur', en: 'Mirror repair', nl: 'Buitenspiegel herstellen' }] },
  { title: { fr: 'Vision', en: 'Lighting', nl: 'Zicht' }, items: [{ fr: 'Rénovation des optiques (feux, phares)', en: 'Headlight restoration (lights, headlamps)', nl: 'Renovatie van koplampen en lichten' }, { fr: 'Réglage des optiques', en: 'Headlight alignment', nl: 'Afstellen van de lichten' }, { fr: 'Changement de phare avant', en: 'Front headlight replacement', nl: 'Koplamp vervangen' }, { fr: 'Changement de feu arrière', en: 'Rear light replacement', nl: 'Achterlicht vervangen' }, { fr: 'Ampoules de phares avant', en: 'Front headlight bulbs', nl: 'Lampjes koplampen' }, { fr: 'Ampoules de feux arrière', en: 'Rear light bulbs', nl: 'Lampjes achterlichten' }, { fr: 'Ampoules de clignotants', en: 'Indicator bulbs', nl: 'Lampjes richtingaanwijzers' }, { fr: 'Ampoules de feux antibrouillard', en: 'Fog light bulbs', nl: 'Lampjes mistlichten' }, { fr: 'Balais d’essuie-glace', en: 'Wiper blades', nl: 'Ruitenwisserbladen' }] },
  { title: { fr: 'Révision & vidange', en: 'Servicing & oil change', nl: 'Onderhoud & olieverversing' }, items: [{ fr: 'Vidange + filtre à huile', en: 'Oil change + oil filter', nl: 'Olieverversing + oliefilter' }, { fr: 'Vidange + 3 filtres', en: 'Oil change + 3 filters', nl: 'Olieverversing + 3 filters' }] },
  { title: { fr: 'Freinage', en: 'Brakes', nl: 'Remmen' }, items: [{ fr: 'Plaquettes de frein', en: 'Brake pads', nl: 'Remblokken' }, { fr: 'Disques et plaquettes', en: 'Discs and pads', nl: 'Remschijven en remblokken' }, { fr: 'Kit de frein à tambour arrière', en: 'Rear drum brake kit', nl: 'Kit trommelremmen achter' }, { fr: 'Purge du liquide de frein', en: 'Brake fluid bleed', nl: 'Remvloeistof ontluchten' }] },
  { title: { fr: 'Embrayage', en: 'Clutch', nl: 'Koppeling' }, items: [{ fr: 'Kit d’embrayage', en: 'Clutch kit', nl: 'Koppelingskit' }, { fr: 'Kit d’embrayage et volant moteur', en: 'Clutch kit and flywheel', nl: 'Koppelingskit en vliegwiel' }, { fr: 'Vidange de boîte manuelle', en: 'Manual gearbox oil change', nl: 'Olie manuele versnellingsbak verversen' }, { fr: 'Vidange de boîte automatique', en: 'Automatic gearbox oil change', nl: 'Olie automatische versnellingsbak verversen' }] },
  { title: { fr: 'Distribution', en: 'Timing', nl: 'Distributie' }, items: [{ fr: 'Kit de courroie de distribution', en: 'Timing belt kit', nl: 'Distributieriemkit' }, { fr: 'Chaîne de distribution', en: 'Timing chain', nl: 'Distributieketting' }, { fr: 'Courroie d’accessoire', en: 'Accessory belt', nl: 'Multiriem' }, { fr: 'Kit de courroie d’accessoire', en: 'Accessory belt kit', nl: 'Multiriemkit' }] },
  { title: { fr: 'Moteur', en: 'Engine', nl: 'Motor' }, items: [{ fr: 'Bougies d’allumage', en: 'Spark plugs', nl: 'Bougies' }, { fr: 'Bougies de préchauffage', en: 'Glow plugs', nl: 'Gloeibougies' }, { fr: 'Injecteur', en: 'Injector', nl: 'Injector' }, { fr: 'Filtre à air', en: 'Air filter', nl: 'Luchtfilter' }, { fr: 'Filtre à carburant', en: 'Fuel filter', nl: 'Brandstoffilter' }, { fr: 'Purge du liquide de refroidissement', en: 'Coolant flush', nl: 'Koelvloeistof verversen' }] },
  { title: { fr: 'Échappement', en: 'Exhaust', nl: 'Uitlaat' }, items: [{ fr: 'Filtre à particules (FAP)', en: 'Diesel particulate filter (DPF)', nl: 'Roetfilter (DPF)' }, { fr: 'Recharge d’additif FAP', en: 'DPF additive refill', nl: 'Additief roetfilter bijvullen' }, { fr: 'Vanne EGR', en: 'EGR valve', nl: 'EGR-klep' }, { fr: 'Décalaminage', en: 'Decarbonising', nl: 'Ontkoling' }, { fr: 'Silencieux arrière', en: 'Rear silencer', nl: 'Achterdemper' }] },
  { title: { fr: 'Démarrage & charge', en: 'Starting & charging', nl: 'Starten & laden' }, items: [{ fr: 'Batterie', en: 'Battery', nl: 'Batterij' }, { fr: 'Démarreur', en: 'Starter motor', nl: 'Startmotor' }, { fr: 'Alternateur', en: 'Alternator', nl: 'Dynamo' }] },
  { title: { fr: 'Suspensions', en: 'Suspension', nl: 'Ophanging' }, items: [{ fr: 'Amortisseurs', en: 'Shock absorbers', nl: 'Schokdempers' }, { fr: 'Triangle / bras de suspension', en: 'Wishbone / control arm', nl: 'Draagarm' }, { fr: 'Rotule de suspension', en: 'Suspension ball joint', nl: 'Fusekogel' }, { fr: 'Biellette de barre stabilisatrice', en: 'Anti-roll bar link', nl: 'Stabilisatorstang' }] },
  { title: { fr: 'Direction & transmission', en: 'Steering & transmission', nl: 'Stuurinrichting & transmissie' }, items: [{ fr: 'Biellette de direction', en: 'Steering tie rod', nl: 'Stuurstang' }, { fr: 'Rotule de direction', en: 'Steering ball joint', nl: 'Stuurkogel' }, { fr: 'Cardan', en: 'CV joint', nl: 'Aandrijfas' }, { fr: 'Soufflet de cardan', en: 'CV joint boot', nl: 'Aandrijfashoes' }] },
  { title: { fr: 'Climatisation', en: 'Air conditioning', nl: 'Airco' }, items: [{ fr: 'Filtre d’habitacle', en: 'Cabin filter', nl: 'Interieurfilter' }] },
  { title: { fr: 'Pneus & roues', en: 'Tyres & wheels', nl: 'Banden & wielen' }, items: [{ fr: 'Roulements de roue', en: 'Wheel bearings', nl: 'Wiellagers' }] },
]

const N = CATALOGUE.length
export const CATALOGUE_COUNT = CATALOGUE.reduce((n, c) => n + c.items.length, 0)
export const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const pad = (n) => String(n).padStart(2, '0')
const UNIT = { fr: ['prestation', 'prestations'], en: ['service', 'services'], nl: ['dienst', 'diensten'] }
const countLabel = (n) => `${n} ${tr(UNIT)[n > 1 ? 1 : 0]}`
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function initPrestations(section, { lenis, reduced }) {
  const deck = section.querySelector('.presta__deck')
  const rail = section.querySelector('.presta__ticks')
  const fill = section.querySelector('.presta__fill')
  const curEl = section.querySelector('.presta__current')
  const nameEl = section.querySelector('.presta__name')
  const countEl = section.querySelector('.presta__active-count')

  section.querySelector('[data-presta-count]').dataset.to = CATALOGUE_COUNT
  section.querySelector('[data-presta-domains]').textContent = N

  deck.innerHTML = CATALOGUE.map((c, i) => `
    <article class="pcard${c.items.length > 6 ? ' pcard--long' : ''}" id="presta-${slug(c.title.fr)}" data-index="${i}">
      <div class="pcard__media" aria-hidden="true">
        <img class="pcard__img" src="/media/presta-${pad(i + 1)}.webp" width="1376" height="768" alt="" loading="lazy" decoding="async" />
        <span class="pcard__big">${pad(i + 1)}</span>
        <i class="pcard__sheen"></i>
      </div>
      <div class="pcard__body">
        <header class="pcard__head">
          <span class="pcard__num">${pad(i + 1)}</span>
          <h3 class="pcard__title">${tr(c.title)}</h3>
          <span class="pcard__count">${pad(c.items.length)}</span>
        </header>
        <ul class="pcard__list">${c.items.map((it) => `<li>${tr(it)}</li>`).join('')}</ul>
      </div>
    </article>`).join('')
  rail.innerHTML = CATALOGUE.map((c, i) => `<button type="button" class="presta__tick" data-i="${i}" aria-label="${tr(c.title)}"><span>${tr(c.title)}</span></button>`).join('')

  const cards = [...deck.children]
  const ticks = [...rail.children]

  // Position de défilement qui amène la carte i face à l'utilisateur
  const scrollFor = (i) => {
    const top = section.getBoundingClientRect().top + window.scrollY
    return top + (i / (N - 1)) * (section.offsetHeight - window.innerHeight)
  }
  const scrollToIndex = (i) => lenis ? lenis.scrollTo(scrollFor(i), { duration: 1.4 }) : window.scrollTo({ top: scrollFor(i), behavior: 'smooth' })
  rail.addEventListener('click', (e) => { const t = e.target.closest('.presta__tick'); if (t) scrollToIndex(+t.dataset.i) })

  /* ---------- Panneau d'information : bascule animée à chaque changement de carte ---------- */
  let active = -1, swapTl
  const setActive = (i) => {
    if (i === active) return
    const dir = i > active ? 1 : -1
    active = i
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i))
    ticks.forEach((t, k) => t.classList.toggle('is-on', k === i))
    swapTl?.kill()
    const els = [curEl, nameEl, countEl]
    if (reduced) {
      curEl.textContent = pad(i + 1); nameEl.textContent = tr(CATALOGUE[i].title); countEl.textContent = countLabel(CATALOGUE[i].items.length)
      return
    }
    swapTl = gsap.timeline()
      .to(els, { yPercent: -60 * dir, opacity: 0, duration: 0.18, ease: 'power2.in', stagger: 0.03 })
      .add(() => {
        curEl.textContent = pad(i + 1)
        nameEl.textContent = tr(CATALOGUE[i].title)
        countEl.textContent = countLabel(CATALOGUE[i].items.length)
      })
      .fromTo(els, { yPercent: 60 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05 })
  }

  /* ---------- Géométrie du carrousel 3D ---------- */
  let geo = {}
  const measure = () => {
    const w = window.innerWidth, mobile = w < 900
    geo = mobile
      ? { near: w * 0.62, far: w * 0.16, depth: 150, rot: 38, lift: 40 }
      : { near: w * 0.19, far: w * 0.085, depth: 190, rot: 44, lift: 70 }
  }
  measure()
  window.addEventListener('resize', () => { measure(); layout(state.p) })

  const state = { p: 0 }
  const layout = (p) => {
    cards.forEach((card, i) => {
      const o = i - p, ao = Math.abs(o), s = Math.sign(o)
      const x = s * (ao < 1 ? ao * geo.near : geo.near + (ao - 1) * geo.far)
      const z = -Math.min(ao, 4.5) * geo.depth + Math.max(0, 1 - ao * 1.6) * geo.lift
      const ry = -clamp(o, -1, 1) * geo.rot - clamp(o, -4, 4) * 2
      const rz = clamp(o, -3, 3) * 1.2
      const y = Math.min(ao, 4) * 14
      const opacity = ao > 4.6 ? 0 : 1 - Math.max(0, ao - 3.2) * 0.7
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`
      card.style.opacity = opacity.toFixed(3)
      card.style.zIndex = String(100 - Math.round(ao * 10))
      card.style.setProperty('--dim', Math.min(ao, 2.4) / 2.4)
      card.style.visibility = opacity <= 0 ? 'hidden' : 'visible'
    })
    fill.style.transform = `scaleX(${p / (N - 1)})`
    setActive(clamp(Math.round(p), 0, N - 1))
  }
  layout(0)


  const setLang = () => {
    cards.forEach((card, i) => {
      const c = CATALOGUE[i]
      card.querySelector('.pcard__title').textContent = tr(c.title)
      card.querySelectorAll('.pcard__list li').forEach((li, k) => { li.textContent = tr(c.items[k]) })
      ticks[i].setAttribute('aria-label', tr(c.title))
      ticks[i].querySelector('span').textContent = tr(c.title)
    })
    if (active >= 0) {
      nameEl.textContent = tr(CATALOGUE[active].title)
      countEl.textContent = countLabel(CATALOGUE[active].items.length)
    }
  }

  if (reduced) {
    section.classList.add('presta--static')
    return { scrollToIndex, setLang, indexOf: (id) => cards.findIndex((c) => c.id === id) }
  }

  // Progression 0 → 12 liée au défilement de la section (lissée), mise en page à chaque image
  gsap.to(state, {
    p: N - 1, ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.9 },
    onUpdate: () => layout(state.p),
  })

  // Inclinaison du plateau selon la vitesse de défilement : donne du poids au mouvement
  const tiltX = gsap.quickTo(deck, 'rotateX', { duration: 0.6, ease: 'power3.out' })
  const tiltZ = gsap.quickTo(deck, 'rotateZ', { duration: 0.8, ease: 'power3.out' })
  let vel = 0, inView = false
  ScrollTrigger.create({
    trigger: section, start: 'top bottom', end: 'bottom top',
    onToggle: (self) => { inView = self.isActive },
    onUpdate: (self) => { vel = clamp(self.getVelocity() / 2600, -1, 1) },
  })
  // La vitesse retombe progressivement : le plateau revient au repos en douceur à l'arrêt
  gsap.ticker.add(() => {
    if (!inView) return
    vel *= 0.9
    tiltX(-vel * 9); tiltZ(vel * 1.5)
  })

  return { scrollToIndex, setLang, indexOf: (id) => cards.findIndex((c) => c.id === id) }
}
