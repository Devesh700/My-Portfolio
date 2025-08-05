import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Sphere, Box } from '@react-three/drei'
// import { InteractiveGlobe } from '../3d/InteractiveGlobe'
import { Button } from '../ui/button'
import { Mail, MapPin, Calendar, Download } from 'lucide-react'
import { copyToClipboard } from '../../lib/utils'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Enhanced Globe with scroll-based animations
function EnhancedInteractiveGlobe({ scrollY }: { scrollY: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const particlesRef = useRef<THREE.Points>(null!)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.001
    
    // Base rotation
    meshRef.current.rotation.y = time * 0.5 + scroll * 0.3
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1 + scroll * 0.1
    
    // Floating effect with scroll influence
    meshRef.current.position.y = Math.sin(time * 2) * 0.1 - scroll * 0.2
    
    // Scale effect based on scroll
    const scale = 1 + Math.sin(scroll * 2) * 0.1
    meshRef.current.scale.setScalar(scale)
    
    // Update particles if they exist
    if (particlesRef.current) {
      particlesRef.current.rotation.x = time * 0.1
      particlesRef.current.rotation.y = -time * 0.2 + scroll
    }
  })

  return (
    <>
      <Sphere
        ref={meshRef}
        args={[1, 32, 32]}
      >
        <meshStandardMaterial
          color="#3b82f6"
          wireframe
          transparent
          opacity={0.6}
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Floating skill orbs around the globe */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <Sphere args={[0.1, 16, 16]} position={[1.5, 0, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.7}>
        <Box args={[0.15, 0.15, 0.15]} position={[-1.2, 0.8, 0.5]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.3} />
        </Box>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={0.4}>
        <Sphere args={[0.08, 12, 12]} position={[0.5, -1.3, -0.8]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
    </>
  )
}

// Floating skill tags in 3D space
function FloatingSkillTags({ skills, scrollY }: { skills: string[], scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.0005
    
    groupRef.current.rotation.y = time * 0.1 + scroll
    groupRef.current.position.y = Math.sin(time) * 0.2 - scroll * 0.3
  })
  
  return (
    <group ref={groupRef}>
      {skills.slice(0, 4).map((skill, index) => {
        const angle = (index / 4) * Math.PI * 2
        const radius = 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <Float key={skill} speed={1 + index * 0.2} rotationIntensity={0.5} floatIntensity={0.3}>
            <Text
              position={[x, 0, z]}
              fontSize={0.15}
              color="#60a5fa"
              anchorX="center"
              anchorY="middle"
            >
              {skill.split('/')[0]}
            </Text>
          </Float>
        )
      })}
    </group>
  )
}

// Animated background particles
function BackgroundParticles({ scrollY }: { scrollY: number }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 200
  
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    
    colors[i * 3] = Math.random() * 0.5 + 0.5
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5
    colors[i * 3 + 2] = 1
  }
  
  useFrame(() => {
    if (!particlesRef.current) return
    
    const scroll = scrollY * 0.001
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01
      positions[i * 3] += Math.cos(Date.now() * 0.001 + i) * 0.005
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y = scroll * 0.5
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
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.6} />
    </points>
  )
}

export function About() {
  const skills = [
    'JavaScript/TypeScript',
    'React/Next.js',
    'Three.js/WebGL',
    'Node.js/Express',
    'Python/Django',
    'MongoDB/PostgreSQL',
    'AWS/Docker',
    'Git/CI/CD'
  ]

  const handleEmailCopy = async () => {
    const success = await copyToClipboard('deveshmishra414@gmail.com')
    if (success) {
      alert('Email copied to clipboard!')
    }
  }

  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Framer Motion scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9])
  
  // Smooth spring animation for cards
  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="min-h-screen py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-900 to-slate-800 overflow-x-hidden relative"
    >
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.01}% ${50 + scrollY * 0.005}%, #3b82f6 0%, transparent 70%)`
        }}
      />
      
      <motion.div 
        style={{ y: springY, opacity, scale: springScale }}
        className="w-full max-w-6xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2"
            style={{
              textShadow: `0 0 20px rgba(59, 130, 246, ${0.3 + scrollY * 0.0001})`
            }}
          >
            About Me
          </motion.h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
            Passionate developer crafting immersive digital experiences through code and creativity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-12 items-start xl:items-center">
          {/* Enhanced 3D Globe Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-48 sm:h-64 md:h-80 xl:h-96 order-2 xl:order-1 w-full"
          >
            <div className="w-full h-full relative">
              <Canvas 
                camera={{ position: [0, 0, 4], fov: 75 }} 
                style={{ width: '100%', height: '100%' }}
                gl={{ antialias: true, alpha: true }}
              >
                {/* Enhanced lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} color="#3b82f6" />
                <pointLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
                <spotLight
                  position={[0, 5, 5]}
                  angle={0.3}
                  penumbra={1}
                  intensity={0.5}
                  castShadow
                />
                
                {/* Background particles */}
                <BackgroundParticles scrollY={scrollY} />
                
                {/* Enhanced interactive globe */}
                <EnhancedInteractiveGlobe scrollY={scrollY} />
                
                {/* Floating skill tags */}
                <FloatingSkillTags skills={skills} scrollY={scrollY} />
                
                {/* Enhanced orbit controls */}
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false} 
                  autoRotate 
                  autoRotateSpeed={0.5}
                  maxPolarAngle={Math.PI / 1.5}
                  minPolarAngle={Math.PI / 3}
                />
              </Canvas>
              
              {/* Glow effect overlay */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Enhanced Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 order-1 xl:order-2 w-full"
          >
            {/* Bio Card with hover effects */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 w-full hover:bg-white/15 transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Hello there! 👋</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                I'm a passionate full-stack developer with a love for creating immersive web experiences. 
                Specializing in modern JavaScript frameworks and 3D web technologies, I bring ideas to life 
                through clean code and innovative design.
              </p>
            </motion.div>

            {/* Enhanced Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300 md:col-span-2 xl:col-span-1 w-full hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/10"
                onClick={handleEmailCopy}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail className="text-blue-400 mb-2" size={20} />
                <p className="text-xs sm:text-sm text-gray-400">Email</p>
                <p className="text-xs sm:text-sm lg:text-base text-white font-semibold break-all overflow-wrap-anywhere">
                  deveshmishra414@gmail.com
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 w-full hover:bg-white/15 transition-all duration-300 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/10"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <MapPin className="text-green-400 mb-2" size={20} />
                <p className="text-xs sm:text-sm text-gray-400">Location</p>
                <p className="text-sm sm:text-base text-white font-semibold">Noida, India</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 w-full hover:bg-white/15 transition-all duration-300 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <Calendar className="text-purple-400 mb-2" size={20} />
                <p className="text-xs sm:text-sm text-gray-400">Experience</p>
                <p className="text-sm sm:text-base text-white font-semibold">2+ Years</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 w-full hover:bg-white/15 transition-all duration-300 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-500/10"
                whileHover={{ scale: 1.03, y: -3 }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/20 text-xs sm:text-sm lg:text-base h-auto py-2 transition-all duration-300"
                  onClick={() => window.open('/resume.pdf', '_blank')}
                >
                  <Download size={14} className="mr-2" />
                  Resume
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Skills Section */}
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 w-full hover:bg-white/15 transition-all duration-300 hover:border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/10"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm border border-blue-500/30 whitespace-nowrap cursor-pointer transition-all duration-300 hover:bg-blue-500/30 hover:border-blue-400/50 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.1, 
                      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" 
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
