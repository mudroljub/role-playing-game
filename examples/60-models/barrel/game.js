import * as THREE from 'three'
import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { loadModel } from '/core/loaders.js'

scene.add(createSun())
createOrbitControls()

camera.position.set(1, 1, 1)
camera.lookAt(new THREE.Vector3(0, 0.4, 0))

const barrel = await loadModel({ file: 'item/barrel/model.fbx', size: 1 })

scene.add(barrel)

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
