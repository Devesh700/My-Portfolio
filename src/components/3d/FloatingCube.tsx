import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Text } from '@react-three/drei'

interface FloatingCubeProps {
  position: [number, number, number]
  text: string
  color?: string
}

export function FloatingCube({ position, text, color = "#3b82f6" }: FloatingCubeProps) {
  const meshRef = useRef<Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = time * 0.2
    meshRef.current.rotation.y = time * 0.3
    meshRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  )
}
