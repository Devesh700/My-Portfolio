import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text } from '@react-three/drei'
// import { FloatingCube } from '../3d/FloatingCube'
import { Button } from '../ui/button'
import { ArrowDown } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Enhanced FloatingCube with scroll effects
function ScrollFloatingCube({ position, text, color, scrollY }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.001
    
    // Rotation based on time and scroll
    meshRef.current.rotation.x = time * 0.2 + scroll * 2
    meshRef.current.rotation.y = time * 0.3 + scroll * 1.5
    
    // Position changes based on scroll
    groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1 - scroll * 0.5
    groupRef.current.position.z = position[2] + scroll * 0.3
    
    // Scale effect based on scroll
    const scale = 1 - Math.min(scroll * 0.5, 0.8)
    groupRef.current.scale.setScalar(Math.max(scale, 0.2))
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
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

// Animated camera controller
function ScrollCamera({ scrollY }: { scrollY: number }) {
  useFrame((state) => {
    const scroll = scrollY * 0.001
    
    // Camera movement based on scroll
    state.camera.position.z = 5 - scroll * 2
    state.camera.position.y = scroll * 1.5
    state.camera.rotation.x = -scroll * 0.3
    
    // Update camera
    state.camera.updateProjectionMatrix()
  })
  
  return null
}

// Particle system that responds to scroll
function ScrollParticles({ scrollY }: { scrollY: number }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 1000
  
  // Create particles
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    
    colors[i * 3] = Math.random()
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()
  }
  
  useFrame(() => {
    if (!particlesRef.current) return
    
    const scroll = scrollY * 0.001
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] -= scroll * 0.1
      
      // Reset particle position if it goes too far
      if (positions[i * 3 + 1] < -25) {
        positions[i * 3 + 1] = 25
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors />
    </points>
  )
}

// Background spheres with scroll effects
function BackgroundSpheres({ scrollY }: { scrollY: number }) {
  const spheres = Array.from({ length: 5 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      -10 - Math.random() * 10
    ] as [number, number, number],
    scale: 0.5 + Math.random() * 1.5,
    color: `hsl(${180 + i * 40}, 70%, 60%)`
  }))
  
  return (
    <>
      {spheres.map((sphere, index) => (
        <ScrollSphere 
          key={index}
          position={sphere.position}
          scale={sphere.scale}
          color={sphere.color}
          scrollY={scrollY}
          index={index}
        />
      ))}
    </>
  )
}

function ScrollSphere({ position, scale, color, scrollY, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.001
    
    // Floating animation
    meshRef.current.position.y = position[1] + Math.sin(time + index) * 2
    meshRef.current.position.z = position[2] - scroll * 3
    
    // Rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
    
    // Scale based on scroll
    const scaleEffect = 1 + scroll * 0.5
    meshRef.current.scale.setScalar(scale * scaleEffect)
    
    // Reset position if sphere goes too far
    if (meshRef.current.position.z > 10) {
      meshRef.current.position.z = -20
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  )
}

export function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const techStack = ['React', 'Three.js', 'TypeScript', 'Node.js', 'Next.js', 'Fastify.js']

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Framer Motion scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -500])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced 3D Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#blue" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.15}
            penumbra={1}
            intensity={0.5}
            castShadow
          />
          
          {/* Animated Stars */}
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0.5}
            fade
          />
          
          {/* Scroll-responsive camera */}
          <ScrollCamera scrollY={scrollY} />
          
          {/* Background particles */}
          <ScrollParticles scrollY={scrollY} />
          
          {/* Background spheres */}
          <BackgroundSpheres scrollY={scrollY} />
          
          {/* Enhanced floating cubes */}
          {techStack.map((tech, index) => (
            <Float 
              key={tech} 
              speed={1.5 + index * 0.1} 
              rotationIntensity={1 + index * 0.2} 
              floatIntensity={2}
            >
              <ScrollFloatingCube
                position={[
                  (index - 2.5) * 2.5,
                  Math.sin(index) * 2,
                  -2 - index * 0.5
                ]}
                text={tech}
                color={`hsl(${200 + index * 30}, 70%, 60%)`}
                scrollY={scrollY}
              />
            </Float>
          ))}
          
          {/* Interactive orbit controls */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </motion.div>

      {/* Enhanced Content with scroll effects */}
      <motion.div 
        style={{ y: contentY, opacity, scale }}
        className="relative z-10 text-center text-white px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          style={{
            filter: `blur(${scrollY * 0.01}px)`,
          }}
        >
          Devesh Mishra
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          style={{
            transform: `translateZ(${scrollY * 0.1}px)`,
          }}
        >
          Full Stack Developer & 3D Web Enthusiast
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/25"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        style={{ 
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
          y: useTransform(scrollYProgress, [0, 0.3], [0, 100])
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer z-20"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm mb-2 opacity-80">Scroll to Explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown size={24} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-5" />
    </section>
  )
}
