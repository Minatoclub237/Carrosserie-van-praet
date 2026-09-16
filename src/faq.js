// FAQ : objections réelles d'un client de carrosserie, réponses fondées sur les faits vérifiés
// (fiche Google, Fixico, Bolid, registre). Chaque réponse porte son propre CTA bleu.
const TEL = 'tel:+32477777036'
const FIXICO = 'https://fixico.be/fr/villes/schaerbeek/garage-van-praet'
const MAPS = 'https://maps.app.goo.gl/2hibFTy7Ff3hPFmB8'

const CATEGORIES = [
  { key: 'devis', label: 'Devis & prix' },
  { key: 'reparation', label: 'Réparation & garantie' },
  { key: 'atelier', label: 'Atelier & pratique' },
]

const FAQS = {
  devis: [
    { q: 'Le devis est-il vraiment gratuit, même si je ne fais pas réparer chez vous ?',
      a: 'Oui. Le devis est gratuit et sans engagement : quelques photos des dégâts suffisent, et vous recevez le chiffrage sous 24 heures. Vous restez libre de comparer ou de ne pas donner suite.',
      cta: { label: 'Demander mon devis gratuit', href: '#devis' } },
    { q: 'Le prix final peut-il dépasser le montant du devis ?',
      a: 'Non : le prix annoncé est le prix payé. Plusieurs clients le soulignent dans leurs avis Fixico, où l’atelier obtient 9,5/10 sur 34 évaluations.',
      cta: { label: 'Vérifier les avis sur Fixico', href: FIXICO, external: true } },
    { q: 'Pourquoi paierais-je moins cher qu’en concession pour le même résultat ?',
      a: 'L’atelier est indépendant et la peinture est réalisée sur place, dans sa propre cabine. Un client Audi indique avoir payé le remplacement de son pare-chocs arrière environ moitié moins cher qu’ailleurs.',
      cta: { label: 'Faire comparer mon devis actuel', href: TEL } },
    { q: 'Quels moyens de paiement acceptez-vous ?',
      a: 'Les espèces, Bancontact et la carte de crédit.',
      cta: { label: 'Voir les horaires de l’atelier', href: '#contact' } },
    { q: 'Dois-je me déplacer pour obtenir un chiffrage ?',
      a: 'Non. Des photos nettes de la zone abîmée, prises de face et de biais, suffisent pour un premier chiffrage, sans rendez-vous.',
      cta: { label: 'Voir les 4 étapes', href: '#etapes' } },
  ],
  reparation: [
    { q: 'La retouche aura-t-elle exactement la même teinte que le reste de ma carrosserie ?',
      a: 'C’est l’intérêt de la cabine de peinture de l’atelier : les raccords de teinte sur rayures et les éléments repeints sont réalisés sur place, puis finis par un polissage professionnel.',
      cta: { label: 'Découvrir la peinture en cabine', href: '#atelier' } },
    { q: 'Montez-vous des pièces d’origine ?',
      a: 'Oui, l’atelier travaille avec des pièces d’origine, un point relevé par des clients dans leurs avis. Demandez le détail des pièces prévues au moment du devis.',
      cta: { label: 'Demander le détail des pièces', href: TEL } },
    { q: 'Que se passe-t-il si un défaut apparaît après la réparation ?',
      a: 'Les réparations sont garanties 2 ans. Si un problème lié aux travaux réapparaît pendant cette période, contactez l’atelier pour qu’il soit repris.',
      cta: { label: 'Signaler un souci à l’atelier', href: TEL } },
    { q: 'Combien de jours ma voiture sera-t-elle immobilisée ?',
      a: 'Cela dépend des dégâts et des pièces à commander. Pour une réparation de carrosserie courante, un client a récupéré son véhicule en deux jours, et plusieurs l’ont eu avant la date prévue. Demandez l’estimation au moment du devis.',
      cta: { label: 'Estimer le délai pour ma voiture', href: '#devis' } },
    { q: 'Mes phares sont jaunis et éclairent mal : faut-il les remplacer ?',
      a: 'Pas forcément. L’atelier propose la rénovation des optiques, qui redonne de la transparence aux phares ternis, ainsi que le réglage des feux. Si l’optique est fissurée, le phare avant ou le feu arrière peut aussi être remplacé.',
      cta: { label: 'Voir les prestations « Vision »', href: '#presta-vision' } },
    { q: 'Travaillez-vous avec mon assurance ?',
      a: 'Chaque contrat et chaque sinistre sont différents. Appelez l’atelier avec les références de votre dossier : on vous explique comment procéder avec votre assureur avant de commencer les travaux.',
      cta: { label: 'Appeler avec mon dossier sinistre', href: TEL } },
  ],
  atelier: [
    { q: 'Prenez-vous en charge la marque de ma voiture ?',
      a: 'Très probablement : plus de 40 marques sont prises en charge, de Volkswagen à Tesla en passant par Toyota, Peugeot, BMW, Volvo ou Dacia.',
      cta: { label: 'Voir les marques prises en charge', href: '#marques' } },
    { q: 'Réparez-vous aussi la mécanique, ou seulement la carrosserie ?',
      a: 'Les deux, au même endroit : entretien et vidange, freins, embrayage, distribution, suspension, climatisation, éclairage et échappement.',
      cta: { label: 'Voir les 51 prestations', href: '#prestations' } },
    { q: 'Le voyant du filtre à particules (FAP) est allumé : pouvez-vous intervenir ?',
      a: 'Oui : l’atelier remplace le filtre à particules, recharge son additif, change la vanne EGR et réalise le décalaminage. Décrivez le voyant et les symptômes au téléphone pour une première orientation.',
      cta: { label: 'Voir les prestations « Échappement »', href: '#presta-echappement' } },
    { q: 'Ma voiture ne démarre plus : batterie, démarreur ou alternateur ?',
      a: 'Les trois sont pris en charge à l’atelier : changement de batterie, de démarreur ou d’alternateur. Le diagnostic permet de savoir lequel est en cause avant de remplacer quoi que ce soit.',
      cta: { label: 'Décrire la panne à l’atelier', href: 'tel:+32477777036' } },
    { q: 'Faites-vous la vidange et l’entretien courant ?',
      a: 'Oui, avec deux formules : vidange avec filtre à huile, ou vidange avec 3 filtres. Freins, bougies, filtres à air et à carburant, courroies et amortisseurs se changent aussi sur place.',
      cta: { label: 'Voir la révision & vidange', href: '#presta-revision-vidange' } },
    { q: 'Puis-je déposer ma voiture le samedi ?',
      a: 'Oui, l’atelier est ouvert le samedi de 9:00 à 14:00, et du lundi au vendredi de 9:00 à 18:00. Il est fermé le dimanche.',
      cta: { label: 'Itinéraire vers la rue Navez 103', href: MAPS, external: true } },
    { q: 'Est-ce que je peux être servi en néerlandais ?',
      a: 'Oui, l’accueil se fait en français et en néerlandais. Ja, u wordt ook in het Nederlands geholpen.',
      cta: { label: 'Bel de werkplaats', href: TEL } },
    { q: 'Peut-on prendre rendez-vous en ligne ?',
      a: 'Oui : l’atelier est référencé sur Fixico, qui permet de demander un devis et de réserver un créneau en ligne. Vous pouvez aussi simplement appeler.',
      cta: { label: 'Réserver un créneau sur Fixico', href: FIXICO, external: true } },
  ],
}

