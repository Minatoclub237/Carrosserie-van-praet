// Langues du site : FR (source, contenu de index.html), EN, NL.
// Changement instantané sans rechargement : les textes marqués [data-i18n] sont réécrits sur place.
import { STRINGS, ATTRS, META } from './i18n-strings.js'

export const LANGS = ['fr', 'en', 'nl']
const STORE = 'vp-lang'

let lang = 'fr'
try {
  const saved = localStorage.getItem(STORE)
  if (LANGS.includes(saved)) lang = saved
} catch {}

export const getLang = () => lang
/** Choisit la valeur de la langue courante dans un objet { fr, en, nl } */
export const tr = (o) => (o == null ? '' : o[lang] ?? o.fr)

const originals = new Map()
const attrOriginals = []
const metaFr = {}

/** À appeler une seule fois, avant toute découpe de texte par les animations */
export function captureOriginals() {
  document.querySelectorAll('[data-i18n]').forEach((el) => originals.set(el, el.innerHTML))
  ATTRS.forEach(([sel, attr, t]) => document.querySelectorAll(sel).forEach((el) => attrOriginals.push([el, attr, el.getAttribute(attr), t])))
  metaFr.title = document.title
  metaFr.description = document.querySelector('meta[name="description"]')?.content
}

/** Réécrit tous les textes dans la langue courante (restaure aussi les textes découpés par les animations) */
export function applyTexts() {
  originals.forEach((fr, el) => {
    el.innerHTML = lang === 'fr' ? fr : STRINGS[el.dataset.i18n]?.[lang] ?? fr
  })
  attrOriginals.forEach(([el, attr, fr, t]) => el.setAttribute(attr, lang === 'fr' ? fr : t[lang] ?? fr))
  document.documentElement.lang = lang
  const m = lang === 'fr' ? metaFr : META[lang]
  document.title = m.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', m.description)
}

export function setLang(next) {
  if (!LANGS.includes(next)) return false
  lang = next
  try { localStorage.setItem(STORE, next) } catch {}
  return true
}
