import "./App.css"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"
import { useThree, useFrame } from "@react-three/fiber"
import { Vector3 } from "three"

const Rig = () => {
  const { camera, mouse } = useThree()
  const vec = new Vector3()
  return useFrame(() =>
    camera.position.lerp(
      vec.set(0 + mouse.x * 0.5, 4 + mouse.y * 0.5, camera.position.z),
      0.02
    )
  )
}

const App = () => (
  <div className='App'>
    <Canvas camera={{ position: [0, 4, -6] }}>
      <Sketch />
      <Rig />
    </Canvas>
  </div>
)

export default App
