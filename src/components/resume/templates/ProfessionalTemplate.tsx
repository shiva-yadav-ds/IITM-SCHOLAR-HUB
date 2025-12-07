import React from 'react';
import { ResumeData } from '@/types/resume';

interface ProfessionalTemplateProps {
  data: ResumeData;
}

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({ data }) => {
  const { personal, education, experience, skills, projects, certifications, additional } = data;
  
  return (
    <div className="bg-background text-foreground w-full h-full font-sans p-4 sm:p-8">
      {/* Header Section */}
      <header className="border-b-2 border-border pb-4 mb-6">
        <h1 className="text-3xl font-bold text-foreground uppercase tracking-wide">
          {personal.firstName} {personal.lastName}
        </h1>
        
        <div className="flex flex-wrap items-center text-sm mt-2 gap-x-6">
          {personal.email && (
            <span className="text-muted-foreground">{personal.email}</span>
          )}
          {personal.phone && (
            <span className="text-muted-foreground">{personal.phone}</span>
          )}
          {personal.address && (
            <span className="text-muted-foreground">{personal.address}</span>
          )}
          {personal.linkedin && (
            <a 
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          )}
          {personal.github && (
            <a 
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </header>
      
      {/* Professional Summary */}
      {additional.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
            Professional Summary
          </h2>
          <p className="text-muted-foreground">{additional.summary}</p>
        </section>
      )}
      
      {/* Experience Section */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-foreground">{exp.title}</h3>
                  <span className="text-muted-foreground text-sm">
                    {exp.startDate} – {exp.currentJob ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-muted-foreground font-semibold mb-1">{exp.company}</p>
                {exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
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
      
      {/* Education Section */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-foreground">{edu.degree}</h3>
                  <span className="text-muted-foreground text-sm">{edu.graduationYear}</span>
                </div>
                <p className="text-muted-foreground font-semibold mb-1">{edu.school}</p>
                {edu.gpa && (
                  <p className="text-muted-foreground text-sm">GPA: {edu.gpa}</p>
                )}
                {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {edu.relevantCourses.map((course, idx) => (
                      <span key={idx} className="bg-secondary text-secondary-foreground text-xs rounded px-2 py-0.5">
                        {course}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="bg-secondary text-secondary-foreground text-xs rounded px-2 py-0.5">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
      
      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-foreground">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-primary text-xs ml-2 hover:underline">Link</a>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-1">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {proj.technologies.map((tech, idx) => (
                      <span key={idx} className="bg-secondary text-secondary-foreground text-xs rounded px-2 py-0.5">
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
      
      {/* Certifications Section */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-foreground uppercase tracking-wide border-b border-border pb-1 mb-3">
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline">
                <h3 className="font-bold text-foreground">{cert.name}</h3>
                <span className="text-muted-foreground text-sm">{cert.issueDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}; 