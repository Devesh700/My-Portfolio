import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Box, Sphere } from '@react-three/drei'
import { Button } from '../ui/button'
import { ExternalLink, Github } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

interface Project {
  id: number
  title: string
  description: string
  tech: string[]
  image: string
  liveUrl: string
  githubUrl: string
  color: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Compliance Doctor TDS",
    description: "A robust tax deduction and compliance management platform built using the MERN stack. Offers admin control, secure login, data management, and report generation for TDS compliance.",
    tech: ["React", "Next.js", "TypeScript", "Vite", "Express.Js", "MongoDb"],
    image: "/images/cd.png",
    liveUrl: "http://13.235.83.84:3000/",
    githubUrl: "https://github.com/username/project",
    color: "#3b82f6"
  },
  {
    id: 2,
    title: "B2B and B2C Tours and Travels Platform",
    description: "Scalable travel booking system offering both B2B and B2C flows, with integrated payment gateway, agent portal, and dynamic package listing. Built with modern front-end and .NET backend.",
    tech: ["React", ".Net", "CC Avenue", "Tailwind", "NX"],
    image: "/images/bcomerce.png",
    liveUrl: "https://b2capp.pierofcloudtech.com/",
    githubUrl: "https://github.com/username/project",
    color: "#10b981"
  },
  {
    id: 3,
    title: "Employee Management System",
    description: "A feature-rich employee management platform with real-time chat, attendance tracking, performance monitoring, and AI-powered assistance. Built with React, Nest.js, and PostgreSQL.",
    tech: ["React", "Nest.Js", "Socket.io", "Chromium", "PostgreSQL"],
    image: "/images/mybildr.png",
    liveUrl: "https://mybildr.com",
    githubUrl: "https://github.com/username/project",
    color: "#8b5cf6"
  }
]

// 3D Background Scene Component
function ProjectsBackground({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.001
    
    groupRef.current.rotation.y = time * 0.1 + scroll * 0.2
    groupRef.current.position.y = -scroll * 0.5
  })
  
  return (
    <group ref={groupRef}>
      {/* Floating geometric shapes */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        <Box args={[0.5, 0.5, 0.5]} position={[-3, 2, -2]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.2} />
        </Box>
      </Float>
      
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
        <Sphere args={[0.3, 16, 16]} position={[3, -1, -3]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={2.5}>
        <Box args={[0.4, 0.8, 0.4]} position={[0, 3, -4]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.2} />
        </Box>
      </Float>
      
      {/* Tech stack labels floating in 3D */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1}>
        <Text
          position={[-2, 0, -1]}
          fontSize={0.3}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          React
        </Text>
      </Float>
      
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={1.8}>
        <Text
          position={[2, 1, -2]}
          fontSize={0.25}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          Next.js
        </Text>
      </Float>
    </group>
  )
}

// Enhanced Project Card with 3D hover effects
function EnhancedProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-500"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        z: 50,
        transition: { duration: 0.3 }
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(45deg, ${project.color}20, transparent, ${project.color}10)`,
          filter: 'blur(10px)',
          zIndex: -1
        }}
        animate={hovered ? { scale: 1.1 } : { scale: 1 }}
      />

      {/* Project Image/Preview with 3D effect */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br" 
          style={{ background: `linear-gradient(135deg, ${project.color}20, transparent)` }}
          animate={hovered ? { opacity: 0.8 } : { opacity: 1 }}
        />
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={hovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="text-6xl font-bold text-white/20">{project.id}</div>
          )}
        </motion.div>

        {/* Enhanced hover overlay */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center space-x-4"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open(project.liveUrl, '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Live Demo
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* <Button
                size="sm"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                <Github size={16} className="mr-2" />
                Code
              </Button> */}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Project Info */}
      <motion.div 
        className="p-6"
        animate={hovered ? { y: -5 } : { y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h3 
          className="text-xl font-bold text-white mb-2"
          animate={hovered ? { color: project.color } : { color: "#ffffff" }}
        >
          {project.title}
        </motion.h3>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
        
        {/* Enhanced Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, techIndex) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: techIndex * 0.1 }}
              className="px-2 py-1 text-xs rounded-md border cursor-pointer transition-all duration-300 hover:scale-110"
              style={{ 
                borderColor: project.color + '50',
                backgroundColor: project.color + '20',
                color: project.color
              }}
              whileHover={{
                boxShadow: `0 4px 12px ${project.color}40`,
                y: -2
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Enhanced Links */}
        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="flex-1 transition-all duration-300 hover:shadow-lg"
              style={{ 
                backgroundColor: project.color,
                boxShadow: `0 4px 12px ${project.color}40`
              }}
              onClick={() => window.open(project.liveUrl, '_blank')}
            >
              <ExternalLink size={14} className="mr-2" />
              View Live
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:border-gray-500"
              onClick={() => window.open(project.githubUrl, '_blank')}
            >
              <Github size={14} />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.9])

  // Spring animations
  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden"
    >
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#3b82f6" />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
          
          <ProjectsBackground scrollY={scrollY} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.005}% ${50 + scrollY * 0.003}%, #8b5cf6 0%, transparent 70%)`
        }}
      />

      <motion.div 
        style={{ y: springY, opacity, scale: springScale }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{
              textShadow: `0 0 30px rgba(139, 92, 246, ${0.3 + scrollY * 0.0001})`
            }}
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            A showcase of my recent work, blending creativity with cutting-edge technology
          </motion.p>
        </motion.div>

        {/* Enhanced Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          {projects.map((project, index) => (
            <EnhancedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Enhanced More Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.p 
            className="text-gray-300 mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Want to see more of my work?
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
              onClick={() => window.open('https://github.com/Devesh700', '_blank')}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Github size={16} className="mr-2" />
              </motion.div>
              View All Projects on GitHub
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
