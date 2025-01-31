import Scena3D from '/core/Scena3D.js'
import { createGround, createFloor } from '/core/ground.js'
import { createSun } from '/core/light.js'
import { sample, getEmptyCoords } from '/core/helpers.js'
import FPSPlayer from '/core/actor/FPSPlayer.js'
import GUI, { fpsControls } from '/core/io/GUI.js'
import { createAirport } from '/core/city.js'
import { loadModel } from '/core/loaders.js'
import Report from '/core/io/Report.js'
import DornierBomber from '/core/objects/DornierBomber.js'
import JunkersStuka from '/core/objects/JunkersStuka.js'
import HeinkelBomber from '/core/objects/HeinkelBomber.js'
import Tower from '/core/objects/Tower.js'
import { TankAI } from '/core/actor/derived/Tank.js'

const mapSize = 200
const dornierNum = 8, stukaNum = 8, heinkelNum = 7

// TODO: popraviti komande, ukloniti orbit
export default class AerodromScena extends Scena3D {
  async init() {
    this.bojaPozadine = 0x440033
    this.dodaj(createSun())
    const ground = createGround({ file: 'terrain/ground.jpg' })
    ground.position.y -= .1
    this.dodaj(ground)
    this.dodaj(createFloor({ size: mapSize, file: 'terrain/asphalt.jpg' }))
    this.aircraft = []
    this.enemies = []
    this.solids = []

    const coords = getEmptyCoords({ mapSize: mapSize * .5 })
    this.player = new FPSPlayer({ camera: this.camera, pos: [100, 0, 0] })
    this.player.lookAt(this.scene.position)
    this.scene.add(this.player.mesh)

    this.gui = new GUI({ subtitle: 'Aircraft left', total: dornierNum + stukaNum + heinkelNum, scoreClass: '', controls: fpsControls, controlsWindowClass: 'white-window' })

    // TODO: loop da ne počinje
    this.gui.showGameScreen({ callback: () => this.start(), usePointerLock: true, subtitle: 'Shoot: MOUSE<br>Move: WASD or ARROWS<br>Run: CAPSLOCK' })

    new Report({ container: this.gui.gameScreen, text: 'The German planes that sow death among our combatants are stationed at the Rajlovac Airport near Sarajevo.\n\nEnter the airport and destroy all enemy aircraft.' })

    for (let i = 0; i < dornierNum; i++) { // front
      const plane = new DornierBomber({ pos: [-50 + i * 15, 0, -75] })
      this.addEnemy(plane, this.aircraft)
    }

    for (let i = 0; i < stukaNum; i++) { // left
      const plane = new JunkersStuka({ pos: [-55, 0, -55 + i * 12] })
      this.addEnemy(plane, this.aircraft)
    }

    for (let i = 0; i < heinkelNum; i++) { // back
      const plane = new HeinkelBomber({ pos: [-50 + i * 18, 0, 50] })
      this.addEnemy(plane, this.aircraft)
    }

    ;[[-75, -75], [-75, 75], [75, -75], [75, 75]].forEach(async([x, z]) => {
      const tower = new Tower({ pos: [x, 0, z], range: 50, interval: 1500, damage: 10, damageDistance: 1 })
      this.addEnemy(tower, this.enemies)
    })

    const airport = createAirport()
    airport.translateX(75)
    airport.rotateY(Math.PI * .5)

    const airport2 = airport.clone()
    airport2.translateX(25)

    const bunker = await loadModel({ file: 'building/bunker.fbx', size: 3, texture: 'terrain/concrete.jpg' })
    bunker.position.set(75, 0, 25)

    this.scene.add(airport, airport2, bunker)
    this.solids.push(airport, airport2, bunker)
    this.player.addSolids(this.solids)

    const soldiers = ['GermanMachineGunner', 'SSSoldier', 'NaziOfficer']
    for (let i = 0; i < 10; i++) {
      const name = sample(soldiers)
      const obj = await import(`/core/actor/derived/ww2/${name}.js`)
      const RandomClass = obj[name + 'AI']
      const soldier = new RandomClass({ pos: coords.pop(), target: this.player.mesh, mapSize })
      this.addEnemy(soldier, this.enemies)
      soldier.addSolids(this.solids)
    }

    const tank = new TankAI({ mapSize })
    this.addEnemy(tank, this.enemies)
    tank.addSolids(this.solids)
  }

  addEnemy(obj, arr) {
    arr.push(obj)
    obj.name = 'enemy'
    this.scene.add(obj.mesh)
  }

  update(dt) {
    super.update(dt)
    if (!document.pointerLockElement) return

    const destroyed = this.aircraft.filter(plane => plane.energy <= 0)
    this.gui.update({ points: destroyed.length, left: this.aircraft.length - destroyed.length, dead: this.player.dead })

    if (destroyed.length == this.aircraft.length)
      this.gui.renderText('Congratulations!<br>All enemy planes were destroyed.')

    this.player.update(dt)
    this.enemies.forEach(obj => obj.update(dt))
    this.aircraft.forEach(obj => obj.update(dt))
  }
}
