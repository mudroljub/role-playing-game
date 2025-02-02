import Scena3D from '/core/Scena3D.js'
import { createGround, createFloor } from '/core/ground.js'
import { createMoon } from '/core/light.js'
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
import { GermanMachineGunnerAI } from '/core/actor/derived/ww2/GermanMachineGunner.js'
import { SSSoldierAI } from '/core/actor/derived/ww2/SSSoldier.js'
import { NaziOfficerAI } from '/core/actor/derived/ww2/NaziOfficer.js'

const mapSize = 200
const dornierNum = 8, stukaNum = 8, heinkelNum = 7

export default class RajlovacScena extends Scena3D {
  async init() {
    this.setupGUI()
    this.bojaPozadine = 0x440033
    const ground = createGround({ file: 'terrain/ground.jpg' })
    ground.position.y -= .1
    const floor = createFloor({ size: mapSize, file: 'terrain/asphalt.jpg' })
    this.solids = []

    const coords = getEmptyCoords({ mapSize: mapSize * .5 })
    this.player = new FPSPlayer({ camera: this.camera, pos: [100, 0, 0] })
    this.player.lookAt(this.scene.position)

    this.aircraft = [
      ...Array.from({ length: dornierNum }, (_, i) => new DornierBomber({ pos: [-50 + i * 15, 0, -75], name: 'enemy' })),
      ...Array.from({ length: stukaNum }, (_, i) => new JunkersStuka({ pos: [-55, 0, -55 + i * 12], name: 'enemy' })),
      ...Array.from({ length: heinkelNum }, (_, i) => new HeinkelBomber({ pos: [-50 + i * 18, 0, 50], name: 'enemy' })),
    ]

    ;[[-75, -75], [-75, 75], [75, -75], [75, 75]].forEach(async([x, z]) => {
      const tower = new Tower({ pos: [x, 0, z], range: 50, interval: 1500, damage: 10, damageDistance: 1, name: 'enemy' })
      this.dodaj(tower)
    })

    const airport = createAirport()
    airport.translateX(75)
    airport.rotateY(Math.PI * .5)

    const airport2 = airport.clone()
    airport2.translateX(25)

    const bunker = await loadModel({ file: 'building/bunker.fbx', size: 3, texture: 'terrain/concrete.jpg' })
    bunker.position.set(75, 0, 25)

    this.solids.push(airport, airport2, bunker)
    this.player.addSolids(this.solids)

    const soldiers = [GermanMachineGunnerAI, SSSoldierAI, NaziOfficerAI]
    for (let i = 0; i < 10; i++) {
      const RandomClass = sample(soldiers)
      const soldier = new RandomClass({ pos: coords.pop(), target: this.player.mesh, mapSize })
      soldier.addSolids(this.solids)
      this.dodaj(soldier)
    }

    const tank = new TankAI({ mapSize })
    tank.addSolids(this.solids)
    this.dodaj(tank)

    this.dodajMesh(ground, floor, createMoon(), airport, airport2, bunker)
    this.dodaj(...this.aircraft, this.player)
  }

  setupGUI() {
    this.gui = new GUI({ subtitle: 'Aircraft left', total: dornierNum + stukaNum + heinkelNum, scoreClass: '', controls: fpsControls, controlsWindowClass: 'white-window' })

    this.gui.showGameScreen({ callback: () => this.start(), usePointerLock: true, subtitle: 'Shoot: MOUSE<br>Move: WASD or ARROWS<br>Run: CAPSLOCK' })

    new Report({ container: this.gui.gameScreen, text: 'The German planes that sow death among our combatants are stationed at the Rajlovac Airport near Sarajevo.\n\nEnter the airport and destroy all enemy aircraft.' })
  }

  update(dt) {
    super.update(dt)
    if (!document.pointerLockElement) return

    const destroyed = this.aircraft.filter(plane => plane.energy <= 0)
    this.gui.update({ points: destroyed.length, left: this.aircraft.length - destroyed.length, dead: this.player.dead })

    if (destroyed.length == this.aircraft.length)
      this.gui.renderText('Congratulations!<br>All enemy planes were destroyed.')
  }
}
