import Scena3D from '/core/Scena3D.js'
import { createGround } from '/core/ground.js'
import { sample } from '/core/helpers.js'
import { hemLight, lightningStrike } from '/core/light.js'
import FPSPlayer from '/core/actor/FPSPlayer.js'
import Maze from '/core/mazes/Maze.js'
import { truePrims } from '/core/mazes/algorithms.js'
import Report from '/core/io/Report.js'
import GUI, { fpsControls } from '/core/io/GUI.js'
import { GermanMachineGunnerAI } from '/core/actor/derived/ww2/GermanMachineGunner.js'
import { SSSoldierAI } from '/core/actor/derived/ww2/SSSoldier.js'
import { NaziOfficerAI } from '/core/actor/derived/ww2/NaziOfficer.js'
import { GermanFlameThrowerAI } from '/core/actor/derived/ww2/GermanFlameThrower.js'
import FirstAid from '/core/objects/FirstAid.js'

export default class LavirintScena extends Scena3D {
  constructor(manager) {
    super(manager, { autostart: false, usePointerLock: true, toon: true })
  }

  async init() {
    this.bojaPozadine = 0x070b34
    this.light = hemLight({ intensity: Math.PI * 1.5, scene: this.scene })
    this.dodajMesh(createGround({ file: 'terrain/ground.jpg' }))

    this.maze = new Maze(8, 8, truePrims, 5)
    const walls = this.maze.toTiledMesh({ texture: 'terrain/concrete.jpg' })
    this.dodajMesh(walls)

    const player = this.player = new FPSPlayer({ camera: this.camera, solids: walls })
    player.putInMaze(this.maze)
    this.dodaj(player)

    const coords = this.maze.getEmptyCoords(true)
    this.enemies = []
    const soldiers = [GermanMachineGunnerAI, SSSoldierAI, NaziOfficerAI, GermanFlameThrowerAI]
    for (let i = 0; i < 10; i++) {
      const EnemyClass = sample(soldiers)
      const enemy = new EnemyClass({ pos: coords.pop(), target: player.mesh, solids: walls })
      this.enemies.push(enemy)
      this.dodaj(enemy)
    }

    for (let i = 0; i < 2; i++) {
      const firstAid = new FirstAid({ pos: coords.pop() })
      this.dodajMesh(firstAid.mesh)
    }

    this.setupGUI()
    this.renderer.render(this.scene, this.camera) // first draw
  }

  setupGUI() {
    this.gui = new GUI({ subtitle: 'Enemy left', total: this.enemies.length, controls: fpsControls, scoreClass: '', controlsWindowClass: 'white-window' })

    this.gui.showGameScreen({
      goals: ['Find the way out', 'Bonus: Kill all enemies'],
      subtitle: 'Shoot: MOUSE<br> Move: WASD or ARROWS<br> Run: CAPSLOCK',
      usePointerLock: true,
    })

    new Report({ container: this.gui.gameScreen, text: 'After a successful sabotage mission you stayed behind enemy lines.\n\nFind the way out of the enemy base.' })
  }

  update(dt, t) {
    super.update(dt, t)

    const killed = this.enemies.filter(enemy => enemy.energy <= 0)
    const left = this.enemies.length - killed.length
    const won = this.player.position.distanceTo(this.maze.exitPosition) < 5

    if (won)
      this.gui.renderText(`Bravo!<br>You found a way out<br> and kill ${killed.length} of ${this.enemies.length} enemies`)

    const blinkingMessage = won ? '' : 'Find a way out!'
    this.gui.update({ time: t, points: killed.length, left, dead: this.player.dead, blinkingMessage })

    if (Math.random() > .998) lightningStrike(this.light)
  }
}
