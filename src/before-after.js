// Avant / après : deux photos superposées au même cadrage, la photo « après » est découverte
// par un clip-path piloté par une seule variable CSS (--x). Glisser, clavier et révélation
// automatique passent tous par le même setter, ils ne se contredisent jamais.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function initBeforeAfter(root, { reduced }) {
  gsap.utils.toArray(root.querySelectorAll('.ba')).forEach((ba) => {
    let pending = 100, frame = 0, touched = false
    const apply = () => {
      frame = 0
      ba.style.setProperty('--x', `${pending.toFixed(2)}%`)
      ba.setAttribute('aria-valuenow', String(Math.round(100 - pending)))
      ba.classList.toggle('at-after', pending < 12)
      ba.classList.toggle('at-before', pending > 88)
    }
    const set = (pct) => {
      pending = gsap.utils.clamp(0, 100, pct)
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const pctFrom = (e) => {
      const r = ba.getBoundingClientRect()
      return ((e.clientX - r.left) / r.width) * 100
    }

    // À l'arrivée dans l'écran la carte est entièrement « avant », puis la réparation se découvre
    const rev = { v: 100 }
    set(reduced ? 50 : 100)
    if (!reduced) {
      const reveal = gsap.to(rev, { v: 45, duration: 1.8, ease: 'power2.inOut', paused: true, onUpdate: () => { if (!touched) set(rev.v) } })
      ScrollTrigger.create({
        trigger: ba, start: 'top 82%', end: 'bottom top',
        onEnter: () => reveal.play(), onEnterBack: () => reveal.play(),
        onLeaveBack: () => { if (!touched) reveal.reverse() },
      })
      ba._takeOver = () => { touched = true; reveal.pause() }
    }
    const takeOver = () => { ba._takeOver?.(); touched = true; ba.classList.add('touched') }

    // Glisser (souris et doigt) ; touch-action: pan-y laisse le défilement vertical au navigateur
    const drag = (e) => set(pctFrom(e))
    const release = (e) => {
      ba.removeEventListener('pointermove', drag)
      if (e?.pointerId !== undefined && ba.hasPointerCapture?.(e.pointerId)) ba.releasePointerCapture(e.pointerId)
    }
    ba.addEventListener('pointerdown', (e) => {
      takeOver()
      if (e.pointerId !== undefined) ba.setPointerCapture?.(e.pointerId)
      set(pctFrom(e))
      ba.addEventListener('pointermove', drag)
    })
    ba.addEventListener('pointerup', release)
    ba.addEventListener('pointercancel', release)

    // Clavier : flèches par pas de 5 %, Début / Fin pour les extrêmes
    ba.addEventListener('keydown', (e) => {
      const step = { ArrowLeft: -5, ArrowRight: 5 }[e.key]
      if (step !== undefined) { e.preventDefault(); takeOver(); set(pending + step) }
      if (e.key === 'Home') { e.preventDefault(); takeOver(); set(0) }
      if (e.key === 'End') { e.preventDefault(); takeOver(); set(100) }
    })
  })
}
