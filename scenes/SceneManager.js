const putanje = {
  DrvarScena: './drvar/DrvarScena.js',
  RajlovacScena: './rajlovac/RajlovacScena.js'
}

class SceneManager {
  static instance = null

  constructor() {
    if (SceneManager.instance)
      return SceneManager.instance

    this.currentScene = null
    SceneManager.instance = this
  }

  async loadScene(key) {
    const sceneModule = await import(putanje[key])
    return sceneModule.default
  }

  async start(key) {
    if (this.currentScene)
      this.currentScene.end()

    const SceneClass = await this.loadScene(key)
    this.currentScene = new SceneClass(this)
    this.currentScene.start()
  }
}

export default SceneManager