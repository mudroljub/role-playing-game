import * as THREE from 'three'
import Scena3D from '/core/Scena3D.js'
import { createGround, createFloor } from '/core/ground.js'
import { createSun } from '/core/light.js'
import { sample, getEmptyCoords } from '/core/helpers.js'
import FPSPlayer from '/core/actor/FPSPlayer.js'
import GUI, { fpsControls } from '/core/io/GUI.js'
import { createAirport } from '/core/city.js'
import { loadModel } from '/core/loaders.js'
import Report from '/core/io/Report.js'

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

    const coords = getEmptyCoords({ mapSize: mapSize * .5 })
    this.player = new FPSPlayer({ camera: this.camera, pos: [100, 0, 0] })
    this.player.lookAt(this.scene.position)
    this.scene.add(this.player.mesh)

    this.gui = new GUI({ subtitle: 'Aircraft left', total: dornierNum + stukaNum + heinkelNum, scoreClass: '', controls: fpsControls, controlsWindowClass: 'white-window' })

    // TODO: loop da ne počinje
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

    this.player.update(dt)
    this.enemies.forEach(obj => obj.update(dt))
    this.aircraft.forEach(obj => obj.update(dt))
  }
}
