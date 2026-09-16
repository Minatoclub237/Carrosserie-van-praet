// Catalogue des prestations — liste relevée sur la fiche Bolid de l'atelier (13 domaines, 51 prestations).
// ⚠ À faire confirmer par le client avant mise en ligne (fiche d'annuaire possiblement générique).
const CATALOGUE = [
  { title: 'Carrosserie', items: ['Réparation de carrosserie (choc important, accident)', 'Rénovation de carrosserie (peinture, rayures, bosses)', 'Changement de rétroviseur', 'Réparation de rétroviseur'] },
  { title: 'Vision', items: ['Rénovation des optiques (feux, phares)', 'Réglage des optiques', 'Changement de phare avant', 'Changement de feu arrière', 'Ampoules de phares avant', 'Ampoules de feux arrière', 'Ampoules de clignotants', 'Ampoules de feux antibrouillard', 'Balais d’essuie-glace'] },
  { title: 'Révision & vidange', items: ['Vidange + filtre à huile', 'Vidange + 3 filtres'] },
  { title: 'Freinage', items: ['Plaquettes de frein', 'Disques et plaquettes', 'Kit de frein à tambour arrière', 'Purge du liquide de frein'] },
  { title: 'Embrayage', items: ['Kit d’embrayage', 'Kit d’embrayage et volant moteur', 'Vidange de boîte manuelle', 'Vidange de boîte automatique'] },
  { title: 'Distribution', items: ['Kit de courroie de distribution', 'Chaîne de distribution', 'Courroie d’accessoire', 'Kit de courroie d’accessoire'] },
  { title: 'Moteur', items: ['Bougies d’allumage', 'Bougies de préchauffage', 'Injecteur', 'Filtre à air', 'Filtre à carburant', 'Purge du liquide de refroidissement'] },
  { title: 'Échappement', items: ['Filtre à particules (FAP)', 'Recharge d’additif FAP', 'Vanne EGR', 'Décalaminage', 'Silencieux arrière'] },
  { title: 'Démarrage & charge', items: ['Batterie', 'Démarreur', 'Alternateur'] },
  { title: 'Suspensions', items: ['Amortisseurs', 'Triangle / bras de suspension', 'Rotule de suspension', 'Biellette de barre stabilisatrice'] },
  { title: 'Direction & transmission', items: ['Biellette de direction', 'Rotule de direction', 'Cardan', 'Soufflet de cardan'] },
  { title: 'Climatisation', items: ['Filtre d’habitacle'] },
  { title: 'Pneus & roues', items: ['Roulements de roue'] },
]

export const CATALOGUE_COUNT = CATALOGUE.reduce((n, c) => n + c.items.length, 0)

const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const pad = (n) => String(n).padStart(2, '0')

export function renderPrestations(root) {
  const chips = root.querySelector('.presta__chips')
  const grid = root.querySelector('.presta__grid')
  chips.innerHTML = CATALOGUE.map((c) => `<button type="button" class="presta__chip" data-target="presta-${slug(c.title)}">${c.title}<sup>${c.items.length}</sup></button>`).join('')
  grid.innerHTML = CATALOGUE.map((c, i) => `
    <article class="presta-card" id="presta-${slug(c.title)}">
      <header class="presta-card__head">
        <span class="presta-card__num">${pad(i + 1)}</span>
        <h3 class="presta-card__title">${c.title}</h3>
        <span class="presta-card__count">${pad(c.items.length)}</span>
      </header>
      <ul class="presta-card__list">${c.items.map((it) => `<li>${it}</li>`).join('')}</ul>
    </article>`).join('')
  root.querySelector('[data-presta-count]').dataset.to = CATALOGUE_COUNT
  root.querySelector('[data-presta-domains]').textContent = CATALOGUE.length
  return { chips, cards: [...grid.children] }
}