const CHEVRON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" fill="currentColor"/></svg>'
const ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const ring = (cls = '') => `<span class="spot-ring ${cls}" aria-hidden="true"></span>`

/* ---------- FadeUp : opacité 0 → 1 et y 24 → 0, une seule fois, à 30 % visible ---------- */
function fadeUp(el, delay, reduced) {
  el.classList.add('fade-up')
  if (reduced) el.classList.add('fade-up--reduced')
  el.style.transitionDelay = `${delay}s`
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    el.classList.add('is-in')
    io.disconnect()
  }, { threshold: 0.3 })
  io.observe(el)
}

/* ---------- Accordéon : un seul ouvert, refermable, hauteur animée 0,2 s ---------- */
function animateHeight(content, open) {
  const full = content.scrollHeight
  content.getAnimations().forEach((a) => a.cancel())
  content.style.height = 'auto'
  const anim = content.animate(
    open ? [{ height: '0px' }, { height: `${full}px` }] : [{ height: `${full}px` }, { height: '0px' }],
    { duration: 200, easing: 'ease-out' },
  )
  content.style.height = open ? 'auto' : '0px'
  anim.onfinish = () => { content.style.height = open ? 'auto' : '0px' }
}

export function initFaq(root, { reduced = false } = {}) {
  const tabs = root.querySelector('.faq__tabs')
  const list = root.querySelector('.faq__list')
  let active = 'devis'

  tabs.innerHTML = ring() + CATEGORIES.map((c) =>
    `<button type="button" class="faq__tab spot" data-key="${c.key}" aria-pressed="${c.key === active}">${ring('spot-ring--pill')}${c.label}</button>`).join('')

  // Typographie française : espace insécable avant ? : ; ! pour ne jamais les isoler en début de ligne
  const nb = (t) => t.replace(/ ([?:;!])/g, ' $1')
  const render = () => {
    list.innerHTML = FAQS[active].map((f, i) => {
      const id = `faq-${active}-${i}`
      const ext = f.cta.external ? ' target="_blank" rel="noopener"' : ''
      return `<div class="faq-item spot" data-state="closed">${ring()}
        <h3 class="faq-item__h"><button type="button" class="faq-item__trigger" aria-expanded="false" aria-controls="${id}">
          <span class="faq-item__q">${nb(f.q)}</span><span class="faq-item__icon">${CHEVRON}</span>
        </button></h3>
        <div class="faq-item__content" id="${id}" role="region" style="height:0px">
          <div class="faq-item__body"><p>${nb(f.a)}</p><a class="faq-cta" href="${f.cta.href}"${ext}>${f.cta.label} ${ARROW}</a></div>
        </div>
      </div>`
    }).join('')
    ;[...list.children].forEach((item, i) => fadeUp(item, 0.15 * i, reduced))
  }
  render()

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq__tab')
    if (!btn || btn.dataset.key === active) return
    active = btn.dataset.key
    tabs.querySelectorAll('.faq__tab').forEach((t) => t.setAttribute('aria-pressed', String(t === btn)))
    render() // nouvelle liste : tout est refermé
  })

  list.addEventListener('click', (e) => {
    const trigger = e.target.closest('.faq-item__trigger')
    if (!trigger) return
    const item = trigger.closest('.faq-item')
    const opening = item.dataset.state !== 'open'
    list.querySelectorAll('.faq-item[data-state="open"]').forEach((other) => {
      if (other === item) return
      other.dataset.state = 'closed'
      other.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false')
      animateHeight(other.querySelector('.faq-item__content'), false)
    })
    item.dataset.state = opening ? 'open' : 'closed'
    trigger.setAttribute('aria-expanded', String(opening))
    animateHeight(item.querySelector('.faq-item__content'), opening)
  })

  root.querySelectorAll('[data-fade]').forEach((el) => fadeUp(el, +el.dataset.fade, reduced))

  /* ---------- Anneau lumineux qui suit le curseur : chaque conteneur et chaque carte ---------- */
  let inView = false, mx = -9999, my = -9999, raf = 0
  new IntersectionObserver(([e]) => { inView = e.isIntersecting }).observe(root)
  const paint = () => {
    raf = 0
    root.querySelectorAll('.spot').forEach((el) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${mx - r.left}px`)
      el.style.setProperty('--spot-y', `${my - r.top}px`)
    })
  }
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY
    if (inView && !raf) raf = requestAnimationFrame(paint)
  }, { passive: true })

  /* ---------- Données structurées FAQPage (toutes catégories) ---------- */
  const ld = document.createElement('script')
  ld.type = 'application/ld+json'
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Object.values(FAQS).flat().map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  })
  document.head.append(ld)
}
