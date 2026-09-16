// FAQ : objections réelles d'un client de carrosserie, réponses fondées sur les faits vérifiés
// (fiche Google, Fixico, Bolid, registre). Chaque réponse porte son propre CTA bleu. FR / EN / NL.
import { getLang, tr } from './i18n.js'

const TEL = 'tel:+32477777036'
const FIXICO = 'https://fixico.be/fr/villes/schaerbeek/garage-van-praet'
const MAPS = 'https://maps.app.goo.gl/2hibFTy7Ff3hPFmB8'

const CATEGORIES = [
  { key: 'devis', label: { fr: 'Devis & prix', en: 'Quotes & prices', nl: 'Offerte & prijs' } },
  { key: 'reparation', label: { fr: 'Réparation & garantie', en: 'Repairs & warranty', nl: 'Herstelling & garantie' } },
  { key: 'atelier', label: { fr: 'Atelier & pratique', en: 'Workshop & practical', nl: 'Werkplaats & praktisch' } },
]

const FAQS = {
  devis: [
    { q: { fr: 'Le devis est-il vraiment gratuit, même si je ne fais pas réparer chez vous ?', en: 'Is the quote really free, even if I don’t get the repair done with you?', nl: 'Is de offerte echt gratis, ook als ik de herstelling niet bij jullie laat doen?' },
      a: { fr: 'Oui. Le devis est gratuit et sans engagement : quelques photos des dégâts suffisent, et vous recevez le chiffrage sous 24 heures. Vous restez libre de comparer ou de ne pas donner suite.', en: 'Yes. The quote is free and without obligation: a few photos of the damage are enough, and you receive the estimate within 24 hours. You remain free to compare or not to go ahead.', nl: 'Ja. De offerte is gratis en vrijblijvend: enkele foto’s van de schade volstaan en u ontvangt de raming binnen 24 uur. U blijft vrij om te vergelijken of er niet op in te gaan.' },
      cta: { label: { fr: 'Demander mon devis gratuit', en: 'Request my free quote', nl: 'Mijn gratis offerte aanvragen' }, href: '#devis' } },
    { q: { fr: 'Le prix final peut-il dépasser le montant du devis ?', en: 'Can the final price be higher than the quote?', nl: 'Kan de eindprijs hoger uitvallen dan de offerte?' },
      a: { fr: 'Non : le prix annoncé est le prix payé. Plusieurs clients le soulignent dans leurs avis Fixico, où l’atelier obtient 9,5/10 sur 34 évaluations.', en: 'No: the price quoted is the price you pay. Several customers point this out in their Fixico reviews, where the workshop scores 9.5/10 from 34 ratings.', nl: 'Nee: de aangekondigde prijs is de prijs die u betaalt. Verschillende klanten benadrukken dat in hun Fixico-reviews, waar de werkplaats 9,5/10 haalt op 34 beoordelingen.' },
      cta: { label: { fr: 'Vérifier les avis sur Fixico', en: 'Check the reviews on Fixico', nl: 'De reviews op Fixico bekijken' }, href: FIXICO, external: true } },
    { q: { fr: 'Pourquoi paierais-je moins cher qu’en concession pour le même résultat ?', en: 'Why would I pay less than at a dealership for the same result?', nl: 'Waarom zou ik minder betalen dan bij de dealer voor hetzelfde resultaat?' },
      a: { fr: 'L’atelier est indépendant et la peinture est réalisée sur place, dans sa propre cabine. Un client Audi indique avoir payé le remplacement de son pare-chocs arrière environ moitié moins cher qu’ailleurs.', en: 'The workshop is independent and painting is done on site, in its own booth. One Audi customer reports paying about half the price asked elsewhere to replace a rear bumper.', nl: 'De werkplaats is onafhankelijk en het spuitwerk gebeurt ter plaatse, in de eigen spuitcabine. Een Audi-klant meldt dat hij voor de vervanging van zijn achterbumper ongeveer de helft betaalde van de prijs elders.' },
      cta: { label: { fr: 'Faire comparer mon devis actuel', en: 'Have my current quote compared', nl: 'Mijn huidige offerte laten vergelijken' }, href: TEL } },
    { q: { fr: 'Quels moyens de paiement acceptez-vous ?', en: 'Which payment methods do you accept?', nl: 'Welke betaalmiddelen aanvaarden jullie?' },
      a: { fr: 'Les espèces, Bancontact et la carte de crédit.', en: 'Cash, Bancontact and credit card.', nl: 'Cash, Bancontact en kredietkaart.' },
      cta: { label: { fr: 'Voir les horaires de l’atelier', en: 'See the workshop’s opening hours', nl: 'Openingsuren van de werkplaats bekijken' }, href: '#contact' } },
    { q: { fr: 'Dois-je me déplacer pour obtenir un chiffrage ?', en: 'Do I have to come in to get an estimate?', nl: 'Moet ik langskomen voor een raming?' },
      a: { fr: 'Non. Des photos nettes de la zone abîmée, prises de face et de biais, suffisent pour un premier chiffrage, sans rendez-vous.', en: 'No. Sharp photos of the damaged area, taken straight on and at an angle, are enough for a first estimate, without an appointment.', nl: 'Nee. Scherpe foto’s van de beschadigde zone, recht van voren en schuin genomen, volstaan voor een eerste raming, zonder afspraak.' },
      cta: { label: { fr: 'Voir les 4 étapes', en: 'See the 4 steps', nl: 'De 4 stappen bekijken' }, href: '#etapes' } },
  ],
  reparation: [
    { q: { fr: 'La retouche aura-t-elle exactement la même teinte que le reste de ma carrosserie ?', en: 'Will the touch-up exactly match the colour of the rest of my car?', nl: 'Heeft de bijwerking exact dezelfde kleur als de rest van mijn carrosserie?' },
      a: { fr: 'C’est l’intérêt de la cabine de peinture de l’atelier : les raccords de teinte sur rayures et les éléments repeints sont réalisés sur place, puis finis par un polissage professionnel.', en: 'That’s the point of the workshop’s paint booth: colour blending on scratches and repainted panels are done on site, then finished with a professional polish.', nl: 'Daarvoor dient de spuitcabine van de werkplaats: kleurafstemming bij krassen en overgespoten onderdelen gebeuren ter plaatse en worden afgewerkt met een professionele polijstbeurt.' },
      cta: { label: { fr: 'Découvrir la peinture en cabine', en: 'Discover booth painting', nl: 'Lakwerk in de spuitcabine ontdekken' }, href: '#atelier' } },
    { q: { fr: 'Montez-vous des pièces d’origine ?', en: 'Do you fit original parts?', nl: 'Monteren jullie originele onderdelen?' },
      a: { fr: 'Oui, l’atelier travaille avec des pièces d’origine, un point relevé par des clients dans leurs avis. Demandez le détail des pièces prévues au moment du devis.', en: 'Yes, the workshop uses original parts, something customers mention in their reviews. Ask for the list of planned parts when you get your quote.', nl: 'Ja, de werkplaats werkt met originele onderdelen, iets wat klanten in hun reviews vermelden. Vraag bij de offerte naar de voorziene onderdelen.' },
      cta: { label: { fr: 'Demander le détail des pièces', en: 'Ask for the parts list', nl: 'Naar de onderdelen vragen' }, href: TEL } },
    { q: { fr: 'Que se passe-t-il si un défaut apparaît après la réparation ?', en: 'What happens if a fault appears after the repair?', nl: 'Wat als er na de herstelling een defect opduikt?' },
      a: { fr: 'Les réparations sont garanties 2 ans. Si un problème lié aux travaux réapparaît pendant cette période, contactez l’atelier pour qu’il soit repris.', en: 'Repairs come with a 2-year warranty. If a problem related to the work reappears during that period, contact the workshop to have it put right.', nl: 'Herstellingen hebben 2 jaar garantie. Duikt er in die periode een probleem op dat met het werk te maken heeft, neem dan contact op met de werkplaats om het te laten rechtzetten.' },
      cta: { label: { fr: 'Signaler un souci à l’atelier', en: 'Report an issue to the workshop', nl: 'Een probleem melden aan de werkplaats' }, href: TEL } },
    { q: { fr: 'Combien de jours ma voiture sera-t-elle immobilisée ?', en: 'How many days will my car be off the road?', nl: 'Hoeveel dagen sta ik zonder wagen?' },
      a: { fr: 'Cela dépend des dégâts et des pièces à commander. Pour une réparation de carrosserie courante, un client a récupéré son véhicule en deux jours, et plusieurs l’ont eu avant la date prévue. Demandez l’estimation au moment du devis.', en: 'It depends on the damage and the parts to order. For a standard bodywork repair, one customer got their car back in two days, and several had it before the planned date. Ask for an estimate with your quote.', nl: 'Dat hangt af van de schade en de te bestellen onderdelen. Voor een gewone carrosserieherstelling kreeg een klant zijn wagen na twee dagen terug, en verschillende klanten nog vóór de geplande datum. Vraag de inschatting bij de offerte.' },
      cta: { label: { fr: 'Estimer le délai pour ma voiture', en: 'Estimate the time for my car', nl: 'De duur voor mijn wagen laten inschatten' }, href: '#devis' } },
    { q: { fr: 'Mes phares sont jaunis et éclairent mal : faut-il les remplacer ?', en: 'My headlights are yellowed and dim: do they need replacing?', nl: 'Mijn koplampen zijn vergeeld en schijnen slecht: moeten ze vervangen worden?' },
      a: { fr: 'Pas forcément. L’atelier propose la rénovation des optiques, qui redonne de la transparence aux phares ternis, ainsi que le réglage des feux. Si l’optique est fissurée, le phare avant ou le feu arrière peut aussi être remplacé.', en: 'Not necessarily. The workshop offers headlight restoration, which makes dull lenses clear again, as well as headlight alignment. If the lens is cracked, the headlight or rear light can also be replaced.', nl: 'Niet noodzakelijk. De werkplaats biedt renovatie van de koplampen aan, waardoor doffe lampen weer helder worden, en het afstellen van de lichten. Is de lamp gebarsten, dan kan de koplamp of het achterlicht ook vervangen worden.' },
      cta: { label: { fr: 'Voir les prestations « Vision »', en: 'See the “Lighting” services', nl: 'De diensten “Zicht” bekijken' }, href: '#presta-vision' } },
    { q: { fr: 'Travaillez-vous avec mon assurance ?', en: 'Do you work with my insurer?', nl: 'Werken jullie met mijn verzekeraar?' },
      a: { fr: 'Chaque contrat et chaque sinistre sont différents. Appelez l’atelier avec les références de votre dossier : on vous explique comment procéder avec votre assureur avant de commencer les travaux.', en: 'Every policy and every claim is different. Call the workshop with your claim reference: we’ll explain how to proceed with your insurer before starting any work.', nl: 'Elk contract en elk schadegeval is anders. Bel de werkplaats met de referentie van uw dossier: we leggen uit hoe u te werk gaat met uw verzekeraar voordat de werken beginnen.' },
      cta: { label: { fr: 'Appeler avec mon dossier sinistre', en: 'Call with my claim details', nl: 'Bellen met mijn schadedossier' }, href: TEL } },
  ],
  atelier: [
    { q: { fr: 'Prenez-vous en charge la marque de ma voiture ?', en: 'Do you work on my car’s make?', nl: 'Behandelen jullie het merk van mijn wagen?' },
      a: { fr: 'Très probablement : plus de 40 marques sont prises en charge, de Volkswagen à Tesla en passant par Toyota, Peugeot, BMW, Volvo ou Dacia.', en: 'Very likely: more than 40 makes are serviced, from Volkswagen to Tesla, including Toyota, Peugeot, BMW, Volvo and Dacia.', nl: 'Zeer waarschijnlijk: meer dan 40 merken, van Volkswagen tot Tesla, met onder meer Toyota, Peugeot, BMW, Volvo en Dacia.' },
      cta: { label: { fr: 'Voir les marques prises en charge', en: 'See the makes we service', nl: 'De behandelde merken bekijken' }, href: '#marques' } },
    { q: { fr: 'Réparez-vous aussi la mécanique, ou seulement la carrosserie ?', en: 'Do you also do mechanical repairs, or just bodywork?', nl: 'Doen jullie ook mechanica, of alleen carrosserie?' },
      a: { fr: 'Les deux, au même endroit : entretien et vidange, freins, embrayage, distribution, suspension, climatisation, éclairage et échappement.', en: 'Both, in the same place: servicing and oil changes, brakes, clutch, timing belt, suspension, air conditioning, lighting and exhaust.', nl: 'Beide, op dezelfde plek: onderhoud en olieverversing, remmen, koppeling, distributie, ophanging, airco, verlichting en uitlaat.' },
      cta: { label: { fr: 'Voir les 51 prestations', en: 'See all 51 services', nl: 'De 51 diensten bekijken' }, href: '#prestations' } },
    { q: { fr: 'Le voyant du filtre à particules (FAP) est allumé : pouvez-vous intervenir ?', en: 'My diesel particulate filter (DPF) warning light is on: can you help?', nl: 'Het controlelampje van mijn roetfilter brandt: kunnen jullie helpen?' },
      a: { fr: 'Oui : l’atelier remplace le filtre à particules, recharge son additif, change la vanne EGR et réalise le décalaminage. Décrivez le voyant et les symptômes au téléphone pour une première orientation.', en: 'Yes: the workshop replaces the particulate filter, refills its additive, changes the EGR valve and carries out decarbonising. Describe the warning light and symptoms by phone for initial advice.', nl: 'Ja: de werkplaats vervangt de roetfilter, vult het additief bij, vervangt de EGR-klep en voert een ontkoling uit. Beschrijf het lampje en de symptomen telefonisch voor een eerste advies.' },
      cta: { label: { fr: 'Voir les prestations « Échappement »', en: 'See the “Exhaust” services', nl: 'De diensten “Uitlaat” bekijken' }, href: '#presta-echappement' } },
    { q: { fr: 'Ma voiture ne démarre plus : batterie, démarreur ou alternateur ?', en: 'My car won’t start: battery, starter or alternator?', nl: 'Mijn wagen start niet meer: batterij, startmotor of dynamo?' },
      a: { fr: 'Les trois sont pris en charge à l’atelier : changement de batterie, de démarreur ou d’alternateur. Le diagnostic permet de savoir lequel est en cause avant de remplacer quoi que ce soit.', en: 'The workshop handles all three: battery, starter or alternator replacement. A diagnosis shows which one is at fault before anything is replaced.', nl: 'De werkplaats doet alle drie: vervanging van batterij, startmotor of dynamo. Een diagnose toont welke de oorzaak is voordat er iets vervangen wordt.' },
      cta: { label: { fr: 'Décrire la panne à l’atelier', en: 'Describe the fault to the workshop', nl: 'De panne beschrijven aan de werkplaats' }, href: TEL } },
    { q: { fr: 'Faites-vous la vidange et l’entretien courant ?', en: 'Do you do oil changes and routine servicing?', nl: 'Doen jullie olieverversing en gewoon onderhoud?' },
      a: { fr: 'Oui, avec deux formules : vidange avec filtre à huile, ou vidange avec 3 filtres. Freins, bougies, filtres à air et à carburant, courroies et amortisseurs se changent aussi sur place.', en: 'Yes, with two options: oil change with oil filter, or oil change with 3 filters. Brakes, spark plugs, air and fuel filters, belts and shock absorbers are also replaced on site.', nl: 'Ja, met twee formules: olieverversing met oliefilter, of olieverversing met 3 filters. Remmen, bougies, lucht- en brandstoffilters, riemen en schokdempers worden ook ter plaatse vervangen.' },
      cta: { label: { fr: 'Voir la révision & vidange', en: 'See servicing & oil change', nl: 'Onderhoud & olieverversing bekijken' }, href: '#presta-revision-vidange' } },
    { q: { fr: 'Puis-je déposer ma voiture le samedi ?', en: 'Can I drop my car off on Saturday?', nl: 'Kan ik mijn wagen op zaterdag binnenbrengen?' },
      a: { fr: 'Oui, l’atelier est ouvert le samedi de 9:00 à 14:00, et du lundi au vendredi de 9:00 à 18:00. Il est fermé le dimanche.', en: 'Yes, the workshop is open on Saturday from 9:00 to 14:00, and Monday to Friday from 9:00 to 18:00. It is closed on Sunday.', nl: 'Ja, de werkplaats is open op zaterdag van 9:00 tot 14:00 en van maandag tot vrijdag van 9:00 tot 18:00. Op zondag is ze gesloten.' },
      cta: { label: { fr: 'Itinéraire vers la rue Navez 103', en: 'Directions to 103 rue Navez', nl: 'Route naar de Navezstraat 103' }, href: MAPS, external: true } },
    { q: { fr: 'Est-ce que je peux être servi en néerlandais ?', en: 'Can I be served in Dutch?', nl: 'Kan ik in het Nederlands geholpen worden?' },
      a: { fr: 'Oui, l’accueil se fait en français et en néerlandais. Ja, u wordt ook in het Nederlands geholpen.', en: 'Yes, the workshop welcomes customers in French and Dutch.', nl: 'Ja, u wordt in het Nederlands en in het Frans geholpen.' },
      cta: { label: { fr: 'Bel de werkplaats', en: 'Call the workshop', nl: 'Bel de werkplaats' }, href: TEL } },
    { q: { fr: 'Peut-on prendre rendez-vous en ligne ?', en: 'Can I book an appointment online?', nl: 'Kan ik online een afspraak maken?' },
      a: { fr: 'Oui : l’atelier est référencé sur Fixico, qui permet de demander un devis et de réserver un créneau en ligne. Vous pouvez aussi simplement appeler.', en: 'Yes: the workshop is listed on Fixico, where you can request a quote and book a slot online. You can also simply call.', nl: 'Ja: de werkplaats staat op Fixico, waar u online een offerte kunt aanvragen en een moment kunt reserveren. U kunt ook gewoon bellen.' },
      cta: { label: { fr: 'Réserver un créneau sur Fixico', en: 'Book a slot on Fixico', nl: 'Een moment reserveren op Fixico' }, href: FIXICO, external: true } },
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

  // Typographie française : espace insécable avant ? : ; ! pour ne jamais les isoler en début de ligne
  const nb = (t) => (getLang() === 'fr' ? t.replace(/ ([?:;!])/g, ' $1') : t)

  const renderTabs = () => {
    tabs.innerHTML = ring() + CATEGORIES.map((c) =>
      `<button type="button" class="faq__tab spot" data-key="${c.key}" aria-pressed="${c.key === active}">${ring('spot-ring--pill')}${tr(c.label)}</button>`).join('')
  }
  const render = (animate = true) => {
    list.innerHTML = FAQS[active].map((f, i) => {
      const id = `faq-${active}-${i}`
      const ext = f.cta.external ? ' target="_blank" rel="noopener"' : ''
      return `<div class="faq-item spot" data-state="closed">${ring()}
        <h3 class="faq-item__h"><button type="button" class="faq-item__trigger" aria-expanded="false" aria-controls="${id}">
          <span class="faq-item__q">${nb(tr(f.q))}</span><span class="faq-item__icon">${CHEVRON}</span>
        </button></h3>
        <div class="faq-item__content" id="${id}" role="region" style="height:0px">
          <div class="faq-item__body"><p>${nb(tr(f.a))}</p><a class="faq-cta" href="${f.cta.href}"${ext}>${tr(f.cta.label)} ${ARROW}</a></div>
        </div>
      </div>`
    }).join('')
    ;[...list.children].forEach((item, i) => (animate ? fadeUp(item, 0.15 * i, reduced) : item.classList.add('fade-up', 'is-in')))
  }
  renderTabs()
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

  /* ---------- Données structurées FAQPage (français) ---------- */
  const ld = document.createElement('script')
  ld.type = 'application/ld+json'
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Object.values(FAQS).flat().map((f) => ({ '@type': 'Question', name: f.q.fr, acceptedAnswer: { '@type': 'Answer', text: f.a.fr } })),
  })
  document.head.append(ld)

  // Changement de langue : onglets et liste réécrits instantanément, catégorie conservée
  return { setLang: () => { renderTabs(); render(false) } }
}
