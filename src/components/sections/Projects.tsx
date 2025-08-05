import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { ExternalLink, Github } from 'lucide-react'
import { useState } from 'react'

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
    description: "Interactive portfolio built with Three.js and React, featuring immersive 3D experiences and smooth animations.",
    tech: ["React", "Next.js", "TypeScript", "Vite", "Express.Js", "MongoDb"],
    image: "/images/cd.png",
    liveUrl: "http://13.235.83.84:3000/",
    githubUrl: "https://github.com/username/project",
    color: "#3b82f6"
  },
  {
    id: 2,
    title: "B2B and B2C Tours and Travels Platform",
    description: "Full-stack e-commerce solution with payment integration, admin dashboard, and modern UI/UX design.",
    tech: ["React", ".Net", "CC Avenue", "Tailwind", "NX"],
    image: "/images/bcomerce.png",
    liveUrl: "https://b2capp.pierofcloudtech.com/",
    githubUrl: "https://github.com/username/project",
    color: "#10b981"
  },
  {
    id: 3,
    title: "Employee Managemenet System",
    description: "Real-time chat application with AI integration, featuring modern design and seamless user experience.",
    tech: ["React", "Nest.Js", "Socket.io", "Chromium", "PostgreSQL"],
    image: "/images/mybildr.png",
    liveUrl: "https://mybildr.com",
    githubUrl: "https://github.com/username/project",
    color: "#8b5cf6"
  }
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Project Image/Preview */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${project.color}20, transparent)` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          {project.image ? 
          <img src={project.image} className='object-cover'/>
          :
          <div className="text-6xl font-bold text-white/20">{project.id}</div>}
        </div>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-4"
          >
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => window.open(project.liveUrl, '_blank')}
            >
              <ExternalLink size={16} className="mr-2" />
              Live Demo
            </Button>
            {/* <Button
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={() => window.open(project.githubUrl, '_blank')}
            >
              <Github size={16} className="mr-2" />
              Code
            </Button> */}
          </motion.div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-md border"
              style={{ 
                borderColor: project.color + '50',
                backgroundColor: project.color + '20',
                color: project.color
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex space-x-3">
          <Button
            size="sm"
            className="flex-1"
            style={{ backgroundColor: project.color }}
            onClick={() => window.open(project.liveUrl, '_blank')}
          >
            <ExternalLink size={14} className="mr-2" />
            View Live
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => window.open(project.githubUrl, '_blank')}
          >
            <Github size={14} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A showcase of my recent work, blending creativity with cutting-edge technology
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* More Projects CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-6">Want to see more of my work?</p>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
            onClick={() => window.open('https://github.com/Devesh700', '_blank')}
          >
            <Github size={16} className="mr-2" />
            View All Projects on GitHub
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
