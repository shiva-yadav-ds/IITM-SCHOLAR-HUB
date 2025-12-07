
import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { personal, education, experience, skills, projects, certifications, additional } = data;
  
  const technicalSkills = skills.filter(skill => skill.type === 'technical');
  const softSkills = skills.filter(skill => skill.type === 'soft');
  
  return (
    <div className="bg-white text-gray-800 w-full h-full flex flex-col">
      {/* Header */}
      <header className="bg-[hsl(var(--iitm-blue))] text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{personal.firstName} {personal.lastName}</h1>
            {additional.summary && (
              <p className="mt-2 max-w-lg">{additional.summary}</p>
            )}
          </div>
          <div className="text-right">
            {personal.email && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <span>{personal.email}</span>
                <Mail size={16} />
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <span>{personal.phone}</span>
                <Phone size={16} />
              </div>
            )}
            {personal.address && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <span>{personal.address}</span>
                <MapPin size={16} />
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <a href={personal.linkedin} target="_blank" rel="noopener noreferrer">
                  {personal.linkedin.replace(/^https?:\/\/(www\.)?/i, '')}
                </a>
                <Linkedin size={16} />
              </div>
            )}
            {personal.github && (
              <div className="flex items-center justify-end gap-2 mb-1">
                <a href={personal.github} target="_blank" rel="noopener noreferrer">
                  {personal.github.replace(/^https?:\/\/(www\.)?/i, '')}
                </a>
                <Github size={16} />
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex flex-1">
        {/* Left Column */}
        <div className="w-2/3 p-6 border-r border-gray-300">
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Education
              </h2>
              {education.map((edu, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <h3 className="font-semibold">{edu.school}</h3>
                  <p className="text-gray-600">{edu.degree} | {edu.graduationYear}</p>
                  {edu.gpa && <p className="text-gray-600">GPA/Percentage: {edu.gpa}</p>}
                  {edu.relevantCourses.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Relevant Courses:</p>
                      <p className="text-gray-600">{edu.relevantCourses.join(", ")}</p>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
          
          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Experience
              </h2>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-6 last:mb-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-gray-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                  <p className="text-gray-700">{exp.company}</p>
                  {exp.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
          
          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4 last:mb-0">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{proj.title}</h3>
                    {proj.link && (
                      <a 
                        href={proj.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Project Link
                      </a>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((tech, i) => (
                        <span 
                          key={i}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        
        {/* Right Column */}
        <div className="w-1/3 p-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Skills
              </h2>
              
              {technicalSkills.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {technicalSkills.map((skill) => (
                      <span 
                        key={skill.id}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {softSkills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {softSkills.map((skill) => (
                      <span 
                        key={skill.id}
                        className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
          
          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Certifications
              </h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-2 last:mb-0">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-gray-600">{cert.issuer} ({cert.year})</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Languages */}
          {additional.languages.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Languages
              </h2>
              <ul className="list-disc list-inside">
                {additional.languages.map((lang, i) => (
                  <li key={i} className="text-gray-600">{lang}</li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Hobbies */}
          {additional.hobbies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                Hobbies & Interests
              </h2>
              <p className="text-gray-600">{additional.hobbies.join(", ")}</p>
            </section>
          )}
          
          {/* References */}
          {additional.references && (
            <section>
              <h2 className="text-xl font-bold text-[hsl(var(--iitm-blue))] border-b border-gray-300 pb-1 mb-4">
                References
              </h2>
              <p className="text-gray-600">{additional.references}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
