import React from 'react';
import { ResumeData } from '@/types/resume';

interface MinimalistTemplateProps {
  data: ResumeData;
}

export const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({ data }) => {
  const { personal, education, experience, skills, projects, certifications, additional } = data;
  
  return (
    <div className="bg-white text-gray-800 w-full h-full font-sans p-10">
      {/* Header with minimal styling */}
      <header className="mb-10">
        <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-4">
          {personal.firstName} {personal.lastName}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.linkedin && (
            <a 
              href={personal.linkedin} 
              className="text-gray-500 hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          )}
          {personal.github && (
            <a 
              href={personal.github} 
              className="text-gray-500 hover:text-gray-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
        </div>
      </header>
      
      {/* Two column layout for content */}
      <div className="grid grid-cols-12 gap-10">
        {/* Left column - 8/12 width */}
        <div className="col-span-8 space-y-8">
          {/* Experience section */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="mb-1">
                      <h3 className="text-lg font-medium text-gray-800">{exp.title}</h3>
                      <p className="text-gray-600 mb-1">{exp.company}</p>
                      <p className="text-gray-500 text-sm mb-2">
                        {exp.startDate} – {exp.currentJob ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    {exp.responsibilities.length > 0 && (
                      <ul className="pl-5 space-y-1 text-gray-600 text-sm leading-relaxed list-disc">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects section */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Projects
              </h2>
              <div className="space-y-6">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="text-lg font-medium text-gray-800">
                      {proj.title}
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-gray-700 text-sm ml-2"
                        >
                          →
                        </a>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-1">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.technologies.map((tech, i) => (
                          <span 
                            key={i} 
                            className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-0.5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Right column - 4/12 width */}
        <div className="col-span-4 space-y-8">
          {/* Education section */}
          {education.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i}>
                    <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                    <p className="text-gray-600 text-sm">{edu.school}</p>
                    <p className="text-gray-500 text-sm">{edu.graduationYear}</p>
                    {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Skills section */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill.id} 
                    className="text-sm text-gray-600 whitespace-nowrap"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications section */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Certifications
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <p className="text-gray-700">{cert.name}</p>
                    <p className="text-gray-500 text-xs">{cert.issuer}, {cert.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Languages */}
          {additional.languages.length > 0 && (
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-5 uppercase tracking-wider">
                Languages
              </h2>
              <p className="text-sm text-gray-600">{additional.languages.join(', ')}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}; 