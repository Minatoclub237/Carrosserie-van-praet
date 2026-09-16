// Barre d'action flottante (mobile) : WhatsApp pour envoyer des photos + appel.
// Apparaît une fois le hero dépassé, s'efface au-dessus des sections qui ont leurs propres contrôles.
import { siWhatsapp } from 'simple-icons'
import { tr } from './i18n.js'

const PHONE = '32477777036'
const T = {
  msg: { fr: 'Bonjour, je souhaite un devis pour ma voiture. Voici quelques photos des dégâts :', en: 'Hello, I would like a quote for my car. Here are some photos of the damage:', nl: 'Goedendag, ik wil graag een offerte voor mijn wagen. Hier zijn enkele foto’s van de schade:' },
  chip: { fr: 'Devis photo', en: 'Photo quote', nl: 'Foto-offerte' },
  wa: { fr: 'Envoyer des photos sur WhatsApp', en: 'Send photos on WhatsApp', nl: 'Foto’s sturen via WhatsApp' },
  call: { fr: 'Appeler l’atelier', en: 'Call the workshop', nl: 'Bel de werkplaats' },
  group: { fr: 'Contact rapide', en: 'Quick contact', nl: 'Snel contact' },
}
const PHONE_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" fill="currentColor"/></svg>'

export function initDock() {
  const dock = document.createElement('div')
  dock.className = 'dock'
  dock.setAttribute('role', 'group')
  dock.innerHTML = `
    <a class="dock__wa" target="_blank" rel="noopener">
      <span class="dock__wa-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${siWhatsapp.path}"/></svg></span>
      <span class="dock__chip"></span>
    </a>
    <a class="dock__call" href="tel:+${PHONE}">${PHONE_ICON}</a>`
  document.body.append(dock)
  const wa = dock.querySelector('.dock__wa')
  const call = dock.querySelector('.dock__call')

  const setLang = () => {
    dock.setAttribute('aria-label', tr(T.group))
    wa.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(tr(T.msg))}`
    wa.setAttribute('aria-label', tr(T.wa))
    wa.querySelector('.dock__chip').textContent = tr(T.chip)
    call.setAttribute('aria-label', tr(T.call))
  }
  setLang()

  // Visible après le hero, sauf au-dessus du catalogue 3D, du formulaire et du pied de page
  let pastHero = false
  const blocked = new Set()
  const update = () => {
    const show = pastHero && blocked.size === 0
    dock.classList.toggle('is-visible', show)
    dock.inert = !show
  }
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; update() }).observe(document.getElementById('hero'))
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? blocked.add(e.target) : blocked.delete(e.target)))
    update()
  })
  ;['#prestations', '#devis', '#contact'].forEach((sel) => { const el = document.querySelector(sel); if (el) io.observe(el) })
  update()

  return { setLang }
}
