import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { InteractiveGlobe } from '../3d/InteractiveGlobe'
import { Button } from '../ui/button'
import { Mail, MapPin, Calendar, Download } from 'lucide-react'
import { copyToClipboard } from '../../lib/utils'

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

  return (
    <section id="about" className="min-h-screen py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-900 to-slate-800 overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 px-2">
            About Me
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
            Passionate developer crafting immersive digital experiences through code and creativity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-12 items-start xl:items-center">
          {/* Left side - 3D Globe */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-48 sm:h-64 md:h-80 xl:h-96 order-2 xl:order-1 w-full"
          >
            <div className="w-full h-full">
              <Canvas camera={{ position: [0, 0, 3] }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <InteractiveGlobe />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
          </motion.div>

          {/* Right side - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 order-1 xl:order-2 w-full"
          >
            {/* Bio Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 w-full">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">Hello there! 👋</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                I'm a passionate full-stack developer with a love for creating immersive web experiences. 
                Specializing in modern JavaScript frameworks and 3D web technologies, I bring ideas to life 
                through clean code and innovative design.
              </p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors md:col-span-2 xl:col-span-1 w-full"
                   onClick={handleEmailCopy}>
                <Mail className="text-blue-400 mb-2" size={20} />
                <p className="text-xs sm:text-sm text-gray-400">Email</p>
                <p className="text-xs sm:text-sm lg:text-base text-white font-semibold break-all overflow-wrap-anywhere">
                  deveshmishra414@gmail.com
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 w-full">
                <MapPin className="text-green-400 mb-2" size={20} />
                <p className="text-xs sm:text-sm text-gray-400">Location</p>
                <p className="text-sm sm:text-base text-white font-semibold">Noida, India</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 w-full">
                <Calendar className="text-purple-400 mb-2" size={20} />
                <p className="text-xs sm:text-sm text-gray-400">Experience</p>
                <p className="text-sm sm:text-base text-white font-semibold">2+ Years</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 w-full">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/20 text-xs sm:text-sm lg:text-base h-auto py-2"
                  onClick={() => window.open('/resume.pdf', '_blank')}
                >
                  <Download size={14} className="mr-2" />
                  Resume
                </Button>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 w-full">
              <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm border border-blue-500/30 whitespace-nowrap"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
