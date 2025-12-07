import React from 'react';
import { ResumeData } from '@/types/resume';

interface TechTemplateProps {
  data: ResumeData;
}

export const TechTemplate: React.FC<TechTemplateProps> = ({ data }) => {
  const { personal, education, experience, skills, projects, certifications, additional } = data;
  
  return (
    <div className="bg-gray-900 text-gray-200 w-full h-full font-mono p-8">
      {/* Header with terminal-style intro */}
      <header className="mb-8 border-b border-gray-700 pb-6">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="ml-4 text-xs text-gray-500">resume.tsx</div>
        </div>
        
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">
          {personal.firstName} <span className="text-cyan-300">{personal.lastName}</span>
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <div className="flex items-center">
            <span className="text-cyan-400 mr-2">$</span>
            <span className="text-gray-400">email:</span>
            <span className="ml-2">{personal.email}</span>
          </div>
          {personal.phone && (
            <div className="flex items-center">
              <span className="text-cyan-400 mr-2">$</span>
              <span className="text-gray-400">phone:</span>
              <span className="ml-2">{personal.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          {personal.linkedin && (
            <a 
              href={personal.linkedin} 
              className="flex items-center hover:text-cyan-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-cyan-400 mr-2">~</span>
              <span>linkedin</span>
            </a>
          )}
          {personal.github && (
            <a 
              href={personal.github} 
              className="flex items-center hover:text-cyan-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-cyan-400 mr-2">~</span>
              <span>github</span>
            </a>
          )}
        </div>
      </header>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Main Column - 8/12 width */}
        <div className="col-span-8 space-y-8">
          {/* Experience Section */}
          {experience.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <span className="text-cyan-400 mr-2">function</span>
                <h2 className="text-lg font-bold text-white">Experience() {`{`}</h2>
              </div>
              
              <div className="space-y-6 ml-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l border-gray-700">
                    <div className="flex flex-col mb-2">
                      <h3 className="font-bold text-white">{exp.title}</h3>
                      <div className="flex justify-between">
                        <p className="text-cyan-400">{exp.company}</p>
                        <p className="text-gray-400 text-sm">
                          {exp.startDate} – {exp.currentJob ? 'Present' : exp.endDate}
                        </p>
                      </div>
                    </div>
                    
                    {exp.responsibilities.length > 0 && (
                      <ul className="space-y-2 text-sm">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="flex">
                            <span className="text-cyan-400 mr-2">→</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-bold text-white">{`}`}</h2>
              </div>
            </section>
          )}
          
          {/* Projects Section */}
          {projects.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <span className="text-cyan-400 mr-2">function</span>
                <h2 className="text-lg font-bold text-white">Projects() {`{`}</h2>
              </div>
              
              <div className="space-y-6 ml-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-gray-800 p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-white flex items-center">
                        <span className="text-cyan-400 mr-2">//</span>
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-cyan-400 hover:text-cyan-300 text-sm"
                        >
                          View Code
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm mb-3">{proj.description}</p>
                    
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className="text-xs bg-gray-700 text-cyan-300 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-bold text-white">{`}`}</h2>
              </div>
            </section>
          )}
        </div>
        
        {/* Right Column - 4/12 width */}
        <div className="col-span-4 space-y-8">
          {/* Skills Section - Highlighted */}
          {skills.length > 0 && (
            <section className="bg-gray-800 p-4 rounded-md border-l-2 border-cyan-400">
              <div className="flex items-center mb-4">
                <span className="text-cyan-400 mr-2">const</span>
                <h2 className="text-lg font-bold text-white">Skills = [</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-2 ml-4">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="flex items-center text-sm">
                    <span className="text-cyan-400 mr-2">{`'`}</span>
                    <span>{skill.name}</span>
                    <span className="text-cyan-400">{`'`}</span>
                    {index !== skills.length - 1 && <span className="text-gray-500">,</span>}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-bold text-white">];</h2>
              </div>
            </section>
          )}
          
          {/* Education */}
          {education.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <span className="text-cyan-400 mr-2">class</span>
                <h2 className="text-lg font-bold text-white">Education {`{`}</h2>
              </div>
              
              <div className="space-y-4 ml-6">
                {education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-white">{edu.degree}</h3>
                    <p className="text-cyan-400 text-sm">{edu.school}</p>
                    <p className="text-gray-400 text-sm">{edu.graduationYear}</p>
                    {edu.gpa && <p className="text-gray-400 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h2 className="text-lg font-bold text-white">{`}`}</h2>
              </div>
            </section>
          )}
          
          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <span className="text-cyan-400 mr-2">import</span>
                <h2 className="text-lg font-bold text-white">Certifications</h2>
              </div>
              
              <div className="space-y-3 ml-6">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <p className="text-white font-bold">{cert.name}</p>
                    <p className="text-gray-400">{cert.issuer}, {cert.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Languages */}
          {additional.languages.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <span className="text-cyan-400 mr-2">const</span>
                <h2 className="text-lg font-bold text-white">Languages = [</h2>
              </div>
              
              <div className="ml-6 mb-4">
                <p className="text-sm">
                  {additional.languages.map((lang, i) => (
                    <React.Fragment key={i}>
                      <span className="text-cyan-400">{`'`}</span>
                      <span>{lang}</span>
                      <span className="text-cyan-400">{`'`}</span>
                      {i !== additional.languages.length - 1 && <span className="text-gray-500">, </span>}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-white">];</h2>
              </div>
            </section>
          )}
        </div>
      </div>
      
      {/* Footer with comment */}
      <footer className="mt-8 pt-6 border-t border-gray-700">
        <p className="text-gray-500 text-sm">
          <span className="text-cyan-400">// </span>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}; 