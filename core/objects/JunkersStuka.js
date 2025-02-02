import Building from '/core/objects/Building.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({
  file: 'aircraft/airplane/junkers-ju-87-stuka/B6L6UIB83ZKUE6YOCT94DAHM3.obj',
  mtl: 'aircraft/airplane/junkers-ju-87-stuka/B6L6UIB83ZKUE6YOCT94DAHM3.mtl',
  size: 3.9,
})

export default class JunkersStuka extends Building {
  constructor(params = {}) {
    super({ mesh, randomSmoke: true, name: 'enemy', ...params })
    this.position.y += this.height / 2
  }
}