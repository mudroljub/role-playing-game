import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { getHeightData } from '/core/terrain/heightmap.js'
import { createTerrain } from '/core/physics/index.js'
import { createSphere, createTremplin } from '/core/geometry/index.js'
import PhysicsWorld from '/core/physics/PhysicsWorld.js'

const { randFloatSpread } = THREE.MathUtils

let vehicle

const world = new PhysicsWorld()

scene.add(createSun({ planetColor: 0xB0E0E6 }))

const { data, width, depth } = await getHeightData('/assets/images/heightmaps/wiki.png', 5)
const terrain = await createTerrain({ data, width, depth, minHeight: -2, maxHeight: 16 })
world.add(terrain)

const tremplin = createTremplin({ color: 0xfffacd })
tremplin.position.set(-10, -4.5, 20)
world.add(tremplin, 0)

for (let i = 0; i < 5; i++) {
  const ball = createSphere({ color: 0xfffacd })
  ball.position.set(randFloatSpread(40), 0, randFloatSpread(40))
  world.add(ball, 800)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
  if (!vehicle) return
  const dt = clock.getDelta()
  vehicle.update(dt)
  world.update(dt)
}()

/* LAZY LOAD */

const vehicleFile = await import('/core/physics/Humvee.js')
vehicle = new vehicleFile.default({ camera, physicsWorld: world.physicsWorld })
scene.add(vehicle.mesh, ...vehicle.wheelMeshes)
