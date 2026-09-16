// Modèles fil de fer procéduraux (voiture, utilitaire, jante, pistolet à peinture).
// Un seul WebGLRenderer hors écran dessine les 4 scènes puis les copie dans chaque
// <canvas> 2D : un seul contexte WebGL, rendu suspendu hors de l'écran.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Shape, ExtrudeGeometry, CylinderGeometry,
  TorusGeometry, BoxGeometry, ConeGeometry, EdgesGeometry, WireframeGeometry, LineSegments,
  LineBasicMaterial, Mesh, MeshBasicMaterial,
} from 'three'

const lineMat = new LineBasicMaterial({ color: 0xf2f2ee, transparent: true, opacity: 0.85 })
const faintMat = new LineBasicMaterial({ color: 0xf2f2ee, transparent: true, opacity: 0.28 })
const occluder = new MeshBasicMaterial({ color: 0x181815, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })

// Surface opaque (couleur du fond) + arêtes vives + maillage discret : rendu « plan technique »
function wire(geo, { dense = true, threshold = 20 } = {}) {
  const g = new Group()
  g.add(new Mesh(geo, occluder))
  g.add(new LineSegments(new EdgesGeometry(geo, threshold), lineMat))
  if (dense) g.add(new LineSegments(new WireframeGeometry(geo), faintMat))
  return g
}

function wheel(r = 0.34, w = 0.24, spokes = 10) {
  const g = new Group()
  const tyre = wire(new TorusGeometry(r, w * 0.45, 10, 32), { dense: true })
  g.add(tyre)
  const rim = wire(new CylinderGeometry(r * 0.72, r * 0.72, w * 0.7, 28, 1, true), { dense: false })
  rim.rotation.x = Math.PI / 2
  g.add(rim)
  for (let i = 0; i < spokes; i++) {
    const s = wire(new BoxGeometry(0.03, r * 0.66, 0.03), { dense: false })
    s.position.set(Math.sin((i / spokes) * Math.PI * 2) * r * 0.33, Math.cos((i / spokes) * Math.PI * 2) * r * 0.33, 0)
    s.rotation.z = -(i / spokes) * Math.PI * 2
    g.add(s)
  }
  const hub = wire(new CylinderGeometry(r * 0.14, r * 0.14, w * 0.8, 16), { dense: false })
  hub.rotation.x = Math.PI / 2
  g.add(hub)
  return g
}

function profile(points) {
  const s = new Shape()
  s.moveTo(points[0][0], points[0][1])
  points.slice(1).forEach(([x, y]) => s.lineTo(x, y))
  s.closePath()
  return s
}

function vehicle(points, width, wheelsX, wheelR) {
  const g = new Group()
  const geo = new ExtrudeGeometry(profile(points), { depth: width, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.08, bevelSegments: 2, steps: 6 })
  geo.translate(0, 0, -width / 2)
  g.add(wire(geo, { threshold: 12 }))
  for (const x of wheelsX) for (const z of [-width / 2 - 0.05, width / 2 + 0.05]) {
    const w = wheel(wheelR, 0.22, 8)
    w.position.set(x, 0, z)
    g.add(w)
  }
  return g
}

