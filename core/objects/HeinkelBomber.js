import Building from '/core/objects/Building.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({
  file: 'aircraft/airplane/heinkel-he-111/model.fbx',
  size: 4,
  angle: .125,
  axis: [1, 0, 0],
})

export default class HeinkelBomber extends Building {
  constructor(params = {}) {
    super({ mesh, randomSmoke: true, name: 'enemy', ...params })
    this.position.y += this.height * .27
  }
}