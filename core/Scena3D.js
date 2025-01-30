import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Scena from './Scena.js'
import { renderer } from './scene.js'

export default class Scena3D extends Scena {
  constructor(manager) {
    super(manager)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 5, 30)

    this.renderer = renderer

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.maxPolarAngle = Math.PI / 2 - 0.1

    this.init()
  }

  set bojaPozadine(boja) {
    this.scene.background = new THREE.Color(boja)
  }

  dodaj(...predmeti) {
    this.scene.add(...predmeti)
  }

  update(dt) {
    this.controls.update(dt)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}
