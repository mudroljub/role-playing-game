import { loadModel } from '/core/loaders.js'
import Bullet from './Bullet.js'
import Building from './Building.js'

const mesh = await loadModel({
  file: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.obj',
  mtl: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.mtl',
  size: 18,
  shouldAdjustHeight: true
})

export default class Tower extends Building {
  constructor({ range = 200, interval = 500, damage = 100, damageDistance = 2, ...rest } = {}) {
    super({ mesh, name: 'tower', ...rest })
    this.range = range
    this.damage = damage
    this.damageDistance = damageDistance
    this.bullets = []
    this.last = Date.now()
    this.interval = interval
  }

  get targetInRange() {
    if (!this.playerMesh) return false
    return this.playerMesh.userData.energy && this.distanceTo(this.playerMesh) < this.range
  }

  get ableToShoot() {
    return !this.dead && Date.now() - this.last >= this.interval
  }

  createBullet() {
    const pos = this.position.clone()
    pos.y += this.height
    const bullet = new Bullet({ pos, damage: this.damage, damageDistance: this.damageDistance })
    this.scene.add(bullet.mesh)
    this.bullets.push(bullet)
  }

  removeBullet(bullet) {
    this.scene.remove(bullet.mesh)
    this.bullets.splice(this.bullets.indexOf(bullet), 1)
  }

  removeBullets() {
    this.bullets.forEach(bullet => this.scene?.remove(bullet.mesh))
    this.bullets = []
  }

  update(delta) {
    super.update(delta)

    if (this.targetInRange && this.ableToShoot) {
      this.createBullet()
      this.last = Date.now()
    }

    if (!this.targetInRange) this.removeBullets()

    this.bullets.forEach(bullet => {
      if (bullet.dead) this.removeBullet(bullet)
      bullet.update(delta)
    })
  }
}

export class AirportTower extends Tower {
  constructor(x, z) {
    super({ pos: [x, 0, z], range: 50, interval: 1500, damage: 10, damageDistance: 1, name: 'enemy' })
  }
}