// Foundation level courses for CGPA calculation

export interface CourseData {
  code: string;
  name: string;
  credits: number;
  level: 'foundation' | 'diploma' | 'bsc' | 'bs';
}

export const foundationCourses: CourseData[] = [
  { code: 'NS_21_MA1011', name: 'Mathematics for Data Science I', credits: 4, level: 'foundation' },
  { code: 'NS_21_MA1012', name: 'Mathematics for Data Science II', credits: 4, level: 'foundation' },
  { code: 'NS_21_ST1011', name: 'Statistics for Data Science I', credits: 4, level: 'foundation' },
  { code: 'NS_21_ST1012', name: 'Statistics for Data Science II', credits: 4, level: 'foundation' },
  { code: 'NS_21_CT1001', name: 'Computational Thinking', credits: 4, level: 'foundation' },
  { code: 'NS_21_PY1001', name: 'Python', credits: 4, level: 'foundation' },
  { code: 'NS_21_EN1011', name: 'English I', credits: 4, level: 'foundation' },
  { code: 'NS_21_EN1012', name: 'English II', credits: 4, level: 'foundation' },
];

// Total Foundation credits: 32
