import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function createOrbitControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement)
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground, negde ne radi
  controls.enableKeys = false
  controls.minDistance = 2
  controls.zoomSpeed = .3
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  return controls
}
