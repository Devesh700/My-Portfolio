import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text, Box, Torus } from '@react-three/drei'
import { Button } from '../ui/button'
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

// 3D Contact Icons floating in space
function FloatingContactIcons({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.001
    
    groupRef.current.rotation.y = time * 0.1 + scroll * 0.2
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.5 - scroll * 0.3
  })
  
  return (
    <group ref={groupRef}>
      {/* Email Icon */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
        <Box args={[0.5, 0.3, 0.1]} position={[-2, 1, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
        </Box>
        <Text
          position={[-2, 0.5, 0]}
          fontSize={0.15}
          color="#60a5fa"
          anchorX="center"
          anchorY="middle"
        >
          EMAIL
        </Text>
      </Float>
      
      {/* Phone Icon */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
        <Box args={[0.2, 0.6, 0.1]} position={[2, 0, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
        </Box>
        <Text
          position={[2, -0.5, 0]}
          fontSize={0.15}
          color="#34d399"
          anchorX="center"
          anchorY="middle"
        >
          PHONE
        </Text>
      </Float>
      
      {/* Location Icon */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={2.5}>
        <Torus args={[0.3, 0.1, 8, 16]} position={[0, -1.5, 0]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.3} />
        </Torus>
        <Text
          position={[0, -2, 0]}
          fontSize={0.15}
          color="#a78bfa"
          anchorX="center"
          anchorY="middle"
        >
          LOCATION
        </Text>
      </Float>
    </group>
  )
}

// Animated particles for form background
function FormParticles({ scrollY }: { scrollY: number }) {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 100
  
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    
    colors[i * 3] = Math.random() * 0.5 + 0.5
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.7
    colors[i * 3 + 2] = 1
  }
  
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    const scroll = scrollY * 0.0005
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.01
      positions[i * 3] += Math.cos(time + i * 0.05) * 0.005
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y = scroll
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
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} />
    </points>
  )
}

// Enhanced contact info item with 3D effects
function ContactInfoItem({ 
  icon: Icon, 
  label, 
  value, 
  bgColor, 
  index 
}: {
  icon: any
  label: string
  value: string
  bgColor: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, rotateY: -15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      className="flex items-center space-x-4 group"
      whileHover={{ 
        scale: 1.05,
        x: 10,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div 
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
        whileHover={{ 
          scale: 1.1,
          rotateY: 15,
          boxShadow: `0 10px 25px ${bgColor.includes('blue') ? '#3b82f620' : bgColor.includes('green') ? '#10b98120' : '#8b5cf620'}`
        }}
      >
        <Icon className="text-white" size={20} />
      </motion.div>
      <motion.div
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </motion.div>
    </motion.div>
  )
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95])

  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Form submitted:', formData)
    alert('Thank you for your message! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'deveshmishra414@gmail.com',
      bgColor: 'bg-blue-500',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 6306685068',
      bgColor: 'bg-green-500',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Noida, India',
      bgColor: 'bg-purple-500',
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden"
    >
      {/* 3D Background for contact info */}
      <div className="absolute left-0 top-0 w-1/2 h-full opacity-20">
        <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#3b82f6" />
          <pointLight position={[-5, -5, -3]} intensity={0.5} color="#8b5cf6" />
          
          <FloatingContactIcons scrollY={scrollY} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </div>

      {/* 3D Background for form */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-15">
        <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[3, 3, 3]} intensity={0.6} color="#10b981" />
          
          <FormParticles scrollY={scrollY} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={-0.1}
          />
        </Canvas>
      </div>

      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `conic-gradient(from ${scrollY * 0.1}deg, #3b82f6, #8b5cf6, #10b981, #3b82f6)`
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
              textShadow: `0 0 30px rgba(59, 130, 246, ${0.4 + scrollY * 0.0001})`
            }}
          >
            Let's Work Together
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Have a project in mind? I'd love to hear about it. Let's create something amazing together.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12" style={{ perspective: '1000px' }}>
          {/* Enhanced Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="space-y-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MessageCircle className="mr-3 text-blue-400" size={28} />
                Get in Touch
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, interesting projects, 
                or just having a chat about technology and development.
              </p>
            </motion.div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <ContactInfoItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  bgColor={item.bgColor}
                  index={index}
                />
              ))}
            </div>

            {/* Social links or additional info can go here */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 border-t border-white/10"
            >
              <p className="text-gray-400 text-sm">
                Available for freelance opportunities and full-time positions.
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            viewport={{ once: true }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6 bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl"
              whileHover={{ 
                scale: 1.02,
                rotateY: -2,
                boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your Name"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                  placeholder="Tell me about your project..."
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Send size={16} />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
