// Diploma level courses for CGPA calculation
// Updated with all 13 diploma subjects including DL GenAI
import { CourseData } from './foundation';

export const diplomaCourses: CourseData[] = [
  // Data Science Diploma
  { code: 'NS_21_ML2001', name: 'Machine Learning Foundations', credits: 4, level: 'diploma' },
  { code: 'NS_21_ML2002', name: 'Machine Learning Techniques', credits: 4, level: 'diploma' },
  { code: 'NS_21_ML2003', name: 'Machine Learning Practice', credits: 4, level: 'diploma' },
  { code: 'NS_21_BD2001', name: 'Business Data Management', credits: 4, level: 'diploma' },
  { code: 'NS_21_BD2002', name: 'Business Analytics', credits: 4, level: 'diploma' },
  { code: 'NS_21_TK2001', name: 'Tools in Data Science', credits: 3, level: 'diploma' },

  // Programming Diploma
  { code: 'NS_21_PD2001', name: 'Programming, Data Structures and Algorithms using Python', credits: 4, level: 'diploma' },
  { code: 'NS_21_DB2001', name: 'Database Management Systems', credits: 4, level: 'diploma' },
  { code: 'NS_21_AD2001', name: 'Application Development - 1', credits: 4, level: 'diploma' },
  { code: 'NS_21_JV2001', name: 'Programming Concepts Using Java', credits: 4, level: 'diploma' },
  { code: 'NS_21_SC2001', name: 'System Commands', credits: 3, level: 'diploma' },
  { code: 'NS_21_AD2002', name: 'Application Development - 2', credits: 4, level: 'diploma' },

  // New subject
  { code: 'NS_21_DL2001', name: 'Introduction to Deep Learning and Generative AI', credits: 4, level: 'diploma' },
];

// Note: Tools in DS and System Commands are 3 credits each, rest are 4 credits
