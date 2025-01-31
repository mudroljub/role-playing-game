import * as THREE from 'three'
import Scena3D from '/core/Scena3D.js'
import { createGround, createFloor } from '/core/ground.js'
import { createSun } from '/core/light.js'

const mapSize = 200
const dornierNum = 8, stukaNum = 8, heinkelNum = 7

export default class AerodromScena extends Scena3D {
  init() {
    this.bojaPozadine = 0x440033
    this.dodaj(createSun())
    const ground = createGround({ file: 'terrain/ground.jpg' })
    ground.position.y -= .1
    this.dodaj(ground)
    this.dodaj(createFloor({ size: mapSize, file: 'terrain/asphalt.jpg' }))
    this.aircraft = []
    this.enemies = []
    this.solids = []
  }

  update(dt) {
    super.update(dt)
  }
}
