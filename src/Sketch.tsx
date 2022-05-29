import { useMemo, useRef } from "react"
import { worldMap } from "./data/worldMap"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Points } from "three"

const sphereRadius = 4

const vertex = `
    attribute float distortion; 
    varying float vDistortion; 

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;

        gl_PointSize = 47.5;
        gl_PointSize *= (1.0 / - viewPosition.z);

        vDistortion = distortion; 
    }
`

const fragment = `
    uniform sampler2D uTexture; 
    varying float vDistortion; 
    
    void main() {
        float size = 2.0; 

        vec2 _uv = gl_PointCoord; 
        _uv.x = _uv.x / size + floor(vDistortion * size)/size; 

        vec3 characterMap = texture2D(uTexture, vec2(_uv.x, 1.0 - _uv.y)).rgb; 
        if(characterMap.r > 0.5) discard; 

        gl_FragColor = vec4(vec3(0.77, 0.82, 0.92), 1.0); 
    }
`

const radians = (degrees: number) => degrees * (Math.PI / 180)

const Sketch = () => {
  const ref = useRef<Points>(null!)

  const texture = useTexture("texture.png")

  const [positions, distortion] = useMemo(() => {
    const positions = new Float32Array(worldMap.length * 3)
    const distortion = new Float32Array(worldMap.length)

    worldMap.forEach(({ lon, lat }, i) => {
      const theta = radians(lat) + Math.PI / 2
      const phi = radians(lon) + Math.PI

      positions[i * 3 + 0] = -sphereRadius * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = sphereRadius * Math.sin(theta) * Math.sin(phi)
      positions[i * 3 + 2] = sphereRadius * Math.cos(theta)

      distortion[i] = Math.random()
    })

    return [positions, distortion]
  }, [])

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
    }),
    [texture]
  )

  useFrame(() => (ref.current.rotation.z += 0.0025))

  return (
    <points ref={ref} rotation={[-Math.PI * 0.5, -Math.PI + 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' args={[positions, 3]} />
        <bufferAttribute
          attach='attributes-distortion'
          args={[distortion, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </points>
  )
}

export default Sketch
