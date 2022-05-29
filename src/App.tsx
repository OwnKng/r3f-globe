import "./App.css"
import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

const App = () => (
  <div className='App'>
    <Canvas camera={{ position: [0, 4, -6] }}>
      <Sketch />
    </Canvas>
  </div>
)

export default App
