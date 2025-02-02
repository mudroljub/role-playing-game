import Building from '/core/objects/Building.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({
  file: 'aircraft/airplane/dornier-do-217/WXSUTGFGGAETK9J6AYCJWA8OO.obj',
  mtl: 'aircraft/airplane/dornier-do-217/WXSUTGFGGAETK9J6AYCJWA8OO.mtl',
  size: 3
})

export default class DornierBomber extends Building {
  constructor(params = {}) {
    super({ mesh, randomSmoke: true, name: 'enemy', ...params })
    this.position.y += this.height / 2
  }
}