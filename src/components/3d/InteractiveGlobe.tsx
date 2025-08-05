import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { Mesh } from 'three'

export function InteractiveGlobe() {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  
  useFrame(() => {
    meshRef.current.rotation.y += 0.01
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 32, 32]}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? "#60a5fa" : "#3b82f6"}
        wireframe
        transparent
        opacity={0.6}
      />
    </Sphere>
  )
}