const MODELS = {
  car: () => {
    // Profil de berline échantillonné sur une courbe lissée (capot, pare-brise, pavillon, coffre)
    const key = [[-2.05, 0.1], [-2.1, 0.5], [-1.85, 0.7], [-1.1, 0.8], [-0.55, 1.22], [0.05, 1.32], [0.7, 1.28], [1.25, 0.86], [1.85, 0.76], [2.1, 0.55], [2.1, 0.1]]
    const pts = []
    for (let i = 0; i < key.length - 1; i++) {
      const [a, b] = [key[i], key[i + 1]]
      for (let s = 0; s < 4; s++) {
        const t = s / 4, e = (1 - Math.cos(t * Math.PI)) / 2
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * e])
      }
    }
    pts.push(key[key.length - 1])
    const g = vehicle(pts, 1.55, [-1.3, 1.3], 0.36)
    g.scale.setScalar(0.62)
    return g
  },
  brake: () => {
    // Disque ventilé percé + moyeu + étrier
    const g = new Group()
    const disc = wire(new CylinderGeometry(1, 1, 0.16, 48, 1)); disc.rotation.x = Math.PI / 2; g.add(disc)
    const hat = wire(new CylinderGeometry(0.42, 0.42, 0.34, 32, 2)); hat.rotation.x = Math.PI / 2; hat.position.z = 0.14; g.add(hat)
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const stud = wire(new CylinderGeometry(0.05, 0.05, 0.3, 10), { dense: false })
      stud.rotation.x = Math.PI / 2; stud.position.set(Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.32); g.add(stud)
    }
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2
      const hole = wire(new CylinderGeometry(0.035, 0.035, 0.18, 8), { dense: false })
      hole.rotation.x = Math.PI / 2; hole.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0); g.add(hole)
    }
    const caliper = wire(new BoxGeometry(0.62, 0.34, 0.5, 4, 2, 2)); caliper.position.set(0.62, 0.62, 0); caliper.rotation.z = -Math.PI / 4; g.add(caliper)
    g.scale.setScalar(1.05)
    return g
  },
  wheel: () => {
    const g = wheel(0.95, 0.6, 12)
    g.scale.setScalar(0.95)
    return g
  },
  gun: () => {
    const g = new Group()
    const body = wire(new CylinderGeometry(0.22, 0.26, 1.5, 20, 6)); body.rotation.z = Math.PI / 2; g.add(body)
    const nozzle = wire(new ConeGeometry(0.2, 0.55, 20, 3)); nozzle.rotation.z = -Math.PI / 2; nozzle.position.x = 1.02; g.add(nozzle)
    const tip = wire(new CylinderGeometry(0.05, 0.05, 0.25, 10), { dense: false }); tip.rotation.z = Math.PI / 2; tip.position.x = 1.4; g.add(tip)
    const cup = wire(new CylinderGeometry(0.38, 0.3, 0.75, 22, 4)); cup.position.set(0.25, 0.68, 0); g.add(cup)
    const lid = wire(new CylinderGeometry(0.4, 0.4, 0.06, 22), { dense: false }); lid.position.set(0.25, 1.07, 0); g.add(lid)
    const handle = wire(new BoxGeometry(0.28, 1.25, 0.34, 2, 6, 2)); handle.position.set(-0.45, -0.68, 0); handle.rotation.z = -0.22; g.add(handle)
    const trigger = wire(new BoxGeometry(0.08, 0.6, 0.12), { dense: false }); trigger.position.set(-0.05, -0.45, 0); trigger.rotation.z = -0.3; g.add(trigger)
    g.scale.setScalar(0.78)
    return g
  },
}

export function initWireframes(canvases, { reduced = false } = {}) {
  if (!canvases.length) return
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setClearColor(0x000000, 0)
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const views = [...canvases].map((canvas, i) => {
    const scene = new Scene()
    const model = MODELS[canvas.dataset.model]()
    const pivot = new Group()
    pivot.add(model)
    pivot.rotation.set(0.42, -0.7 + i * 0.35, 0.05)
    scene.add(pivot)
    const camera = new PerspectiveCamera(32, 1, 0.1, 50)
    camera.position.set(0, 0.2, 6.2)
    return { canvas, ctx: canvas.getContext('2d'), scene, camera, pivot, base: pivot.rotation.y }
  })

  let w = 0, h = 0
  const resize = () => {
    const r = views[0].canvas.getBoundingClientRect()
    w = Math.max(1, Math.round(r.width * dpr)); h = Math.max(1, Math.round(r.height * dpr))
    renderer.setPixelRatio(1)
    renderer.setSize(w, h, false)
    views.forEach((v) => {
      v.canvas.width = w; v.canvas.height = h
      v.camera.aspect = w / h
      v.camera.position.z = w / h < 0.9 ? 8.2 : 6.2
      v.camera.updateProjectionMatrix()
    })
  }
  resize()
  new ResizeObserver(resize).observe(views[0].canvas)

  const draw = (t) => {
    const scrollTurn = window.scrollY * 0.0009
    views.forEach((v, i) => {
      v.pivot.rotation.y = v.base + (reduced ? 0 : t * 0.00022 + scrollTurn) + i * 0.1
      renderer.render(v.scene, v.camera)
      v.ctx.clearRect(0, 0, w, h)
      v.ctx.drawImage(renderer.domElement, 0, 0)
    })
  }

  let visible = false, raf = 0
  const loop = (t) => { draw(t); raf = visible && !reduced ? requestAnimationFrame(loop) : 0 }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible && !raf) raf = requestAnimationFrame(loop)
  }, { rootMargin: '100px' }).observe(canvases[0].closest('section'))
  draw(0)
}
